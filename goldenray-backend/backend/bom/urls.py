from django.urls import path
from .views.auth import login_view, logout_view
from .views.dashboard import dashboard_view
from .views.calculator import calculator_view
from .views.api import BomCalculateView
from .views.api import (
    GlobalCostsList, GlobalCostsDetail,
    CategoryList, CategoryDetail,
    CatalogItemList, CatalogItemDetail,
    ItemTierList, ItemTierDetail,
    BomTemplateList, BomTemplateDetail,
    BomSlotList, BomSlotDetail,
    BomFixedItemList, BomFixedItemDetail,
    MarketRateList, MarketRateDetail,
    StructureTemplateList, StructureTemplateDetail,
    StructureTemplateItemList, StructureTemplateItemDetail,
    TubeWeightList, TubeWeightDetail,
    OfferList, OfferDetail,
)

app_name = "bom"

urlpatterns = [
    # ── Template views ──────────────────────────────────────────────────────
    path("", login_view, name="login"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("calculator/", calculator_view, name="calculator"),
    path("logout/", logout_view, name="logout"),

    # ── Calculator API (public) ──────────────────────────────────────────────
    path("api/calculate/", BomCalculateView.as_view(), name="api-bom-calculate"),

    # ── GlobalCosts ─────────────────────────────────────────────────────────
    path("api/global-costs/", GlobalCostsList.as_view(), name="api-global-costs-list"),
    path("api/global-costs/<int:pk>/", GlobalCostsDetail.as_view(), name="api-global-costs-detail"),

    # ── Category ────────────────────────────────────────────────────────────
    path("api/categories/", CategoryList.as_view(), name="api-category-list"),
    path("api/categories/<int:pk>/", CategoryDetail.as_view(), name="api-category-detail"),

    # ── CatalogItem ─────────────────────────────────────────────────────────
    path("api/catalog-items/", CatalogItemList.as_view(), name="api-catalog-item-list"),
    path("api/catalog-items/<int:pk>/", CatalogItemDetail.as_view(), name="api-catalog-item-detail"),

    # ── ItemTier ────────────────────────────────────────────────────────────
    path("api/item-tiers/", ItemTierList.as_view(), name="api-item-tier-list"),
    path("api/item-tiers/<int:pk>/", ItemTierDetail.as_view(), name="api-item-tier-detail"),

    # ── BomTemplate ─────────────────────────────────────────────────────────
    path("api/bom-templates/", BomTemplateList.as_view(), name="api-bom-template-list"),
    path("api/bom-templates/<int:pk>/", BomTemplateDetail.as_view(), name="api-bom-template-detail"),

    # ── BomSlot ─────────────────────────────────────────────────────────────
    path("api/bom-slots/", BomSlotList.as_view(), name="api-bom-slot-list"),
    path("api/bom-slots/<int:pk>/", BomSlotDetail.as_view(), name="api-bom-slot-detail"),

    # ── BomFixedItem ────────────────────────────────────────────────────────
    path("api/bom-fixed-items/", BomFixedItemList.as_view(), name="api-bom-fixed-item-list"),
    path("api/bom-fixed-items/<int:pk>/", BomFixedItemDetail.as_view(), name="api-bom-fixed-item-detail"),

    # ── MarketRate ──────────────────────────────────────────────────────────
    path("api/market-rates/", MarketRateList.as_view(), name="api-market-rate-list"),
    path("api/market-rates/<int:pk>/", MarketRateDetail.as_view(), name="api-market-rate-detail"),

    # ── StructureTemplate ───────────────────────────────────────────────────
    path("api/structure-templates/", StructureTemplateList.as_view(), name="api-structure-template-list"),
    path("api/structure-templates/<int:pk>/", StructureTemplateDetail.as_view(), name="api-structure-template-detail"),

    # ── StructureTemplateItem ───────────────────────────────────────────────
    path("api/structure-template-items/", StructureTemplateItemList.as_view(), name="api-structure-template-item-list"),
    path("api/structure-template-items/<int:pk>/", StructureTemplateItemDetail.as_view(), name="api-structure-template-item-detail"),

    # ── TubeWeight ──────────────────────────────────────────────────────────
    path("api/tube-weights/", TubeWeightList.as_view(), name="api-tube-weight-list"),
    path("api/tube-weights/<int:pk>/", TubeWeightDetail.as_view(), name="api-tube-weight-detail"),

    # ── Offer ────────────────────────────────────────────────────────────────
    path("api/offers/", OfferList.as_view(), name="api-offer-list"),
    path("api/offers/<int:pk>/", OfferDetail.as_view(), name="api-offer-detail"),
]
