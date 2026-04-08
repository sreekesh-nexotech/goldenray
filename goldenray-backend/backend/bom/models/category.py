from django.db import models

GST_CHOICES = [(5, "5%"), (12, "12%"), (18, "18%")]


class Category(models.Model):
    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=100)
    gst_default = models.IntegerField(choices=GST_CHOICES)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.label
