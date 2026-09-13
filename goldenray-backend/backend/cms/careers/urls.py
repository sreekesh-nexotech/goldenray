from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CareersOverviewAPIView, DepartmentViewSet, JobPositionViewSet

router = DefaultRouter()
router.register("job-positions", JobPositionViewSet, basename="job-position")
router.register("departments", DepartmentViewSet, basename="department")

urlpatterns = [
    path("careers/overview/", CareersOverviewAPIView.as_view(), name="careers-overview"),
    *router.urls,
]
