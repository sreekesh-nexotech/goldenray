from django.db import models


class GlobalCosts(models.Model):
    install_rate = models.DecimalField(max_digits=12, decimal_places=2)
    service_rate_year = models.DecimalField(max_digits=12, decimal_places=2)
    service_years = models.PositiveSmallIntegerField()
    transport_rate = models.DecimalField(max_digits=12, decimal_places=2)
    default_dist_km = models.PositiveSmallIntegerField()
    miscellaneous = models.DecimalField(max_digits=12, decimal_places=2)
    office = models.DecimalField(max_digits=12, decimal_places=2)
    elevated_structure_rate = models.DecimalField(max_digits=12, decimal_places=2)
    sheet_structure_rate = models.DecimalField(max_digits=12, decimal_places=2)
    gp_rate_per_kg = models.DecimalField(max_digits=12, decimal_places=2)
    gi_rate_per_kg = models.DecimalField(max_digits=12, decimal_places=2)
    structure_labor = models.DecimalField(max_digits=12, decimal_places=2)
    structure_repair_pct = models.DecimalField(max_digits=6, decimal_places=4)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Global Costs"
        verbose_name_plural = "Global Costs"
