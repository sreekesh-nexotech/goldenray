from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import DashboardAPIView, EntryViewSet, SiteConfigAPIView

router = DefaultRouter()
router.register("entries", EntryViewSet, basename="entry")

urlpatterns = [
    path("dashboard/", DashboardAPIView.as_view(), name="admin-dashboard"),
    path("config/", SiteConfigAPIView.as_view(), name="admin-site-config"),
    *router.urls,
]
