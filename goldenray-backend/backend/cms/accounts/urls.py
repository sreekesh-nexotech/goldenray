from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import StudioTokenObtainPairSerializer
from .views import AdminUserViewSet, MeAPIView, PermissionRegistryAPIView, RoleViewSet

router = DefaultRouter()
router.register("users", AdminUserViewSet, basename="admin-user")
router.register("roles", RoleViewSet, basename="role")

urlpatterns = [
    path(
        "login/",
        TokenObtainPairView.as_view(serializer_class=StudioTokenObtainPairSerializer),
        name="token-obtain-pair",
    ),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", MeAPIView.as_view(), name="accounts-me"),
    path("permission-registry/", PermissionRegistryAPIView.as_view(), name="permission-registry"),
    *router.urls,
]
