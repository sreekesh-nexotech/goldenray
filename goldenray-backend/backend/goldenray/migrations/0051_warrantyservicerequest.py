from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("goldenray", "0050_solarinverter"),
    ]

    operations = [
        migrations.CreateModel(
            name="WarrantyServiceRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=255)),
                ("phone", models.CharField(db_index=True, max_length=20)),
                (
                    "issue_type",
                    models.CharField(
                        choices=[
                            ("Low Generation", "Low Generation"),
                            ("Inverter Fault", "Inverter Fault"),
                            ("Panel Damage", "Panel Damage"),
                            ("KSEB / Net Metering", "KSEB / Net Metering"),
                            ("Warranty Claim", "Warranty Claim"),
                            ("Other", "Other"),
                        ],
                        max_length=64,
                    ),
                ),
                ("description", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "warranty_service_request",
                "ordering": ["-created_at"],
            },
        ),
    ]
