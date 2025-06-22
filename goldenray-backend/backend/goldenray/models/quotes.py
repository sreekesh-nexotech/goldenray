from django.db import models


class Quote(models.Model):
    quote_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    quote_url = models.URLField(max_length=200)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quotes"

    def __str__(self):
        return f"{self.quote_id} - {self.name}"
