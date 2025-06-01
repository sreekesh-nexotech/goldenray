from rest_framework import serializers
from ..models import Device


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ["id", "name", "show_in_ui"]
        read_only_fields = ["id"]
