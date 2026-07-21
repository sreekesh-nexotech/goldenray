from rest_framework import serializers

from .models import (
    Author,
    Badge,
    Category,
    Collection,
    Tag,
    Template,
    TemplateAttributeSlot,
    TemplateImageGroup,
)


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = (
            "id",
            "api_uid",
            "singular_name",
            "plural_name",
            "description",
            "is_active",
        )


class TemplateImageGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateImageGroup
        fields = ("id", "key", "label", "repeatable", "max_items", "required", "order")


class TemplateAttributeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateAttributeSlot
        fields = ("id", "key", "label", "type", "options", "required", "order")


class TemplateSerializer(serializers.ModelSerializer):
    image_groups = TemplateImageGroupSerializer(many=True, read_only=True)
    attribute_slots = TemplateAttributeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Template
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "sort_order",
            "image_groups",
            "attribute_slots",
        )


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("id", "name", "bio", "role")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ("id", "label", "color")
