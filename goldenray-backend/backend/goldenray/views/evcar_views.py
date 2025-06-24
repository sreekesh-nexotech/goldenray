from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import EVCar
from ..serializers.evcar_serializer import EVCarSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class EVCarAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                car = EVCar.objects.get(pk=pk)
                serializer = EVCarSerializer(car)
                return Response(serializer.data)
            except EVCar.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        cars = EVCar.objects.all()
        serializer = EVCarSerializer(cars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EVCarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            car = EVCar.objects.get(pk=pk)
        except EVCar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = EVCarSerializer(car, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            car = EVCar.objects.get(pk=pk)
        except EVCar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        car.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
