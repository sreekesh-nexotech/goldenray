from rest_framework import serializers
from ..models import SolarInstallationNew

class SolarInstallationNewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolarInstallationNew
        fields = [
            "id",
            "bill_range",
            "power_capacity",
            "time_to_complete",
            "total_cost",
            "total_subsidy",
            "area_required",
            "loan_available",
            "inverter_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"] 