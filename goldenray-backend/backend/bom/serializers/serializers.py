import copy

from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import FileExtensionValidator
from django.utils import timezone
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
    QuotationSettings,
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


class QuotationSettingsSerializer(serializers.ModelSerializer):
    """
    Quotation EMI rates and offer banner. Besides the stored fields it reports
    what the document should actually do today: `offer_active` (print the
    banner at all) and `offer_image_src` (uploaded image, else the URL).
    """

    offer_active = serializers.SerializerMethodField()
    offer_image_src = serializers.SerializerMethodField()
    # Nullable so an empty multipart value (or JSON null) removes the upload.
    offer_image = serializers.FileField(
        required=False, allow_null=True,
        validators=[FileExtensionValidator(["png", "jpg", "jpeg", "webp"])],
    )

    class Meta:
        model = QuotationSettings
        exclude = ["id"]
        read_only_fields = ["updated_at"]

    def get_offer_active(self, obj):
        return obj.offer_is_active(timezone.localdate())

    def get_offer_image_src(self, obj):
        if obj.offer_image:
            request = self.context.get("request")
            url = obj.offer_image.url
            return request.build_absolute_uri(url) if request else url
        return obj.offer_image_url

    def validate(self, attrs):
        # Run the model's cross-field checks (date order, image size) on the
        # merged state, so a partial update cannot slip past them.
        # On a copy, so the real instance still holds the old values for update().
        instance = copy.copy(self.instance) if self.instance else QuotationSettings()
        for key, value in attrs.items():
            setattr(instance, key, value)
        try:
            instance.clean()
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.message_dict)
        return attrs

    def update(self, instance, validated_data):
        # Replacing or clearing the upload deletes the old file, so the media
        # volume does not collect every banner ever tried.
        old = instance.offer_image.name if instance.offer_image else None
        instance = super().update(instance, validated_data)
        if old and "offer_image" in validated_data and instance.offer_image.name != old:
            instance.offer_image.storage.delete(old)
        return instance
