"""Website page maintenance (§6.2) — the controlled alternative to a page builder.

The scope is unusually firm about what this module must *not* be: no general
rich-text editing, no layout editing, no page builder. The public site's pages
are hand-built React; their copy and structure are not the admin's to change.
What an admin does need is to swap an approved image, fix an exposed string,
and maintain the page's SEO — and to be shown plainly that everything else is
locked.

That shape is what the three models here encode:

  * ``Page``      registers a real site route so it can be listed, given SEO,
                  and pointed at by other records (FAQs associate to a page).
  * ``PageImageSlot`` is one replaceable image on that page. The slot exists
                  because the *page* declares it, not because an author added
                  it — so replacing the image can never change the layout.
  * ``PageTextSlot``  is one explicitly exposed string. This is the whole of
                  "allowed small corrections only where the field is explicitly
                  exposed": a field nobody registered is a field nobody can edit.

Slots are seeded by developers alongside the page component they belong to.
An admin fills them; they cannot create or remove them, which is what makes the
"maintenance only" promise structural rather than a matter of good behaviour.
"""

from django.conf import settings
from django.db import models

from seo.models import SeoFields


class Page(models.Model):
    """One maintainable route on the public website."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    name = models.CharField(max_length=160, help_text="how the page is referred to internally")
    route = models.CharField(
        max_length=255,
        unique=True,
        help_text="site-relative path, e.g. '/career' or '/subsidy'",
    )
    description = models.TextField(blank=True, help_text="what this page is for; shown to maintainers")
    group = models.CharField(
        max_length=80,
        blank=True,
        help_text="grouping for the Pages list, e.g. 'Solutions', 'Careers'",
    )
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PUBLISHED)

    # §7: "Protected website content should be visually marked as locked/read-only."
    # A protected page still exposes its slots and SEO — protection is about the
    # copy and layout the admin must not reach, not about locking the record.
    is_protected = models.BooleanField(
        default=True,
        help_text="content/layout is developer-owned; only registered slots and SEO are editable",
    )
    sort_order = models.IntegerField(default=0)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sitepages_page"
        ordering = ["sort_order", "name"]
        indexes = [models.Index(fields=["status"]), models.Index(fields=["group"])]

    def __str__(self):
        return f"{self.name} ({self.route})"


class PageSeo(SeoFields):
    """SEO + schema for a page, one-to-one (§6.2, §6.7).

    Split from ``Page`` rather than mixed into it so the SEO module (screen 07)
    can list and edit SEO across record types through one shape, and so a role
    granted ``seo.edit`` but not ``pages.edit`` writes here without being handed
    the page's other fields.
    """

    page = models.OneToOneField(Page, on_delete=models.CASCADE, related_name="seo")

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sitepages_page_seo"

    def __str__(self):
        return f"SEO for {self.page.route}"

    def seo_fallback_title(self) -> str:
        return self.page.name

    def seo_path(self) -> str:
        return self.page.route


class PageImageSlot(models.Model):
    """One replaceable image on a page (§6.2, §6.6).

    ``key`` is the contract the page component reads and must stay stable;
    ``label`` and ``guidance`` are what the maintainer sees. ``asset`` is null
    until someone replaces the built-in default, which is why the frontend keeps
    rendering its shipped image when no asset is set — replacing an image must
    never be able to leave a hole in the page.
    """

    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="image_slots")
    key = models.CharField(max_length=60, help_text="stable machine name the page component reads")
    label = models.CharField(max_length=120, help_text="editable display name")
    guidance = models.CharField(
        max_length=255, blank=True, help_text="e.g. 'landscape, at least 1600×900'"
    )
    asset = models.ForeignKey(
        "media.MediaAsset",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="page_slots",
        help_text="leave empty to keep the page's built-in image",
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        help_text="overrides the asset's own alt text for this placement",
    )
    order = models.IntegerField(default=0)

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sitepages_page_image_slot"
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(fields=["page", "key"], name="uniq_image_slot_per_page"),
        ]

    def __str__(self):
        return f"{self.page.route}:{self.key}"

    @property
    def effective_alt(self) -> str:
        return self.alt_text or (self.asset.alternative_text if self.asset_id else "")


class PageTextSlot(models.Model):
    """One explicitly exposed, editable string on a page (§6.2).

    Deliberately typed and length-capped per slot: a maintainer correcting a
    phone number or a hero subtitle should not be able to paste a paragraph into
    a control designed for six words, and the cap is how the page's layout
    survives contact with the admin.
    """

    class Kind(models.TextChoices):
        SHORT_TEXT = "short_text", "Short text"
        LONG_TEXT = "long_text", "Long text"
        URL = "url", "URL"
        EMAIL = "email", "Email"
        PHONE = "phone", "Phone"

    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="text_slots")
    key = models.CharField(max_length=60, help_text="stable machine name the page component reads")
    label = models.CharField(max_length=120)
    kind = models.CharField(max_length=16, choices=Kind.choices, default=Kind.SHORT_TEXT)
    guidance = models.CharField(max_length=255, blank=True)
    value = models.TextField(blank=True)
    max_length = models.PositiveIntegerField(
        null=True, blank=True, help_text="cap enforced in the editor; null = uncapped"
    )
    order = models.IntegerField(default=0)

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sitepages_page_text_slot"
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(fields=["page", "key"], name="uniq_text_slot_per_page"),
        ]

    def __str__(self):
        return f"{self.page.route}:{self.key}"
