from django.db import migrations

def update_evscooter_energy_consumption(apps, schema_editor):
    EVScooter = apps.get_model("goldenray", "EVScooter")
    updates = {
        1: 0.039,  # kWh/km
        2: 0.028,
        3: 0.023,
        4: 0.023,
        5: 0.024,
        6: 0.002,
        7: 0.029,
        8: 0.039,
        9: 0.014,
        10: 0.019,
        11: 0.022,
        12: 0.022,
        13: 0.021,
        14: 0.023,
        15: 0.013,
        
    }
    for pk, value in updates.items():
        try:
            obj = EVScooter.objects.get(pk=pk)
            obj.energy_consumption = value
            obj.save()
        except EVScooter.DoesNotExist:
            pass

def reverse_func(apps, schema_editor):
    EVScooter = apps.get_model("goldenray", "EVScooter")
    for pk in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]:
        try:
            obj = EVScooter.objects.get(pk=pk)
            obj.energy_consumption = None
            obj.save()
        except EVScooter.DoesNotExist:
            pass

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0023_evscooter_energy_consumption"),
    ]

    operations = [
        migrations.RunPython(update_evscooter_energy_consumption, reverse_func),
    ] 