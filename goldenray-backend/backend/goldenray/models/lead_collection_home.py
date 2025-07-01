from django.db import models

class LeadCollectionHome(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'lead_collection_home'

    def __str__(self):
        return f"{self.name} - {self.phone_number}" 