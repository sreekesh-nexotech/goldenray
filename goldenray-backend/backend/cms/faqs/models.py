"""FAQ management (§6.4, §6.5).

Today the site's FAQs are hard-coded across roughly seven React components —
home, subsidy, service area, how-it-works, comparison, affiliate. This module
is what replaces them: one record per question, associated to the page it
appears on, ordered, with its own status and its FAQPage schema generated from
the record rather than typed.

Two requirements shape the model more than the rest:

  * **Order matters.** §6.4 calls reordering mandatory because FAQ display order
    is meaningful on the page. ``display_order`` is therefore scoped per page,
    not global, and reordering is a dedicated endpoint rather than N separate
    saves — a drag that renumbers eight rows must not be able to half-apply.

  * **Page association is the join to the website.** §6.5 makes it required when
    FAQs are page-specific. ``page`` points at ``sitepages.Page``, which is the
    same registry the Pages module maintains, so "which FAQs show on /subsidy"
    and "what is /subsidy" cannot drift into two different answers.

``section`` exists because several pages carry more than one FAQ block (the
comparison page has one per product family). It is a free string rather than a
model: the sections are declared by the page component, and inventing a table
for them would be the kind of over-modelling §6.4 warns against.
"""

from django.conf import settings
from django.db import models

from seo.models import SeoFields


class FaqCategory(models.Model):
    """Optional grouping for FAQs (§6.5 — "category: optional/configurable")."""

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "faqs_category"
        ordering = ["sort_order", "name"]
        verbose_name_plural = "FAQ categories"

    def __str__(self):
        return self.name


class Faq(SeoFields):
    """One question/answer pair bound to a page."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    question = models.CharField(max_length=500)
    # Blank is allowed on purpose: §6.5 gates *publishing* on completeness, not
    # saving, so a half-written draft has to survive a save. ``publish_errors()``
    # is what refuses to put an answerless FAQ on the site.
    answer = models.TextField(
        blank=True,
        help_text="light HTML is allowed — the site renders the same markup the schema carries",
    )

    page = models.ForeignKey(
        "sitepages.Page",
        on_delete=models.PROTECT,
        related_name="faqs",
        help_text="the website page this FAQ appears on",
    )
    section = models.CharField(
        max_length=80,
        blank=True,
        help_text="block within the page when it carries more than one FAQ list",
    )
    category = models.ForeignKey(
        FaqCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="faqs"
    )

    display_order = models.IntegerField(default=0, help_text="order within the page/section")
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)

    published_at = models.DateTimeField(null=True, blank=True)
    archived_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "faqs_faq"
        # Page → section → author-set order is the order the site renders in, so
        # the default ordering is the published order. Nothing downstream has to
        # re-sort, and the Studio list shows exactly what a visitor will see.
        ordering = ["page", "section", "display_order", "id"]
        indexes = [
            models.Index(fields=["page", "section", "display_order"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return self.question[:80]

    # ── SEO hooks ────────────────────────────────────────────────────────────
    def seo_fallback_title(self) -> str:
        return self.question

    def seo_path(self) -> str:
        return self.page.route if self.page_id else ""

    # ── Publish validation (§6.5 — "prevent publishing incomplete records") ──
    def publish_errors(self) -> list[str]:
        """Everything blocking publication, in the words the editor should read."""
        errors = []
        if not (self.question or "").strip():
            errors.append("A question is required.")
        if not (self.answer or "").strip():
            errors.append("An answer is required.")
        if not self.page_id:
            errors.append("Choose the page this FAQ appears on.")
        elif self.page.status == self.page.Status.ARCHIVED:
            errors.append(f"'{self.page.name}' is archived — publish it or pick another page.")
        return errors
