from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import SolarInstallationNew, Pincode, KSEBTariff
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

        #  Graph Calculation Logic
        # handle ranges like "2,00,000-6,00,000"
        loan_str = str(row.loan_available).replace(",", "")
        if "-" in loan_str:
            loan_amount = int(loan_str.split("-")[0])
        else:
            loan_amount = int(loan_str)
        initial_cost = float(row.total_cost)
        years_to_breakeven = 10
        # Get KSEB tariff for 50 units
        tariff = KSEBTariff.objects.filter(min_units__lte=50, max_units__gte=50).first()
        if not tariff:
            tariff = KSEBTariff.objects.order_by('min_units').first()
        kseb_unit_rate = float(tariff.rate)
        bimonthly_bill = monthly_bill  # for residential
        years = [0, 5, 10, 15, 20, 25]
        # Without solar: upward curve (5% increase per year)
        def calculate_without_solar(bimonthly_bill, years, rate=0.05):
            annual_bill = bimonthly_bill * 6
            cumulative = []
            for y in years:
                year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                cumulative.append(round(year_bill))
            return cumulative
        # With solar: curve for 10 years, then flat
        def calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, kseb_unit_rate, years, rate=0.05):
            units_per_bimonth = 50
            bill_per_bimonth = units_per_bimonth * kseb_unit_rate
            annual_bill = bill_per_bimonth * 6
            loan_repayment_per_year = loan_amount / years_to_breakeven
            cumulative = []
            for y in years:
                if y == 0:
                    cumulative.append(initial_cost)
                elif y <= years_to_breakeven:
                    year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                    total = initial_cost + year_bill + loan_repayment_per_year * y
                    cumulative.append(round(total))
                else:
                    year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                    total = initial_cost + year_bill + loan_amount
                    cumulative.append(round(total))
            return cumulative
        without_solar = calculate_without_solar(bimonthly_bill, years)
        with_solar = calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, kseb_unit_rate, years)
        savings = without_solar[-1] - with_solar[-1]
        result = {
            "solar_capacity_kW": row.power_capacity,
            "area_required": row.area_required,
            "installation_time_days": row.time_to_complete,
            "total_cost": float(row.total_cost),
            "subsidy": float(row.total_subsidy),
            "loan_available": row.loan_available,
            "pincode": pincode,
            "property_type": property_type,
            "datasets": [
                {"data": without_solar},
                {"data": with_solar}
            ],
            "savings": savings
        }
        return Response(result, status=status.HTTP_200_OK)