from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import EVCar, EVScooter, SolarInstallationNew, Battery, KSEBTariff, DeviceType
from ..permissions import ApiMethodPermission, non_authenticated_view

class SolarAdvancedCalcAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def post(self, request):
        data = request.data
        specs = data.get("Specifications", {})
        usage = data.get("usageDetails", {})
        preference = data.get("preferenceDetails", {})

        home_type = specs.get("home_type")
        grid_type = specs.get("grid_type")

        # Handle both On Grid and Hybrid
        if grid_type not in ["On Grid", "Hybrid"]:
            return Response({"error": "Only On Grid and Hybrid supported in this version."}, status=400)

        bill_frequency = specs.get("bill_frequency") or "BI-Monthly"
        days = 30 if bill_frequency == "Monthly" else 60

        # Calculate device consumption
        total_device_kwh_per_day = 0
        for device in usage.get("usage_electronic_devices", []):
            device_type_name = device.get("device_type")
            if device_type_name and device_type_name.lower() == "light":
                wattage = 15.0
            else:
                dt = DeviceType.objects.filter(name__iexact=device_type_name).first()
                wattage = float(dt.watts) if dt and dt.watts else 0
            daily_usage = float(device.get("daily_usage", 0))
            no_of_units = int(device.get("no_of_units", 1))
            total_device_kwh_per_day += (wattage * daily_usage * no_of_units) / 1000

        # Calculate EV consumption (supporting no_of_vehicles, ensure all decimals are float)
        total_ev_kwh_per_day = 0
        for ev in usage.get("electric_vehicles", []):
            model = ev.get("model")
            daily_avg_km = float(ev.get("daily_avg_km", 0))
            no_of_vehicles = int(ev.get("no_of_vehicles", 1))
            ev_obj = EVCar.objects.filter(model=model).first() or EVScooter.objects.filter(model=model).first()
            if ev_obj and ev_obj.energy_consumption:
                energy_consumption = float(ev_obj.energy_consumption)
                total_ev_kwh_per_day += daily_avg_km * energy_consumption * no_of_vehicles

        # Total consumption for the period
        total_kwh = (total_device_kwh_per_day + total_ev_kwh_per_day) * days

        if home_type == "New Home":
            # Use estimated_base_load (units for 2 months)
            estimated_base_load = specs.get("estimated_base_load")
            if estimated_base_load:
                try:
                    estimated_base_load = float(estimated_base_load)
                    total_kwh += estimated_base_load
                except (ValueError, TypeError):
                    pass
        else:
            # Add average_bill converted to units (1 unit = 6.67 rupees)
            average_bill = specs.get("average_bill")
            if average_bill:
                try:
                    average_bill = float(average_bill)
                    average_bill_units = average_bill / 6.75
                    total_kwh += average_bill_units
                except (ValueError, TypeError):
                    pass

        # Convert total_kwh_for_period back to rupees
        new_bimonthly_bill = total_kwh * 6.75

        # Find matching solar installation
        solar_row = SolarInstallationNew.objects.filter(bill_range__gte=new_bimonthly_bill, type__iexact='Residential').order_by('bill_range').first()
        if not solar_row:
            return Response({"error": "No matching solar installation found for the calculated bill and type Residential."}, status=404)

        # Prepare response data from the solar_row
        response_data = {
            "bill_range": solar_row.bill_range,
            "power_capacity": solar_row.power_capacity,
            "time_to_complete": solar_row.time_to_complete,
            "total_cost": float(solar_row.total_cost),
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
            backup_hours = float(preference.get("backup_hours", 0))
            preference_devices = preference.get("preference_electronic_devices", [])
            # Add default lights and fan load
            default_devices = [
                {"device_type": "Light", "no_of_units": 3, "daily_usage": backup_hours},
                {"device_type": "Fan", "no_of_units": 2, "daily_usage": backup_hours},
            ]
            all_devices = preference_devices + default_devices
            total_required_battery_capacity = 0
            total_backup_watts = 0
            for device in all_devices:
                device_type_name = device.get("device_type")
                if device_type_name.lower() == "light":
                    wattage = 15.0
                else:
                    dt = DeviceType.objects.filter(name__iexact=device_type_name).first()
                    wattage = float(dt.watts) if dt and dt.watts else 0
                no_of_units = int(device.get("no_of_units", 1))
                daily_usage = float(device.get("daily_usage", 0))
                total_required_battery_capacity += (wattage * no_of_units * daily_usage) / 1000
                total_backup_watts += wattage * no_of_units

            # Calculate average load (kW) during backup
            average_load_kw = float(total_required_battery_capacity) / float(backup_hours) if backup_hours else 0

            # Find the smallest battery where actual_backup_time >= backup_hours
            selected_battery = None
            for battery in Battery.objects.all().order_by('battery_capacity'):
                battery_capacity = float(battery.battery_capacity)
                if average_load_kw > 0:
                    actual_backup_time = battery_capacity / average_load_kw
                else:
                    actual_backup_time = 0
                if actual_backup_time >= backup_hours:
                    selected_battery = battery
                    break

            if selected_battery:
                total_battery_cost = float(selected_battery.battery_price + selected_battery.inverter_price)
                response_data.update({
                    "battery_capacity": float(selected_battery.battery_capacity),
                    "backup_hour": float(selected_battery.backup_hour),
                    "battery_price": float(selected_battery.battery_price),
                    "inverter_price": float(selected_battery.inverter_price),
                    "total_battery_cost": total_battery_cost,
                    "calculated_required_capacity": round(float(total_required_battery_capacity), 2),
                    "total_backup_watts": total_backup_watts,
                    "actual_backup_time": round(float(actual_backup_time), 2),
                    "overall_setup_cost": float(response_data.get("final_cost", 0)) + total_battery_cost
                })
            else:
                response_data["battery_info"] = f"No battery found that can provide {backup_hours} hours of backup with {float(total_required_battery_capacity):.2f} kWh capacity"

        # Calculate the virtual monthly bill based on all planned devices and EVs
        virtual_monthly_kwh = (total_device_kwh_per_day + total_ev_kwh_per_day) * 30  # 30 days for monthly
        virtual_monthly_bill = virtual_monthly_kwh * 6.67  # Always use 6.67 as per-unit rate

        # Graph Calculation Logic (similar to solar_calculator_new_views.py)
        years = [0, 5, 10, 15, 20, 25]
        bill_cycles_per_year = 6  # or 12 for commercial, adjust as needed
        rate = 0.05  # 5% increase per year

        def calculate_without_solar(bill, cycles_per_year, years, rate=0.05):
            annual_bill = bill * cycles_per_year
            cumulative = []
            for y in years:
                year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                cumulative.append(round(year_bill))
            return cumulative

        def calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, years, cycles_per_year, subsidy, rate=0.05):
            bill_per_cycle = 72  # Assumed minimal bill per cycle with solar
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

        # Use values from the selected solar_row for with_solar calculation
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

        without_solar = calculate_without_solar(virtual_monthly_bill, bill_cycles_per_year, years)
        with_solar = calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, years, bill_cycles_per_year, subsidy)
        response_data["graph_without_solar"] = without_solar
        response_data["graph_with_solar"] = with_solar
        # Add savings as the difference between the last values of the two graphs
        if without_solar and with_solar:
            response_data["savings"] = without_solar[-1] - with_solar[-1]

        return Response(response_data)