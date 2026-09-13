from rest_framework import serializers

from .models import Faq, FaqCategory


class FaqCategorySerializer(serializers.ModelSerializer):
    faq_count = serializers.SerializerMethodField()

    class Meta:
        model = FaqCategory
        fields = ("id", "name", "slug", "description", "is_active", "sort_order", "faq_count")

    def get_faq_count(self, obj) -> int:
        return obj.faqs.count()


class FaqListSerializer(serializers.ModelSerializer):
    """The FAQ list's row shape — exactly the columns §6.4 specifies.

    Page and category names are denormalised into the row so the list renders
    from one request; the alternative is a lookup per row, which is what makes
    admin tables feel slow.
    """

    page_name = serializers.CharField(source="page.name", read_only=True)
    page_route = serializers.CharField(source="page.route", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    updated_by_name = serializers.SerializerMethodField()
    seo_status = serializers.CharField(read_only=True)

    class Meta:
        model = Faq
        fields = (
            "id", "question", "page", "page_name", "page_route", "section",
            "category", "category_name", "status", "display_order",
            "seo_status", "updated_by_name", "published_at", "created_at", "updated_at",
        )

    def get_updated_by_name(self, obj) -> str | None:
        user = obj.updated_by or obj.created_by
        if not user:
            return None
        return " ".join(filter(None, [user.first_name, user.last_name])) or user.username


class FaqSerializer(serializers.ModelSerializer):
    """Full read/write shape for the FAQ editor (§6.5)."""

    page_name = serializers.CharField(source="page.name", read_only=True)
    page_route = serializers.CharField(source="page.route", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    created_by_name = serializers.SerializerMethodField()
    updated_by_name = serializers.SerializerMethodField()
    seo_status = serializers.CharField(read_only=True)
    seo_issues = serializers.SerializerMethodField()
    publish_errors = serializers.SerializerMethodField()

    class Meta:
        model = Faq
        fields = (
            "id", "question", "answer", "page", "page_name", "page_route", "section",
            "category", "category_name", "display_order", "status",
            # SEO block (§6.7)
            "seo_title", "meta_description", "canonical_url", "og_image",
            "schema_type", "schema_extra", "noindex", "seo_status", "seo_issues",
            # Audit metadata (§6.5 — "created/updated by and timestamps")
            "publish_errors", "published_at", "archived_at",
            "created_by_name", "updated_by_name", "created_at", "updated_at",
        )
        read_only_fields = (
            "status", "published_at", "archived_at", "created_at", "updated_at",
        )
        # A draft is allowed to be answerless; publishing is not (§6.5).
        extra_kwargs = {"answer": {"required": False, "allow_blank": True}}

    def get_created_by_name(self, obj) -> str | None:
        return self._display_name(obj.created_by)

    def get_updated_by_name(self, obj) -> str | None:
        return self._display_name(obj.updated_by)

    @staticmethod
    def _display_name(user) -> str | None:
        if not user:
            return None
        return " ".join(filter(None, [user.first_name, user.last_name])) or user.username

    def get_seo_issues(self, obj) -> list:
        return obj.seo_issues()

    def get_publish_errors(self, obj) -> list:
        """What would block publishing right now — shown live in the editor.

        Surfacing this on every read is what lets the editor disable Publish and
        say why, instead of letting someone hit the button and read a 400.
        """
        return obj.publish_errors()

    def validate_question(self, value):
        if not (value or "").strip():
            raise serializers.ValidationError("A question is required.")
        return value.strip()


class FaqReorderSerializer(serializers.Serializer):
    """Body for ``POST faqs/reorder/``."""

    page = serializers.IntegerField()
    section = serializers.CharField(required=False, allow_blank=True, default="")
    order = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)
