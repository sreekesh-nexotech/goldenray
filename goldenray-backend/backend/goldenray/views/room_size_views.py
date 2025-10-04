from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import RoomSize
from ..serializers.room_size_serializer import RoomSizeSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class RoomSizeAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                room_size = RoomSize.objects.get(pk=pk)
                serializer = RoomSizeSerializer(room_size)
                return Response(serializer.data)
            except RoomSize.DoesNotExist:
                return Response({"error": "Room size not found"}, status=status.HTTP_404_NOT_FOUND)

        room_sizes = RoomSize.objects.all().order_by('bhk_type')
        serializer = RoomSizeSerializer(room_sizes, many=True)
        return Response(serializer.data)

    # @non_authenticated_view
    def post(self, request):
        serializer = RoomSizeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @non_authenticated_view
    def put(self, request, pk):
        try:
            room_size = RoomSize.objects.get(pk=pk)
        except RoomSize.DoesNotExist:
            return Response({"error": "Room size not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RoomSizeSerializer(room_size, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @non_authenticated_view
    def delete(self, request, pk):
        try:
            room_size = RoomSize.objects.get(pk=pk)
            room_size.delete()
            return Response({"message": "Room size deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except RoomSize.DoesNotExist:
            return Response({"error": "Room size not found"}, status=status.HTTP_404_NOT_FOUND)