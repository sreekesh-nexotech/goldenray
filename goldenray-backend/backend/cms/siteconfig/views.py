from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.modules import Module
from accounts.permissions import HasModulePermission

from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    lead_recipients = serializers.ListField(child=serializers.EmailField(), read_only=True)
    application_recipients = serializers.ListField(child=serializers.EmailField(), read_only=True)

    class Meta:
        model = SiteSettings
        fields = (
            "company_name", "company_email", "company_phone",
            "address_line", "address_locality", "address_region", "postal_code", "country_code",
            "lead_notification_emails", "application_notification_emails",
            "notify_on_new_lead", "notify_on_new_application",
            "lead_recipients", "application_recipients",
            "default_meta_description", "default_og_image",
            "careers_accepting_general_applications", "careers_intro",
            "updated_at",
        )
        read_only_fields = ("updated_at",)

    def _validate_email_list(self, value, field_label):
        """Catch a malformed address before it silently stops notifications.

        A typo here does not fail loudly at send time — the mail just never
        arrives, and nobody finds out until a lead is missed. Validating on save
        is the only place this is cheap to catch.
        """
        bad = []
        for raw in (value or "").split(","):
            candidate = raw.strip()
            if not candidate:
                continue
            try:
                serializers.EmailField().run_validation(candidate)
            except serializers.ValidationError:
                bad.append(candidate)
        if bad:
            raise serializers.ValidationError(
                f"{field_label} contains invalid address(es): {', '.join(bad)}."
            )
        return value

    def validate_lead_notification_emails(self, value):
        return self._validate_email_list(value, "Lead notifications")

    def validate_application_notification_emails(self, value):
        return self._validate_email_list(value, "Application notifications")


class SiteSettingsAPIView(APIView):
    """Global settings (§6.18) — a singleton, so no list or detail route."""

    permission_classes = [HasModulePermission]
    permission_module = Module.SETTINGS

    def get(self, request):
        return Response(SiteSettingsSerializer(SiteSettings.load()).data)

    def patch(self, request):
        serializer = SiteSettingsSerializer(SiteSettings.load(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)
