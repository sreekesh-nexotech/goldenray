from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
    queryset = (
        Template.objects.prefetch_related("image_groups", "attribute_slots")
        .annotate(entries_count=Count("entries"))
    )
    serializer_class = TemplateSerializer
    permission_classes = [IsSchemaEditor]

    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        """Deep-copy the template + all groups/slots → 201 with a `-copy` slug.
        Existing entries stay on the original."""
        src = self.get_object()
        base = f"{src.slug}-copy"
        slug, n = base, 2
        while Template.objects.filter(slug=slug).exists():
            slug, n = f"{base}-{n}", n + 1
        copy = Template.objects.create(
            name=f"{src.name} (copy)",
            slug=slug,
            description=src.description,
            is_active=src.is_active,
            sort_order=src.sort_order,
        )
        for g in src.image_groups.all():
            TemplateImageGroup.objects.create(
                template=copy, key=g.key, label=g.label, repeatable=g.repeatable,
                max_items=g.max_items, required=g.required, order=g.order,
            )
        for s in src.attribute_slots.all():
            TemplateAttributeSlot.objects.create(
                template=copy, key=s.key, label=s.label, type=s.type,
                options=s.options, required=s.required, order=s.order,
            )
        copy = self.get_queryset().get(pk=copy.pk)  # re-fetch with annotation
        return Response(self.get_serializer(copy).data, status=status.HTTP_201_CREATED)


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
