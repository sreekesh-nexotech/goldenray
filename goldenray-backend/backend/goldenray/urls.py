from django.urls import path
from .views.device_type_views import DeviceTypeAPIView

urlpatterns = [
    # Device Types.
    path("device-types/", DeviceTypeAPIView.as_view(), name="device-type-list-create"),
    path("device-types/<int:pk>/", DeviceTypeAPIView.as_view(), name="device-type-retrieve-update-destroy"),
]
