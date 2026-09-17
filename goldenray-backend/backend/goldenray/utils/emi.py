"""The EMI calculator's calculation flow.

Order of operations:

    system_cost   = price_per_kW × capacity_kW, or the customer's slider price
    down_payment  = system_cost × down_payment_percent / 100 (customer slider,
                    10%-90% of the price by default policy)
    subsidy       = subsidy rule for this capacity — only if "with subsidy"
    loan_amount   = system_cost − down_payment − subsidy  (the "final loan amount")
    rate          = interest rule for this loan amount / capacity / system-cost
    emi           = standard reducing-balance formula
    daily         = emi ÷ daily_saving_divisor

Every input is read from the EmiConfig models so the Content Studio owns the
numbers. Nothing here is hard-coded except the EMI formula itself.
"""

from decimal import Decimal, ROUND_CEILING, ROUND_HALF_UP

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


def resolve_rate_unlock(
    capacity_kw, system_cost, loan_amount, current_rate,
    down_payment_amount, max_down_payment,
):
    """The cheapest rate band the customer can reach by paying more upfront.

    Looks for an active rule with a lower rate whose loan ceiling sits below
    the current loan amount, and works out the extra down payment needed to
    bring the loan under that ceiling. Rules are tested with the loan pinned
    at their own ceiling, so only the capacity/cost bands actually filter.
    Returns None when nothing cheaper is reachable within the down-payment
    band. The extra is rounded up to the nearest ₹100 so it reads as an
    amount a person would actually pay.
    """
    best = None
    for rule in EmiInterestRateRule.objects.filter(is_active=True):
        if rule.max_loan is None or Decimal(rule.rate) >= current_rate:
            continue
        if Decimal(rule.max_loan) >= loan_amount:
            continue
        if not rule.matches(capacity_kw, Decimal(rule.max_loan), system_cost):
            continue
        extra = loan_amount - Decimal(rule.max_loan)
        extra = (extra / 100).to_integral_value(rounding=ROUND_CEILING) * 100
        if down_payment_amount + extra > max_down_payment:
            continue
        if best is None or extra < best[0]:
            best = (extra, rule)
    if best is None:
        return None
    extra, rule = best
    return {
        "rate": float(rule.rate),
        "extra_down_payment": float(extra),
        "down_payment_amount": float(down_payment_amount + extra),
        "rule_label": rule.label,
    }


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
    interest_rate_override=None,
    system_cost_override=None,
    down_payment_percent_override=None,
    apply_down_payment=True,
    apply_subsidy=True,
    settings=None,
):
    """Run the full flow and return a serialisable breakdown.

    Raises ValueError with a user-safe message on bad input.

    ``system_cost_override`` lets the customer move the price slider away
    from the size's default price; it is clamped to the size's configured
    ``[price_min, price_max]`` band (blank bounds pin the price to the
    default, i.e. no slider room).

    ``down_payment_percent_override`` lets the customer move the down-payment
    slider; it is clamped to the settings' configured
    ``[down_payment_min_percent, down_payment_max_percent]`` band and applied
    to whatever the (possibly overridden) system price is. ``apply_down_payment``
    is the With/Without Down Payment toggle — off means no down payment is
    deducted at all, regardless of the slider position.
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
        price_per_kw = Decimal(size.price_per_kw)
        default_cost = _money(price_per_kw * resolved_capacity)
        price_min = _dec(size.price_min, default=default_cost)
        price_max = _dec(size.price_max, default=default_cost)

        if system_cost_override is not None:
            system_cost = _money(_dec(system_cost_override))
            if system_cost <= 0:
                raise ValueError("System price must be greater than zero")
            system_cost = min(max(system_cost, price_min), price_max)
            price_source = "customer"
        else:
            system_cost = default_cost
            price_source = "computed"
    else:
        # Capacity with no configured tile — no price to work from.
        raise ValueError(
            f"No active system size configured for {resolved_capacity} kW"
        )

    dp_min = Decimal(settings.down_payment_min_percent)
    dp_max = Decimal(settings.down_payment_max_percent)
    if apply_down_payment:
        requested_dp_percent = _dec(down_payment_percent_override)
        if requested_dp_percent is not None:
            down_payment_percent = min(max(requested_dp_percent, dp_min), dp_max)
        else:
            down_payment_percent = dp_min
        down_payment_amount = _money(system_cost * down_payment_percent / Decimal("100"))
    else:
        down_payment_percent = Decimal("0")
        down_payment_amount = Decimal("0")

    subsidy = resolve_subsidy(resolved_capacity) if apply_subsidy else Decimal("0")
    subsidy = min(subsidy, system_cost)

    # What's left after the down payment and (optionally) the subsidy is the
    # "final loan amount" the interest-rate rule and the EMI key off.
    loan_amount = _money(
        max(Decimal("0"), system_cost - down_payment_amount - subsidy)
    )

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
        # Both loan-amount bands are fixed policy rates: a customer
        # adjustment is accepted by the API but deliberately ignored.
        interest_rate = base_rate
    elif requested_rate is not None:
        interest_rate = max(requested_rate, floor_rate)
    else:
        interest_rate = max(base_rate, floor_rate)

    unlock = resolve_rate_unlock(
        capacity_kw=resolved_capacity,
        system_cost=system_cost,
        loan_amount=loan_amount,
        current_rate=interest_rate,
        down_payment_amount=down_payment_amount,
        max_down_payment=_money(system_cost * dp_max / Decimal("100")),
    )
    if unlock is not None:
        unlock["down_payment_percent"] = float(
            Decimal(str(unlock["down_payment_amount"])) / system_cost * 100
        )

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
            "price_min": float(price_min),
            "price_max": float(price_max),
            "price_source": price_source,
            "monthly_bill_reference": float(monthly_bill),
        },
        "down_payment": {
            "applied": bool(apply_down_payment),
            "percent": float(down_payment_percent),
            "amount": float(down_payment_amount),
            "min_percent": float(dp_min),
            "max_percent": float(dp_max),
            "step_percent": float(settings.down_payment_step_percent),
            "min_amount": float(_money(system_cost * dp_min / Decimal("100"))),
            "max_amount": float(_money(system_cost * dp_max / Decimal("100"))),
            "quick_add_amounts": [float(a) for a in settings.down_payment_quick_adds],
        },
        "subsidy": {
            "applied": bool(apply_subsidy),
            "amount": float(subsidy),
            "net_cost_after_subsidy": float(system_cost - subsidy),
        },
        "loan": {
            "amount": float(loan_amount),
        },
        "interest": {
            "rate": float(interest_rate),
            "base_rate": float(base_rate),
            "min_rate": float(floor_rate),
            "is_locked": locked,
            "requested_rate": float(requested_rate) if requested_rate is not None else None,
            "rule_id": rule.id if rule else None,
            "rule_label": rule.label if rule else None,
            "unlock": unlock,
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
