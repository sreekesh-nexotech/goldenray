from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import modules as mod
from .models import AdminUser, Role
from .modules import Action, Module
from .permissions import HasModulePermission
from .serializers import AdminUserSerializer, AdminUserWriteSerializer, RoleSerializer


class MeAPIView(APIView):
    """Return the currently authenticated internal user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AdminUserSerializer(request.user).data)


class PermissionRegistryAPIView(APIView):
    """The module/action vocabulary the Roles screen builds its matrix from.

    Shipping this rather than hard-coding the grid in the frontend means adding
    a module is a one-file backend change: the Roles screen grows a row, the
    sidebar grows an item, and neither can drift from what the permission
    checker actually honours.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "actions": [
                    {"key": a, "label": mod.ACTION_LABELS[a]} for a in mod.ALL_ACTIONS
                ],
                "groups": [
                    {
                        "title": title,
                        "modules": [
                            {
                                "key": m,
                                "label": mod.MODULE_LABELS[m],
                                "actions": list(mod.ALLOWED_ACTIONS[m]),
                            }
                            for m in members
                        ],
                    }
                    for title, members in mod.MODULE_GROUPS
                ],
            }
        )


class RoleViewSet(viewsets.ModelViewSet):
    """Roles & Permissions: the Phase 1 module matrix.

    Gated on the ``roles`` module rather than the legacy admin enum, so the
    matrix decides who may edit the matrix. Deleting a role is a ``manage``
    action: the registry does not allow ``archive`` on Roles, and removing a
    grant outright is the most consequential thing this screen can do.
    """

    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [HasModulePermission]
    permission_module = Module.ROLES
    permission_actions = {"destroy": Action.MANAGE}

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.is_system:
            return Response(
                {"detail": f"'{role.name}' is a built-in role and cannot be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        in_use = role.users.count()
        if in_use:
            return Response(
                {
                    "detail": (
                        f"{in_use} user(s) still hold this role. Move them to another "
                        "role before deleting it."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class AdminUserViewSet(viewsets.ModelViewSet):
    """Users: manage internal authoring accounts (``users`` module)."""

    queryset = AdminUser.objects.select_related("access_role").order_by("username")
    permission_classes = [HasModulePermission]
    permission_module = Module.USERS

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
