"""Drop the down payment; key the interest rate off the loan amount.

Business-logic change, agreed with the customer:

  * No more upfront/financed split. Every quote finances the whole system
    price, less the subsidy — that remainder is now simply "the loan
    amount". ``EmiCalculatorSettings.loan_percentage`` /
    ``subsidy_before_loan`` and the loan-amount slider bounds
    (``loan_amount_min`` / ``loan_amount_max`` / ``loan_step``) are gone.
  * The "Apply PM Surya Ghar Subsidy" toggle is gone too — the subsidy is
    always applied, so there is nothing left to toggle.
  * A system's price is no longer fixed to `price_per_kw x capacity` — the
    customer can slide it up or down. ``EmiSystemSize.max_system_cost``
    (a hard reject, introduced only to bound the old capacity-keyed rate
    bands) is replaced by ``price_min`` / ``price_max``, the slider's
    bounds, seeded at roughly the old default price +/- 20%. The slider's
    ₹ increment moves from the settings' ``loan_step`` to a new
    ``price_step``.
  * The interest-rate policy used to be keyed on capacity (3kW fixed at
    5.75%, anything larger floors at 8%). It is now keyed purely on the
    final loan amount: <= Rs 2,00,000 -> 5.75%, > Rs 2,00,000 -> 8%. Both
    bands are locked (no customer override), same as the old 3kW rule.
    ``EmiInterestRateRule.min_loan`` / ``max_loan`` already exist, so this
    is a data-only change: the old capacity- and cost-keyed rules are
    deactivated and two new loan-keyed rules take over.

Reversing this migration restores the previous fields (with their model
defaults) and switches the old capacity-keyed rules back on.
"""

from decimal import Decimal

import django.core.validators
from django.db import migrations, models


# System-size default price -> slider band (+/- ~20%, rounded).
PRICE_BANDS = {
    "3.00": ("180000.00", "280000.00"),
    "5.00": ("260000.00", "400000.00"),
    "8.00": ("420000.00", "630000.00"),
    "10.00": ("480000.00", "720000.00"),
}

OLD_RATE_RULE_LABELS = [
    "Up to 3kW — Flarize/SBI PM Surya Ghar (fixed)",
    "Above 3kW — floor 8%",
    "Up to 3kW — system cost up to ₹2L (fixed 5.75%)",
    "Up to 3kW — system cost ₹2L to ₹3L (8%)",
]

NEW_RATE_RULES = [
    {
        "label": "Loan amount up to ₹2,00,000 — 5.75%",
        "min_kw": None,
        "max_kw": None,
        "min_cost": None,
        "max_cost": None,
        "min_loan": None,
        "max_loan": "200000.00",
        "rate": "5.75",
        "min_rate": "5.75",
        "is_locked": True,
        "priority": 20,
    },
    {
        "label": "Loan amount above ₹2,00,000 — 8%",
        "min_kw": None,
        "max_kw": None,
        "min_cost": None,
        "max_cost": None,
        "min_loan": "200000.01",
        "max_loan": None,
        "rate": "8.00",
        "min_rate": "8.00",
        "is_locked": True,
        "priority": 20,
    },
]


def seed_price_bands(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    for size in EmiSystemSize.objects.all():
        band = PRICE_BANDS.get(str(size.capacity_kw))
        if band is None:
            default_cost = size.price_per_kw * size.capacity_kw
            band = (
                str((default_cost * Decimal("0.8")).quantize(Decimal("0.01"))),
                str((default_cost * Decimal("1.2")).quantize(Decimal("0.01"))),
            )
        size.price_min, size.price_max = band
        size.save(update_fields=["price_min", "price_max"])


def unseed_price_bands(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    EmiSystemSize.objects.update(price_min=None, price_max=None)


def apply_loan_based_rates(apps, schema_editor):
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")

    EmiInterestRateRule.objects.filter(label__in=OLD_RATE_RULE_LABELS).update(
        is_active=False
    )
    for rule in NEW_RATE_RULES:
        EmiInterestRateRule.objects.update_or_create(
            label=rule["label"],
            defaults={**{k: v for k, v in rule.items() if k != "label"}, "is_active": True},
        )


def revert_loan_based_rates(apps, schema_editor):
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")

    EmiInterestRateRule.objects.filter(
        label__in=[r["label"] for r in NEW_RATE_RULES]
    ).delete()
    EmiInterestRateRule.objects.filter(
        label="Up to 3kW — Flarize/SBI PM Surya Ghar (fixed)"
    ).update(is_active=True)
    EmiInterestRateRule.objects.filter(label="Above 3kW — floor 8%").update(
        is_active=True
    )


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0059_jobapplication_workflow"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="emisystemsize",
            name="max_system_cost",
        ),
        migrations.AddField(
            model_name="emisystemsize",
            name="price_min",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text=(
                    "₹ floor for the customer's price-adjustment slider. "
                    "Blank = the default price (no downward room)."
                ),
                max_digits=12,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="emisystemsize",
            name="price_max",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text=(
                    "₹ ceiling for the customer's price-adjustment slider. "
                    "Blank = the default price (no upward room)."
                ),
                max_digits=12,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.RemoveField(
            model_name="emicalculatorsettings",
            name="loan_percentage",
        ),
        migrations.RemoveField(
            model_name="emicalculatorsettings",
            name="subsidy_before_loan",
        ),
        migrations.RemoveField(
            model_name="emicalculatorsettings",
            name="loan_amount_min",
        ),
        migrations.RemoveField(
            model_name="emicalculatorsettings",
            name="loan_amount_max",
        ),
        migrations.RemoveField(
            model_name="emicalculatorsettings",
            name="loan_step",
        ),
        migrations.AddField(
            model_name="emicalculatorsettings",
            name="price_step",
            field=models.DecimalField(
                decimal_places=2,
                default=5000,
                help_text="Increment for the system price +/- buttons and slider.",
                max_digits=12,
            ),
        ),
        migrations.RunPython(seed_price_bands, unseed_price_bands),
        migrations.RunPython(apply_loan_based_rates, revert_loan_based_rates),
    ]
