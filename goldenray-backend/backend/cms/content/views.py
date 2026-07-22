from django.conf import settings
from django.utils.text import slugify
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import CanAuthorEntries
from catalog.models import Author, Badge, Category, Collection, Tag, Template
from media.models import MediaAsset

from .models import Entry
from .selectors import admin_entry_queryset
from .serializers import EntryListSerializer, EntryReadSerializer, EntryWriteSerializer
from .services import PublishError, duplicate_entry, publish_entry, unpublish_entry

# Whitelisted ?ordering= values for the entries list screen.
ORDERING_FIELDS = {
    "title", "slug", "status", "sort_order",
    "created_at", "updated_at", "published_on", "published_at",
}


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
        if (author := params.get("author")):
            qs = qs.filter(author_id=author)
        if (search := params.get("search")):
            qs = qs.filter(title__icontains=search) | qs.filter(slug__icontains=search)
        if (ordering := params.get("ordering")):
            if ordering.lstrip("-") in ORDERING_FIELDS:
                qs = qs.order_by(ordering)
        return qs.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return EntryListSerializer
        if self.action == "retrieve":
            return EntryReadSerializer
        return EntryWriteSerializer

    # ── Slug helper for the editor's URL-slug field ───────────────────────────
    @action(detail=False, methods=["get"], url_path="check-slug")
    def check_slug(self, request):
        """?collection=<id|api_uid>&slug=<candidate>[&exclude=<entry id>]

        Returns whether the slug is free in that collection and, when taken,
        the next free ``<slug>-N`` suggestion. Backs the ↻ regenerate button
        and inline availability feedback.
        """
        col, raw = request.query_params.get("collection"), request.query_params.get("slug", "")
        slug = slugify(raw)
        if not col or not slug:
            return Response(
                {"detail": "Query params 'collection' and 'slug' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        collection = (
            Collection.objects.filter(pk=col).first() if col.isdigit()
            else Collection.objects.filter(api_uid=col).first()
        )
        if collection is None:
            return Response({"detail": "Unknown collection."}, status=status.HTTP_400_BAD_REQUEST)

        qs = Entry.objects.filter(collection=collection)
        if (exclude := request.query_params.get("exclude")):
            qs = qs.exclude(pk=exclude)

        available = not qs.filter(slug=slug).exists()
        suggestion = slug
        i = 2
        while not available and qs.filter(slug=suggestion).exists():
            suggestion = f"{slug}-{i}"
            i += 1
        return Response({"slug": slug, "available": available, "suggestion": suggestion})

    # ── Publish workflow actions ──────────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        entry = self.get_object()
        try:
            publish_entry(entry, user=request.user)
        except PublishError as exc:
            return Response(
                {"detail": str(exc), "errors": exc.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(EntryReadSerializer(entry, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        entry = self.get_object()
        try:
            unpublish_entry(entry, user=request.user)
        except PublishError as exc:
            return Response(
                {"detail": str(exc), "errors": exc.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(EntryReadSerializer(entry, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        entry = self.get_object()
        copy = duplicate_entry(entry, user=request.user)
        return Response(
            EntryReadSerializer(copy, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


# ── Admin-shell endpoints (dashboard + site config) ───────────────────────────
class DashboardAPIView(APIView):
    """One call for the Dashboard page + sidebar count badges."""

    permission_classes = [CanAuthorEntries]

    def get(self, request):
        entries = Entry.objects.all()
        counts = {
            "collections": Collection.objects.count(),
            "entries": entries.count(),
            "entries_draft": entries.filter(status=Entry.Status.DRAFT).count(),
            "entries_published": entries.filter(status=Entry.Status.PUBLISHED).count(),
            "templates": Template.objects.count(),
            "media_assets": MediaAsset.objects.count(),
            "authors": Author.objects.count(),
            "categories": Category.objects.count(),
            "tags": Tag.objects.count(),
            "badges": Badge.objects.count(),
        }
        recent = admin_entry_queryset().order_by("-updated_at")[:5]
        return Response(
            {
                "counts": counts,
                "recent_entries": EntryListSerializer(
                    recent, many=True, context={"request": request}
                ).data,
            }
        )


class SiteConfigAPIView(APIView):
    """Static shell metadata: the 'flarize.com · production' header, the
    Preview-site link and the ``<site>/blog/{slug}`` slug preview."""

    permission_classes = [CanAuthorEntries]

    def get(self, request):
        return Response(
            {
                "environment": settings.ENVIRONMENT,          # "development" | "production"
                "site_url": settings.FRONTEND_BASE_URL,       # e.g. https://flarize.com
                "blog_path": "/blog",                         # entry URLs: {site_url}{blog_path}/{slug}
                "media_base_url": settings.PUBLIC_MEDIA_BASE_URL,
                "delivery_api_base": "/api",                  # public delivery routes: /api/<collection api_uid>
            }
        )
