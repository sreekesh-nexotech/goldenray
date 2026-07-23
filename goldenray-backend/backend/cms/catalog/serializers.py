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
    # Writable so the admin UI can create/reorder groups via
    # /admin-api/template-image-groups/. When nested read-only inside
    # TemplateSerializer it simply echoes the parent id.
    template = serializers.PrimaryKeyRelatedField(queryset=Template.objects.all())

    class Meta:
        model = TemplateImageGroup
        fields = ("id", "template", "key", "label", "repeatable", "max_items", "required", "order")
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=TemplateImageGroup.objects.all(),
                fields=("template", "key"),
                message="This template already has an image group with this key.",
            )
        ]


class TemplateAttributeSlotSerializer(serializers.ModelSerializer):
    template = serializers.PrimaryKeyRelatedField(queryset=Template.objects.all())

    class Meta:
        model = TemplateAttributeSlot
        fields = ("id", "template", "key", "label", "type", "options", "required", "order")
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=TemplateAttributeSlot.objects.all(),
                fields=("template", "key"),
                message="This template already has an attribute slot with this key.",
            )
        ]


class TemplateSerializer(serializers.ModelSerializer):
    image_groups = TemplateImageGroupSerializer(many=True, read_only=True)
    attribute_slots = TemplateAttributeSlotSerializer(many=True, read_only=True)
    # "used by N entries" badge — annotated on the viewset queryset.
    entries_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Template
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "sort_order",
            "entries_count",
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
