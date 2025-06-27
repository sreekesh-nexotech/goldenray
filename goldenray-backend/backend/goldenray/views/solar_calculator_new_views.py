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

        # Determine the bill_range to fetch (now includes 24000, 30000, 40000)
        if monthly_bill <= 6000:
            bill_range = 6000
        elif 6001 <= monthly_bill <= 8000:
            bill_range = 8000
        elif 8001 <= monthly_bill <= 10000:
            bill_range = 10000
        elif 10001 <= monthly_bill <= 15500:
            bill_range = 15500
        elif 15501 <= monthly_bill <= 20000:
            bill_range = 20000
        elif 20001 <= monthly_bill <= 24000:
            bill_range = 24000
        elif 24001 <= monthly_bill <= 30000:
            bill_range = 30000
        elif 30001 <= monthly_bill <= 40000:
            bill_range = 40000
        else:
            return Response({"error": "Monthly bill out of supported range"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch row by bill_range and type (case-insensitive)
        try:
            row = SolarInstallationNew.objects.get(bill_range=bill_range, type__iexact=property_type)
        except SolarInstallationNew.DoesNotExist:
            return Response({"error": "No data found for the given bill range and property type"}, status=status.HTTP_404_NOT_FOUND)

        #  Graph Calculation Logic
        # handle ranges like "2,00,000-6,00,000"
        loan_str = str(row.loan_available).replace(",", "")
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
        initial_cost = float(row.total_cost)
        subsidy = float(row.total_subsidy)
        years_to_breakeven = 10
        # Get KSEB tariff for 50 units
        tariff = KSEBTariff.objects.filter(min_units__lte=50, max_units__gte=50).first()
        if not tariff:
            tariff = KSEBTariff.objects.order_by('min_units').first()
        kseb_unit_rate = float(tariff.rate)
        if property_type.lower() == "commercial":
            bill_cycles_per_year = 12
        else:
            bill_cycles_per_year = 6
        years = [0, 5, 10, 15, 20, 25]
        # Use a generic variable for bill per cycle
        bill_amount_per_cycle = monthly_bill
        # Without solar: upward curve (5% increase per year)
        def calculate_without_solar(bill, cycles_per_year, years, rate=0.05):
            annual_bill = bill * cycles_per_year
            cumulative = []
            for y in years:
                year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
                cumulative.append(round(year_bill))
            return cumulative
        # With solar: curve for 10 years, then flat
        def calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, kseb_unit_rate, years, cycles_per_year, subsidy, rate=0.05):
            bill_per_cycle = 72
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
        without_solar = calculate_without_solar(bill_amount_per_cycle, bill_cycles_per_year, years)
        with_solar = calculate_with_solar(initial_cost, loan_amount, years_to_breakeven, kseb_unit_rate, years, bill_cycles_per_year, subsidy)
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