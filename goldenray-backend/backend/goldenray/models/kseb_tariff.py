from django.db import models


class KSEBTariff(models.Model):
    min_units = models.IntegerField()
    max_units = models.IntegerField(null=True, blank=True)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "kseb_tariffs"

    def __str__(self):
        return f"{self.min_units}-{self.max_units or '∞'} units: ₹{self.rate}/unit"
