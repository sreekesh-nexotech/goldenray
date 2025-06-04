from django.db import models


class Pincode(models.Model):
    pincode = models.CharField(max_length=6)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    office_name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    division = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pincodes"

    def __str__(self):
        return f"{self.pincode} - {self.office_name}"
