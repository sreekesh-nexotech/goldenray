import re
from rest_framework import serializers
from ..models.warranty_service_request import WarrantyServiceRequest


INDIA_PHONE_PATTERN = re.compile(r"^[6-9][0-9]{9}$")


class WarrantyServiceRequestSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True, allow_blank=False, max_length=255)
    phone = serializers.CharField(required=True, allow_blank=False, max_length=20)
    issue_type = serializers.ChoiceField(
        required=True, choices=WarrantyServiceRequest.ISSUE_TYPE_CHOICES
    )
    description = serializers.CharField(
        required=False, allow_blank=True, max_length=2000
    )
    # Honeypot: must be empty.
    website = serializers.CharField(
        required=False, allow_blank=True, write_only=True, max_length=255
    )

    class Meta:
        model = WarrantyServiceRequest
        fields = [
            "id",
            "full_name",
            "phone",
            "issue_type",
            "description",
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
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not INDIA_PHONE_PATTERN.match(digits):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian mobile number."
            )
        return digits

    def validate_description(self, value):
        return (value or "").strip()

    def validate(self, attrs):
        if attrs.pop("website", ""):
            raise serializers.ValidationError("Invalid submission.")
        return attrs
