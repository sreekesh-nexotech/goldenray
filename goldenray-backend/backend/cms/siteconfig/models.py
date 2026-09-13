"""Global settings (§6.18).

The scope asks for this to stay intentionally small until management confirms
more, and lists exactly four areas: company/admin information the system needs,
notification email preferences for leads and career applications, website
defaults if required, and career configuration if required. Nothing else belongs
here — a settings screen is where scope creep goes to hide.

Stored as a singleton row rather than key/value pairs: the fields are known and
typed, and a typed row is what lets the Organization schema builder and the
notification senders read them without guessing at types.
"""

from django.conf import settings as django_settings
from django.db import models


class SiteSettings(models.Model):
    """The one settings row. Fetch with ``SiteSettings.load()``."""

    SINGLETON_PK = 1

    # ── Company / admin information ──────────────────────────────────────────
    company_name = models.CharField(max_length=160, blank=True)
    company_email = models.EmailField(max_length=254, blank=True)
    company_phone = models.CharField(max_length=40, blank=True)
    address_line = models.CharField(max_length=255, blank=True)
    address_locality = models.CharField(max_length=120, blank=True, help_text="city")
    address_region = models.CharField(max_length=120, blank=True, help_text="state")
    postal_code = models.CharField(max_length=20, blank=True)
    country_code = models.CharField(max_length=2, default="IN")

    # ── Notification preferences ─────────────────────────────────────────────
    #
    # Comma-separated rather than a related table: these are two short operator
    # lists, and §6.18 explicitly scopes this to "notification email preferences
    # where already needed" — not a subscription system.
    lead_notification_emails = models.CharField(
        max_length=500,
        blank=True,
        help_text="comma-separated; who is emailed when a lead arrives",
    )
    application_notification_emails = models.CharField(
        max_length=500,
        blank=True,
        help_text="comma-separated; who is emailed when a career application arrives",
    )
    notify_on_new_lead = models.BooleanField(default=True)
    notify_on_new_application = models.BooleanField(default=True)

    # ── Website defaults ─────────────────────────────────────────────────────
    default_meta_description = models.TextField(
        blank=True, help_text="used when a page has no description of its own"
    )
    default_og_image = models.ForeignKey(
        "media.MediaAsset", on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    # ── Careers configuration ────────────────────────────────────────────────
    careers_accepting_general_applications = models.BooleanField(
        default=True, help_text="show the general application form on the careers page"
    )
    careers_intro = models.TextField(blank=True, help_text="short line above Open Positions")

    updated_by = models.ForeignKey(
        django_settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "siteconfig_settings"
        verbose_name = "site settings"
        verbose_name_plural = "site settings"

    def __str__(self):
        return self.company_name or "Site settings"

    def save(self, *args, **kwargs):
        # Pin the primary key so a second row cannot be created by accident and
        # leave two disagreeing sources of truth for the same settings.
        self.pk = self.SINGLETON_PK
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Settings are not deletable — clearing fields is the way to reset them."""
        return None

    @classmethod
    def load(cls) -> "SiteSettings":
        row, _ = cls.objects.get_or_create(pk=cls.SINGLETON_PK)
        return row

    # ── Helpers ──────────────────────────────────────────────────────────────
    @staticmethod
    def _split_emails(value: str) -> list[str]:
        return [e.strip() for e in (value or "").split(",") if e.strip()]

    @property
    def lead_recipients(self) -> list[str]:
        return self._split_emails(self.lead_notification_emails)

    @property
    def application_recipients(self) -> list[str]:
        return self._split_emails(self.application_notification_emails)
