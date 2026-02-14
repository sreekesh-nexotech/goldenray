from rest_framework import serializers
from ..models import CustomerInstallation


class CustomerInstallationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerInstallation
        fields = [
            "id",
            "customer_name",
            "phone_number",
            "pincode",
            "address",
            "system_size",
            "installation_date",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
