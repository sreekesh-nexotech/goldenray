from rest_framework import viewsets

from accounts.permissions import CanAuthorEntries, IsSchemaEditor

from .models import (
    Author,
    Badge,
    Category,
    Collection,
    Tag,
    Template,
    TemplateAttributeSlot,
    TemplateImageGroup,
)
from .serializers import (
    AuthorSerializer,
    BadgeSerializer,
    CategorySerializer,
    CollectionSerializer,
    TagSerializer,
    TemplateAttributeSlotSerializer,
    TemplateImageGroupSerializer,
    TemplateSerializer,
)


# ── Schema-editing viewsets (admin role only for writes) ──────────────────────
class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsSchemaEditor]


class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.prefetch_related("image_groups", "attribute_slots")
    serializer_class = TemplateSerializer
    permission_classes = [IsSchemaEditor]


class TemplateImageGroupViewSet(viewsets.ModelViewSet):
    serializer_class = TemplateImageGroupSerializer
    permission_classes = [IsSchemaEditor]

    def get_queryset(self):
        qs = TemplateImageGroup.objects.all()
        template_id = self.request.query_params.get("template")
        return qs.filter(template_id=template_id) if template_id else qs


class TemplateAttributeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TemplateAttributeSlotSerializer
    permission_classes = [IsSchemaEditor]

    def get_queryset(self):
        qs = TemplateAttributeSlot.objects.all()
        template_id = self.request.query_params.get("template")
        return qs.filter(template_id=template_id) if template_id else qs


# ── Lookup viewsets (any authenticated author may create) ─────────────────────
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [CanAuthorEntries]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [CanAuthorEntries]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [CanAuthorEntries]


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [CanAuthorEntries]
