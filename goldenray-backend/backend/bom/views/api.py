from rest_framework import generics
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

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
