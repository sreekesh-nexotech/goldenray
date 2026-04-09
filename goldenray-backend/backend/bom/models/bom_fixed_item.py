from django.db import models
from .bom_template import BomTemplate
from .category import Category
from .catalog_item import CatalogItem

GST_CHOICES = [(5, "5%"), (12, "12%"), (18, "18%")]


class BomFixedItem(models.Model):
    template = models.ForeignKey(BomTemplate, on_delete=models.CASCADE, related_name="fixed_items")
    name = models.CharField(max_length=255)
    gst = models.IntegerField(choices=GST_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    catalog_item = models.ForeignKey(
        CatalogItem, on_delete=models.SET_NULL, null=True, blank=True, related_name="fixed_bom_entries"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="fixed_bom_items"
    )
    qty = models.JSONField(default=dict)
    bat_qty = models.JSONField(null=True, blank=True)
    premium_qty = models.JSONField(null=True, blank=True)
    section = models.CharField(max_length=50, blank=True)
    is_tube = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.template.system_type} — {self.name}"
