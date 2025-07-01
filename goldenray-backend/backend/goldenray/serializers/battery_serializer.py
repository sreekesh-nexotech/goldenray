from rest_framework import serializers
from ..models import Battery

 
class BatterySerializer(serializers.ModelSerializer):
    class Meta:
        model = Battery
        fields = ["id", "battery_capacity", "backup_hour", "battery_price"]
        read_only_fields = ["id"] 