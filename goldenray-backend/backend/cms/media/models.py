from django.db import models


def upload_to(instance, filename):
    return f"blog/{filename}"


class MediaAsset(models.Model):
    """An uploaded media file. Delivery resolves it to Strapi's media shape
    ``{ url, width, height, alternativeText }`` (client's ``ApiCoverImage``).

    When BunnyCDN is configured, the upload is compressed (WebP) and pushed to
    ``cms/<collection>/`` on the storage zone; ``cdn_url`` then takes priority
    over the local file everywhere the asset is served.
    """

    file = models.ImageField(upload_to=upload_to)
    collection = models.ForeignKey(
        "catalog.Collection",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="media_assets",
        help_text="CDN folder: cms/<collection>/ (cms/general/ if unset)",
    )
    cdn_url = models.URLField(max_length=1000, blank=True, help_text="BunnyCDN URL (auto-filled on upload)")
    storage_path = models.CharField(max_length=500, blank=True, help_text="path inside the Bunny storage zone")
    mime = models.CharField(max_length=120, blank=True)
    size = models.PositiveIntegerField(default=0, help_text="bytes")
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    alternative_text = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "media_asset"
        ordering = ["-created_at"]

    def __str__(self):
        return self.file.name or f"asset-{self.pk}"

    def save(self, *args, **kwargs):
        # Auto-populate size / dimensions from the uploaded file where possible.
        f = self.file
        if f:
            try:
                self.size = f.size or self.size
            except Exception:
                pass
            try:
                self.width = getattr(f, "width", None) or self.width
                self.height = getattr(f, "height", None) or self.height
            except Exception:
                pass
            if not self.mime and getattr(f, "file", None) is not None:
                self.mime = getattr(f.file, "content_type", "") or self.mime
        super().save(*args, **kwargs)
