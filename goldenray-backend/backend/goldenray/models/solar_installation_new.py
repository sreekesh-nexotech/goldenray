from django.db import models

class SolarInstallationNew(models.Model):
    bill_range = models.IntegerField()
    power_capacity = models.FloatField()
    time_to_complete = models.CharField(max_length=255)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_subsidy = models.DecimalField(max_digits=10, decimal_places=2)
    area_required = models.IntegerField()
    loan_available = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "solar_installation_new"

    def __str__(self):
        return f"SolarInstallationNew {self.power_capacity} kW - {self.area_required} sqft" 