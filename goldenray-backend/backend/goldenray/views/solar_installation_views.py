from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import SolarInstallation
from ..serializers.solar_installation_serializer import SolarInstallationSerializer


class SolarInstallationAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                installation = SolarInstallation.objects.get(pk=pk)
                serializer = SolarInstallationSerializer(installation)
                return Response(serializer.data)
            except SolarInstallation.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        installations = SolarInstallation.objects.all()
        serializer = SolarInstallationSerializer(installations, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SolarInstallationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            installation = SolarInstallation.objects.get(pk=pk)
        except SolarInstallation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SolarInstallationSerializer(installation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            installation = SolarInstallation.objects.get(pk=pk)
        except SolarInstallation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        installation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
