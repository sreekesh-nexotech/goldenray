from rest_framework import serializers
from ..models import SolarPanel


class SolarPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolarPanel
        fields = [
            "id",
            "brand",
            "name",
            "wattage",
            "panel_type",
            "technology",
            "image_url",
            "description",
            "efficiency",
            "temperature_coefficient",
            "noct",
            "real_output_at_60c",
            "ip_rating",
            "wind_load",
            "moisture_protection",
            "weight",
            "bifacial_gain",
            "product_warranty",
            "performance_warranty",
            "first_year_power_drop",
            "annual_degradation",
            "output_at_year_25",
            "manufacturing_capacity",
            "bloomberg_tier1",
            "pvel_top_performer",
            "bis_certified",
            "independent_audit",
            "certifications",
            "price_range",
            "subsidy_eligible",
            "kerala_climate_score",
            "efficiency_rating",
            "heat_performance_rating",
            "warranty_rating",
            "kerala_climate_rating",
            "overall_rating",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
