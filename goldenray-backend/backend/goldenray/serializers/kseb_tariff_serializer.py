from rest_framework import serializers
from ..models import KSEBTariff


class KSEBTariffSerializer(serializers.ModelSerializer):
    class Meta:
        model = KSEBTariff
        fields = ["id", "min_units", "max_units", "rate"]
        read_only_fields = ["id"]
