from django.db import models


class TubeWeight(models.Model):
    tube_size = models.CharField(max_length=20, unique=True)
    weight_kg = models.DecimalField(max_digits=8, decimal_places=4)

    def __str__(self):
        return f"{self.tube_size} → {self.weight_kg} kg"
