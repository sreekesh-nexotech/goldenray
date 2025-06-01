from django.urls import path
from .views.device_views import DeviceAPIView

urlpatterns = [
    # Devices.
    path("devices/", DeviceAPIView.as_view(), name="device-list-create"),
    path("devices/<int:pk>/", DeviceAPIView.as_view(), name="device-retrieve-update-destroy"),
]
