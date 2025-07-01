from rest_framework import serializers
from ..models import DeviceType


class DeviceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceType
        fields = ["id", "name", "show_in_ui", "url", "watts"]
        read_only_fields = ["id"]
