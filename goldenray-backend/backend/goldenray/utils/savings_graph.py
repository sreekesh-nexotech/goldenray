"""The 25-year "with vs without solar" cumulative-cost curves.

Shared by the website's solar calculator (SolarCalculatorNewAPIView) and the
BOM calculator's quotation, so the savings chart on page 8 of a quotation is
drawn by the same formula whichever of the two produced it.
"""

#: The points the chart plots.
GRAPH_YEARS = [0, 5, 10, 15, 20, 25]
YEARS_TO_BREAKEVEN = 10
#: Residual KSEB bill per billing cycle once solar is running.
RESIDUAL_BILL_PER_CYCLE = 280


def bill_cycles_per_year(property_type):
    """Commercial connections are billed monthly, residential bi-monthly."""
    return 12 if str(property_type).lower() == "commercial" else 6


def without_solar(bill, cycles_per_year, years=GRAPH_YEARS, rate=0.05):
    """Cumulative KSEB spend, bills rising `rate` a year."""
    annual_bill = bill * cycles_per_year
    cumulative = []
    for y in years:
        year_bill = sum([annual_bill * ((1 + rate) ** i) for i in range(y)])
        cumulative.append(round(year_bill))
    return cumulative


def with_solar(initial_cost, loan_amount, cycles_per_year, subsidy,
               years=GRAPH_YEARS, years_to_breakeven=YEARS_TO_BREAKEVEN, rate=0.05):
    """Cumulative spend with solar: net cost, the residual bill and loan repayment."""
    annual_bill = RESIDUAL_BILL_PER_CYCLE * cycles_per_year
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


def parse_loan_available(value):
    """`loan_available` is stored as text, sometimes a range like "2,00,000-6,00,000"."""
    loan_str = str(value).replace(",", "")
    try:
        return int(loan_str.split("-")[0]) if "-" in loan_str else int(loan_str)
    except ValueError:
        return 0


#: Upper bound of each pricing band in SolarInstallationNew.bill_range.
BILL_RANGES = (6000, 8000, 10000, 15500, 20000, 24000, 30000, 40000)


def bill_range_for(bill):
    """The SolarInstallationNew band a bill falls in, or None above ₹40,000."""
    for upper in BILL_RANGES:
        if bill <= upper:
            return upper
    return None
