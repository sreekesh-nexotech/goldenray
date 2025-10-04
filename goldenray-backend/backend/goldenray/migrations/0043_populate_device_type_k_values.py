# Generated migration to populate k_value field for DeviceType model

from django.db import migrations


def populate_device_type_k_values(apps, schema_editor):
    DeviceType = apps.get_model('goldenray', 'DeviceType')
    
    device_k_values = {
        'AC 1 ton': 0.35,
        'AC 1.5 ton': 0.35,
        'AC 2 ton': 0.35,
        'Washing Machine': 1,
        'Dishwasher': 1,
        'Refrigerator': 1,
        'Heater': 1.0,
        'Microwave': 1,
        'TV': 1,
        'Vacuum Cleaner': 1,
        'Iron': 1,
        'Air Fryer': 1,
        'Cooker': 1,
        'Printer': 1,
        'Toaster': 1,
        'Blender': 1,
        'Electric Kettle': 1,
        'Fan': 1,
    }
    
    for device_name, k_value in device_k_values.items():
        try:
            device = DeviceType.objects.get(name=device_name)
            device.k_value = k_value
            device.save()
            print(f"Updated {device_name} with k_value: {k_value}")
        except DeviceType.DoesNotExist:
            print(f"Device {device_name} not found, skipping...")
            continue


def reverse_populate_device_type_k_values(apps, schema_editor):
    DeviceType = apps.get_model('goldenray', 'DeviceType')
    DeviceType.objects.all().update(k_value=None)


class Migration(migrations.Migration):

    dependencies = [
        ('goldenray', '0042_devicetype_k_value'),
    ]

    operations = [
        migrations.RunPython(
            populate_device_type_k_values,
            reverse_populate_device_type_k_values
        ),
    ]