from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as drf_status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db import models as django_models
from django.utils import timezone

from bom.models import (
    GlobalCosts,
    Category,
    CatalogItem,
    ItemTier,
    BomTemplate,
    BomSlot,
    BomFixedItem,
    MarketRate,
    StructureTemplate,
    StructureTemplateItem,
    TubeWeight,
    Offer,
)
from bom.serializers import (
    GlobalCostsSerializer,
    CategorySerializer,
    CatalogItemSerializer,
    ItemTierSerializer,
    BomTemplateSerializer,
    BomSlotSerializer,
    BomFixedItemSerializer,
    MarketRateSerializer,
    StructureTemplateSerializer,
    StructureTemplateItemSerializer,
    TubeWeightSerializer,
    OfferSerializer,
)


class AuthMixin:
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


# ── GlobalCosts ──────────────────────────────────────────────────────────────

class GlobalCostsList(AuthMixin, generics.ListCreateAPIView):
    queryset = GlobalCosts.objects.all()
    serializer_class = GlobalCostsSerializer


class GlobalCostsDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = GlobalCosts.objects.all()
    serializer_class = GlobalCostsSerializer


# ── Category ─────────────────────────────────────────────────────────────────

class CategoryList(AuthMixin, generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# ── CatalogItem ───────────────────────────────────────────────────────────────

class CatalogItemList(AuthMixin, generics.ListCreateAPIView):
    queryset = CatalogItem.objects.select_related("category").all()
    serializer_class = CatalogItemSerializer


class CatalogItemDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = CatalogItem.objects.select_related("category").all()
    serializer_class = CatalogItemSerializer


# ── ItemTier ──────────────────────────────────────────────────────────────────

class ItemTierList(AuthMixin, generics.ListCreateAPIView):
    queryset = ItemTier.objects.select_related("item").all()
    serializer_class = ItemTierSerializer


class ItemTierDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = ItemTier.objects.select_related("item").all()
    serializer_class = ItemTierSerializer


# ── BomTemplate ───────────────────────────────────────────────────────────────

class BomTemplateList(AuthMixin, generics.ListCreateAPIView):
    queryset = BomTemplate.objects.all()
    serializer_class = BomTemplateSerializer


class BomTemplateDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = BomTemplate.objects.all()
    serializer_class = BomTemplateSerializer


# ── BomSlot ───────────────────────────────────────────────────────────────────

class BomSlotList(AuthMixin, generics.ListCreateAPIView):
    queryset = BomSlot.objects.select_related("template", "category").all()
    serializer_class = BomSlotSerializer


class BomSlotDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = BomSlot.objects.select_related("template", "category").all()
    serializer_class = BomSlotSerializer


# ── BomFixedItem ──────────────────────────────────────────────────────────────

class BomFixedItemList(AuthMixin, generics.ListCreateAPIView):
    queryset = BomFixedItem.objects.select_related("template", "catalog_item", "category").all()
    serializer_class = BomFixedItemSerializer


class BomFixedItemDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = BomFixedItem.objects.select_related("template", "catalog_item", "category").all()
    serializer_class = BomFixedItemSerializer


# ── MarketRate ────────────────────────────────────────────────────────────────

class MarketRateList(AuthMixin, generics.ListCreateAPIView):
    queryset = MarketRate.objects.all()
    serializer_class = MarketRateSerializer


class MarketRateDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = MarketRate.objects.all()
    serializer_class = MarketRateSerializer


# ── StructureTemplate ─────────────────────────────────────────────────────────

class StructureTemplateList(AuthMixin, generics.ListCreateAPIView):
    queryset = StructureTemplate.objects.all()
    serializer_class = StructureTemplateSerializer


class StructureTemplateDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = StructureTemplate.objects.all()
    serializer_class = StructureTemplateSerializer


# ── StructureTemplateItem ─────────────────────────────────────────────────────

class StructureTemplateItemList(AuthMixin, generics.ListCreateAPIView):
    queryset = StructureTemplateItem.objects.select_related("template").all()
    serializer_class = StructureTemplateItemSerializer


class StructureTemplateItemDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = StructureTemplateItem.objects.select_related("template").all()
    serializer_class = StructureTemplateItemSerializer


# ── TubeWeight ────────────────────────────────────────────────────────────────

class TubeWeightList(AuthMixin, generics.ListCreateAPIView):
    queryset = TubeWeight.objects.all()
    serializer_class = TubeWeightSerializer


class TubeWeightDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = TubeWeight.objects.all()
    serializer_class = TubeWeightSerializer


# ── Offer ─────────────────────────────────────────────────────────────────────

class OfferList(AuthMixin, generics.ListCreateAPIView):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


class OfferDetail(AuthMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


# ── BOM Calculator (public) ───────────────────────────────────────────────────

class BomCalculateView(APIView):
    """
    POST /bom/api/calculate/
    Public endpoint — no authentication required.
    Accepts system config, returns full BOM with pricing.
    """
    authentication_classes = []
    permission_classes = []

    VALID_SYS_TYPES = {"ongrid", "hybrid", "upgrade"}
    VALID_TIERS = {"base", "value", "premium"}
    VALID_SUBSIDY = {"residential", "ghs", "none"}
    VALID_MARGIN = {"percent", "flat"}
    VALID_STRUCTURE = {"flatRoof", "elevated", "sheetRoof"}

    def post(self, request):
        data = request.data
        errors = self._validate(data)
        if errors:
            return Response({"errors": errors}, status=drf_status.HTTP_400_BAD_REQUEST)

        params = self._coerce(data)
        sys_type = params["sys_type"]

        # ── Fetch all required data ───────────────────────────────────────────
        costs = GlobalCosts.objects.first()
        if not costs:
            return Response({"error": "System not configured (GlobalCosts missing)."}, status=503)

        template = (
            BomTemplate.objects
            .filter(system_type=sys_type)
            .prefetch_related(
                "slots__category__items__item_tiers",
                "fixed_items__catalog_item__item_tiers",
                "fixed_items__catalog_item__category",
                "fixed_items__category",
            )
            .first()
        )
        if not template:
            return Response({"error": f"No BOM template found for system type '{sys_type}'."}, status=400)

        # Build cat_map from slot categories
        slot_cat_slugs = list(
            template.slots.values_list("category__slug", flat=True).distinct()
        )
        categories = (
            Category.objects
            .filter(slug__in=slot_cat_slugs)
            .prefetch_related("items__item_tiers")
        )
        cat_map = {c.slug: c for c in categories}

        structure_templates_qs = StructureTemplate.objects.prefetch_related("items").all()
        structure_templates = {st.slug: st for st in structure_templates_qs}

        tube_weights = {tw.tube_size: float(tw.weight_kg) for tw in TubeWeight.objects.all()}

        market_rates = list(MarketRate.objects.filter(system_type=sys_type))

        today = timezone.now().date()
        offers = list(
            Offer.objects.filter(active=True).filter(
                django_models.Q(start_date__isnull=True) | django_models.Q(start_date__lte=today)
            ).filter(
                django_models.Q(end_date__isnull=True) | django_models.Q(end_date__gte=today)
            )
        )

        # ── Run calculator ────────────────────────────────────────────────────
        from bom.calculator import BomCalculator
        calculator = BomCalculator(
            costs=costs,
            template=template,
            cat_map=cat_map,
            structure_templates=structure_templates,
            tube_weights=tube_weights,
            market_rates=market_rates,
            offers=offers,
            params=params,
        )
        result = calculator.compute()
        return Response(result, status=200)

    def _validate(self, data: dict) -> list:
        errors = []
        if data.get("sys_type") not in self.VALID_SYS_TYPES:
            errors.append("sys_type must be ongrid | hybrid | upgrade")
        if data.get("tier") not in self.VALID_TIERS:
            errors.append("tier must be base | value | premium")
        if not data.get("size"):
            errors.append("size is required")
        if data.get("subsidy_type", "none") not in self.VALID_SUBSIDY:
            errors.append("subsidy_type must be residential | ghs | none")
        if data.get("margin_type", "percent") not in self.VALID_MARGIN:
            errors.append("margin_type must be percent | flat")
        if data.get("structure_type", "flatRoof") not in self.VALID_STRUCTURE:
            errors.append("structure_type must be flatRoof | elevated | sheetRoof")
        for field in ("dist_km", "margin_val"):
            try:
                float(data.get(field, 0))
            except (TypeError, ValueError):
                errors.append(f"{field} must be a number")
        return errors

    def _coerce(self, data: dict) -> dict:
        return {
            "sys_type": data["sys_type"],
            "size": str(data["size"]),
            "tier": data["tier"],
            "bat_config": str(data.get("bat_config", "0")),
            "mode": data.get("mode", "quotation"),
            "dist_km": max(0, int(data.get("dist_km", 100))),
            "structure_type": data.get("structure_type", "flatRoof"),
            "subsidy_type": data.get("subsidy_type", "none"),
            "ghs_houses": max(1, int(data.get("ghs_houses", 1))),
            "selected_offer_id": data.get("selected_offer_id") or None,
            "custom_discount": data.get("custom_discount") or None,
            "margin_type": data.get("margin_type", "percent"),
            "margin_val": float(data.get("margin_val", 20)),
            "upgrade_from_kw": float(data.get("upgrade_from_kw", 3)),
            "upgrade_to_kw": float(data.get("upgrade_to_kw", 5)),
            "upgrade_sections": data.get("upgrade_sections") or {
                "panels": True, "structure": True, "inverter": True,
                "hybrid_inv": False, "battery": False, "wiring": True,
            },
        }
