from django.db import models


class EVCar(models.Model):
    model = models.CharField(max_length=100)
    battery_capacity = models.FloatField()
    claimed_range = models.IntegerField()
    adjusted_real_world_range = models.IntegerField()
    ex_showroom_price = models.IntegerField()
    energy_consumption = models.FloatField(null=True, blank=True)
    k_value = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ev_cars"

    def __str__(self):
        return self.model
