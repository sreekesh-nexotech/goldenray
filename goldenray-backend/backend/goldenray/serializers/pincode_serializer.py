from rest_framework import serializers
from ..models import Pincode


class PincodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pincode
        fields = ["id", "pincode", "state", "district", "office_name", "region", "division"]
        read_only_fields = ["id", "created_at", "updated_at"]
