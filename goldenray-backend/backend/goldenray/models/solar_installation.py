from django.db import models


class SolarInstallation(models.Model):
    power_capacity = models.FloatField()
    time_to_complete = models.IntegerField()
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_subsidy = models.DecimalField(max_digits=10, decimal_places=2)
    area_required = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "solar_installations"

    def __str__(self):
        return f"Solar Installation {self.power_capacity} kW - {self.area_required} sqft"
