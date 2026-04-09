from django.db import models

OFFER_TYPE_CHOICES = [
    ("flat", "Flat"),
    ("percent", "Percent"),
]

APPLIES_TO_CHOICES = [
    ("all", "All"),
    ("ongrid", "On-Grid"),
    ("hybrid", "Hybrid"),
    ("upgrade", "Upgrade"),
]

APPLIES_TO_TIER_CHOICES = [
    ("all", "All"),
    ("base", "Base"),
    ("value", "Value"),
    ("premium", "Premium"),
]


class Offer(models.Model):
    offer_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    offer_type = models.CharField(max_length=10, choices=OFFER_TYPE_CHOICES)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    applies_to = models.CharField(max_length=10, choices=APPLIES_TO_CHOICES)
    applies_to_tier = models.CharField(max_length=10, choices=APPLIES_TO_TIER_CHOICES)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.offer_id})"
