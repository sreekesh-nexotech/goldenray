from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Pincode, KSEBTariff, SolarInstallation
from ..permissions import ApiMethodPermission, non_authenticated_view


class SolarCalculatorAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def post(self, request):
        # Extract input data
        monthly_bill = request.data.get("monthly_bill")
        pincode = request.data.get("pincode")
        property_type = request.data.get("property_type")

        # Validate inputs
        if not all([monthly_bill, pincode, property_type]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(monthly_bill, (int, float)) or monthly_bill < 0:
            return Response({"error": "Invalid monthly bill"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if pincode exists in the database
        if not Pincode.objects.filter(pincode=pincode).exists():
            return Response({"error": "Pincode not found in database"}, status=status.HTTP_404_NOT_FOUND)

        def calculate_solar_from_bill(monthly_bill):
            # Fetch tariff slabs from KSEBTariff model
            tariff_objects = KSEBTariff.objects.all().order_by("min_units")
            tariff_slabs = [
                (tariff.max_units if tariff.max_units is not None else float("inf"), float(tariff.rate))
                for tariff in tariff_objects
            ]

            fixed_charges = 190 + 6 + (6 * 0.18)
            base_amount = monthly_bill - fixed_charges
            remaining_amount = base_amount
            units = 0
            previous_limit = 0

            for limit, rate in tariff_slabs:
                slab_width = limit - previous_limit
                max_slab_amount = slab_width * rate
                if remaining_amount <= max_slab_amount:
                    units += remaining_amount / rate
                    break
                else:
                    units += slab_width
                    remaining_amount -= max_slab_amount
                    previous_limit = limit

            daily_units = units / 30
            buffered_daily_units = daily_units * 1.3
            solar_kW = -(-buffered_daily_units // 4)

            return {
                "estimated_units": round(units, 2),
                "daily_consumption": round(daily_units, 2),
                "buffered_daily": round(buffered_daily_units, 2),
                "solar_capacity_kW": int(solar_kW),
            }

        result = calculate_solar_from_bill(monthly_bill)

        # Fetch SolarInstallation data matching the calculated solar_capacity_kW
        try:
            installation = SolarInstallation.objects.get(power_capacity=result["solar_capacity_kW"])
            result.update(
                {
                    "area_required": installation.area_required,
                    "installation_time_days": installation.time_to_complete,
                    "total_cost": float(installation.total_cost),
                    "subsidy": float(installation.total_subsidy),
                }
            )
        except SolarInstallation.DoesNotExist:
            result.update({"area_required": None, "installation_time_days": None, "total_cost": None, "subsidy": None})

        result["pincode"] = pincode
        result["property_type"] = property_type
        return Response(result, status=status.HTTP_200_OK)
