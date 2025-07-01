from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0032_remove_inverter_price_from_battery"),
    ]

    operations = [
        migrations.AddField(
            model_name="solarinstallationnew",
            name="inverter_price",
            field=models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True),
        ),
    ] 