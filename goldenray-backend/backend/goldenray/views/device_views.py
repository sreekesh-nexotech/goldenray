from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Device
from ..serializers.device_serializer import DeviceSerializer


class DeviceAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                device = Device.objects.get(pk=pk)
                serializer = DeviceSerializer(device)
                return Response(serializer.data)
            except Device.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        devices = Device.objects.all()
        serializer = DeviceSerializer(devices, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DeviceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            device = Device.objects.get(pk=pk)
        except Device.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DeviceSerializer(device, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            device = Device.objects.get(pk=pk)
        except Device.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        device.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
