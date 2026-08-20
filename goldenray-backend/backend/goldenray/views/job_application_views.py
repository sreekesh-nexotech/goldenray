from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.parsers import MultiPartParser, FormParser

from ..models.job_application import JobApplication
from ..serializers.job_application_serializer import JobApplicationSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class JobApplicationAPIView(APIView):
    permission_classes = [ApiMethodPermission]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "job_application"
    # The form carries file uploads (resume / portfolio), so accept multipart.
    parser_classes = [MultiPartParser, FormParser]

    def get_throttles(self):
        # The 5/min scope exists to stop application spam. Reading the list
        # (Content Studio → Career) is not a write, so it isn't throttled.
        if self.request.method == "GET":
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
