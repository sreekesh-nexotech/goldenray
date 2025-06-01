from django.db import models


class Device(models.Model):
    name = models.CharField(max_length=100)
    show_in_ui = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "devices"

    def __str__(self):
        return self.name
