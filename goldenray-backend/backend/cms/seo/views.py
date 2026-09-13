"""SEO overview (§6.7, screen 07).

One list answering "where is our SEO incomplete?" across every record type that
has any — pages, FAQs and job positions. It deliberately does not score
anything: §6.7 asks for a simple validity indicator and explicitly rules out an
SEO scoring platform, so a row is ok, warning or error and nothing finer.
"""

from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.modules import Module
from accounts.permissions import HasModulePermission
from careers.models import JobPosition
from faqs.models import Faq
from sitepages.models import PageSeo


def _row(kind: str, label: str, path: str, record, *, record_id: int, status_value: str) -> dict:
    return {
        "kind": kind,
        "id": record_id,
        "label": label,
        "path": path,
        "record_status": status_value,
        "seo_title": record.seo_title,
        "meta_description": record.meta_description,
        "schema_type": record.schema_type,
        "noindex": record.noindex,
        "seo_status": record.seo_status(),
        "issues": record.seo_issues(),
    }


class SeoOverviewAPIView(APIView):
    """Every SEO-bearing record with its validity indicator."""

    permission_classes = [HasModulePermission]
    permission_module = Module.SEO

    def get(self, request):
        kind_filter = request.query_params.get("kind")
        status_filter = request.query_params.get("seo_status")
        rows: list[dict] = []

        if kind_filter in (None, "", "page"):
            for seo_row in PageSeo.objects.select_related("page"):
                rows.append(
                    _row(
                        "page",
                        seo_row.page.name,
                        seo_row.page.route,
                        seo_row,
                        record_id=seo_row.page_id,
                        status_value=seo_row.page.status,
                    )
                )

        if kind_filter in (None, "", "faq"):
            for faq in Faq.objects.select_related("page").exclude(status=Faq.Status.ARCHIVED):
                rows.append(
                    _row(
                        "faq",
                        faq.question[:120],
                        faq.seo_path(),
                        faq,
                        record_id=faq.id,
                        status_value=faq.status,
                    )
                )

        if kind_filter in (None, "", "job"):
            for position in JobPosition.objects.exclude(status=JobPosition.Status.ARCHIVED):
                rows.append(
                    _row(
                        "job",
                        position.title,
                        position.seo_path(),
                        position,
                        record_id=position.id,
                        status_value=position.status,
                    )
                )

        if status_filter:
            rows = [r for r in rows if r["seo_status"] == status_filter]

        # Worst first: an error is what somebody has to act on today.
        severity = {"error": 0, "warning": 1, "ok": 2}
        rows.sort(key=lambda r: (severity.get(r["seo_status"], 3), r["kind"], r["label"]))

        return Response(
            {
                "counts": {
                    "error": sum(1 for r in rows if r["seo_status"] == "error"),
                    "warning": sum(1 for r in rows if r["seo_status"] == "warning"),
                    "ok": sum(1 for r in rows if r["seo_status"] == "ok"),
                },
                "results": rows,
            }
        )
