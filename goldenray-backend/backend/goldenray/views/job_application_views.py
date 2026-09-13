import os
import re

from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from ..models.job_application import JobApplication, JobApplicationEvent, JobApplicationNote
from ..serializers.job_application_serializer import (
    JobApplicationAssignSerializer,
    JobApplicationDetailSerializer,
    JobApplicationNoteSerializer,
    JobApplicationSerializer,
    JobApplicationStatusSerializer,
)
from ..permissions import ApiMethodPermission, non_authenticated_view
from ..utils.studio_auth import HasStudioModule, studio_payload_from_request

# Extension → Content-Type for the only formats the form accepts.
CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# DELETE archives (§6.13), so it asks for the `archive` verb rather than `edit`.
ApplicationsModule = HasStudioModule.for_("applications", delete_action="archive")


def _actor(request) -> str:
    """Studio username from the verified token, for notes and the timeline."""
    user = getattr(request, "studio_user", None) or {}
    return user.get("username") or ""


def _record(application, kind, *, actor="", from_status="", to_status="", detail=""):
    JobApplicationEvent.objects.create(
        application=application,
        kind=kind,
        from_status=from_status,
        to_status=to_status,
        detail=detail,
        actor=actor,
    )


class JobApplicationPermission(ApiMethodPermission):
    """POST is the public form; everything else is the Studio's Applications module.

    Reading the queue was public before Phase 1 — it returned every candidate's
    phone, email and resume link to anyone who asked. §6.8/§7 bring existing
    modules under the unified permission model, so reads now need a Studio
    token granting ``applications``, the same as the writes.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return super().has_permission(request, view)
        return ApplicationsModule().has_permission(request, view)


class JobApplicationAPIView(APIView):
    # Studio tokens are minted by the CMS with a different signing key, so DRF's
    # default JWTAuthentication would reject them before the permission class
    # ever runs. Authorisation happens entirely in JobApplicationPermission.
    authentication_classes = []
    permission_classes = [JobApplicationPermission]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "job_application"
    # The form carries file uploads (resume / portfolio), so accept multipart.
    parser_classes = [MultiPartParser, FormParser]

    def get_throttles(self):
        # The 5/min scope exists to stop application spam from the public form,
        # so it only applies to POST. Reading the list and archiving rows are
        # both Studio actions behind the Applications screen.
        if self.request.method != "POST":
            return []
        return super().get_throttles()

    def get(self, request, pk=None):
        """Career applications for the Studio, newest first (Meta.ordering).

        ``?include_archived=1`` brings retired rows back into the list; a detail
        call can always reach one. `request` goes into the serializer context so
        `resume` / `portfolio_file` come back as absolute, downloadable URLs.
        """
        if pk is not None:
            try:
                application = JobApplication.objects.prefetch_related("notes", "events").get(pk=pk)
            except JobApplication.DoesNotExist:
                return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response(JobApplicationDetailSerializer(application, context={"request": request}).data)

        applications = JobApplication.objects.all()
        params = request.query_params
        if params.get("include_archived", "").lower() not in ("1", "true", "yes"):
            applications = applications.filter(archived_at__isnull=True)
        if (st := params.get("status")):
            applications = applications.filter(status=st)
        if (pos := params.get("position_id")):
            applications = applications.filter(position_id=pos)
        serializer = JobApplicationSerializer(applications, many=True, context={"request": request})
        return Response(serializer.data)

    @non_authenticated_view
    def post(self, request):
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            _record(application, JobApplicationEvent.Kind.RECEIVED, detail=application.display_position)
            return Response(
                {
                    "message": "Application received. Our team will get in touch if there's a fit.",
                    "status": "success",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "message": "Validation failed",
                "status": "error",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk=None):
        """Archive, never delete (§6.13 — "records should not be silently deleted").

        Same 204 contract the Studio already expects, but the row, its files,
        its notes and its timeline all survive. Purging for real is a Django
        admin action, not something the queue offers.
        """
        if pk is None:
            return Response({"error": "An application id is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            application = JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        if application.archived_at is None:
            application.archived_at = timezone.now()
            application.save(update_fields=["archived_at"])
            _record(application, JobApplicationEvent.Kind.ARCHIVED, actor=_actor(request))
        return Response(status=status.HTTP_204_NO_CONTENT)


class JobApplicationWorkflowView(APIView):
    """Studio-only workflow actions on one application (§6.13, §6.14).

        POST job-applications/<pk>/status/   {"status": "...", "note": "..."}
        POST job-applications/<pk>/assign/   {"position_id", "position_title", "department_name"}
        POST job-applications/<pk>/notes/    {"body": "..."}
        POST job-applications/<pk>/restore/
    """

    authentication_classes = []
    permission_classes = [ApplicationsModule]
    parser_classes = [JSONParser, FormParser]
    throttle_classes = []

    def _get(self, pk):
        try:
            return JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            raise Http404("Application not found")

    def _detail(self, application, request):
        application = JobApplication.objects.prefetch_related("notes", "events").get(pk=application.pk)
        return Response(JobApplicationDetailSerializer(application, context={"request": request}).data)

    def post(self, request, pk, action):
        application = self._get(pk)
        actor = _actor(request)

        if action == "status":
            body = JobApplicationStatusSerializer(data=request.data)
            body.is_valid(raise_exception=True)
            to_status = body.validated_data["status"]
            if to_status == application.status:
                return self._detail(application, request)
            if not application.can_transition(to_status):
                allowed = ", ".join(application.TRANSITIONS.get(application.status, ()))
                return Response(
                    {"detail": f"Cannot move from '{application.status}' to '{to_status}'. Allowed: {allowed or 'none'}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            from_status = application.status
            application.status = to_status
            application.status_changed_at = timezone.now()
            application.save(update_fields=["status", "status_changed_at"])
            _record(
                application, JobApplicationEvent.Kind.STATUS, actor=actor,
                from_status=from_status, to_status=to_status, detail=body.validated_data.get("note", ""),
            )
            return self._detail(application, request)

        if action == "assign":
            # §6.14: link a general application to a posting while preserving
            # what was submitted — the free-text `position` is left untouched.
            body = JobApplicationAssignSerializer(data=request.data)
            body.is_valid(raise_exception=True)
            application.position_id = body.validated_data["position_id"]
            application.position_title = body.validated_data["position_title"]
            application.department_name = body.validated_data.get("department_name", "")
            application.save(update_fields=["position_id", "position_title", "department_name"])
            _record(application, JobApplicationEvent.Kind.ASSIGNED, actor=actor, detail=application.position_title)
            return self._detail(application, request)

        if action == "notes":
            body = JobApplicationNoteSerializer(data=request.data)
            body.is_valid(raise_exception=True)
            JobApplicationNote.objects.create(application=application, author=actor, body=body.validated_data["body"])
            _record(application, JobApplicationEvent.Kind.NOTE, actor=actor)
            return self._detail(application, request)

        if action == "restore":
            if application.archived_at is not None:
                application.archived_at = None
                application.save(update_fields=["archived_at"])
                _record(application, JobApplicationEvent.Kind.RESTORED, actor=actor)
            return self._detail(application, request)

        raise Http404("Unknown action")


class JobApplicationFileDownloadView(APIView):
    """Stream a stored resume / portfolio through the API.

    Media files are *not* publicly reachable in production: Django only serves
    MEDIA_URL when DEBUG is on, and the edge routes everything outside /api/ to
    the Next.js app — so the absolute `/media/...` URL in the serializer 404s
    there. Serving the bytes from an /api/ route sidesteps that entirely and
    lets us send a proper `Content-Disposition: attachment` with a candidate
    named filename instead of an opaque upload name.

    Gated the same way as the queue: a resume is candidate PII.
    """

    authentication_classes = []
    permission_classes = [ApplicationsModule]
    throttle_classes = []

    # Query/path key → model field.
    FIELDS = {"resume": "resume", "portfolio": "portfolio_file"}

    def get(self, request, pk, kind="resume"):
        field_name = self.FIELDS.get(kind)
        if field_name is None:
            raise Http404("Unknown file")

        try:
            application = JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            raise Http404("Application not found")

        stored = getattr(application, field_name, None)
        if not stored:
            raise Http404("No file on this application")

        try:
            handle = stored.open("rb")
        except (FileNotFoundError, OSError):
            # The DB row points at a file the storage no longer has — most
            # often an upload made before the media volume existed.
            raise Http404("The stored file is no longer available")

        ext = os.path.splitext(stored.name)[1].lower()
        return FileResponse(
            handle,
            as_attachment=True,
            filename=self._download_name(application, kind, ext),
            content_type=CONTENT_TYPES.get(ext, "application/octet-stream"),
        )

    @staticmethod
    def _download_name(application, kind, ext):
        """`Harikrishnan_K_R_Resume.pdf` rather than whatever was uploaded."""
        slug = re.sub(r"[^A-Za-z0-9]+", "_", application.full_name or "").strip("_")
        label = "Resume" if kind == "resume" else "Portfolio"
        return f"{slug or 'application'}_{label}{ext or ''}"
