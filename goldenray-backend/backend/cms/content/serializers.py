from django.db import transaction
from rest_framework import serializers

from catalog.models import Author, Badge, Category, Collection, Tag, Template
from catalog.serializers import (
    AuthorSerializer,
    BadgeSerializer,
    CategorySerializer,
    TagSerializer,
)
from media.serializers import MediaAssetSerializer

from .models import ContentBlock, Entry, EntryAttributeValue, EntryImage, Seo


class ContentBlockSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = ContentBlock
        fields = ("id", "component", "body", "order")


class EntryImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = EntryImage
        fields = ("id", "group_key", "position", "media_asset", "external_url")


class EntryAttributeValueSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = EntryAttributeValue
        fields = ("id", "slot_key", "value")


class SeoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seo
        fields = ("meta_title", "meta_description", "canonical_url", "keywords")


class EntryReadSerializer(serializers.ModelSerializer):
    """Rich read shape for the authoring UI (not the public delivery shape)."""

    author = AuthorSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    badges = BadgeSerializer(many=True, read_only=True)
    cover_image = MediaAssetSerializer(read_only=True)
    content_blocks = ContentBlockSerializer(many=True, read_only=True)
    images = EntryImageSerializer(many=True, read_only=True)
    attribute_values = EntryAttributeValueSerializer(many=True, read_only=True)
    seo = SeoSerializer(read_only=True)
    collection_uid = serializers.CharField(source="collection.api_uid", read_only=True)
    template_slug = serializers.CharField(source="template.slug", read_only=True, default=None)

    class Meta:
        model = Entry
        fields = (
            "id", "document_id", "collection", "collection_uid", "template", "template_slug",
            "title", "slug", "excerpt", "summary", "introduction", "read_time",
            "is_featured", "sort_order", "published_on", "warning", "insights",
            "author", "categories", "tags", "badges", "cover_image",
            "content_blocks", "images", "attribute_values", "seo",
            "status", "published_at", "created_at", "updated_at",
        )


class EntryListSerializer(serializers.ModelSerializer):
    """Slim row shape for the Entries list screen (no nested bodies/images/SEO —
    fetch the detail endpoint when opening the editor)."""

    collection_uid = serializers.CharField(source="collection.api_uid", read_only=True)
    collection_name = serializers.CharField(source="collection.plural_name", read_only=True)
    template_slug = serializers.CharField(source="template.slug", read_only=True, default=None)
    author_name = serializers.CharField(source="author.name", read_only=True, default=None)
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = (
            "id", "document_id", "collection", "collection_uid", "collection_name",
            "template", "template_slug", "title", "slug", "excerpt", "status",
            "author_name", "cover_url", "is_featured", "sort_order",
            "published_on", "published_at", "created_at", "updated_at",
        )

    def get_cover_url(self, obj):
        # Thumbnail for list cards: legacy cover FK wins, else the first
        # resolvable template-group image (rows are prefetched + ordered).
        if obj.cover_image_id and obj.cover_image:
            if obj.cover_image.cdn_url:
                return obj.cover_image.cdn_url
            try:
                return obj.cover_image.file.url
            except ValueError:
                pass
        for img in obj.images.all():
            url = img.resolved_url()
            if url:
                return url
        return None


class EntryWriteSerializer(serializers.ModelSerializer):
    """Create/update an entry plus its nested children in one call."""

    collection = serializers.PrimaryKeyRelatedField(queryset=Collection.objects.all())
    template = serializers.PrimaryKeyRelatedField(
        queryset=Template.objects.all(), required=False, allow_null=True
    )
    author = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), required=False, allow_null=True
    )
    categories = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, required=False
    )
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    badges = serializers.PrimaryKeyRelatedField(queryset=Badge.objects.all(), many=True, required=False)

    content_blocks = ContentBlockSerializer(many=True, required=False)
    images = EntryImageSerializer(many=True, required=False)
    attribute_values = EntryAttributeValueSerializer(many=True, required=False)
    seo = SeoSerializer(required=False, allow_null=True)

    class Meta:
        model = Entry
        fields = (
            "id", "collection", "template", "title", "slug", "excerpt", "summary",
            "introduction", "read_time", "is_featured", "sort_order", "published_on",
            "warning", "insights", "author", "categories", "tags", "badges",
            "cover_image", "content_blocks", "images", "attribute_values", "seo",
        )

    def validate(self, attrs):
        collection = attrs.get("collection") or getattr(self.instance, "collection", None)
        slug = attrs.get("slug") or getattr(self.instance, "slug", None)
        if collection and slug:
            qs = Entry.objects.filter(collection=collection, slug=slug)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"slug": "An entry with this slug already exists in this collection."}
                )
        return attrs

    def _write_children(self, entry, blocks, images, attrs, seo, *, replace):
        if blocks is not None:
            if replace:
                entry.content_blocks.all().delete()
            for b in blocks:
                b.pop("id", None)
                ContentBlock.objects.create(entry=entry, **b)
        if images is not None:
            if replace:
                entry.images.all().delete()
            for im in images:
                im.pop("id", None)
                EntryImage.objects.create(entry=entry, **im)
        if attrs is not None:
            if replace:
                entry.attribute_values.all().delete()
            for av in attrs:
                av.pop("id", None)
                EntryAttributeValue.objects.create(entry=entry, **av)
        if seo is not None:
            Seo.objects.update_or_create(entry=entry, defaults=seo)

    @transaction.atomic
    def create(self, validated_data):
        blocks = validated_data.pop("content_blocks", None)
        images = validated_data.pop("images", None)
        attrs = validated_data.pop("attribute_values", None)
        seo = validated_data.pop("seo", None)
        categories = validated_data.pop("categories", [])
        tags = validated_data.pop("tags", [])
        badges = validated_data.pop("badges", [])

        user = self.context["request"].user if "request" in self.context else None
        if user is not None and user.is_authenticated:
            validated_data["created_by"] = user
            validated_data["updated_by"] = user

        entry = Entry.objects.create(**validated_data)
        entry.categories.set(categories)
        entry.tags.set(tags)
        entry.badges.set(badges)
        self._write_children(entry, blocks, images, attrs, seo, replace=False)
        return entry

    @transaction.atomic
    def update(self, instance, validated_data):
        blocks = validated_data.pop("content_blocks", None)
        images = validated_data.pop("images", None)
        attrs = validated_data.pop("attribute_values", None)
        seo = validated_data.pop("seo", None)
        categories = validated_data.pop("categories", None)
        tags = validated_data.pop("tags", None)
        badges = validated_data.pop("badges", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        user = self.context["request"].user if "request" in self.context else None
        if user is not None and user.is_authenticated:
            instance.updated_by = user
        instance.save()

        if categories is not None:
            instance.categories.set(categories)
        if tags is not None:
            instance.tags.set(tags)
        if badges is not None:
            instance.badges.set(badges)
        self._write_children(instance, blocks, images, attrs, seo, replace=True)
        return instance

    def to_representation(self, instance):
        return EntryReadSerializer(instance, context=self.context).data
