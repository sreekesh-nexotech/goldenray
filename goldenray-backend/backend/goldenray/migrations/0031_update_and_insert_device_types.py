from django.db import migrations

def update_and_insert_device_types(apps, schema_editor):
    DeviceType = apps.get_model("goldenray", "DeviceType")
    # Update 'AC' to 'AC 1 ton'
    try:
        ac = DeviceType.objects.get(name="AC")
        ac.name = "AC 1 ton"
        ac.save()
    except DeviceType.DoesNotExist:
        pass

    # Insert new device types with url and watts
    new_device_types = [
        {"name": "AC 1.5 ton", "url": "https://gym-manager-pull.b-cdn.net/golden_ray/icons/ac.svg", "watts": 1500},
        {"name": "AC 2 ton", "url": "https://gym-manager-pull.b-cdn.net/golden_ray/icons/ac.svg", "watts": 2000},
    ]
    for device in new_device_types:
        DeviceType.objects.get_or_create(
            name=device["name"],
            defaults={
                "url": device["url"],
                "watts": device["watts"]
            }
        )

def reverse_func(apps, schema_editor):
    DeviceType = apps.get_model("goldenray", "DeviceType")
    # Revert 'AC 1 ton' back to 'AC'
    try:
        ac = DeviceType.objects.get(name="AC 1 ton")
        ac.name = "AC"
        ac.save()
    except DeviceType.DoesNotExist:
        pass
    # Remove the inserted device types
    for name in ["AC 1.5 ton", "AC 2 ton"]:
        DeviceType.objects.filter(name=name).delete()

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0030_reset_batteries"),
    ]

    operations = [
        migrations.RunPython(update_and_insert_device_types, reverse_func),
    ] 