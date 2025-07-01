from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0031_update_and_insert_device_types"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="battery",
            name="inverter_price",
        ),
    ] 