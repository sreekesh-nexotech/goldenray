from rest_framework import serializers

from .models import Department, JobPosition


class DepartmentSerializer(serializers.ModelSerializer):
    """Department row — §6.15 asks for the associated-job count on the list."""

    job_count = serializers.IntegerField(read_only=True)
    open_job_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Department
        fields = (
            "id", "name", "slug", "description", "is_active", "sort_order",
            "job_count", "open_job_count", "created_at", "updated_at",
        )


class JobPositionListSerializer(serializers.ModelSerializer):
    """Positions list row — the columns §6.11 specifies.

    ``application_count`` is injected by the view from the goldenray backend
    rather than joined: applications live in a different database, so the number
    is fetched once for the whole list instead of per row.
    """

    department_name = serializers.CharField(source="department.name", read_only=True)
    employment_type_label = serializers.CharField(source="get_employment_type_display", read_only=True)
    application_count = serializers.IntegerField(read_only=True, default=0)
    seo_status = serializers.CharField(read_only=True)

    class Meta:
        model = JobPosition
        fields = (
            "id", "title", "slug", "department", "department_name", "location",
            "employment_type", "employment_type_label", "status", "sort_order",
            "application_count", "seo_status", "application_deadline",
            "published_at", "created_at", "updated_at",
        )


class JobPositionSerializer(serializers.ModelSerializer):
    """Full job editor shape (§6.12)."""

    department_name = serializers.CharField(source="department.name", read_only=True)
    employment_type_label = serializers.CharField(source="get_employment_type_display", read_only=True)
    seo_status = serializers.CharField(read_only=True)
    seo_issues = serializers.SerializerMethodField()
    publish_errors = serializers.SerializerMethodField()
    public_url = serializers.SerializerMethodField()

    class Meta:
        model = JobPosition
        fields = (
            "id", "title", "slug", "department", "department_name",
            "location", "employment_type", "employment_type_label", "experience_required",
            "description", "responsibilities", "requirements", "benefits",
            "application_instructions", "application_deadline",
            "status", "sort_order",
            # SEO basics for the job page (§6.12)
            "seo_title", "meta_description", "canonical_url", "og_image",
            "schema_type", "schema_extra", "noindex", "seo_status", "seo_issues",
            "publish_errors", "public_url", "published_at", "closed_at",
            "created_at", "updated_at",
        )
        read_only_fields = ("status", "published_at", "closed_at", "created_at", "updated_at")

    def get_seo_issues(self, obj) -> list:
        return obj.seo_issues()

    def get_publish_errors(self, obj) -> list:
        return obj.publish_errors()

    def get_public_url(self, obj) -> str:
        return obj.seo_path()
