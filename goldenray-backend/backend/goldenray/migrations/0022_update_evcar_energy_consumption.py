from django.db import migrations

def update_evcar_energy_consumption(apps, schema_editor):
    EVCar = apps.get_model("goldenray", "EVCar")
    updates = {
        1: 0.152,  # kWh/km
        2: 0.13,
        3: 0.49,
        4: 0.16,
        5: 0.156,
        6: 0.129,
        7: 0.089,
        8: 0.16,
        9: 0.121,
        10: 0.176,
        11: 0.185,
        12: 0.123,
        13: 0.151,
        14: 0.148
        
    }
    for pk, value in updates.items():
        try:
            obj = EVCar.objects.get(pk=pk)
            obj.energy_consumption = value
            obj.save()
        except EVCar.DoesNotExist:
            pass

def reverse_func(apps, schema_editor):
    EVCar = apps.get_model("goldenray", "EVCar")
    for pk in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]:
        try:
            obj = EVCar.objects.get(pk=pk)
            obj.energy_consumption = None
            obj.save()
        except EVCar.DoesNotExist:
            pass

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0021_evcar_energy_consumption"),
    ]

    operations = [
        migrations.RunPython(update_evcar_energy_consumption, reverse_func),
    ] 