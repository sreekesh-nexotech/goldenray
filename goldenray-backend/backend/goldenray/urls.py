from django.urls import path
from .views.device_type_views import DeviceTypeAPIView
from .views.wattage_views import WattageAPIView
from .views.kseb_tariff_views import KSEBTariffAPIView
from .views.evcar_views import EVCarAPIView
from .views.evscooter_views import EVScooterAPIView
from .views.solar_installation_views import SolarInstallationAPIView
from .views.pincode_views import PincodeAPIView
from .views.solar_calculator_views import SolarCalculatorAPIView
from .views.solar_calculator_new_views import SolarCalculatorNewAPIView
from .views.solar_installation_new_views import SolarInstallationNewAPIView


urlpatterns = [
    # Device Types.
    path("device-types/", DeviceTypeAPIView.as_view(), name="device-type-list-create"),
    path("device-types/<int:pk>/", DeviceTypeAPIView.as_view(), name="device-type-retrieve-update-destroy"),
    # Wattages
    path("wattages/", WattageAPIView.as_view(), name="wattage-list-create"),
    path("wattages/<int:pk>/", WattageAPIView.as_view(), name="wattage-retrieve-update-destroy"),
    # KSEB Tariffs
    path("tariffs/", KSEBTariffAPIView.as_view(), name="tariff-list-create"),
    path("tariffs/<int:pk>/", KSEBTariffAPIView.as_view(), name="tariff-retrieve-update-destroy"),
    # EV Cars
    path("ev-cars/", EVCarAPIView.as_view(), name="ev-car-list-create"),
    path("ev-cars/<int:pk>/", EVCarAPIView.as_view(), name="ev-car-retrieve-update-destroy"),
    # EV Scooters
    path("ev-scooters/", EVScooterAPIView.as_view(), name="ev-scooter-list-create"),
    path("ev-scooters/<int:pk>/", EVScooterAPIView.as_view(), name="ev-scooter-retrieve-update-destroy"),
    # Solar Installations
    path("solar-installations/", SolarInstallationAPIView.as_view(), name="solar-installation-list-create"),
    path("solar-installations/<int:pk>/", SolarInstallationAPIView.as_view(), name="solar-installation-retrieve-update-destroy"),
    # Solar Installations New
    path("solar-installations-new/", SolarInstallationNewAPIView.as_view(), name="solar-installation-new-list-create"),
    path("solar-installations-new/<int:pk>/", SolarInstallationNewAPIView.as_view(), name="solar-installation-new-retrieve-update-destroy"),
    # Pincodes
    path("pincodes/", PincodeAPIView.as_view(), name="pincode-list-create"),
    path("pincodes/<int:pk>/", PincodeAPIView.as_view(), name="pincode-retrieve-update-destroy"),
    # Solar Calculator.
    path("calculate-solar/", SolarCalculatorAPIView.as_view(), name="calculate-solar"),
    # Solar Calculator New
    path("calculate-solar-new/", SolarCalculatorNewAPIView.as_view(), name="calculate-solar-new"),
]
