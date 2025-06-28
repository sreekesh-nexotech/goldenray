from rest_framework import serializers
from ..models import EVScooter


class EVScooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = EVScooter
        fields = [
            "id",
            "model",
            "battery_capacity",
            "claimed_range",
            "adjusted_real_world_range",
            "ex_showroom_price",
            "energy_consumption",
        ]
        read_only_fields = ["id"]
