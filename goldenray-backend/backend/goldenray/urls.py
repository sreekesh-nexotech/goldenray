from django.urls import path
from .views.device_type_views import DeviceTypeAPIView
from .views.wattage_views import WattageAPIView

urlpatterns = [
    # Device Types.
    path("device-types/", DeviceTypeAPIView.as_view(), name="device-type-list-create"),
    path("device-types/<int:pk>/", DeviceTypeAPIView.as_view(), name="device-type-retrieve-update-destroy"),
    # Wattages
    path("wattages/", WattageAPIView.as_view(), name="wattage-list-create"),
    path("wattages/<int:pk>/", WattageAPIView.as_view(), name="wattage-retrieve-update-destroy"),
]
