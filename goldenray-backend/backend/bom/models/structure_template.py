from django.db import models


class StructureTemplate(models.Model):
    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label
