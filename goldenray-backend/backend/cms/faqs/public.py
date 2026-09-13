"""Public FAQ delivery.

    GET /api/faqs?page=/subsidy
    GET /api/faqs?page=/subsidy&section=residential

Published FAQs only, in display order, with the FAQPage schema for the whole
returned set. Handing the schema back alongside the questions is what keeps
§6.5's "generated from the structured record" promise true end to end — the
frontend embeds what the CMS built rather than assembling its own JSON-LD from
the list and drifting from it.
"""

from django.conf import settings
from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from seo import schema as schema_builders
from sitepages.models import Page

from .models import Faq


class PublicFaqListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # public endpoint, no auth attempted

    def get(self, request):
        route = request.query_params.get("page")
        if not route:
            raise Http404("A 'page' query parameter is required.")

        page = Page.objects.filter(route=route).first()
        if page is None:
            raise Http404(f"Unknown page '{route}'")

        qs = Faq.objects.filter(page=page, status=Faq.Status.PUBLISHED)
        section = request.query_params.get("section")
        if section is not None:
            qs = qs.filter(section=section)
        rows = list(qs.order_by("section", "display_order", "id"))

        site_url = getattr(settings, "FRONTEND_BASE_URL", "")
        return Response(
            {
                "data": [
                    {
                        "id": f.id,
                        "question": f.question,
                        "answer": f.answer,
                        "section": f.section,
                        "category": f.category.name if f.category_id else None,
                        "order": f.display_order,
                    }
                    for f in rows
                ],
                "meta": {
                    "page": {"name": page.name, "route": page.route},
                    "count": len(rows),
                    "schema": schema_builders.faq_page(
                        rows, site_url=site_url, page_url=page.route
                    ),
                },
            }
        )
