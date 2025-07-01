from django.db import migrations

def reset_batteries(apps, schema_editor):
    Battery = apps.get_model('goldenray', 'Battery')
    
    Battery.objects.all().delete()
    
    new_batteries = [
        Battery(battery_capacity=4.61, backup_hour=4.30, battery_price=140300, inverter_price=20000),
        Battery(battery_capacity=5, backup_hour=5.50, battery_price=145000, inverter_price=35000),
        Battery(battery_capacity=5.12, backup_hour=6.56, battery_price=145000, inverter_price=50000),
        Battery(battery_capacity=5.53, backup_hour=7.76, battery_price=151400, inverter_price=50000),
    ]
    Battery.objects.bulk_create(new_batteries)

def reverse_func(apps, schema_editor):
    Battery = apps.get_model('goldenray', 'Battery')
    Battery.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('goldenray', '0029_update_kseb_tariffs'),
    ]
    operations = [
        migrations.RunPython(reset_batteries, reverse_func),
    ]