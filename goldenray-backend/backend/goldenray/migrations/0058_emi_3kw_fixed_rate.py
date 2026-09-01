"""3kW goes back to one fixed rate, whatever the system cost.

Migration 0056 keyed the 3kW rate to the system cost — 5.75% up to ₹2,00,000
and 8% from there to the ₹3,00,000 ceiling. That is not the policy: a 3kW
system is on the Flarize/SBI PM Surya Ghar rate of 5.75% at any price, and only
larger systems floor at 8%.

So the two cost-band rules are switched off and the capacity-only 3kW rule that
0056 deactivated is switched back on (re-created if it is missing, so this also
lands on a database whose rules were edited in the Studio). The ₹3,00,000
ceiling on the 3kW size is a separate rule and stays as it is.

Reversing this migration puts the cost bands back.
"""

from django.db import migrations


FIXED_3KW_RULE = {
    "label": "Up to 3kW — Flarize/SBI PM Surya Ghar (fixed)",
    "min_kw": None,
    "max_kw": "3.00",
    "min_cost": None,
    "max_cost": None,
    "min_loan": None,
    "max_loan": None,
    "rate": "5.75",
    "min_rate": "5.75",
    "is_locked": True,
    "priority": 20,
}

COST_BAND_LABELS = [
    "Up to 3kW — system cost up to ₹2L (fixed 5.75%)",
    "Up to 3kW — system cost ₹2L to ₹3L (8%)",
]


def apply_policy(apps, schema_editor):
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")

    label = FIXED_3KW_RULE["label"]
    EmiInterestRateRule.objects.update_or_create(
        label=label,
        defaults={
            **{k: v for k, v in FIXED_3KW_RULE.items() if k != "label"},
            "is_active": True,
        },
    )
    EmiInterestRateRule.objects.filter(label__in=COST_BAND_LABELS).update(
        is_active=False
    )


def revert_policy(apps, schema_editor):
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")

    EmiInterestRateRule.objects.filter(label__in=COST_BAND_LABELS).update(
        is_active=True
    )
    EmiInterestRateRule.objects.filter(label=FIXED_3KW_RULE["label"]).update(
        is_active=False
    )


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0057_emi_subsidy_help_text"),
    ]

    operations = [
        migrations.RunPython(apply_policy, revert_policy),
    ]
