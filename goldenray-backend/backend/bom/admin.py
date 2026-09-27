from django.contrib import admin
from django.utils.html import format_html

from bom.models import QuotationSettings, QuotationTestimonial


@admin.register(QuotationSettings)
class QuotationSettingsAdmin(admin.ModelAdmin):
    """One row. Opening the changelist goes straight to it."""

    fieldsets = (
        ("Offer banner", {
            "description": "Printed only while switched on, titled and within its dates. "
                           "Leave 'valid until' blank to run it for as long as the quotation is valid.",
            "fields": (
                "offer_enabled",
                ("offer_valid_from", "offer_valid_until"),
                "offer_title", "offer_description", "offer_details",
                "offer_title_ml", "offer_description_ml", "offer_details_ml",
                "offer_image", "offer_image_url",
            ),
        }),
    )
    readonly_fields = ("updated_at",)

    def has_add_permission(self, request):
        return not QuotationSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        from django.shortcuts import redirect
        from django.urls import reverse
        obj = QuotationSettings.load()
        return redirect(reverse("admin:bom_quotationsettings_change", args=[obj.pk]))


@admin.register(QuotationTestimonial)
class QuotationTestimonialAdmin(admin.ModelAdmin):
    """Page 6 of the quotation. The first three active ones show on the website's quotation."""

    list_display = ("name", "location", "installed_on", "bill_before", "bill_after", "is_active", "sort_order", "thumb")
    list_editable = ("is_active", "sort_order")
    list_filter = ("is_active",)
    search_fields = ("name", "location")
    readonly_fields = ("preview",)
    fieldsets = (
        (None, {"fields": ("name", "location", "system_label", "installed_on", "is_active", "sort_order")}),
        ("Quote", {"fields": ("quote", "quote_ml")}),
        ("Photo", {"description": "An uploaded photo wins over the URL; with neither, the design's stock photo is used.",
                   "fields": ("photo", "photo_url", "preview")}),
        ("Monthly bill (₹)", {"description": "The card prints before → after and saves before − after.",
                              "fields": ("bill_before", "bill_after")}),
    )

    def _src(self, obj):
        return obj.photo.url if obj.photo else obj.photo_url

    @admin.display(description="Photo")
    def thumb(self, obj):
        src = self._src(obj)
        return format_html('<img src="{}" style="height:36px;border-radius:4px">', src) if src else "Stock photo"

    @admin.display(description="Preview")
    def preview(self, obj):
        src = self._src(obj)
        return format_html('<img src="{}" style="max-height:180px;border-radius:8px">', src) if src else "Stock photo"
