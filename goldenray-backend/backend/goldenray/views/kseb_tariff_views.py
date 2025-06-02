from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import KSEBTariff
from ..serializers.kseb_tariff_serializer import KSEBTariffSerializer


class KSEBTariffAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                tariff = KSEBTariff.objects.get(pk=pk)
                serializer = KSEBTariffSerializer(tariff)
                return Response(serializer.data)
            except KSEBTariff.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        tariffs = KSEBTariff.objects.all()
        serializer = KSEBTariffSerializer(tariffs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = KSEBTariffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            tariff = KSEBTariff.objects.get(pk=pk)
        except KSEBTariff.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = KSEBTariffSerializer(tariff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            tariff = KSEBTariff.objects.get(pk=pk)
        except KSEBTariff.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        tariff.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
