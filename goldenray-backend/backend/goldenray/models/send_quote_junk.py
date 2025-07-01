from django.db import models

class SendQuoteJunk(models.Model):
    quote_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    quote_url = models.URLField(max_length=200)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "send_quote_junk"

    def __str__(self):
        return f"{self.quote_id} - {self.name}" 