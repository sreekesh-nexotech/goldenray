from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.lead_collection_home import LeadCollectionHome
from ..serializers.lead_collection_home_serializer import LeadCollectionHomeSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view

class LeadCollectionHomeAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
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