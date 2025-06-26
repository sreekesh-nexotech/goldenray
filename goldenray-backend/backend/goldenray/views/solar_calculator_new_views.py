from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import SolarInstallationNew, Pincode
from ..permissions import ApiMethodPermission, non_authenticated_view


class SolarCalculatorNewAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def post(self, request):
        monthly_bill = request.data.get("monthly_bill")
        pincode = request.data.get("pincode")
        property_type = request.data.get("property_type")

        # Validate inputs
        if not all([monthly_bill, pincode, property_type]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            monthly_bill = int(monthly_bill)
        except (ValueError, TypeError):
            return Response({"error": "Invalid monthly_bill value"}, status=status.HTTP_400_BAD_REQUEST)

        if monthly_bill < 0:
            return Response({"error": "Invalid monthly_bill value"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if pincode exists in the database
        if not Pincode.objects.filter(pincode=pincode).exists():
            return Response({"error": "Pincode not found in database"}, status=status.HTTP_404_NOT_FOUND)

        # Determine the bill_range to fetch
        if monthly_bill <= 6000:
            bill_range = 6000
        elif 6001 <= monthly_bill <= 8000:
            bill_range = 8000
        elif 8001 <= monthly_bill <= 10000:
            bill_range = 10000
        elif 10001 <= monthly_bill <= 15500:
            bill_range = 15500
        elif 15501 <= monthly_bill <= 24000:
            bill_range = 24000
        else:
            return Response({"error": "Monthly bill out of supported range"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            row = SolarInstallationNew.objects.get(bill_range=bill_range)
        except SolarInstallationNew.DoesNotExist:
            return Response({"error": "No data found for the given bill range"}, status=status.HTTP_404_NOT_FOUND)

        result = {
            "solar_capacity_kW": row.power_capacity,
            "area_required": row.area_required,
            "installation_time_days": row.time_to_complete,
            "total_cost": float(row.total_cost),
            "subsidy": float(row.total_subsidy),
            "loan_available": row.loan_available,
            "pincode": pincode,
            "property_type": property_type,
        }
        return Response(result, status=status.HTTP_200_OK) 