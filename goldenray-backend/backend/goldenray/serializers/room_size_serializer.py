from rest_framework import serializers
from ..models import RoomSize


class RoomSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSize
        fields = ["id", "bhk_type", "size", "units"]
        read_only_fields = ["id"]