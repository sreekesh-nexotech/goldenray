from django.db import models


class WarrantyServiceRequest(models.Model):
    ISSUE_TYPE_CHOICES = [
        ("Low Generation", "Low Generation"),
        ("Inverter Fault", "Inverter Fault"),
        ("Panel Damage", "Panel Damage"),
        ("KSEB / Net Metering", "KSEB / Net Metering"),
        ("Warranty Claim", "Warranty Claim"),
        ("Other", "Other"),
    ]

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, db_index=True)
    issue_type = models.CharField(max_length=64, choices=ISSUE_TYPE_CHOICES)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "warranty_service_request"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.phone} ({self.issue_type})"
