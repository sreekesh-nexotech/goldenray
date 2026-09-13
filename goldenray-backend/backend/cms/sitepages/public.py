"""Public page-maintenance delivery.

    GET /api/page-content?route=/career

Returns the maintained values for one page: the image slots an admin has
replaced, the exposed strings they have corrected, and the page's SEO. The
frontend merges this over its own built-in defaults, which is why an unset slot
returns ``null`` rather than a placeholder — "nobody has replaced this yet"
must stay distinguishable from "this was replaced with nothing", or the page
loses its shipped image the first time someone opens the maintenance screen.
"""

from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Page


class PublicPageContentView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        route = request.query_params.get("route")
        if not route:
            raise Http404("A 'route' query parameter is required.")

        page = (
            Page.objects.filter(route=route, status=Page.Status.PUBLISHED)
            .select_related("seo")
            .prefetch_related("image_slots__asset", "text_slots")
            .first()
        )
        if page is None:
            raise Http404(f"Unknown page '{route}'")

        seo = getattr(page, "seo", None)
        return Response(
            {
                "data": {
                    "route": page.route,
                    "name": page.name,
                    "images": {
                        slot.key: (
                            {
                                "url": slot.asset.cdn_url or slot.asset.file.url,
                                "alt": slot.effective_alt,
                                "width": slot.asset.width,
                                "height": slot.asset.height,
                            }
                            if slot.asset_id
                            else None
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
                        }
                        if seo
                        else None
                    ),
                }
            }
        )
