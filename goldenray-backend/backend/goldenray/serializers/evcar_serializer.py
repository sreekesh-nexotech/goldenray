from rest_framework import serializers
from ..models import EVCar


class EVCarSerializer(serializers.ModelSerializer):
    class Meta:
        model = EVCar
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
