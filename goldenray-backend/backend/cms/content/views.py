from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import CanAuthorEntries

from .models import Entry
from .selectors import admin_entry_queryset
from .serializers import EntryReadSerializer, EntryWriteSerializer
from .services import PublishError, duplicate_entry, publish_entry, unpublish_entry


class EntryViewSet(viewsets.ModelViewSet):
    """Authoring CRUD + publish workflow for blog entries (any collection)."""

    permission_classes = [CanAuthorEntries]

    def get_queryset(self):
        qs = admin_entry_queryset()
        params = self.request.query_params
        if (col := params.get("collection")):
            qs = qs.filter(collection__api_uid=col) if not col.isdigit() else qs.filter(collection_id=col)
        if (st := params.get("status")):
            qs = qs.filter(status=st)
        if (cat := params.get("category")):
            qs = qs.filter(categories__id=cat)
        if (tag := params.get("tag")):
            qs = qs.filter(tags__id=tag)
        if (tpl := params.get("template")):
            qs = qs.filter(template_id=tpl)
        if (search := params.get("search")):
            qs = qs.filter(title__icontains=search) | qs.filter(slug__icontains=search)
        return qs.distinct()

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return EntryReadSerializer
        return EntryWriteSerializer

    # ── Publish workflow actions ──────────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        entry = self.get_object()
        try:
            publish_entry(entry, user=request.user)
        except PublishError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(EntryReadSerializer(entry, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        entry = self.get_object()
        try:
            unpublish_entry(entry, user=request.user)
        except PublishError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(EntryReadSerializer(entry, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        entry = self.get_object()
        copy = duplicate_entry(entry, user=request.user)
        return Response(
            EntryReadSerializer(copy, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )
