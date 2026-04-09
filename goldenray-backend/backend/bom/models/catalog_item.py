from django.db import models
from .category import Category

GST_CHOICES = [(5, "5%"), (12, "12%"), (18, "18%")]

PHASE_CHOICES = [
    ("1P", "1P"),
    ("3P", "3P"),
    ("1P-HYB", "1P-HYB"),
    ("3P-HYB", "3P-HYB"),
]

INVERTER_TYPE_CHOICES = [
    ("ongrid", "On-Grid"),
    ("hybrid", "Hybrid"),
]


class CatalogItem(models.Model):
    item_id = models.CharField(max_length=20, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="items")
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    gst_override = models.IntegerField(choices=GST_CHOICES, null=True, blank=True)

    # Panels only
    watt = models.IntegerField(null=True, blank=True)
    per_watt = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    dcr = models.BooleanField(null=True, blank=True)

    # Inverters / DCDB
    phase = models.CharField(max_length=10, choices=PHASE_CHOICES, null=True, blank=True)

    # Inverters only
    kw = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    model = models.CharField(max_length=100, null=True, blank=True)
    inverter_type = models.CharField(max_length=10, choices=INVERTER_TYPE_CHOICES, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def effective_gst(self):
        if self.gst_override is not None:
            return self.gst_override
        return self.category.gst_default

    def __str__(self):
        return f"{self.item_id} — {self.name}"
