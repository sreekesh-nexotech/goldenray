"""Bring back a down payment, this time as a customer-adjustable slider.

Migration 0060 removed the down payment entirely: every quote financed the
whole system price less the subsidy. The customer now wants a down payment
back, but as an explicit percentage slider (10%-90% of whatever the system
price currently is) rather than the old fixed 90% financed / 10% upfront
split, plus a With/Without-Subsidy toggle next to it.

This is purely additive: three new settings fields for the slider's bounds
and step. Reversing this migration removes them.
"""

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0060_emi_price_slider_loan_based_rate"),
    ]

    operations = [
        migrations.AddField(
            model_name="emicalculatorsettings",
            name="down_payment_min_percent",
            field=models.DecimalField(
                decimal_places=2,
                default=10,
                help_text="Floor for the down-payment slider, as % of the system price.",
                max_digits=5,
            ),
        ),
        migrations.AddField(
            model_name="emicalculatorsettings",
            name="down_payment_max_percent",
            field=models.DecimalField(
                decimal_places=2,
                default=90,
                help_text="Ceiling for the down-payment slider, as % of the system price.",
                max_digits=5,
            ),
        ),
        migrations.AddField(
            model_name="emicalculatorsettings",
            name="down_payment_step_percent",
            field=models.DecimalField(
                decimal_places=2,
                default=5,
                help_text="Increment for the down-payment +/- buttons and slider.",
                max_digits=5,
            ),
        ),
    ]
