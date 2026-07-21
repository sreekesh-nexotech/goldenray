from django.db import models


class Collection(models.Model):
    """Registers a blog collection (Article, CaseStudy, Guide, …).

    Every entry belongs to exactly one; each drives a delivery route
    ``/api/<api_uid>``. The current frontend consumes ``articles``.
    """

    api_uid = models.SlugField(max_length=80, unique=True, help_text="route slug, e.g. 'articles'")
    singular_name = models.CharField(max_length=80)
    plural_name = models.CharField(max_length=80)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "catalog_collection"
        ordering = ["plural_name"]

    def __str__(self):
        return self.plural_name


class Template(models.Model):
    """A named layout an entry is assigned to. Owns image-group and
    attribute-slot definitions. Reusable across collections."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "catalog_template"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class TemplateImageGroup(models.Model):
    """A named, relabelable image group on a template.

    ``single`` groups hold one image (e.g. coverImg); ``repeatable`` groups hold
    0..N images (galleries) → unbounded images per template. ``key`` is the
    stable delivery contract; ``label`` is freely editable presentation.
    """

    template = models.ForeignKey(Template, on_delete=models.CASCADE, related_name="image_groups")
    key = models.CharField(max_length=60, help_text="stable machine name, e.g. coverImg / bodyImages")
    label = models.CharField(max_length=120, help_text="editable display name")
    repeatable = models.BooleanField(default=False)
    max_items = models.PositiveIntegerField(null=True, blank=True, help_text="cap for repeatable; null = unbounded")
    required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "catalog_template_image_group"
        ordering = ["order", "id"]
        unique_together = (("template", "key"),)

    def __str__(self):
        return f"{self.template.name}:{self.key}"


class TemplateAttributeSlot(models.Model):
    """Predefined, typed attribute slot. ``label`` is editable, ``key`` stays
    stable so the delivery contract never breaks when a label is renamed."""

    class Type(models.TextChoices):
        TEXT = "text", "Text"
        RICHTEXT_BLOCKS = "richtext_blocks", "Rich text (blocks)"
        NUMBER = "number", "Number"
        BOOLEAN = "boolean", "Boolean"
        DATE = "date", "Date"
        ENUM = "enum", "Enum"
        URL = "url", "URL"

    template = models.ForeignKey(Template, on_delete=models.CASCADE, related_name="attribute_slots")
    key = models.CharField(max_length=60, help_text="stable machine name (contract)")
    label = models.CharField(max_length=120, help_text="editable display name")
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.TEXT)
    options = models.JSONField(default=dict, blank=True, help_text="{choices:[...]} for enum, {default,min,max} for number")
    required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "catalog_template_attribute_slot"
        ordering = ["order", "id"]
        unique_together = (("template", "key"),)

    def __str__(self):
        return f"{self.template.name}:{self.key}"


# ── Simple named lookups (relations the client reads) ─────────────────────────
class Author(models.Model):
    name = models.CharField(max_length=160)
    bio = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=120, blank=True, null=True)

    class Meta:
        db_table = "catalog_author"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, null=True, blank=True)

    class Meta:
        db_table = "catalog_category"
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)

    class Meta:
        db_table = "catalog_tag"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Badge(models.Model):
    label = models.CharField(max_length=120)
    color = models.CharField(max_length=32, default="#123532")

    class Meta:
        db_table = "catalog_badge"
        ordering = ["label"]

    def __str__(self):
        return self.label
