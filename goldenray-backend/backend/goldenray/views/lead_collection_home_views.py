from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.lead_collection_home import LeadCollectionHome
from ..serializers.lead_collection_home_serializer import LeadCollectionHomeSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view
from ..utils.studio_auth import HasStudioModule

# §6.8 / §7: the Leads module joins the unified permission model. Reads need
# `leads: view`, edits `leads: edit`, and DELETE — which really deletes here,
# as the existing module always did — needs `leads: archive`.
LeadsModule = HasStudioModule.for_("leads", delete_action="archive")


class LeadCollectionHomePermission(ApiMethodPermission):
    """POST is the public capture form; everything else is the Studio's Leads screen.

    Before Phase 1 the list was readable by anyone — every lead's name and
    phone number to whoever asked. Now only a Studio token granting ``leads``
    reaches it, and the public form keeps working exactly as before.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return super().has_permission(request, view)
        return LeadsModule().has_permission(request, view)


class LeadCollectionHomeAPIView(APIView):
    # Studio tokens are minted by the CMS with a different signing key, so
    # DRF's JWTAuthentication would reject them before the permission ran.
    # Authorisation happens entirely in the permission class.
    authentication_classes = []
    permission_classes = [LeadCollectionHomePermission]

    def get(self, request, pk=None):
        if pk:
            try:
                lead = LeadCollectionHome.objects.get(pk=pk)
                serializer = LeadCollectionHomeSerializer(lead)
                return Response(serializer.data)
            except LeadCollectionHome.DoesNotExist:
                return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        leads = LeadCollectionHome.objects.all().order_by('-created_at')
        serializer = LeadCollectionHomeSerializer(leads, many=True)
        return Response(serializer.data)

    @non_authenticated_view
    def post(self, request):
        serializer = LeadCollectionHomeSerializer(data=request.data)
        if serializer.is_valid():
            # Check if phone number already exists
            phone_number = serializer.validated_data.get('phone_number')
            if LeadCollectionHome.objects.filter(phone_number=phone_number).exists():
                return Response({
                    'message': 'Phone number already exists',
                    'phone_number': phone_number
                }, status=status.HTTP_200_OK)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            lead = LeadCollectionHome.objects.get(pk=pk)
        except LeadCollectionHome.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = LeadCollectionHomeSerializer(lead, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            lead = LeadCollectionHome.objects.get(pk=pk)
        except LeadCollectionHome.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        lead.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
