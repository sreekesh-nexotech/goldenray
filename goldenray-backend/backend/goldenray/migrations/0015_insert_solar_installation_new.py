from django.db import migrations
from django.utils import timezone


def insert_solar_installation_new(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    now = timezone.now()
    data = [
        {
            "bill_range": 6000,
            "power_capacity": 3.0,
            "time_to_complete": "3-7",
            "total_cost": 230000.00,
            "total_subsidy": 78000.00,
            "area_required": 240,
            "loan_available": "2,00,000",
            "created_at": now,
            "updated_at": now,
        },
        {
            "bill_range": 8000,
            "power_capacity": 4.0,
            "time_to_complete": "3-7",
            "total_cost": 277000.00,
            "total_subsidy": 78000.00,
            "area_required": 320,
            "loan_available": "2,00,000-600000",
            "created_at": now,
            "updated_at": now,
        },
        {
            "bill_range": 10000,
            "power_capacity": 5.0,
            "time_to_complete": "3-7",
            "total_cost": 330000.00,
            "total_subsidy": 78000.00,
            "area_required": 400,
            "loan_available": "2,00,000-600000",
            "created_at": now,
            "updated_at": now,
        },
        {
            "bill_range": 15500,
            "power_capacity": 8.0,
            "time_to_complete": "3-10",
            "total_cost": 525000.00,
            "total_subsidy": 78000.00,
            "area_required": 640,
            "loan_available": "2,00,000-600000",
            "created_at": now,
            "updated_at": now,
        },
        {
            "bill_range": 24000,
            "power_capacity": 10.0,
            "time_to_complete": "3-13",
            "total_cost": 570000.00,
            "total_subsidy": 78000.00,
            "area_required": 800,
            "loan_available": "2,00,000-600000",
            "created_at": now,
            "updated_at": now,
        },
    ]
    SolarInstallationNew.objects.bulk_create([SolarInstallationNew(**entry) for entry in data])

def remove_solar_installation_new(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    SolarInstallationNew.objects.filter(bill_range__in=[6000, 8000, 10000, 15500, 24000]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0014_solarinstallationnew"),
    ]

    operations = [
        migrations.RunPython(insert_solar_installation_new, remove_solar_installation_new),
    ] 