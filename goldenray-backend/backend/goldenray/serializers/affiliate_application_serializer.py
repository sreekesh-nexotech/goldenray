import re
from rest_framework import serializers
from ..models.affiliate_application import AffiliateApplication


INDIA_PHONE_PATTERN = re.compile(r"^[6-9][0-9]{9}$")


class AffiliateApplicationSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True, allow_blank=False, max_length=255)
    phone = serializers.CharField(required=True, allow_blank=False, max_length=20)
    email = serializers.EmailField(required=True, allow_blank=False)
    profession = serializers.ChoiceField(
        required=True, choices=AffiliateApplication.PROFESSION_CHOICES
    )
    district = serializers.ChoiceField(
        required=True, choices=AffiliateApplication.DISTRICT_CHOICES
    )
    # Honeypot: must be empty. Bots tend to autofill any visible-looking field.
    website = serializers.CharField(
        required=False, allow_blank=True, write_only=True, max_length=255
    )

    class Meta:
        model = AffiliateApplication
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "profession",
            "district",
            "created_at",
            "website",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_full_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Full name is required.")
        return value

    def validate_phone(self, value):
        digits = re.sub(r"[\s\-()+]", "", value)
        # Strip a leading country code 91 if present, then validate Indian mobile.
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not INDIA_PHONE_PATTERN.match(digits):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian mobile number."
            )
        return digits

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        # Honeypot — if it was filled, silently reject as validation error.
        if attrs.pop("website", ""):
            raise serializers.ValidationError("Invalid submission.")
        return attrs
