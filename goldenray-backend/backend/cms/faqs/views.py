from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.modules import Action, Module
from accounts.permissions import HasModulePermission
from seo import schema as schema_builders

from .models import Faq, FaqCategory
from .serializers import (
    FaqCategorySerializer,
    FaqListSerializer,
    FaqReorderSerializer,
    FaqSerializer,
)
from .services import (
    FaqWorkflowError,
    archive_faq,
    next_display_order,
    publish_faq,
    reorder_faqs,
    restore_faq,
    unpublish_faq,
)

#: Whitelisted ``?ordering=`` values for the FAQ list screen.
ORDERING_FIELDS = {"question", "status", "display_order", "created_at", "updated_at"}


class FaqCategoryViewSet(viewsets.ModelViewSet):
    """FAQ categories — optional grouping (§6.5)."""

    queryset = FaqCategory.objects.all()
    serializer_class = FaqCategorySerializer
    permission_classes = [HasModulePermission]
    permission_module = Module.FAQS

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        if category.faqs.exists():
            return Response(
                {
                    "detail": (
                        f"{category.faqs.count()} FAQ(s) use this category. "
                        "Deactivate it instead, or move those FAQs first."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class FaqViewSet(viewsets.ModelViewSet):
    """FAQ list, editor and publish workflow (§6.4, §6.5)."""

    permission_classes = [HasModulePermission]
    permission_module = Module.FAQS
    permission_actions = {
        "publish": Action.PUBLISH,
        "unpublish": Action.PUBLISH,
        "archive": Action.ARCHIVE,
        "restore": Action.EDIT,
        "reorder": Action.EDIT,
        "preview": Action.VIEW,
    }

    def get_queryset(self):
        params = self.request.query_params
        qs = Faq.objects.select_related("page", "category", "created_by", "updated_by")

        # Archived FAQs stay out of the working list unless asked for, but a
        # detail or restore call must still be able to reach one.
        if self.action == "list" and params.get("status") != Faq.Status.ARCHIVED:
            if params.get("include_archived", "").lower() not in ("1", "true", "yes"):
                qs = qs.exclude(status=Faq.Status.ARCHIVED)

        if (page := params.get("page_id")):
            qs = qs.filter(page_id=page)
        if (section := params.get("section")) is not None and section != "":
            qs = qs.filter(section=section)
        if (category := params.get("category")):
            qs = qs.filter(category_id=category)
        if (st := params.get("status")):
            qs = qs.filter(status=st)
        if (since := params.get("updated_after")):
            qs = qs.filter(updated_at__gte=since)
        if (search := params.get("search")):
            qs = qs.filter(question__icontains=search) | qs.filter(answer__icontains=search)
        if (ordering := params.get("ordering")):
            if ordering.lstrip("-") in ORDERING_FIELDS:
                qs = qs.order_by(ordering)
        return qs.distinct()

    def get_serializer_class(self):
        return FaqListSerializer if self.action == "list" else FaqSerializer

    def perform_create(self, serializer):
        # New FAQs land at the end of their section rather than colliding on 0.
        page = serializer.validated_data.get("page")
        section = serializer.validated_data.get("section", "")
        order = serializer.validated_data.get("display_order")
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
            display_order=order if order else next_display_order(page.id, section),
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    # ── Workflow ─────────────────────────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        faq = self.get_object()
        try:
            publish_faq(faq, user=request.user)
        except FaqWorkflowError as exc:
            return Response({"detail": str(exc), "errors": exc.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response(FaqSerializer(faq, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        faq = unpublish_faq(self.get_object(), user=request.user)
        return Response(FaqSerializer(faq, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def archive(self, request, pk=None):
        faq = archive_faq(self.get_object(), user=request.user)
        return Response(FaqSerializer(faq, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        faq = restore_faq(self.get_object(), user=request.user)
        return Response(FaqSerializer(faq, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        """Archive rather than delete — §7 keeps content-changing actions reversible."""
        archive_faq(self.get_object(), user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["post"])
    def reorder(self, request):
        """``{page, section, order: [id, ...]}`` — renumber one section atomically."""
        body = FaqReorderSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        rows = reorder_faqs(
            body.validated_data["page"],
            body.validated_data.get("section", ""),
            body.validated_data["order"],
            user=request.user,
        )
        return Response(FaqListSerializer(rows, many=True, context={"request": request}).data)

    # ── Preview (§6.5 — "show how the FAQ will appear on the website") ───────
    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):
        """The FAQ as the site will render it, plus the FAQPage schema it joins.

        The schema is built from the whole published section, not this record
        alone, because that is what actually ends up on the page — previewing
        one question's JSON-LD in isolation would show something the site never
        emits.
        """
        faq = self.get_object()
        siblings = Faq.objects.filter(
            page=faq.page, section=faq.section, status=Faq.Status.PUBLISHED
        )
        # An unpublished FAQ still previews in position, so the author can see
        # where it will land before committing to publishing it.
        if faq.status != Faq.Status.PUBLISHED:
            siblings = list(siblings) + [faq]
            siblings.sort(key=lambda f: (f.display_order, f.id))

        site_url = getattr(settings, "FRONTEND_BASE_URL", "")
        return Response(
            {
                "question": faq.question,
                "answer": faq.answer,
                "page": {"name": faq.page.name, "route": faq.page.route},
                "section": faq.section,
                "position": faq.display_order,
                "url": f"{site_url.rstrip('/')}{faq.page.route}",
                "schema": schema_builders.faq_page(
                    siblings, site_url=site_url, page_url=faq.page.route
                ),
                "seo_issues": faq.seo_issues(),
            }
        )
