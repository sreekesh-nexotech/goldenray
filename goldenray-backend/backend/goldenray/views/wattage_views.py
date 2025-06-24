from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Wattage
from ..serializers.wattage_serializer import WattageSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class WattageAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                wattage = Wattage.objects.get(pk=pk)
                serializer = WattageSerializer(wattage)
                return Response(serializer.data)
            except Wattage.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        wattages = Wattage.objects.all()
        serializer = WattageSerializer(wattages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WattageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            wattage = Wattage.objects.get(pk=pk)
        except Wattage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = WattageSerializer(wattage, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            wattage = Wattage.objects.get(pk=pk)
        except Wattage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        wattage.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
