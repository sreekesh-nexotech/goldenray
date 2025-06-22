from rest_framework import permissions
from functools import wraps


class ApiMethodPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the view method has the _non_authenticated_view attribute
        view_method = getattr(view, request.method.lower(), None)
        is_non_authenticated = getattr(view_method, "_non_authenticated_view", False)
        return is_non_authenticated or (request.user and request.user.is_authenticated)


def non_authenticated_view(view_func):
    @wraps(view_func)
    def wrapped_view(self, request, *args, **kwargs):
        return view_func(self, request, *args, **kwargs)

    # Set the attribute on the function itself
    wrapped_view._non_authenticated_view = True
    return wrapped_view
