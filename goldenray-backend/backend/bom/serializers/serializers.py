from rest_framework import serializers
from bom.models import (
    GlobalCosts,
    Category,
    CatalogItem,
    ItemTier,
    BomTemplate,
    BomSlot,
    BomFixedItem,
    MarketRate,
    StructureTemplate,
    StructureTemplateItem,
    TubeWeight,
    Offer,
)


class GlobalCostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalCosts
        fields = "__all__"
        read_only_fields = ["updated_at"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CatalogItemSerializer(serializers.ModelSerializer):
    effective_gst = serializers.ReadOnlyField()

    class Meta:
        model = CatalogItem
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class ItemTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTier
        fields = "__all__"


class BomTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BomTemplate
        fields = "__all__"


class BomSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BomSlot
        fields = "__all__"


class BomFixedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BomFixedItem
        fields = "__all__"


class MarketRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketRate
        fields = "__all__"
        read_only_fields = ["updated_at"]


class StructureTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureTemplate
        fields = "__all__"


class StructureTemplateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureTemplateItem
        fields = "__all__"


class TubeWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = TubeWeight
        fields = "__all__"


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"
        read_only_fields = ["created_at"]
