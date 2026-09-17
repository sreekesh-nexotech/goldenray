"""One-tap "Quick add" amounts for the down-payment slider.

The public calculator offers a row of chips (+₹5,000, +₹10,000, ...) that
bump the down payment by a fixed rupee amount. Those amounts live in the
settings row so the Studio owns them like every other calculator number.
The singleton is seeded with the agreed defaults; reversing removes the
field.
"""

from django.db import migrations, models


DEFAULT_QUICK_ADDS = [5000, 10000, 20000]


def seed_quick_adds(apps, schema_editor):
    EmiCalculatorSettings = apps.get_model("goldenray", "EmiCalculatorSettings")
    EmiCalculatorSettings.objects.filter(pk=1, down_payment_quick_adds=[]).update(
        down_payment_quick_adds=DEFAULT_QUICK_ADDS
    )


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0062_emi_price_max_ceilings"),
    ]

    operations = [
        migrations.AddField(
            model_name="emicalculatorsettings",
            name="down_payment_quick_adds",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text=(
                    '₹ amounts offered as one-tap "Quick add" chips under the '
                    "down-payment slider, e.g. [5000, 10000, 20000]."
                ),
            ),
        ),
        migrations.RunPython(seed_quick_adds, migrations.RunPython.noop),
    ]
