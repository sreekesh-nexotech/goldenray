from django.conf import settings
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.modules import Action, Module
from accounts.permissions import HasModulePermission
from seo import schema as schema_builders
from siteconfig.models import SiteSettings

from .models import Department, JobPosition
from .serializers import (
    DepartmentSerializer,
    JobPositionListSerializer,
    JobPositionSerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    """Departments used by jobs (§6.15)."""

    serializer_class = DepartmentSerializer
    permission_classes = [HasModulePermission]
    permission_module = Module.DEPARTMENTS

    def get_queryset(self):
        # Prefetch rather than annotate: ``job_count``/``open_job_count`` are
        # model properties, and an annotation sharing their name cannot be set
        # on the instance. The prefetch is what keeps them free of N+1 queries.
        qs = Department.objects.prefetch_related("positions")
        if (active := self.request.query_params.get("is_active")):
            qs = qs.filter(is_active=active.lower() in ("1", "true", "yes"))
        if (search := self.request.query_params.get("search")):
            qs = qs.filter(name__icontains=search)
        return qs

    def destroy(self, request, *args, **kwargs):
        """§6.15: prevent unsafe deletion; deactivate instead.

        The model's PROTECT would raise anyway, but a raw IntegrityError reaches
        the UI as a 500. Refusing here turns it into a message that says which
        jobs are in the way and what to do instead.
        """
        department = self.get_object()
        dependants = department.positions.count()
        if dependants:
            return Response(
                {
                    "detail": (
                        f"{dependants} job position(s) belong to '{department.name}'. "
                        "Deactivate the department instead, or move those jobs first."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class JobPositionViewSet(viewsets.ModelViewSet):
    """Job positions list, editor and publish workflow (§6.11, §6.12)."""

    permission_classes = [HasModulePermission]
    permission_module = Module.JOB_POSITIONS
    permission_actions = {
        "publish": Action.PUBLISH,
        "unpublish": Action.PUBLISH,
        "close": Action.EDIT,
        "archive": Action.ARCHIVE,
        "preview": Action.VIEW,
    }

    def get_queryset(self):
        params = self.request.query_params
        qs = JobPosition.objects.select_related("department")

        if self.action == "list" and params.get("status") != JobPosition.Status.ARCHIVED:
            if params.get("include_archived", "").lower() not in ("1", "true", "yes"):
                qs = qs.exclude(status=JobPosition.Status.ARCHIVED)

        if (dept := params.get("department")):
            qs = qs.filter(department_id=dept)
        if (loc := params.get("location")):
            qs = qs.filter(location__icontains=loc)
        if (et := params.get("employment_type")):
            qs = qs.filter(employment_type=et)
        if (st := params.get("status")):
            qs = qs.filter(status=st)
        if (search := params.get("search")):
            qs = qs.filter(title__icontains=search) | qs.filter(location__icontains=search)
        return qs.distinct()

    def get_serializer_class(self):
        return JobPositionListSerializer if self.action == "list" else JobPositionSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    # ── Workflow ─────────────────────────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        position = self.get_object()
        errors = position.publish_errors()
        if errors:
            return Response(
                {"detail": "This position is not ready to publish.", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        position.status = JobPosition.Status.PUBLISHED
        position.published_at = position.published_at or timezone.now()
        position.closed_at = None
        position.updated_by = request.user
        position.save(update_fields=["status", "published_at", "closed_at", "updated_by", "updated_at"])
        return Response(JobPositionSerializer(position, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        position = self.get_object()
        position.status = JobPosition.Status.DRAFT
        position.updated_by = request.user
        position.save(update_fields=["status", "updated_by", "updated_at"])
        return Response(JobPositionSerializer(position, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        """Stop accepting applications while keeping the posting readable."""
        position = self.get_object()
        position.status = JobPosition.Status.CLOSED
        position.closed_at = timezone.now()
        position.updated_by = request.user
        position.save(update_fields=["status", "closed_at", "updated_by", "updated_at"])
        return Response(JobPositionSerializer(position, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def archive(self, request, pk=None):
        position = self.get_object()
        position.status = JobPosition.Status.ARCHIVED
        position.updated_by = request.user
        position.save(update_fields=["status", "updated_by", "updated_at"])
        return Response(JobPositionSerializer(position, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        """Archive rather than delete — applications reference this posting."""
        position = self.get_object()
        position.status = JobPosition.Status.ARCHIVED
        position.updated_by = request.user
        position.save(update_fields=["status", "updated_by", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):
        """The posting as the public job page will render it (§6.12)."""
        position = self.get_object()
        site_url = getattr(settings, "FRONTEND_BASE_URL", "")
        company = SiteSettings.load()
        return Response(
            {
                "url": f"{site_url.rstrip('/')}{position.seo_path()}",
                "title": position.seo_title or position.title,
                "description": position.meta_description,
                "department": position.department.name if position.department_id else None,
                "location": position.location,
                "employment_type": position.get_employment_type_display(),
                "schema": schema_builders.job_posting(
                    position, site_url=site_url, organisation=company.company_name
                ),
                "seo_issues": position.seo_issues(),
                "publish_errors": position.publish_errors(),
            }
        )


class CareersOverviewAPIView(APIView):
    """Careers operational dashboard (§6.10).

    Counts only, no analytics — §6.10 is explicit that this is not an ATS
    reporting surface. Application totals come from the goldenray service and
    are filled in by the frontend, which already holds a session for it; this
    endpoint answers for what the CMS owns.
    """

    permission_classes = [HasModulePermission]
    permission_module = Module.CAREERS

    def get(self, request):
        positions = JobPosition.objects.exclude(status=JobPosition.Status.ARCHIVED)
        open_positions = positions.filter(status=JobPosition.Status.PUBLISHED).select_related("department")
        return Response(
            {
                "counts": {
                    "active_positions": open_positions.count(),
                    "draft_positions": positions.filter(status=JobPosition.Status.DRAFT).count(),
                    "closed_positions": positions.filter(status=JobPosition.Status.CLOSED).count(),
                    "departments": Department.objects.filter(is_active=True).count(),
                },
                "open_positions": JobPositionListSerializer(
                    open_positions[:10], many=True, context={"request": request}
                ).data,
            }
        )
