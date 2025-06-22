from rest_framework import serializers
from ..models import Quote


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ["quote_id", "name", "phone", "quote_url", "status"]
        read_only_fields = ["quote_id", "created_at", "updated_at"]
