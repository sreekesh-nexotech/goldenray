from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle

from ..serializers.affiliate_application_serializer import (
    AffiliateApplicationSerializer,
)
from ..permissions import ApiMethodPermission, non_authenticated_view


class AffiliateApplicationAPIView(APIView):
    permission_classes = [ApiMethodPermission]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "affiliate_application"

    @non_authenticated_view
    def post(self, request):
        serializer = AffiliateApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Message sent!",
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
