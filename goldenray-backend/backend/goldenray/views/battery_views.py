from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Battery
from ..serializers.battery_serializer import BatterySerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class BatteryAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                battery = Battery.objects.get(pk=pk)
                serializer = BatterySerializer(battery)
                return Response(serializer.data)
            except Battery.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        batteries = Battery.objects.all()
        serializer = BatterySerializer(batteries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BatterySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            battery = Battery.objects.get(pk=pk)
        except Battery.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = BatterySerializer(battery, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            battery = Battery.objects.get(pk=pk)
        except Battery.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        battery.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 