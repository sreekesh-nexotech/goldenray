from django.db import migrations


def update_interest_rates(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")

    rate_6_5 = [
        {"bill_range": 6000, "type": "Residential"},
        {"bill_range": 8000, "type": "Residential"},
    ]
    
    for criteria in rate_6_5:
        SolarInstallationNew.objects.filter(**criteria).update(interest_rate=6.5)
    
    rate_8_9 = [
        {"bill_range": 10000, "type": "Residential"},
        {"bill_range": 15500, "type": "Residential"},
        {"bill_range": 20000, "type": "Residential"},
        {"bill_range": 24000, "type": "Residential"},
        {"bill_range": 30000, "type": "Residential"},
        {"bill_range": 40000, "type": "Residential"},
    ]
    
    for criteria in rate_8_9:
        SolarInstallationNew.objects.filter(**criteria).update(interest_rate=8.9)


def reverse_update_interest_rates(apps, schema_editor):
    SolarInstallationNew = apps.get_model("goldenray", "SolarInstallationNew")

    original_6_5_rows = [
        {"bill_range": 6000, "type": "Residential"},
        {"bill_range": 8000, "type": "Residential"},
    ]
    
    for criteria in original_6_5_rows:
        if criteria["type"] == "Residential":
            SolarInstallationNew.objects.filter(**criteria).update(interest_rate=9.15)
        else:
            SolarInstallationNew.objects.filter(**criteria).update(interest_rate=0.0)
    
    original_8_9_rows = [
        {"bill_range": 10000, "type": "Residential"},
        {"bill_range": 15500, "type": "Residential"},
        {"bill_range": 20000, "type": "Residential"},
        {"bill_range": 24000, "type": "Residential"},
        {"bill_range": 30000, "type": "Residential"},
        {"bill_range": 40000, "type": "Residential"},
    ]
    
    for criteria in original_8_9_rows:
        if criteria["type"] == "Residential":
            SolarInstallationNew.objects.filter(**criteria).update(interest_rate=9.15)
        else:
            SolarInstallationNew.objects.filter(**criteria).update(interest_rate=0.0)


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0044_populate_ev_k_values"),
    ]

    operations = [
        migrations.RunPython(update_interest_rates, reverse_update_interest_rates),
    ]
