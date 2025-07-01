from rest_framework import serializers
from ..models.send_quote_junk import SendQuoteJunk

class SendQuoteJunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SendQuoteJunk
        fields = ["quote_id", "name", "phone", "quote_url", "is_sent"]
        read_only_fields = ["quote_id", "created_at", "updated_at"] 