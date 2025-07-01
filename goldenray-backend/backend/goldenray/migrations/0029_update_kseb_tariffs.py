from django.db import migrations

def update_kseb_tariff_rates(apps, schema_editor):
    KSEBTariff = apps.get_model('goldenray', 'KSEBTariff')
    updates = [
        {'id': 1, 'rate': 6.75},
        {'id': 2, 'rate': 7.6},
        {'id': 3, 'rate': 7.95},
        {'id': 4, 'rate': 8.25},
        {'id': 5, 'rate': 9.2},
    ]
    for upd in updates:
        KSEBTariff.objects.filter(id=upd['id']).update(rate=upd['rate'])

def reverse_func(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('goldenray', '0028_add_watts_to_device_types'),
    ]
    operations = [
        migrations.RunPython(update_kseb_tariff_rates, reverse_func),
    ] 