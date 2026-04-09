from django.db import models

SYSTEM_TYPE_CHOICES = [
    ("ongrid", "On-Grid"),
    ("hybrid", "Hybrid"),
    ("upgrade", "Upgrade"),
]


class BomTemplate(models.Model):
    system_type = models.CharField(max_length=10, unique=True, choices=SYSTEM_TYPE_CHOICES)
    label = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    sizes = models.JSONField(default=dict)
    three_phase_sizes = models.JSONField(default=list)
    available_tiers = models.JSONField(default=list)
    battery_configs = models.JSONField(default=list)

    def __str__(self):
        return self.label
