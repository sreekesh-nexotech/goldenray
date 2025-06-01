from rest_framework import serializers
from ..models import Wattage


class WattageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wattage
        fields = ["id", "value", "show_in_ui"]
        read_only_fields = ["id"]
