# Generated migration to populate k_value field for EVCar and EVScooter models

from django.db import migrations


def populate_ev_k_values(apps, schema_editor):
    EVCar = apps.get_model('goldenray', 'EVCar')
    EVScooter = apps.get_model('goldenray', 'EVScooter')
    
    ev_cars_updated = EVCar.objects.all().update(k_value=1.0)
    print(f"Updated {ev_cars_updated} EV Cars with k_value: 1.0")
    
    ev_scooters_updated = EVScooter.objects.all().update(k_value=1.0)
    print(f"Updated {ev_scooters_updated} EV Scooters with k_value: 1.0")


def reverse_populate_ev_k_values(apps, schema_editor):
    EVCar = apps.get_model('goldenray', 'EVCar')
    EVScooter = apps.get_model('goldenray', 'EVScooter')
    
    EVCar.objects.all().update(k_value=None)
    EVScooter.objects.all().update(k_value=None)


class Migration(migrations.Migration):

    dependencies = [
        ('goldenray', '0043_populate_device_type_k_values'),
    ]

    operations = [
        migrations.RunPython(
            populate_ev_k_values,
            reverse_populate_ev_k_values
        ),
    ]