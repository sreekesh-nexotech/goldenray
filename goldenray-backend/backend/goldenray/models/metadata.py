from django.db import models

class Metadata(models.Model):
    page = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    keywords = models.JSONField()
    imageUrl = models.CharField(max_length=255)
    ogtype = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.page}: {self.title}" 