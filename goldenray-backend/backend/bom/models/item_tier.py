from django.db import models
from .catalog_item import CatalogItem

TIER_CHOICES = [
    ("base", "Base"),
    ("value", "Value"),
    ("premium", "Premium"),
]


class ItemTier(models.Model):
    item = models.ForeignKey(CatalogItem, on_delete=models.CASCADE, related_name="item_tiers")
    tier = models.CharField(max_length=10, choices=TIER_CHOICES)

    class Meta:
        unique_together = [("item", "tier")]

    def __str__(self):
        return f"{self.item.item_id} / {self.tier}"
