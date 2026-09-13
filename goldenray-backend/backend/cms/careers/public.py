"""Public careers delivery.

    GET /api/job-positions            → the Open Positions list
    GET /api/job-positions/<slug>     → one posting + JobPosting schema

§6.11 requires that only active jobs reach the public Open Positions section,
so the list serves ``PUBLISHED`` alone. The detail route also answers for a
``CLOSED`` posting, flagged ``is_open: false``, so the job page can say "this
position is no longer accepting applications" instead of vanishing from a link
somebody bookmarked. Drafts and archived postings 404 — they were never, or are
no longer, public.
"""

from django.conf import settings
from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from seo import schema as schema_builders
from siteconfig.models import SiteSettings

from .models import Department, JobPosition


def _lines(value: str) -> list[str]:
    """Split a one-per-line textarea into a list, dropping blanks."""
    return [line.strip() for line in (value or "").splitlines() if line.strip()]


def _card(position: JobPosition) -> dict:
    return {
        "id": position.id,
        "slug": position.slug,
        "title": position.title,
        "department": position.department.name if position.department_id else None,
        "location": position.location,
        "employment_type": position.get_employment_type_display(),
        "experience_required": position.experience_required,
        "application_deadline": (
            position.application_deadline.isoformat() if position.application_deadline else None
        ),
        "published_at": position.published_at.isoformat() if position.published_at else None,
        "is_open": position.is_open,
    }


class PublicJobPositionListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        qs = JobPosition.objects.filter(status=JobPosition.Status.PUBLISHED).select_related("department")
        if (dept := request.query_params.get("department")):
            qs = qs.filter(department__slug=dept)

        rows = list(qs)
        settings_row = SiteSettings.load()
        return Response(
            {
                "data": [_card(p) for p in rows],
                "meta": {
                    "count": len(rows),
                    "departments": [
                        {"name": d.name, "slug": d.slug}
                        for d in Department.objects.filter(is_active=True, positions__status=JobPosition.Status.PUBLISHED).distinct()
                    ],
                    "accepting_general_applications": settings_row.careers_accepting_general_applications,
                    "intro": settings_row.careers_intro,
                },
            }
        )


class PublicJobPositionDetailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, slug: str):
        position = (
            JobPosition.objects.filter(
                slug=slug, status__in=(JobPosition.Status.PUBLISHED, JobPosition.Status.CLOSED)
            )
            .select_related("department")
            .first()
        )
        if position is None:
            raise Http404("This position does not exist.")

        site_url = getattr(settings, "FRONTEND_BASE_URL", "")
        settings_row = SiteSettings.load()
        return Response(
            {
                "data": {
                    **_card(position),
                    "description": position.description,
                    "responsibilities": _lines(position.responsibilities),
                    "requirements": _lines(position.requirements),
                    "benefits": _lines(position.benefits),
                    "application_instructions": position.application_instructions,
                    "seo": {
                        "title": position.seo_title or position.title,
                        "description": position.meta_description,
                        "canonical_url": position.canonical_url,
                        "noindex": position.noindex,
                    },
                },
                "meta": {
                    "schema": schema_builders.job_posting(
                        position, site_url=site_url, organisation=settings_row.company_name
                    ),
                },
            }
        )
