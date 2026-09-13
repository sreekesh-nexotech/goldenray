from rest_framework import serializers

from .models import Page, PageImageSlot, PageSeo, PageTextSlot


class PageImageSlotSerializer(serializers.ModelSerializer):
    """A replaceable image slot. Only ``asset`` and ``alt_text`` are writable.

    ``key``, ``label`` and ``guidance`` describe a slot the page component
    declares; letting an admin edit them would break the contract the component
    reads, which is exactly the "no layout editing" line §6.2 draws.
    """

    asset_url = serializers.SerializerMethodField()
    asset_filename = serializers.SerializerMethodField()
    asset_width = serializers.IntegerField(source="asset.width", read_only=True, default=None)
    asset_height = serializers.IntegerField(source="asset.height", read_only=True, default=None)
    effective_alt = serializers.CharField(read_only=True)

    class Meta:
        model = PageImageSlot
        fields = (
            "id", "key", "label", "guidance", "order",
            "asset", "asset_url", "asset_filename", "asset_width", "asset_height",
            "alt_text", "effective_alt", "updated_at",
        )
        read_only_fields = ("key", "label", "guidance", "order", "updated_at")

    def get_asset_url(self, obj) -> str | None:
        if not obj.asset_id:
            return None
        return obj.asset.cdn_url or (obj.asset.file.url if obj.asset.file else None)

    def get_asset_filename(self, obj) -> str | None:
        return obj.asset.file.name.rsplit("/", 1)[-1] if obj.asset_id and obj.asset.file else None


class PageTextSlotSerializer(serializers.ModelSerializer):
    """An exposed text field. Only ``value`` is writable, and only up to its cap."""

    class Meta:
        model = PageTextSlot
        fields = ("id", "key", "label", "kind", "guidance", "value", "max_length", "order", "updated_at")
        read_only_fields = ("key", "label", "kind", "guidance", "max_length", "order", "updated_at")

    def validate_value(self, value):
        cap = self.instance.max_length if self.instance else None
        if cap and len(value or "") > cap:
            raise serializers.ValidationError(
                f"This field holds up to {cap} characters — you have {len(value)}."
            )
        return value


class PageSeoSerializer(serializers.ModelSerializer):
    seo_status = serializers.CharField(read_only=True)
    seo_issues = serializers.SerializerMethodField()

    class Meta:
        model = PageSeo
        fields = (
            "id", "seo_title", "meta_description", "canonical_url", "og_image",
            "schema_type", "schema_extra", "noindex",
            "seo_status", "seo_issues", "updated_at",
        )
        read_only_fields = ("updated_at",)

    def get_seo_issues(self, obj) -> list:
        return obj.seo_issues()


class PageListSerializer(serializers.ModelSerializer):
    """Page list row — name, URL, status, last updated (§6.2)."""

    seo_status = serializers.SerializerMethodField()
    image_slot_count = serializers.IntegerField(read_only=True, default=0)
    faq_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Page
        fields = (
            "id", "name", "route", "group", "status", "is_protected",
            "seo_status", "image_slot_count", "faq_count", "sort_order", "updated_at",
        )

    def get_seo_status(self, obj) -> str:
        seo = getattr(obj, "seo", None)
        return seo.seo_status() if seo else "error"


class PageDetailSerializer(serializers.ModelSerializer):
    """The controlled maintenance view (§6.2).

    Everything writable is here; everything else is context so the maintainer
    can see what they are working on. There is no body/content field on purpose
    — the page's copy is not editable through this API at all, which is the
    structural half of "maintenance only".
    """

    seo = PageSeoSerializer(read_only=True)
    image_slots = PageImageSlotSerializer(many=True, read_only=True)
    text_slots = PageTextSlotSerializer(many=True, read_only=True)
    faq_count = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = (
            "id", "name", "route", "description", "group", "status", "is_protected",
            "sort_order", "seo", "image_slots", "text_slots", "faq_count",
            "created_at", "updated_at",
        )
        # A maintainer never renames a route: the site's router owns it, and
        # changing it here would point the record at a page that does not exist.
        read_only_fields = (
            "route", "name", "description", "group", "is_protected",
            "created_at", "updated_at",
        )

    def get_faq_count(self, obj) -> int:
        return obj.faqs.exclude(status="archived").count()
