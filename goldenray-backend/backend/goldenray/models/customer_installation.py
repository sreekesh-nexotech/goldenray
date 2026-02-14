from django.db import models


class CustomerInstallation(models.Model):
    """
    Tracks actual customer installations with location data
    """
    customer_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    pincode = models.CharField(max_length=6, db_index=True)
    address = models.TextField()
    system_size = models.FloatField(help_text="System size in kW")
    installation_date = models.DateField()
    status = models.CharField(
        max_length=50,
        choices=[
            ('completed', 'Completed'),
            ('in_progress', 'In Progress'),
            ('planned', 'Planned'),
        ],
        default='completed'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "customer_installations"
        indexes = [
            models.Index(fields=['pincode']),
            models.Index(fields=['installation_date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.customer_name} - {self.pincode} ({self.system_size} kW)"
