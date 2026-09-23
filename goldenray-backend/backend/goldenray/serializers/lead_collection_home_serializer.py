import re

from rest_framework import serializers
from ..models.lead_collection_home import LeadCollectionHome


INDIA_PHONE_PATTERN = re.compile(r"^[6-9][0-9]{9}$")
MAX_DETAIL_FIELDS = 30
MAX_DETAIL_VALUE = 2000


class LeadCollectionHomeSerializer(serializers.ModelSerializer):
    source_label = serializers.CharField(source="get_source_display", read_only=True)

    class Meta:
        model = LeadCollectionHome
        fields = [
            'id', 'name', 'phone_number', 'source', 'source_label', 'page', 'details',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'source_label', 'created_at', 'updated_at']
        extra_kwargs = {
            'source': {'required': False},
            'page': {'required': False, 'allow_blank': True},
            'details': {'required': False},
        }

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name is required.")
        return value

    def validate_phone_number(self, value):
        digits = re.sub(r"[\s\-()+]", "", value)
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not INDIA_PHONE_PATTERN.match(digits):
            raise serializers.ValidationError("Enter a valid 10-digit Indian mobile number.")
        return digits

    def validate_details(self, value):
        # Free-form extras from the form (address, district, …). Keep it a flat,
        # bounded dict of scalars so the public endpoint can't be used to park
        # arbitrary blobs in the database.
        if value in (None, ""):
            return {}
        if not isinstance(value, dict) or len(value) > MAX_DETAIL_FIELDS:
            raise serializers.ValidationError("Invalid details.")
        clean = {}
        for key, item in value.items():
            if item in (None, ""):
                continue
            if not isinstance(item, (str, int, float, bool)):
                raise serializers.ValidationError("Invalid details.")
            clean[str(key)[:64]] = str(item)[:MAX_DETAIL_VALUE] if isinstance(item, str) else item
        return clean
