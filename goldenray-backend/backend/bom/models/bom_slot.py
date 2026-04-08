from django.db import models
from .bom_template import BomTemplate
from .category import Category

GST_CHOICES = [(5, "5%"), (12, "12%"), (18, "18%")]


class BomSlot(models.Model):
    template = models.ForeignKey(BomTemplate, on_delete=models.CASCADE, related_name="slots")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="bom_slots")
    pos = models.PositiveSmallIntegerField()
    label = models.CharField(max_length=100)
    variable = models.BooleanField(default=False)
    gst = models.IntegerField(choices=GST_CHOICES)
    qty = models.JSONField(default=dict)
    premium_qty = models.JSONField(null=True, blank=True)
    bat_qty = models.JSONField(null=True, blank=True)
    premium_bat_qty = models.JSONField(null=True, blank=True)
    filter_type = models.CharField(max_length=20, blank=True)
    filter_phase = models.CharField(max_length=20, blank=True)
    qty_mode = models.CharField(max_length=20, blank=True)
    fixed_qty = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = [("template", "pos")]
        ordering = ["pos"]

    def get_qty(self, size_key, bat_config=None, tier=None):
        if tier == "premium":
            if bat_config and self.premium_bat_qty:
                bat_map = self.premium_bat_qty.get(bat_config, self.premium_bat_qty.get("0", {}))
                return bat_map.get(size_key, 0)
            if self.premium_qty is not None:
                return self.premium_qty.get(size_key, 0)
        if bat_config and self.bat_qty:
            bat_map = self.bat_qty.get(bat_config, self.bat_qty.get("0", {}))
            return bat_map.get(size_key, 0)
        return self.qty.get(size_key, 0)

    def __str__(self):
        return f"{self.template.system_type} / pos {self.pos} — {self.label}"
