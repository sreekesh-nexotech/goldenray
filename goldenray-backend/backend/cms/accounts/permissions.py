from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSchemaEditor(BasePermission):
    """Only admins may mutate catalog/schema (collections, templates, slots)."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return bool(request.user and request.user.is_authenticated and request.user.can_edit_schema)


class IsUserAdmin(BasePermission):
    """Only admins (or superusers) may manage internal accounts (Roles & access)."""

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and (u.is_superuser or u.role == u.Role.ADMIN))


class CanAuthorEntries(BasePermission):
    """Any authenticated internal user may read/author entries.

    Publishing is gated separately in the service layer (author role = draft only).
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
