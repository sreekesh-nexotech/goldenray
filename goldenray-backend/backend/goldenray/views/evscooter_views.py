from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import EVScooter
from ..serializers.evscooter_serializer import EVScooterSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class EVScooterAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                scooter = EVScooter.objects.get(pk=pk)
                serializer = EVScooterSerializer(scooter)
                return Response(serializer.data)
            except EVScooter.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        scooters = EVScooter.objects.all()
        serializer = EVScooterSerializer(scooters, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EVScooterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            scooter = EVScooter.objects.get(pk=pk)
        except EVScooter.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = EVScooterSerializer(scooter, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            scooter = EVScooter.objects.get(pk=pk)
        except EVScooter.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        scooter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
