from rest_framework import serializers
from ..models import SolarInstallation


class SolarInstallationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolarInstallation
        fields = ["id", "power_capacity", "time_to_complete", "total_cost", "total_subsidy", "area_required"]
        read_only_fields = ["id", "created_at", "updated_at"]
