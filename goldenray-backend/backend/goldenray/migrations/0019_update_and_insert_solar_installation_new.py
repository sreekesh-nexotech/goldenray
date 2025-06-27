from django.db import migrations


def update_solar_installation_new_by_pk(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")
    
    updates = {
        1: {"per_kw_rate": 76667.00, "final_cost": 152000.00, "interest_rate": 9.15, "type": "Residential"},
        2: {"per_kw_rate": 69250.00, "final_cost": 199000.00, "interest_rate": 9.15, "type": "Residential"},
        3: {"per_kw_rate": 66000.00, "final_cost": 252000.00, "interest_rate": 9.15, "type": "Residential"},
        4: {"per_kw_rate": 65625.00, "final_cost": 447000.00, "interest_rate": 9.15, "type": "Residential"},
        5: {"bill_range":20000,"per_kw_rate": 60000.00, "final_cost": 492000.00, "interest_rate": 9.15, "type": "Residential"},
        
        
    }
    for pk, fields in updates.items():
        try:
            obj = SolarInstallationNew.objects.get(pk=pk)
            for field, value in fields.items():
                setattr(obj, field, value)
            obj.save()
        except SolarInstallationNew.DoesNotExist:
            pass  # Optionally handle missing rows

def reverse_func(apps, schema_editor):
    # Optionally, revert the updates if needed
    pass

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0018_solarinstallationnew_final_cost_and_more"),
    ]

    operations = [
        migrations.RunPython(update_solar_installation_new_by_pk, reverse_func),
    ]