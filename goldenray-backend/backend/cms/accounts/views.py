from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AdminUser
from .permissions import IsUserAdmin
from .serializers import AdminUserSerializer, AdminUserWriteSerializer


class MeAPIView(APIView):
    """Return the currently authenticated internal user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AdminUserSerializer(request.user).data)


class AdminUserViewSet(viewsets.ModelViewSet):
    """Roles & access: manage internal authoring accounts (admin role only)."""

    queryset = AdminUser.objects.order_by("username")
    permission_classes = [IsUserAdmin]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return AdminUserSerializer
        return AdminUserWriteSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.pk == request.user.pk:
            return Response(
                {"detail": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Keep authorship history intact: deactivate instead of hard-deleting.
        user.is_active = False
        user.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)
