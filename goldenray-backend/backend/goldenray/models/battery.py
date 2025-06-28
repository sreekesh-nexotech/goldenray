from django.db import models


class Battery(models.Model):
    battery_capacity = models.DecimalField(max_digits=10, decimal_places=2)
    backup_hour = models.DecimalField(max_digits=5, decimal_places=2)
    battery_price = models.DecimalField(max_digits=12, decimal_places=2)
    inverter_price = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "batteries"

    def __str__(self):
        return f"Battery {self.battery_capacity}kWh - {self.backup_hour}h backup" 