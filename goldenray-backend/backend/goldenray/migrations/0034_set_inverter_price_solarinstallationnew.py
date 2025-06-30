from django.db import migrations

def set_inverter_price(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    SolarInstallationNew.objects.all().update(inverter_price=55000)

def reverse_func(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    SolarInstallationNew.objects.all().update(inverter_price=None)

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0033_add_inverter_price_to_solarinstallationnew"),
    ]

    operations = [
        migrations.RunPython(set_inverter_price, reverse_func),
    ] 