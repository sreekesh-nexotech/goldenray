from django.conf import settings
from django.db.models import Count, Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.modules import Action, Module
from accounts.permissions import HasModulePermission, require
from seo import schema as schema_builders

from .models import Page, PageImageSlot, PageSeo, PageTextSlot
from .serializers import (
    PageDetailSerializer,
    PageImageSlotSerializer,
    PageListSerializer,
    PageSeoSerializer,
    PageTextSlotSerializer,
)


class PageViewSet(viewsets.ModelViewSet):
    """Website page maintenance (§6.2).

    Create and delete are deliberately absent: pages are real routes in the
    Next.js app, so a page exists because a developer built it. The Studio
    maintains what is there and never invents a route the site cannot serve.
    """

    permission_classes = [HasModulePermission]
    permission_module = Module.PAGES
    permission_actions = {
        "seo": Action.EDIT,
        "image_slot": Action.EDIT,
        "text_slot": Action.EDIT,
        "preview": Action.VIEW,
    }
    http_method_names = ["get", "patch", "post", "head", "options"]

    #: Narrow the reachable pages. ``None`` means every registered page; the
    #: Career Page surface below pins it to the one route §6.16 hands to HR.
    route_filter: str | None = None

    def get_queryset(self):
        params = self.request.query_params
        qs = Page.objects.select_related("seo").annotate(
            image_slot_count=Count("image_slots", distinct=True),
            faq_count=Count("faqs", filter=~Q(faqs__status="archived"), distinct=True),
        )
        if self.route_filter:
            qs = qs.filter(route=self.route_filter)
        if (st := params.get("status")):
            qs = qs.filter(status=st)
        if (group := params.get("group")):
            qs = qs.filter(group=group)
        if (search := params.get("search")):
            qs = qs.filter(name__icontains=search) | qs.filter(route__icontains=search)
        return qs.distinct()

    def get_serializer_class(self):
        return PageListSerializer if self.action == "list" else PageDetailSerializer

    def perform_update(self, serializer):
        # Taking a page off the site (or putting it back) is a publish decision,
        # not an edit: a maintainer correcting alt text must not be able to
        # 404 the route by flipping ``status``. Everything else in the writable
        # set (sort order) stays an edit.
        new_status = serializer.validated_data.get("status")
        if new_status is not None and new_status != serializer.instance.status:
            if not require(self.request.user, self.permission_module, Action.PUBLISH):
                raise PermissionDenied("Changing a page's status needs the Publish permission.")
        serializer.save(updated_by=self.request.user)

    # ── SEO block ────────────────────────────────────────────────────────────
    @action(detail=True, methods=["get", "patch"])
    def seo(self, request, pk=None):
        """Read or update this page's SEO. Created on first access."""
        page = self.get_object()
        row, _ = PageSeo.objects.get_or_create(page=page)
        if request.method == "GET":
            return Response(PageSeoSerializer(row).data)

        serializer = PageSeoSerializer(row, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)

    # ── Slots ────────────────────────────────────────────────────────────────
    @action(detail=True, methods=["patch"], url_path="image-slots/(?P<slot_id>[^/.]+)")
    def image_slot(self, request, pk=None, slot_id=None):
        """Replace the image in one slot, or change its alt text (§6.2, §6.6)."""
        page = self.get_object()
        try:
            slot = page.image_slots.get(pk=slot_id)
        except PageImageSlot.DoesNotExist:
            return Response({"detail": "No such image slot on this page."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PageImageSlotSerializer(slot, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="text-slots/(?P<slot_id>[^/.]+)")
    def text_slot(self, request, pk=None, slot_id=None):
        """Correct one exposed string (§6.2)."""
        page = self.get_object()
        try:
            slot = page.text_slots.get(pk=slot_id)
        except PageTextSlot.DoesNotExist:
            return Response({"detail": "No such text slot on this page."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PageTextSlotSerializer(slot, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)

    # ── Preview (§6.2 — "preview changes before publishing/approval") ────────
    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):
        page = self.get_object()
        seo_row = getattr(page, "seo", None) or PageSeo(page=page)
        site_url = getattr(settings, "FRONTEND_BASE_URL", "")

        schema_doc = None
        if seo_row.schema_type == "WebPage":
            schema_doc = schema_builders.web_page(seo_row, site_url=site_url)

        return Response(
            {
                "url": f"{site_url.rstrip('/')}{page.route}",
                "title": seo_row.seo_title or page.name,
                "description": seo_row.meta_description,
                "noindex": seo_row.noindex,
                "schema": schema_doc,
                "seo_issues": seo_row.seo_issues(),
                "image_slots": PageImageSlotSerializer(page.image_slots.all(), many=True).data,
                "text_slots": PageTextSlotSerializer(page.text_slots.all(), many=True).data,
            }
        )


class CareerPageViewSet(PageViewSet):
    """The Career Page maintenance surface (§6.16), mounted at ``career-page/``.

    Identical behaviour to ``PageViewSet`` but reachable through the
    ``career_page`` grant and pinned to the ``/career`` route. The Career/HR
    role holds ``career_page`` and *not* ``pages`` — §6.17 keeps that role off
    general website maintenance — so without this second mount the Career Page
    screen 403'd for the one role it was written for.
    """

    permission_module = Module.CAREER_PAGE
    route_filter = "/career"
