from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle

from ..serializers.affiliate_application_serializer import (
    AffiliateApplicationSerializer,
)
from ..models.lead_collection_home import LeadCollectionHome, record_lead
from ..permissions import ApiMethodPermission, non_authenticated_view


class AffiliateApplicationAPIView(APIView):
    permission_classes = [ApiMethodPermission]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "affiliate_application"

    @non_authenticated_view
    def post(self, request):
        serializer = AffiliateApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            record_lead(
                name=application.full_name,
                phone_number=application.phone,
                source=LeadCollectionHome.Source.REFERRAL,
                page="/solar-referral-program",
                details={
                    "Email": application.email,
                    "Profession": application.profession,
                    "District": application.district,
                },
            )
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
