import uuid

from django.conf import settings
from django.db import models

from catalog.models import Author, Badge, Category, Collection, Tag, Template
from media.models import MediaAsset


class Entry(models.Model):
    """One blog entry, any collection. This is what the client reads as
    ``ApiArticle``. ``collection`` says which one; ``template`` says which
    layout / image groups / attribute slots apply."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    document_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    collection = models.ForeignKey(Collection, on_delete=models.PROTECT, related_name="entries")
    template = models.ForeignKey(
        Template, on_delete=models.PROTECT, related_name="entries", null=True, blank=True
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, db_index=True)
    excerpt = models.TextField(blank=True)
    summary = models.JSONField(default=list, blank=True, help_text="Strapi-blocks array")
    introduction = models.JSONField(default=list, blank=True, help_text="Strapi-blocks array")
    read_time = models.PositiveIntegerField(null=True, blank=True, help_text="minutes")
    is_featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(null=True, blank=True)
    published_on = models.DateTimeField(null=True, blank=True, help_text="author-set display date")
    warning = models.TextField(blank=True, null=True, help_text="→ 'important' callout")
    insights = models.TextField(blank=True, null=True, help_text="→ 'key insight' callout")

    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True)
    categories = models.ManyToManyField(Category, blank=True, related_name="entries")
    tags = models.ManyToManyField(Tag, blank=True, related_name="entries")
    badges = models.ManyToManyField(Badge, blank=True, related_name="entries")
    cover_image = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_entry"
        ordering = ["sort_order", "-published_on", "-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["collection", "slug"], name="uniq_entry_collection_slug"),
        ]
        indexes = [
            models.Index(fields=["collection", "status", "published_on"]),
            models.Index(fields=["is_featured"]),
            models.Index(fields=["sort_order"]),
        ]

    def __str__(self):
        return f"{self.title} [{self.status}]"


class ContentBlock(models.Model):
    """The repeatable ``contentBlocks`` component (Strapi-blocks body)."""

    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="content_blocks")
    component = models.CharField(max_length=120, default="shared.rich-text")
    body = models.JSONField(default=list, blank=True, help_text="Strapi-blocks array")
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "content_content_block"
        ordering = ["order", "id"]

    def __str__(self):
        return f"block#{self.pk} of {self.entry_id}"


class EntryImage(models.Model):
    """An image bound to a template image-group (N per repeatable group)."""

    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="images")
    group_key = models.CharField(max_length=60, help_text="matches a TemplateImageGroup.key")
    position = models.IntegerField(default=0, help_text="order within a repeatable group")
    media_asset = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    external_url = models.URLField(max_length=1000, blank=True, help_text="external/CDN URL alternative")

    class Meta:
        db_table = "content_entry_image"
        ordering = ["group_key", "position", "id"]

    def resolved_url(self):
        if self.external_url:
            return self.external_url
        if self.media_asset_id and self.media_asset:
            if self.media_asset.cdn_url:
                return self.media_asset.cdn_url
            if self.media_asset.file:
                try:
                    return self.media_asset.file.url
                except ValueError:
                    return None
        return None

    def __str__(self):
        return f"{self.entry_id}:{self.group_key}[{self.position}]"


class EntryAttributeValue(models.Model):
    """Typed value for a template attribute slot (validated against its type)."""

    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="attribute_values")
    slot_key = models.CharField(max_length=60, help_text="matches a TemplateAttributeSlot.key")
    value = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "content_entry_attribute_value"
        constraints = [
            models.UniqueConstraint(fields=["entry", "slot_key"], name="uniq_entry_attr_slot"),
        ]

    def __str__(self):
        return f"{self.entry_id}:{self.slot_key}"


class Seo(models.Model):
    """SEO component (one-to-one with an entry)."""

    entry = models.OneToOneField(Entry, on_delete=models.CASCADE, related_name="seo")
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    canonical_url = models.URLField(max_length=1000, blank=True, null=True)
    keywords = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "content_seo"

    def __str__(self):
        return f"SEO for {self.entry_id}"
