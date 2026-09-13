from django.conf import settings
from django.utils.text import slugify
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.modules import Action, Module
from accounts.permissions import CanAuthorEntries, HasModulePermission
from careers.models import Department, JobPosition
from catalog.models import Author, Badge, Category, Collection, Tag, Template
from faqs.models import Faq
from media.models import MediaAsset
from sitepages.models import Page, PageSeo

from .models import Entry
from .selectors import admin_entry_queryset
from .serializers import EntryListSerializer, EntryReadSerializer, EntryWriteSerializer
from .services import (
    PublishError,
    duplicate_entry,
    publish_entry,
    restore_entry,
    slug_taken,
    soft_delete_entry,
    unpublish_entry,
)
from .validators import slug_error

# Whitelisted ?ordering= values for the entries list screen.
ORDERING_FIELDS = {
    "title", "slug", "status", "sort_order",
    "created_at", "updated_at", "published_on", "published_at",
}


class EntryViewSet(viewsets.ModelViewSet):
    """Authoring CRUD + publish workflow for blog entries (any collection).

    Gated on the ``blogs`` module (§6.3, §6.17): the sidebar already hid this
    screen from roles without the grant, but the API let any signed-in account
    through. The service layer's legacy ``can_publish`` check still applies on
    top, so an author-level account cannot publish even with the module.
    """

    permission_classes = [HasModulePermission]
    permission_module = Module.BLOGS
    permission_actions = {
        "check_slug": Action.VIEW,
        "publish": Action.PUBLISH,
        "unpublish": Action.PUBLISH,
        "duplicate": Action.CREATE,
        "restore": Action.EDIT,
    }

    def get_queryset(self):
        params = self.request.query_params
        # Deleted entries stay out of the working set unless asked for — but a
        # detail/publish/restore call must still be able to reach one.
        include_deleted = (
            params.get("include_deleted", "").lower() in ("1", "true", "yes")
            or params.get("status") == Entry.Status.DELETED
            or self.action not in ("list",)
        )
        qs = admin_entry_queryset(include_deleted=include_deleted)
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

        "Taken" includes retired slugs still aliased to another entry, and the
        response carries ``valid``/``error`` so the editor can show *why* a
        placeholder or malformed slug will be rejected rather than waiting for
        the save to fail.
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

        exclude = request.query_params.get("exclude") or None
        available = not slug_taken(collection.pk, slug, exclude_entry_pk=exclude)
        suggestion = slug
        i = 2
        while slug_taken(collection.pk, suggestion, exclude_entry_pk=exclude):
            suggestion = f"{slug}-{i}"
            i += 1
        error = slug_error(slug)
        return Response(
            {
                "slug": slug,
                "available": available,
                "suggestion": suggestion,
                "valid": error is None,
                "error": error,
            }
        )

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

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        """Bring a deleted entry back as a draft."""
        entry = self.get_object()
        try:
            restore_entry(entry, user=request.user)
        except PublishError as exc:
            return Response(
                {"detail": str(exc), "errors": exc.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(EntryReadSerializer(entry, context={"request": request}).data)

    # ── Deletion ──────────────────────────────────────────────────────────────
    def destroy(self, request, *args, **kwargs):
        """Soft-delete: same 204 contract as before, but the record survives.

        Callers see no difference; what changes is that the entry keeps its
        slug, its body and its alias rows, so a deliberate takedown stays
        distinguishable from a URL that never existed and stays reversible via
        ``POST /entries/{id}/restore/``. Purging for real is an admin action.
        """
        entry = self.get_object()
        try:
            soft_delete_entry(entry, user=request.user)
        except PublishError as exc:
            return Response(
                {"detail": str(exc), "errors": exc.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Admin-shell endpoints (dashboard + site config) ───────────────────────────
class DashboardAPIView(APIView):
    """One call for the Dashboard page + sidebar count badges.

    Phase 1 (§6.1) widens this from blog counts to "what needs attention":
    published blogs, active jobs, FAQ drafts, pages with SEO problems, and a
    recent-activity feed across content, FAQs and jobs. Lead and application
    counts live on the goldenray service and are fetched by the frontend
    directly — this endpoint answers for what the CMS owns.
    """

    permission_classes = [CanAuthorEntries]

    def get(self, request):
        entries = Entry.objects.all()
        faqs = Faq.objects.exclude(status=Faq.Status.ARCHIVED)
        positions = JobPosition.objects.exclude(status=JobPosition.Status.ARCHIVED)
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
            # Phase 1
            "faqs": faqs.count(),
            "faqs_draft": faqs.filter(status=Faq.Status.DRAFT).count(),
            "faqs_published": faqs.filter(status=Faq.Status.PUBLISHED).count(),
            "positions_active": positions.filter(status=JobPosition.Status.PUBLISHED).count(),
            "positions_draft": positions.filter(status=JobPosition.Status.DRAFT).count(),
            "departments": Department.objects.filter(is_active=True).count(),
            "pages": Page.objects.count(),
            "pages_seo_issues": self._pages_with_seo_issues(),
        }
        recent = admin_entry_queryset().order_by("-updated_at")[:5]
        return Response(
            {
                "counts": counts,
                "recent_entries": EntryListSerializer(
                    recent, many=True, context={"request": request}
                ).data,
                "recent_activity": self._recent_activity(),
            }
        )

    @staticmethod
    def _pages_with_seo_issues() -> int:
        """Pages whose SEO block is missing or reports an error."""
        with_seo = {row.page_id: row for row in PageSeo.objects.select_related("page")}
        total = 0
        for page_id in Page.objects.values_list("id", flat=True):
            row = with_seo.get(page_id)
            if row is None or row.seo_status() == "error":
                total += 1
        return total

    @staticmethod
    def _recent_activity(limit: int = 8) -> list[dict]:
        """The latest content-side changes, newest first (§6.1)."""

        def who(obj):
            user = getattr(obj, "updated_by", None) or getattr(obj, "created_by", None)
            if not user:
                return None
            return " ".join(filter(None, [user.first_name, user.last_name])) or user.username

        items = []
        for faq in Faq.objects.select_related("page", "updated_by", "created_by").order_by("-updated_at")[:limit]:
            items.append(
                {
                    "kind": "faq",
                    "label": faq.question[:100],
                    "detail": f"{faq.get_status_display()} · {faq.page.name}",
                    "href": f"/studio/faqs/{faq.id}",
                    "actor": who(faq),
                    "at": faq.updated_at,
                }
            )
        for pos in JobPosition.objects.select_related("department", "updated_by", "created_by").order_by("-updated_at")[:limit]:
            items.append(
                {
                    "kind": "job",
                    "label": pos.title,
                    "detail": f"{pos.get_status_display()} · {pos.department.name}",
                    "href": f"/studio/careers/positions/{pos.id}",
                    "actor": who(pos),
                    "at": pos.updated_at,
                }
            )
        for entry in admin_entry_queryset().select_related("updated_by", "created_by").order_by("-updated_at")[:limit]:
            items.append(
                {
                    "kind": "blog",
                    "label": entry.title,
                    "detail": f"{entry.get_status_display()} · {entry.collection.plural_name}",
                    "href": f"/studio/entries/{entry.id}",
                    "actor": who(entry),
                    "at": entry.updated_at,
                }
            )
        items.sort(key=lambda i: i["at"], reverse=True)
        return items[:limit]


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
