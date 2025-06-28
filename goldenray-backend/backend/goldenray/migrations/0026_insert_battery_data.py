from django.db import migrations
from django.utils import timezone


def insert_battery_data(apps, schema_editor):
    Battery = apps.get_model("goldenray", "Battery")
    now = timezone.now()
    
    battery_data = [
        {
            "battery_capacity": 9.6,
            "backup_hour": 4.8,
            "battery_price": 79800.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 12.8,
            "backup_hour": 6.4,
            "battery_price": 254706.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 15.36,
            "backup_hour": 7.7,
            "battery_price": 506600.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 20.48,
            "backup_hour": 10.2,
            "battery_price": 674500.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 30.72,
            "backup_hour": 15.4,
            "battery_price": 674500.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 30.72,
            "backup_hour": 16,
            "battery_price": 674500.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 40,
            "backup_hour": 17,
            "battery_price": 674500.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
        {
            "battery_capacity": 50,
            "backup_hour": 18,
            "battery_price": 674500.00,
            "inverter_price": 55000.00,
            "created_at": now,
            "updated_at": now,
        },
    ]
    
    Battery.objects.bulk_create([Battery(**entry) for entry in battery_data])


def remove_battery_data(apps, schema_editor):
    Battery = apps.get_model("goldenray", "Battery")
    Battery.objects.filter(battery_capacity__in=[9.6, 12.8, 15.36, 20.48, 30.72, 40, 50]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0025_battery"),
    ]

    operations = [
        migrations.RunPython(insert_battery_data, remove_battery_data),
    ] 