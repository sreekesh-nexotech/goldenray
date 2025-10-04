from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import EVCar, EVScooter, SolarInstallationNew, Battery, KSEBTariff, DeviceType
from ..permissions import ApiMethodPermission, non_authenticated_view

class SolarAdvancedCalcAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    def estimate_units_from_bill(self, bill_amount):
        slabs = KSEBTariff.objects.order_by('-min_units')
        for slab in slabs:
            rate = float(slab.rate)
            min_units = int(slab.min_units)
            max_units = int(slab.max_units) if slab.max_units is not None else None
            estimated_units = bill_amount / rate
            if max_units is not None:
                if min_units <= estimated_units <= max_units:
                    return estimated_units, rate
            else:
                if estimated_units >= min_units:
                    return estimated_units, rate
        # Fallback: use the lowest slab
        first_slab = KSEBTariff.objects.order_by('min_units').first()
        return bill_amount / float(first_slab.rate), float(first_slab.rate)

    @non_authenticated_view
    def post(self, request):
        data = request.data
        specs = data.get("Specifications", {})
        usage = data.get("usageDetails", {})
        preference = data.get("preferenceDetails", {})

        home_type = specs.get("home_type")
        grid_type = specs.get("grid_type")

        if grid_type not in ["On Grid", "Hybrid"]:
            return Response({"error": "Only On Grid and Hybrid supported in this version."}, status=400)

        bill_frequency = specs.get("bill_frequency") or "BI-Monthly"
        days = 30 if bill_frequency == "Monthly" else 60

        # Calculate device consumption (in units for the period)
        total_device_kwh_per_day = 0
        for device in usage.get("usage_electronic_devices", []):
            device_type_name = device.get("device_type")
            if device_type_name and device_type_name.lower() == "light":
                wattage = 15.0
                k_value = 0.1
            else:
                dt = DeviceType.objects.filter(name__iexact=device_type_name).first()
                wattage = float(dt.watts) if dt and dt.watts else 0
                k_value = float(dt.k_value) if dt and dt.k_value else 1.0
            daily_usage = float(device.get("daily_usage", 0))
            no_of_units = int(device.get("no_of_units", 1))
            total_device_kwh_per_day += (wattage * daily_usage * no_of_units * k_value) / 1000
        total_device_units = total_device_kwh_per_day * days

        # Calculate EV consumption (supporting no_of_vehicles, ensure all decimals are float)
        total_ev_kwh_per_day = 0
        for ev in usage.get("electric_vehicles", []):
            model = ev.get("model")
            daily_avg_km = float(ev.get("daily_avg_km", 0))
            no_of_vehicles = int(ev.get("no_of_vehicles", 1))
            ev_obj = EVCar.objects.filter(model=model).first() or EVScooter.objects.filter(model=model).first()
            if ev_obj and ev_obj.energy_consumption:
                energy_consumption = float(ev_obj.energy_consumption)
                k_value = float(ev_obj.k_value) if ev_obj.k_value else 1.0
                total_ev_kwh_per_day += daily_avg_km * energy_consumption * no_of_vehicles * k_value
        total_ev_units = total_ev_kwh_per_day * days

        # Calculate base units
        base_units = 0
        if home_type == "New Home":
            estimated_base_load = specs.get("estimated_base_load")
            if estimated_base_load:
                try:
                    base_units = float(estimated_base_load)
                except (ValueError, TypeError):
                    base_units = 0
        else:  # Existing Home
            average_bill = specs.get("average_bill")
            if average_bill:
                try:
                    average_bill = float(average_bill)
                    base_units, _ = self.estimate_units_from_bill(average_bill)
                except (ValueError, TypeError):
                    base_units = 0

        # Total units for the period (base + devices + EVs)
        total_units = base_units + total_device_units + total_ev_units

        # Convert total_units to cash using the correct slab
        slab = KSEBTariff.objects.filter(min_units__lte=total_units).order_by('-min_units').first()
        kseb_rate = float(slab.rate) if slab else 6.75
        new_bimonthly_bill = total_units * kseb_rate

        # Find matching solar installation
        solar_row = SolarInstallationNew.objects.filter(bill_range__gte=new_bimonthly_bill, type__iexact='Residential').order_by('bill_range').first()
        if not solar_row:
            solar_row = SolarInstallationNew.objects.filter(type__iexact='Residential').order_by('bill_range').first()
            if not solar_row:
                return Response({"error": "No matching solar installation found for the calculated bill and type Residential."}, status=404)

        # Prepare response data from the solar_row
        response_data = {
            "bill_range": solar_row.bill_range,
            "power_capacity": solar_row.power_capacity,
            "time_to_complete": solar_row.time_to_complete,
            "overall_setup_cost": float(solar_row.total_cost),
            "total_subsidy": float(solar_row.total_subsidy),
            "area_required": solar_row.area_required,
            "loan_available": solar_row.loan_available,
            "per_kw_rate": float(solar_row.per_kw_rate) if solar_row.per_kw_rate is not None else None,
            "final_cost": float(solar_row.final_cost) if solar_row.final_cost is not None else None,
            "interest_rate": float(solar_row.interest_rate) if solar_row.interest_rate is not None else None,
            "type": solar_row.type,
        }

        # For Hybrid, add battery information
        if grid_type == "Hybrid":
            backup_hours = preference.get("backup_hours")
            preference_devices = preference.get("preference_electronic_devices", [])

            if (not backup_hours or float(backup_hours) == 0) and not preference_devices:
                # Fetch default backup hours from DB or use 3 if not present
                default_row = SolarInstallationNew.objects.filter(type__iexact='Residential').order_by('bill_range').first()
                default_backup_hours = getattr(default_row, 'default_backup_hours', 3) if default_row else 3
                backup_hours = default_backup_hours
                # Use default devices
                default_devices = [
                    {"device_type": "Light", "no_of_units": 3, "daily_usage": backup_hours},
                    {"device_type": "Fan", "no_of_units": 2, "daily_usage": backup_hours},
                ]
                all_devices = default_devices
                response_data['default_backup_hours'] = backup_hours
            else:
                # Use user-specified devices and backup hours, plus default devices
                all_devices = preference_devices + [
                    {"device_type": "Light", "no_of_units": 3, "daily_usage": float(backup_hours) if backup_hours else 0},
                    {"device_type": "Fan", "no_of_units": 2, "daily_usage": float(backup_hours) if backup_hours else 0},
                ]

            total_required_battery_capacity = 0
            total_backup_watts = 0
            for device in all_devices:
                device_type_name = device.get("device_type")
                if device_type_name.lower() == "light":
                    wattage = 15.0
                    k_value = 0.1
                else:
                    dt = DeviceType.objects.filter(name__iexact=device_type_name).first()
                    wattage = float(dt.watts) if dt and dt.watts else 0
                    k_value = float(dt.k_value) if dt and dt.k_value else 1.0
                no_of_units = int(device.get("no_of_units", 1))
                daily_usage = float(device.get("daily_usage", 0)) # Hours for this device (should be <= backup_hours)
                total_required_battery_capacity += (wattage * no_of_units * daily_usage * k_value) / 1000
                total_backup_watts += wattage * no_of_units

            # Calculate average load (kW) for the backup window
            average_load_kw = total_required_battery_capacity / float(backup_hours) if backup_hours and float(backup_hours) > 0 else 0

            # Find the smallest battery that can meet the total required energy (kWh).
            selected_battery = Battery.objects.filter(
                battery_capacity__gte=total_required_battery_capacity
            ).order_by('battery_capacity').first()
            
            actual_backup_time = 0
            if selected_battery:
                # Calculate what the actual backup time would be with the selected battery's capacity.
                if average_load_kw > 0:
                    actual_backup_time = float(selected_battery.battery_capacity) / average_load_kw

                inverter_price = float(solar_row.inverter_price) if solar_row.inverter_price is not None else 0
                total_battery_cost = float(selected_battery.battery_price) + inverter_price
                overall_setup_cost = float(response_data.get("final_cost", 0)) + total_battery_cost + float(response_data.get("total_cost", 0))
                final_cost = overall_setup_cost + float(response_data.get("total_subsidy", 0))

                response_data.update({
                    "battery_capacity": float(selected_battery.battery_capacity),
                    "battery_price": float(selected_battery.battery_price),
                    "inverter_price": inverter_price,
                    "total_battery_cost": total_battery_cost,
                    "calculated_required_capacity": round(float(total_required_battery_capacity), 2),
                    "total_backup_watts": total_backup_watts,
                    "average_load_kw": round(float(average_load_kw), 2),
                    "actual_backup_time": round(float(actual_backup_time), 2),
                    "overall_setup_cost": final_cost,
                    "final_cost": overall_setup_cost
                })
            else:
                # No battery is large enough, so select the largest available and return max backup time
                largest_battery = Battery.objects.order_by('-battery_capacity').first()
                if largest_battery and average_load_kw > 0:
                    actual_backup_time = float(largest_battery.battery_capacity) / average_load_kw
                    inverter_price = float(solar_row.inverter_price) if solar_row.inverter_price is not None else 0
                    total_battery_cost = float(largest_battery.battery_price) + inverter_price
                    overall_setup_cost = float(response_data.get("final_cost", 0)) + total_battery_cost + float(response_data.get("total_cost", 0))
                    final_cost = overall_setup_cost+float(response_data.get("total_subsidy", 0))
                    response_data.update({
                        "battery_capacity": float(largest_battery.battery_capacity),
                        "battery_price": float(largest_battery.battery_price),
                        "inverter_price": inverter_price,
                        "total_battery_cost": total_battery_cost,
                        "calculated_required_capacity": round(float(total_required_battery_capacity), 2),
                        "total_backup_watts": total_backup_watts,
                        "average_load_kw": round(float(average_load_kw), 2),
                        "actual_backup_time": round(float(actual_backup_time), 2),
                        "overall_setup_cost": final_cost,
                        "final_cost": overall_setup_cost,
                        "battery_info": f"No battery can provide {backup_hours} hours of backup for your specified devices (need {total_required_battery_capacity:.2f} kWh). The largest available battery can provide up to {round(float(actual_backup_time), 2)} hours of backup."
                    })
                else:
                    response_data["battery_info"] = f"No battery found that can provide {backup_hours} hours of backup for your specified devices, which require {total_required_battery_capacity:.2f} kWh of energy."

        # Calculate the virtual monthly bill based on all planned devices and EVs
        virtual_monthly_kwh = (total_device_kwh_per_day + total_ev_kwh_per_day) * 30
        tariff_row_virtual = KSEBTariff.objects.filter(min_units__lte=virtual_monthly_kwh).order_by('-min_units').first()
        kseb_rate_virtual = 6.67 # Default
        if tariff_row_virtual and (tariff_row_virtual.max_units is None or virtual_monthly_kwh <= tariff_row_virtual.max_units):
            kseb_rate_virtual = float(tariff_row_virtual.rate)
        virtual_monthly_bill = virtual_monthly_kwh * kseb_rate_virtual

        # Add current average bill or estimated base load to the virtual monthly bill
        base_bimonthly_bill = 0
        if home_type == "New Home":
            estimated_base_load = specs.get("estimated_base_load")
            if estimated_base_load:
                try:
                    base_units = float(estimated_base_load)
                except (ValueError, TypeError):
                    base_units = 0
        else: # Existing home
            average_bill = specs.get("average_bill")
            if average_bill:
                try:
                    average_bill = float(average_bill)
                    base_units, _ = self.estimate_units_from_bill(average_bill)
                except (ValueError, TypeError):
                    base_units = 0

        # For both cases, convert base_units to cash using the correct slab
        slab = KSEBTariff.objects.filter(min_units__lte=base_units).order_by('-min_units').first()
        kseb_rate = float(slab.rate) if slab else 6.75
        base_bimonthly_bill = base_units * kseb_rate

        # The total bi-monthly bill for the graph is the base bill plus the new devices
        total_bimonthly_bill_for_graph = base_bimonthly_bill + (virtual_monthly_bill * 2 if virtual_monthly_bill else 0)

        
        years = [0, 5, 10, 15, 20, 25]
        bill_cycles_per_year = 6
        rate = 0.05

        def calculate_without_solar(bill, cycles_per_year, years, rate=0.05):
            annual_bill = bill * cycles_per_year
            cumulative = []
            for y in years:
                year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                cumulative.append(round(year_bill))
            return cumulative

        def calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, years, cycles_per_year, subsidy, rate=0.05):
            bill_per_cycle = 280
            annual_bill = bill_per_cycle * cycles_per_year
            loan_repayment_per_year = loan_amount / years_to_breakeven if years_to_breakeven else 0
            cumulative = []
            for y in years:
                if y == 0:
                    cumulative.append(initial_cost - subsidy)
                elif y <= years_to_breakeven:
                    year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                    total = (initial_cost - subsidy) + year_bill + loan_repayment_per_year * y
                    cumulative.append(round(total))
                else:
                    year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                    total = (initial_cost - subsidy) + year_bill + loan_amount
                    cumulative.append(round(total))
            return cumulative

        
        initial_cost = float(solar_row.total_cost)
        if grid_type == "Hybrid" and "overall_setup_cost" in response_data:
            initial_cost = float(response_data["overall_setup_cost"])
        subsidy = float(solar_row.total_subsidy)
        years_to_breakeven = 10
        # Handle loan
        loan_str = str(solar_row.loan_available).replace(",", "")
        if "-" in loan_str:
            try:
                loan_amount = int(loan_str.split("-")[0])
            except ValueError:
                loan_amount = 0
        else:
            try:
                loan_amount = int(loan_str)
            except ValueError:
                loan_amount = 0

        without_solar = calculate_without_solar(total_bimonthly_bill_for_graph, bill_cycles_per_year, years)
        with_solar = calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, years, bill_cycles_per_year, subsidy)
        response_data["graph_without_solar"] = without_solar
        response_data["graph_with_solar"] = with_solar
        
        if without_solar and with_solar:
            response_data["savings"] = without_solar[-1] - with_solar[-1]

        return Response(response_data)