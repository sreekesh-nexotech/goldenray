from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AdminUserSerializer


class MeAPIView(APIView):
    """Return the currently authenticated internal user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AdminUserSerializer(request.user).data)
