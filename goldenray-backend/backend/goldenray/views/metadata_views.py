from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.metadata import Metadata
from ..serializers.metadata_serializer import MetadataSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view

class MetadataAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                metadata = Metadata.objects.get(pk=pk)
                serializer = MetadataSerializer(metadata)
                return Response(serializer.data)
            except Metadata.DoesNotExist:
                return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        metadata = Metadata.objects.all()
        serializer = MetadataSerializer(metadata, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MetadataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            metadata = Metadata.objects.get(pk=pk)
        except Metadata.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MetadataSerializer(metadata, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            metadata = Metadata.objects.get(pk=pk)
        except Metadata.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        metadata.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 