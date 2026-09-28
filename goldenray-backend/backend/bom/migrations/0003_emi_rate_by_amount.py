from decimal import Decimal

import django.core.validators
from django.db import migrations, models


def old_default_to_new(apps, schema_editor):
    # The old "above 3 kW" rate (7.90 by default) becomes the rate at or below
    # ₹2 lakh, which the new rule sets to 8%. Only the untouched default moves;
    # a rate an admin chose is left alone.
    QuotationSettings = apps.get_model("bom", "QuotationSettings")
    QuotationSettings.objects.filter(emi_rate_at_or_below_threshold=Decimal("7.90")).update(
        emi_rate_at_or_below_threshold=Decimal("8.00"),
    )


class Migration(migrations.Migration):
    """
    EMI rate now depends on the amount, not the system size: with
    X = total − 10% down payment, X > ₹2 lakh → 5.75%, X ≤ ₹2 lakh → 8%.
    The old up-to-3 kW rate (5.75) carries over as the above-threshold rate.
    """

    dependencies = [
        ("bom", "0002_quotation_settings"),
    ]

    operations = [
        migrations.RenameField("quotationsettings", "emi_rate_up_to_3kw", "emi_rate_above_threshold"),
        migrations.RenameField("quotationsettings", "emi_rate_above_3kw", "emi_rate_at_or_below_threshold"),
        migrations.AlterField(
            model_name="quotationsettings",
            name="emi_rate_above_threshold",
            field=models.DecimalField(
                decimal_places=2, default=Decimal("5.75"), max_digits=5,
                validators=[
                    django.core.validators.MinValueValidator(Decimal("0")),
                    django.core.validators.MaxValueValidator(Decimal("30")),
                ],
                verbose_name="EMI rate above the threshold (% p.a.)",
            ),
        ),
        migrations.AlterField(
            model_name="quotationsettings",
            name="emi_rate_at_or_below_threshold",
            field=models.DecimalField(
                decimal_places=2, default=Decimal("8.00"), max_digits=5,
                validators=[
                    django.core.validators.MinValueValidator(Decimal("0")),
                    django.core.validators.MaxValueValidator(Decimal("30")),
                ],
                verbose_name="EMI rate at or below the threshold (% p.a.)",
            ),
        ),
        migrations.AddField(
            model_name="quotationsettings",
            name="emi_rate_threshold",
            field=models.DecimalField(
                decimal_places=2, default=Decimal("200000"), max_digits=12,
                validators=[django.core.validators.MinValueValidator(Decimal("0"))],
                verbose_name="EMI threshold (₹, on total − down payment)",
            ),
        ),
        migrations.RunPython(old_default_to_new, migrations.RunPython.noop),
    ]
