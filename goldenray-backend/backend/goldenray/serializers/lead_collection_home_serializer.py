from rest_framework import serializers
from ..models.lead_collection_home import LeadCollectionHome

class LeadCollectionHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadCollectionHome
        fields = ['id', 'name', 'phone_number', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at'] 