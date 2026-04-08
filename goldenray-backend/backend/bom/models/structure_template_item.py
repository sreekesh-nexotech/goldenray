from django.db import models
from .structure_template import StructureTemplate

ITEM_TYPE_CHOICES = [
    ("tube", "Tube"),
    ("fixed", "Fixed"),
]


class StructureTemplateItem(models.Model):
    template = models.ForeignKey(StructureTemplate, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=255)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPE_CHOICES)
    tube_size = models.CharField(max_length=20, blank=True)
    weight_kg = models.DecimalField(max_digits=8, decimal_places=4, null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    unit = models.CharField(max_length=10, blank=True)
    qty = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.template.slug} — {self.name}"
