from django.db import migrations
from django.utils import timezone


# 7kW rows backing the EMI calculator's "7kW" tile.
# Values are interpolated between the existing 5kW and 8kW seed rows so that
# per_kw_rate stays in the same band (~65k) and the subsidy matches the
# PM Surya Ghar bracket (₹78,000) used by other Residential rows.

ROWS = [
    {
        "bill_range": 14000,
        "power_capacity": 7.0,
        "time_to_complete": "3-10",
        "total_cost": 460000.00,
        "total_subsidy": 78000.00,
        "area_required": 560,
        "loan_available": "2,00,000-6,00,000",
        "per_kw_rate": 65714.00,
        "final_cost": 382000.00,
        "interest_rate": 8.9,
        "type": "Residential",
    },
    {
        "bill_range": 14000,
        "power_capacity": 7.0,
        "time_to_complete": "3-10",
        "total_cost": 460000.00,
        "total_subsidy": 0.00,
        "area_required": 560,
        "loan_available": "N/A",
        "per_kw_rate": 65714.00,
        "final_cost": 460000.00,
        "interest_rate": 0.0,
        "type": "Commercial",
    },
]


def insert_7kw_rows(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    now = timezone.now()
    to_create = []
    for entry in ROWS:
        exists = SolarInstallationNew.objects.filter(
            power_capacity=entry["power_capacity"],
            type=entry["type"],
        ).exists()
        if exists:
            continue
        to_create.append(
            SolarInstallationNew(**entry, created_at=now, updated_at=now)
        )
    if to_create:
        SolarInstallationNew.objects.bulk_create(to_create)


def remove_7kw_rows(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    SolarInstallationNew.objects.filter(
        power_capacity=7.0,
        bill_range=14000,
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0048_affiliateapplication"),
    ]

    operations = [
        migrations.RunPython(insert_7kw_rows, remove_7kw_rows),
    ]
