from django.db import models


class Wattage(models.Model):
    value = models.IntegerField(unique=True)
    show_in_ui = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "wattages"

    def __str__(self):
        return f"{self.value} Watts"
