from django.db import migrations, models


class Migration(migrations.Migration):
    """Help-text only: the loan % now applies to the gross system cost and the
    subsidy comes off the resulting loan, not the other way round."""

    dependencies = [
        ("goldenray", "0054_seed_emi_calculator_config"),
    ]

    operations = [
        migrations.AlterField(
            model_name="emicalculatorsettings",
            name="loan_percentage",
            field=models.DecimalField(
                decimal_places=2,
                default=90,
                help_text="% of the system cost that is financed. The rest is upfront.",
                max_digits=5,
            ),
        ),
        migrations.AlterField(
            model_name="emicalculatorsettings",
            name="subsidy_before_loan",
            field=models.BooleanField(
                default=True,
                help_text=(
                    "On: the loan % is applied to the system cost, then the subsidy "
                    "is deducted from that loan. Off: the subsidy does not reduce "
                    "the loan."
                ),
            ),
        ),
    ]
