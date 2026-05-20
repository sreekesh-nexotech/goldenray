def emi_calc(principal, interest_rate, tenure_years=10):
    if principal <= 0 or interest_rate <= 0 or tenure_years <= 0:
        return {
            "emi_per_month": 0,
            "total_payment": 0,
            "total_interest": 0,
        }

    monthly_interest_rate = interest_rate / (12 * 100)
    tenure_months = tenure_years * 12

    # EMI formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
    growth = (1 + monthly_interest_rate) ** tenure_months
    emi_per_month = (principal * monthly_interest_rate * growth) / (growth - 1)
    total_payment = emi_per_month * tenure_months
    total_interest = total_payment - principal

    return {
        "emi_per_month": round(emi_per_month, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
    }
