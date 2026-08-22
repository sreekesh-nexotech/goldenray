from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.battery_views import BatteryAPIView
from .views.device_type_views import DeviceTypeAPIView
from .views.wattage_views import WattageAPIView
from .views.kseb_tariff_views import KSEBTariffAPIView
from .views.evcar_views import EVCarAPIView
from .views.evscooter_views import EVScooterAPIView
from .views.solar_installation_views import SolarInstallationAPIView
from .views.solar_panel_views import SolarPanelAPIView
from .views.solar_inverter_views import SolarInverterAPIView
from .views.pincode_views import PincodeAPIView
from .views.solar_calculator_views import SolarCalculatorAPIView
from .views.solar_calculator_new_views import SolarCalculatorNewAPIView
from .views.solar_installation_new_views import SolarInstallationNewAPIView
from .views.solar_advanced_calc_views import SolarAdvancedCalcAPIView
from .views.otp_views import SendOTPAPIView, VerifyOTPAPIView
from .views.lead_collection_home_views import LeadCollectionHomeAPIView
from .views.metadata_views import MetadataAPIView
from .views.room_size_views import RoomSizeAPIView
from .views.customer_installation_views import CustomerInstallationAPIView, InstallationStatsByPincodeAPIView
from .views.affiliate_application_views import AffiliateApplicationAPIView
from .views.emicalculator import (
    EMICalculatorAPIView,
    EMICalculatorConfigAPIView,
    EmiBankViewSet,
    EmiCalculatorSettingsAPIView,
    EmiInterestRateRuleViewSet,
    EmiSubsidyRuleViewSet,
    EmiSystemSizeViewSet,
)
from .views.warranty_service_request_views import WarrantyServiceRequestAPIView
from .views.job_application_views import (
    JobApplicationAPIView,
    JobApplicationFileDownloadView,
)

# Authoring routes for the EMI calculator config (Content Studio → /studio/emi-calculator).
emi_admin_router = DefaultRouter()
emi_admin_router.register("system-sizes", EmiSystemSizeViewSet, basename="emi-system-size")
emi_admin_router.register("subsidies", EmiSubsidyRuleViewSet, basename="emi-subsidy-rule")
emi_admin_router.register("interest-rates", EmiInterestRateRuleViewSet, basename="emi-interest-rate-rule")
emi_admin_router.register("banks", EmiBankViewSet, basename="emi-bank")

urlpatterns = [
    # Batteries
    path("batteries/", BatteryAPIView.as_view(), name="battery-list-create"),
    path("batteries/<int:pk>/", BatteryAPIView.as_view(), name="battery-retrieve-update-destroy"),
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
    # Solar Panels
    path("solar-panels/", SolarPanelAPIView.as_view(), name="solar-panel-list-create"),
    path("solar-panels/<int:pk>/", SolarPanelAPIView.as_view(), name="solar-panel-retrieve-update-destroy"),
    # Solar Inverters
    path("solar-inverters/", SolarInverterAPIView.as_view(), name="solar-inverter-list-create"),
    path("solar-inverters/<int:pk>/", SolarInverterAPIView.as_view(), name="solar-inverter-retrieve-update-destroy"),
    # Pincodes
    path("pincodes/", PincodeAPIView.as_view(), name="pincode-list-create"),
    path("pincodes/<int:pk>/", PincodeAPIView.as_view(), name="pincode-retrieve-update-destroy"),
    # Solar Calculator.
    path("calculate-solar/", SolarCalculatorAPIView.as_view(), name="calculate-solar"),
    # Solar Calculator New
    path("calculate-solar-new/", SolarCalculatorNewAPIView.as_view(), name="calculate-solar-new"),
    path("calculate-solar-advanced/", SolarAdvancedCalcAPIView.as_view(), name="calculate-solar-advanced"),
    path("send-otp/", SendOTPAPIView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPAPIView.as_view(), name="verify-otp"),
    # Lead Collection Home
    path("lead-collection-home/", LeadCollectionHomeAPIView.as_view(), name="lead-collection-home-list-create"),
    path("lead-collection-home/<int:pk>/", LeadCollectionHomeAPIView.as_view(), name="lead-collection-home-retrieve-update-destroy"),
    # Metadata
    path("metadata/", MetadataAPIView.as_view(), name="metadata-list-create"),
    path("metadata/<int:pk>/", MetadataAPIView.as_view(), name="metadata-retrieve-update-destroy"),
    # Room Sizes
    path("room-sizes/", RoomSizeAPIView.as_view(), name="room-size-list-create"),
    path("room-sizes/<int:pk>/", RoomSizeAPIView.as_view(), name="room-size-retrieve-update-destroy"),
    # Customer Installations
    path("customer-installations/", CustomerInstallationAPIView.as_view(), name="customer-installation-list-create"),
    path("customer-installations/<int:pk>/", CustomerInstallationAPIView.as_view(), name="customer-installation-retrieve-update-destroy"),
    # Installation Stats by Pincode
    path("installation-stats/", InstallationStatsByPincodeAPIView.as_view(), name="installation-stats-by-pincode"),
    # Affiliate Applications
    path("affiliate-applications/", AffiliateApplicationAPIView.as_view(), name="affiliate-application-create"),
    # EMI Calculator (public)
    path("emi-calculator/", EMICalculatorAPIView.as_view(), name="emi-calculator"),
    path("emi-calculator/config/", EMICalculatorConfigAPIView.as_view(), name="emi-calculator-config"),
    # EMI Calculator configuration (Content Studio authoring)
    path("emi-admin/settings/", EmiCalculatorSettingsAPIView.as_view(), name="emi-admin-settings"),
    path("emi-admin/", include(emi_admin_router.urls)),
    # Warranty / Support Service Requests
    path(
        "warranty-service-requests/",
        WarrantyServiceRequestAPIView.as_view(),
        name="warranty-service-request-create",
    ),
    # Career / Job Applications
    path(
        "job-applications/",
        JobApplicationAPIView.as_view(),
        name="job-application-list-create",
    ),
    path(
        "job-applications/<int:pk>/",
        JobApplicationAPIView.as_view(),
        name="job-application-detail",
    ),
    # Resume / portfolio downloads. MEDIA_URL isn't served in production, so
    # the files come back through the API instead — see the view's docstring.
    path(
        "job-applications/<int:pk>/download/<str:kind>/",
        JobApplicationFileDownloadView.as_view(),
        name="job-application-download",
    ),
]
