"""The EMI calculator's corrected calculation flow.

Order of operations (this is the whole point of the module — the previous
implementation applied these in a different order and disagreed with the UI):

    system_cost  = price_per_kW × capacity_kW
    gross_loan   = system_cost × loan_percentage  ← the 90% comes off FIRST
    loan_amount  = gross_loan − subsidy           ← then the subsidy
    net_cost     = system_cost − subsidy
    upfront      = net_cost − loan_amount         (= the customer's 10%)
    rate         = interest rule for this capacity / system-cost / loan band
    emi          = standard reducing-balance formula
    daily        = emi ÷ daily_saving_divisor

Every input is read from the EmiConfig models so the Content Studio owns the
numbers. Nothing here is hard-coded except the EMI formula itself.
"""

from decimal import Decimal, ROUND_HALF_UP

from ..models import (
    EmiCalculatorSettings,
    EmiInterestRateRule,
    EmiSubsidyRule,
    EmiSystemSize,
)
from .finance import emi_calc


def _money(value):
    """Round to paise, half-up — the convention the rest of the app uses."""
    return Decimal(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def format_inr(value):
    """₹ with Indian digit grouping — these strings reach the customer."""
    whole = int(Decimal(value).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    digits = str(abs(whole))
    if len(digits) > 3:
        head, tail = digits[:-3], digits[-3:]
        groups = []
        while len(head) > 2:
            groups.insert(0, head[-2:])
            head = head[:-2]
        if head:
            groups.insert(0, head)
        digits = ",".join(groups + [tail])
    return f"₹{'-' if whole < 0 else ''}{digits}"


def _dec(value, default=None):
    if value is None or value == "":
        return default
    return Decimal(str(value))


def resolve_subsidy(capacity_kw):
    """Subsidy for a capacity, or Decimal(0) when no band matches."""
    if capacity_kw is None:
        return Decimal("0")
    rules = [
        rule
        for rule in EmiSubsidyRule.objects.filter(is_active=True)
        if rule.matches(capacity_kw)
    ]
    if not rules:
        return Decimal("0")
    # Model ordering already puts the highest priority first.
    return Decimal(rules[0].amount)


def resolve_interest_rule(capacity_kw, loan_amount, system_cost=None):
    """Best-matching active rate rule, or None.

    Priority decides first; the more specific rule wins ties, so a rule scoped
    to 3kW *and* a system-cost band beats a capacity-only rule even when both
    are priority 0.
    """
    candidates = [
        rule
        for rule in EmiInterestRateRule.objects.filter(is_active=True)
        if rule.matches(capacity_kw, loan_amount, system_cost)
    ]
    if not candidates:
        return None
    candidates.sort(key=lambda r: (r.priority, r.specificity), reverse=True)
    return candidates[0]


def find_system_size(capacity_kw=None, size_id=None):
    qs = EmiSystemSize.objects.filter(is_active=True)
    if size_id is not None:
        return qs.filter(pk=size_id).first()
    if capacity_kw is not None:
        return qs.filter(capacity_kw=capacity_kw).first()
    return None


def calculate(
    capacity_kw=None,
    size_id=None,
    tenure_years=None,
    apply_subsidy=True,
    interest_rate_override=None,
    loan_amount_override=None,
    settings=None,
):
    """Run the full flow and return a serialisable breakdown.

    Raises ValueError with a user-safe message on bad input.

    ``loan_amount_override`` lets the customer move the loan slider away from
    the computed 90%; the upfront figure follows it so the two always sum to
    the net cost.
    """
    settings = settings or EmiCalculatorSettings.load()

    size = find_system_size(capacity_kw=capacity_kw, size_id=size_id)
    if size is None and capacity_kw is None:
        raise ValueError("Provide either size_id or capacity_kw")

    resolved_capacity = Decimal(size.capacity_kw) if size else _dec(capacity_kw)

    # Tenure: fall back to the configured default, then clamp to the allowed
    # band. Only a missing value falls back — an explicit 0 is an error, not a
    # request for the default.
    tenure = settings.tenure_default_years if tenure_years is None else tenure_years
    try:
        tenure = int(tenure)
    except (TypeError, ValueError):
        raise ValueError("tenure_years must be a whole number of years")
    if tenure < settings.tenure_min_years or tenure > settings.tenure_max_years:
        raise ValueError(
            f"tenure_years must be between {settings.tenure_min_years} "
            f"and {settings.tenure_max_years}"
        )

    if size is not None:
        system_cost = _money(Decimal(size.price_per_kw) * resolved_capacity)
        price_per_kw = Decimal(size.price_per_kw)
        # Per-size price ceiling — a 3kW system above ₹3,00,000 is not a deal
        # we finance, so refuse to quote rather than quote something wrong.
        max_cost = _dec(size.max_system_cost)
        if max_cost is not None and system_cost > max_cost:
            raise ValueError(
                f"A {size.label} system cannot be priced above "
                f"{format_inr(max_cost)} (this one is {format_inr(system_cost)})"
            )
    else:
        # Capacity with no configured tile — no price to work from.
        raise ValueError(
            f"No active system size configured for {resolved_capacity} kW"
        )

    subsidy = resolve_subsidy(resolved_capacity) if apply_subsidy else Decimal("0")
    subsidy = min(subsidy, system_cost)

    # The loan percentage is taken off the gross system cost first; only then
    # does the subsidy come off the financed amount — the corrected order.
    # `financeable` is what the customer still has to cover in total, so the
    # loan and the upfront always add back up to it.
    if settings.subsidy_before_loan:
        financeable = system_cost - subsidy
    else:
        financeable = system_cost

    loan_pct = Decimal(settings.loan_percentage) / Decimal("100")
    gross_loan = _money(system_cost * loan_pct)
    if settings.subsidy_before_loan:
        suggested_loan = _money(max(Decimal("0"), gross_loan - subsidy))
    else:
        suggested_loan = gross_loan

    if loan_amount_override is not None:
        loan_amount = _money(_dec(loan_amount_override))
        if loan_amount <= 0:
            raise ValueError("Loan amount must be greater than zero")
        loan_source = "customer"
    else:
        loan_amount = suggested_loan
        loan_source = "computed"

    upfront = _money(max(Decimal("0"), financeable - loan_amount))

    rule = resolve_interest_rule(resolved_capacity, loan_amount, system_cost)
    requested_rate = _dec(interest_rate_override)

    if rule is None:
        base_rate = Decimal(settings.default_interest_rate)
        floor_rate = base_rate
        locked = False
    else:
        base_rate = Decimal(rule.rate)
        floor_rate = Decimal(rule.min_rate)
        locked = rule.is_locked

    if locked:
        # 3kW sits on the fixed Flarize–SBI PM Surya Ghar rate: a customer
        # adjustment is accepted by the API but deliberately ignored.
        interest_rate = base_rate
    elif requested_rate is not None:
        interest_rate = max(requested_rate, floor_rate)
    else:
        interest_rate = max(base_rate, floor_rate)

    # A computed loan of zero is legitimate now — a subsidy can cover the whole
    # financed share — and emi_calc returns zeros for it. Only a customer
    # override of zero is an error, and that is caught above.
    emi = emi_calc(
        principal=float(loan_amount),
        interest_rate=float(interest_rate),
        tenure_years=tenure,
    )

    divisor = settings.daily_saving_divisor or 30
    daily_amount = round(emi["emi_per_month"] / divisor, 2)

    monthly_bill = Decimal(size.monthly_bill_reference) if size else Decimal("0")
    monthly_savings = float(monthly_bill) - emi["emi_per_month"]

    return {
        "system": {
            "size_id": size.id if size else None,
            "label": size.label if size else None,
            "capacity_kw": float(resolved_capacity),
            "price_per_kw": float(price_per_kw),
            "system_cost": float(system_cost),
            "max_system_cost": (
                float(size.max_system_cost)
                if size is not None and size.max_system_cost is not None
                else None
            ),
            "monthly_bill_reference": float(monthly_bill),
        },
        "subsidy": {
            "applied": bool(apply_subsidy),
            "amount": float(subsidy),
            "deducted_before_loan": settings.subsidy_before_loan,
            "net_cost_after_subsidy": float(system_cost - subsidy),
        },
        "loan": {
            "percentage": float(settings.loan_percentage),
            "financeable_base": float(financeable),
            "gross_amount": float(gross_loan),
            "suggested_amount": float(suggested_loan),
            "amount": float(loan_amount),
            "amount_source": loan_source,
            "upfront_amount": float(upfront),
        },
        "interest": {
            "rate": float(interest_rate),
            "base_rate": float(base_rate),
            "min_rate": float(floor_rate),
            "is_locked": locked,
            "requested_rate": float(requested_rate) if requested_rate is not None else None,
            "rule_id": rule.id if rule else None,
            "rule_label": rule.label if rule else None,
        },
        "tenure": {
            "years": tenure,
            "months": tenure * 12,
        },
        "result": {
            "emi_per_month": emi["emi_per_month"],
            "total_payment": emi["total_payment"],
            "total_interest": emi["total_interest"],
            "daily_amount": daily_amount,
            "daily_saving_divisor": divisor,
            "monthly_savings": round(monthly_savings, 2),
        },
    }
