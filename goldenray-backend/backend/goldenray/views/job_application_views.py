import os
import re

from django.http import FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.parsers import MultiPartParser, FormParser

from ..models.job_application import JobApplication
from ..serializers.job_application_serializer import JobApplicationSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view
from ..utils.studio_auth import IsStudioEditor

# Extension → Content-Type for the only formats the form accepts.
CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


class JobApplicationPermission(ApiMethodPermission):
    """GET/POST keep the public rules; DELETE needs a Studio admin/editor.

    Removing a candidate record is destructive and irreversible, so it is gated
    on a Content Studio token the same way the EMI authoring endpoints are.
    """

    def has_permission(self, request, view):
        if request.method == "DELETE":
            return IsStudioEditor().has_permission(request, view)
        return super().has_permission(request, view)


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
        # so it only applies to POST. Reading the list and clearing rows are
        # both Studio actions behind the Career screen — throttling deletes
        # would stop an editor tidying up more than five stale applications.
        if self.request.method != "POST":
            return []
        return super().get_throttles()

    @non_authenticated_view
    def get(self, request, pk=None):
        """Career applications, newest first (Meta.ordering), for the Studio.

        `request` goes into the serializer context so `resume` /
        `portfolio_file` come back as absolute, downloadable URLs.
        """
        if pk is not None:
            try:
                application = JobApplication.objects.get(pk=pk)
            except JobApplication.DoesNotExist:
                return Response(
                    {"error": "Not found"}, status=status.HTTP_404_NOT_FOUND
                )
            serializer = JobApplicationSerializer(
                application, context={"request": request}
            )
            return Response(serializer.data)

        applications = JobApplication.objects.all()
        serializer = JobApplicationSerializer(
            applications, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @non_authenticated_view
    def post(self, request):
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
        """Remove an application and its uploaded files (Studio → Career)."""
        if pk is None:
            return Response(
                {"error": "An application id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            application = JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # The model's delete() also unlinks the stored resume / portfolio so the
        # media directory doesn't accumulate orphans.
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class JobApplicationFileDownloadView(APIView):
    """Stream a stored resume / portfolio through the API.

    Media files are *not* publicly reachable in production: Django only serves
    MEDIA_URL when DEBUG is on, and the edge routes everything outside /api/ to
    the Next.js app — so the absolute `/media/...` URL in the serializer 404s
    there. Serving the bytes from an /api/ route sidesteps that entirely and
    lets us send a proper `Content-Disposition: attachment` with a candidate
    named filename instead of an opaque upload name.
    """

    authentication_classes = []
    permission_classes = [ApiMethodPermission]
    throttle_classes = []

    # Query/path key → model field.
    FIELDS = {"resume": "resume", "portfolio": "portfolio_file"}

    @non_authenticated_view
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
