import os
import re
from django.urls import reverse
from rest_framework import serializers
from ..models.job_application import JobApplication, JobApplicationEvent, JobApplicationNote


INDIA_PHONE_PATTERN = re.compile(r"^[6-9][0-9]{9}$")
LINKEDIN_HOST_PATTERN = re.compile(r"(^|\.)linkedin\.com$", re.IGNORECASE)

# Keep in sync with the frontend Careers form (Max 10MB, PDF / Word).
MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_FILE_EXTENSIONS = (".pdf", ".doc", ".docx")


def _validate_upload(uploaded_file):
    """Shared file check: allowed extension + size limit."""
    name = (uploaded_file.name or "").lower()
    _, ext = os.path.splitext(name)
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise serializers.ValidationError(
            "Only PDF or Word documents are allowed."
        )
    if uploaded_file.size > MAX_FILE_BYTES:
        raise serializers.ValidationError("File must be under 10MB.")
    return uploaded_file


class JobApplicationSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True, allow_blank=False, max_length=255)
    email = serializers.EmailField(required=True, allow_blank=False)
    phone = serializers.CharField(required=True, allow_blank=False, max_length=20)
    location = serializers.CharField(required=True, allow_blank=False, max_length=255)
    linkedin = serializers.CharField(required=True, allow_blank=False, max_length=300)
    portfolio_website = serializers.CharField(
        required=False, allow_blank=True, max_length=300
    )

    resume = serializers.FileField(required=True)
    portfolio_file = serializers.FileField(required=False, allow_null=True)

    # The raw `resume` / `portfolio_file` URLs point at MEDIA_URL, which is only
    # served while DEBUG is on — in production /media/ hits the Next.js app and
    # 404s. These go through /api/, which the edge does proxy to Django, and
    # arrive as a proper attachment. The Studio links to these.
    resume_download_url = serializers.SerializerMethodField()
    portfolio_download_url = serializers.SerializerMethodField()

    declaration_accepted = serializers.BooleanField(required=True)
    display_position = serializers.CharField(read_only=True)

    # Honeypot: must stay empty. Bots tend to autofill any visible-looking field.
    website = serializers.CharField(
        required=False, allow_blank=True, write_only=True, max_length=255
    )

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "position",
            "position_id",
            "position_title",
            "department_name",
            "display_position",
            "status",
            "status_changed_at",
            "archived_at",
            "full_name",
            "email",
            "phone",
            "location",
            "linkedin",
            "portfolio_website",
            "current_company",
            "current_role",
            "total_experience",
            "relevant_experience",
            "current_salary",
            "expected_salary",
            "notice_period",
            "heard_about_us",
            "resume",
            "portfolio_file",
            "resume_download_url",
            "portfolio_download_url",
            "declaration_accepted",
            "created_at",
            "website",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "resume_download_url",
            "portfolio_download_url",
            # Workflow fields change through their own endpoints, never the form.
            "status",
            "status_changed_at",
            "archived_at",
            "display_position",
        ]
        extra_kwargs = {
            "position": {"required": False},
            "position_id": {"required": False, "allow_null": True},
            "position_title": {"required": False, "allow_blank": True},
            "department_name": {"required": False, "allow_blank": True},
            "current_company": {"required": False, "allow_blank": True},
            "current_role": {"required": False, "allow_blank": True},
            "total_experience": {"required": False, "allow_blank": True},
            "relevant_experience": {"required": False, "allow_blank": True},
            "current_salary": {"required": False, "allow_blank": True},
            "expected_salary": {"required": False, "allow_blank": True},
            "notice_period": {"required": False, "allow_blank": True},
            "heard_about_us": {"required": False, "allow_blank": True},
        }

    def _download_url(self, instance, kind):
        """Absolute /api/ download URL, or None when there is no file."""
        if not instance.pk:
            return None
        field = instance.resume if kind == "resume" else instance.portfolio_file
        if not field:
            return None
        path = reverse(
            "job-application-download", kwargs={"pk": instance.pk, "kind": kind}
        )
        request = self.context.get("request")
        return request.build_absolute_uri(path) if request else path

    def get_resume_download_url(self, obj):
        return self._download_url(obj, "resume")

    def get_portfolio_download_url(self, obj):
        return self._download_url(obj, "portfolio")

    def validate_full_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Full name is required.")
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        digits = re.sub(r"[\s\-()+]", "", value)
        # Strip a leading country code 91 if present, then validate Indian mobile.
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not INDIA_PHONE_PATTERN.match(digits):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian mobile number."
            )
        return digits

    def validate_location(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Current location is required.")
        return value

    def validate_linkedin(self, value):
        value = value.strip()
        url = value if re.match(r"^https?://", value, re.IGNORECASE) else f"https://{value}"
        host = re.sub(r"^https?://", "", url, flags=re.IGNORECASE).split("/")[0].lower()
        if not LINKEDIN_HOST_PATTERN.search(host):
            raise serializers.ValidationError(
                "Enter a valid LinkedIn URL (e.g. linkedin.com/in/username)."
            )
        return url

    def validate_portfolio_website(self, value):
        value = value.strip()
        if not value:
            return ""
        if not re.match(r"^https?://", value, re.IGNORECASE):
            value = f"https://{value}"
        return value

    def validate_resume(self, value):
        return _validate_upload(value)

    def validate_portfolio_file(self, value):
        if value is None:
            return value
        return _validate_upload(value)

    def validate_declaration_accepted(self, value):
        if not value:
            raise serializers.ValidationError(
                "Please accept the declaration to continue."
            )
        return value

    def validate(self, attrs):
        # Honeypot — if it was filled, silently reject as a validation error.
        if attrs.pop("website", ""):
            raise serializers.ValidationError("Invalid submission.")
        return attrs


# ── Studio-side shapes (§6.14) ────────────────────────────────────────────────


class JobApplicationNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplicationNote
        fields = ["id", "author", "body", "created_at"]
        read_only_fields = ["id", "author", "created_at"]

    def validate_body(self, value):
        value = (value or "").strip()
        if not value:
            raise serializers.ValidationError("Write something first.")
        return value


class JobApplicationEventSerializer(serializers.ModelSerializer):
    kind_label = serializers.CharField(source="get_kind_display", read_only=True)

    class Meta:
        model = JobApplicationEvent
        fields = ["id", "kind", "kind_label", "from_status", "to_status", "detail", "actor", "created_at"]


class JobApplicationDetailSerializer(JobApplicationSerializer):
    """Detail view: the application plus its notes and timeline."""

    notes = JobApplicationNoteSerializer(many=True, read_only=True)
    events = JobApplicationEventSerializer(many=True, read_only=True)
    allowed_transitions = serializers.SerializerMethodField()

    class Meta(JobApplicationSerializer.Meta):
        fields = JobApplicationSerializer.Meta.fields + ["notes", "events", "allowed_transitions"]

    def get_allowed_transitions(self, obj):
        return list(JobApplication.TRANSITIONS.get(obj.status, ()))


class JobApplicationStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=JobApplication.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True, max_length=255)


class JobApplicationAssignSerializer(serializers.Serializer):
    """Link a general application to a posting, keeping the original intact."""

    position_id = serializers.IntegerField()
    position_title = serializers.CharField(max_length=200)
    department_name = serializers.CharField(max_length=120, required=False, allow_blank=True)
