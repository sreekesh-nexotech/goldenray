from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import DeviceType
from ..serializers.device_type_serializer import DeviceTypeSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class DeviceTypeAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                device_type = DeviceType.objects.get(pk=pk)
                serializer = DeviceTypeSerializer(device_type)
                return Response(serializer.data)
            except DeviceType.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        device_types = DeviceType.objects.all()
        serializer = DeviceTypeSerializer(device_types, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DeviceTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            device_type = DeviceType.objects.get(pk=pk)
        except DeviceType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DeviceTypeSerializer(device_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            device_type = DeviceType.objects.get(pk=pk)
        except DeviceType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        device_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
