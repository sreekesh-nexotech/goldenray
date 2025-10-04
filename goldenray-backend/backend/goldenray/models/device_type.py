from django.db import models


class DeviceType(models.Model):
    name = models.CharField(max_length=100)
    show_in_ui = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    url = models.CharField(max_length=255, null=True, blank=True)
    watts = models.PositiveIntegerField(null=True, blank=True)
    k_value = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "device_types"

    def __str__(self):
        return self.name
