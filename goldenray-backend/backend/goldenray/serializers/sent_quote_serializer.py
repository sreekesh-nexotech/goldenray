from rest_framework import serializers
from ..models import SentQuote


class SentQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentQuote
        fields = ["quote_id", "name", "phone", "quote_url", "is_sent"]
        read_only_fields = ["quote_id", "created_at", "updated_at"]
