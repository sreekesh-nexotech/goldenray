from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Pincode
from ..serializers.pincode_serializer import PincodeSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class PincodeAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                pincode = Pincode.objects.get(pk=pk)
                serializer = PincodeSerializer(pincode)
                return Response(serializer.data)
            except Pincode.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        pincodes = Pincode.objects.all()
        serializer = PincodeSerializer(pincodes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PincodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            pincode = Pincode.objects.get(pk=pk)
        except Pincode.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PincodeSerializer(pincode, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            pincode = Pincode.objects.get(pk=pk)
        except Pincode.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        pincode.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
