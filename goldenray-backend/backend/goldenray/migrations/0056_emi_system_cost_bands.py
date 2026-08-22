"""System-cost policy for the EMI calculator.

Two new business rules, both expressed as configuration so the Studio keeps
owning the numbers:

  * a 3kW system may not be priced above ₹3,00,000 (``max_system_cost`` on the
    size row — the calculator refuses to quote above it);
  * the interest rate for a 3kW system is keyed to the system cost —
    ≤ ₹2,00,000 → 5.75% fixed, ₹2,00,000–₹3,00,000 → 8% floor — which the rate
    rules now express with ``min_cost`` / ``max_cost`` bands.

The old capacity-only "Up to 3kW — 5.75% locked" rule is deactivated rather
than deleted: the two cost bands replace it, and reversing this migration
switches it back on.
"""

import django.core.validators
from django.db import migrations, models


LEGACY_3KW_RULE = "Up to 3kW — Flarize/SBI PM Surya Ghar (fixed)"

COST_BAND_RULES = [
    {
        "label": "Up to 3kW — system cost up to ₹2L (fixed 5.75%)",
        "min_kw": None,
        "max_kw": "3.00",
        "min_cost": None,
        "max_cost": "200000.00",
        "rate": "5.75",
        "min_rate": "5.75",
        "is_locked": True,
        "priority": 30,
    },
    {
        "label": "Up to 3kW — system cost ₹2L to ₹3L (8%)",
        "min_kw": None,
        "max_kw": "3.00",
        "min_cost": "200000.01",
        "max_cost": "300000.00",
        "rate": "8.00",
        "min_rate": "8.00",
        "is_locked": False,
        "priority": 30,
    },
]


def apply_policy(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")

    EmiSystemSize.objects.filter(capacity_kw="3.00", max_system_cost=None).update(
        max_system_cost="300000.00"
    )

    for rule in COST_BAND_RULES:
        EmiInterestRateRule.objects.get_or_create(
            label=rule["label"],
            defaults={**rule, "is_active": True},
        )

    EmiInterestRateRule.objects.filter(label=LEGACY_3KW_RULE).update(is_active=False)


def revert_policy(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")

    EmiInterestRateRule.objects.filter(
        label__in=[r["label"] for r in COST_BAND_RULES]
    ).delete()
    EmiInterestRateRule.objects.filter(label=LEGACY_3KW_RULE).update(is_active=True)
    EmiSystemSize.objects.filter(capacity_kw="3.00").update(max_system_cost=None)


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0055_emi_subsidy_after_loan_percentage"),
    ]

    operations = [
        migrations.AddField(
            model_name="emisystemsize",
            name="max_system_cost",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text=(
                    "₹ ceiling for this size, e.g. 300000 for 3kW. A price that "
                    "puts the system cost above this is rejected. Blank = no "
                    "ceiling."
                ),
                max_digits=12,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="emiinterestraterule",
            name="min_cost",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Inclusive ₹ system-cost lower bound. Blank = any cost.",
                max_digits=12,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="emiinterestraterule",
            name="max_cost",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Inclusive ₹ system-cost upper bound. Blank = any cost.",
                max_digits=12,
                null=True,
            ),
        ),
        migrations.AlterModelOptions(
            name="emiinterestraterule",
            options={
                "ordering": ["-priority", "min_kw", "min_cost", "min_loan"],
                "verbose_name": "EMI interest rate rule",
                "verbose_name_plural": "EMI interest rate rules",
            },
        ),
        migrations.RunPython(apply_policy, revert_policy),
    ]
