"""Help text only: the subsidy now comes off the loan, not off the system cost."""

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0056_emi_system_cost_bands"),
    ]

    operations = [
        migrations.AlterField(
            model_name="emisubsidyrule",
            name="amount",
            field=models.DecimalField(
                decimal_places=2,
                help_text="₹ deducted from the loan once the loan % has been applied.",
                max_digits=12,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
    ]
