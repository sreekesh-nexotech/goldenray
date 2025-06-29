from django.db import migrations

def add_watts_to_device_types(apps, schema_editor):
    DeviceType = apps.get_model('goldenray', 'DeviceType')
    device_watts = {
        'AC': 1200,
        'Washing Machine': 500,
        'TV': 100,
        'Printer':200,
        'Air Fryer':1400,
        'Cooker':800,
        'Refrigerator': 150,
        'Microwave': 1000,
        'Toaster': 1000,
        'Blender':400,
        'Dishwasher':1000,
        'Vacuum Cleaner':800,
        'Electric Kettle': 1500,
        'Fan': 60,
        'Heater':1500,
        'Iron': 1000,
        }
    for name, watts in device_watts.items():
        DeviceType.objects.filter(name__iexact=name).update(watts=watts)

def reverse_func(apps, schema_editor):
    DeviceType = apps.get_model('goldenray', 'DeviceType')
    DeviceType.objects.all().update(watts=None)

class Migration(migrations.Migration):
    dependencies = [
        ('goldenray', '0027_devicetype_watts'),
    ]
    operations = [
        migrations.RunPython(add_watts_to_device_types, reverse_func),
    ] 