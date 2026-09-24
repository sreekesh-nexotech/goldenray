from django.contrib import admin

from bom.models import QuotationSettings


@admin.register(QuotationSettings)
class QuotationSettingsAdmin(admin.ModelAdmin):
    """One row. Opening the changelist goes straight to it."""

    fieldsets = (
        ("EMI (10-year loan on the amount financed)", {
            "fields": ("emi_rate_up_to_3kw", "emi_rate_above_3kw"),
        }),
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
