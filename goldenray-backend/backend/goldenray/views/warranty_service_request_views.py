from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle

from ..serializers.warranty_service_request_serializer import (
    WarrantyServiceRequestSerializer,
)
from ..models.lead_collection_home import LeadCollectionHome, record_lead
from ..permissions import ApiMethodPermission, non_authenticated_view


class WarrantyServiceRequestAPIView(APIView):
    permission_classes = [ApiMethodPermission]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "warranty_service_request"

    @non_authenticated_view
    def post(self, request):
        serializer = WarrantyServiceRequestSerializer(data=request.data)
        if serializer.is_valid():
            service_request = serializer.save()
            record_lead(
                name=service_request.full_name,
                phone_number=service_request.phone,
                source=LeadCollectionHome.Source.WARRANTY,
                page="/solar-warranty",
                details={
                    "Issue": service_request.issue_type,
                    "Description": service_request.description,
                },
            )
            return Response(
                {
                    "message": "Service request received. Our team will contact you shortly.",
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
