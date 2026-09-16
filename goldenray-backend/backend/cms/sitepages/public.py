"""Public page-maintenance delivery.

    GET /api/page-content?route=/career

Returns the maintained values for one page: the image slots an admin has
replaced, the exposed strings they have corrected, and the page's SEO. The
frontend merges this over its own built-in defaults, which is why an unset slot
returns ``null`` rather than a placeholder — "nobody has replaced this yet"
must stay distinguishable from "this was replaced with nothing", or the page
loses its shipped image the first time someone opens the maintenance screen.
"""

from django.conf import settings
from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from seo import schema as schema_builders
from siteconfig.models import SiteSettings

from .models import Page


def _asset_payload(asset) -> dict:
    return {
        "url": asset.cdn_url or asset.file.url,
        "alt": asset.alternative_text,
        "width": asset.width,
        "height": asset.height,
    }


class PublicPageContentView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        route = request.query_params.get("route")
        if not route:
            raise Http404("A 'route' query parameter is required.")

        page = (
            Page.objects.filter(route=route, status=Page.Status.PUBLISHED)
            .select_related("seo", "seo__og_image")
            .prefetch_related("image_slots__asset", "text_slots")
            .first()
        )
        if page is None:
            raise Http404(f"Unknown page '{route}'")

        seo = getattr(page, "seo", None)
        # The JSON-LD is generated here from the record, never typed (§6.7), so
        # the site embeds it verbatim and the Studio's preview shows the same doc.
        schema_doc = None
        if seo and seo.schema_type == "WebPage":
            schema_doc = schema_builders.web_page(
                seo,
                site_url=getattr(settings, "FRONTEND_BASE_URL", ""),
                organisation=SiteSettings.load().company_name,
            )
        return Response(
            {
                "data": {
                    "route": page.route,
                    "name": page.name,
                    "images": {
                        slot.key: (
                            {**_asset_payload(slot.asset), "alt": slot.effective_alt} if slot.asset_id else None
                        )
                        for slot in page.image_slots.all()
                    },
                    "text": {slot.key: slot.value for slot in page.text_slots.all() if slot.value},
                    "seo": (
                        {
                            "title": seo.seo_title,
                            "description": seo.meta_description,
                            "canonical_url": seo.canonical_url,
                            "noindex": seo.noindex,
                            "og_image": _asset_payload(seo.og_image) if seo.og_image_id else None,
                            "schema": schema_doc,
                        }
                        if seo
                        else None
                    ),
                }
            }
        )
