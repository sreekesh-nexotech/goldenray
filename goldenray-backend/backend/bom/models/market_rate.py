from django.db import models

SYSTEM_TYPE_CHOICES = [
    ("ongrid", "On-Grid"),
    ("hybrid", "Hybrid"),
    ("upgrade", "Upgrade"),
]

TIER_CHOICES = [
    ("base", "Base"),
    ("value", "Value"),
    ("premium", "Premium"),
]


class MarketRate(models.Model):
    system_type = models.CharField(max_length=10, choices=SYSTEM_TYPE_CHOICES)
    tier = models.CharField(max_length=10, choices=TIER_CHOICES, blank=True)
    bat_config = models.CharField(max_length=5, blank=True)
    from_size = models.CharField(max_length=10, blank=True)
    to_size = models.CharField(max_length=10, blank=True)
    size_rates = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("system_type", "tier", "bat_config", "from_size", "to_size")]

    def __str__(self):
        return f"{self.system_type} / {self.tier} / bat={self.bat_config}"
