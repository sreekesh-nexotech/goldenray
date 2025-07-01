# Example: 0017_update_device_type_urls.py
from django.db import migrations

def set_device_type_urls(apps, schema_editor):
    DeviceType = apps.get_model("goldenray", "DeviceType")
    url_map = {
        "AC": "https://gym-manager-pull.b-cdn.net/golden_ray/icons/ac.svg",
        "Washing Machine": "https://gym-manager-pull.b-cdn.net/golden_ray/icons/washing-machine.svg",
        "TV":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/tv.svg",
        "Printer":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/printer.svg",
        "Air Fryer":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/common-device.svg",
        "Cooker":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/common-device.svg",
        "Refrigerator":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/refrigerator.svg",
        "Microwave":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/microwave.svg",
        "Toaster":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/toaster.svg",
        "Blender":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/common-device.svg",
        "Dishwasher":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/common-device.svg",
        "Vacuum Cleaner":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/common-device.svg",
        "Electric Kettle":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/electric-kettle.svg",
        "Fan":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/fan.svg",
        "Heater":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/common-device.svg",
        "Iron":"https://gym-manager-pull.b-cdn.net/golden_ray/icons/iron.svg"
    }
    for name, url in url_map.items():
        DeviceType.objects.filter(name=name).update(url=url)

def remove_device_type_urls(apps, schema_editor):
    DeviceType = apps.get_model("goldenray", "DeviceType")
    names = [
        "AC",
        "Washing Machine",
        "TV",
        "Printer",
        "Air Fryer",
        "Cooker",
        "Refrigerator",
        "Microwave",
        "Toaster",
        "Blender",
        "Dishwasher",
        "Vacuum Cleaner",
        "Electric Kettle",
        "Fan",
        "Heater",
        "Iron"
    ]
    DeviceType.objects.filter(name__in=names).update(url=None)

class Migration(migrations.Migration):

    dependencies = [
        ("goldenray", "0016_devicetype_url"),  
    ]

    operations = [
        migrations.RunPython(set_device_type_urls, remove_device_type_urls),
    ]