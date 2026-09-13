"""Root URL configuration for the Blog CMS service.

Two API surfaces:
  * /api/...        → public, Strapi-shaped delivery (read-only). What the blog
                      frontend consumes. Route slug per collection: /api/<api_uid>.
  * /admin-api/...  → protected authoring API (for a future custom admin UI).
  * /admin/         → Django admin (immediately usable authoring UI).
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

from careers.public import PublicJobPositionDetailView, PublicJobPositionListView
from faqs.public import PublicFaqListView
from sitepages.public import PublicPageContentView

urlpatterns = [
    path("admin/", admin.site.urls),
    # ── Public delivery API ───────────────────────────────────────────────────
    #
    # The Phase 1 routes are declared *before* the collection include: that one
    # ends in a catch-all `<slug:api_uid>`, so anything registered after it is
    # unreachable — /api/faqs would resolve as a collection named "faqs" and
    # 404 instead of serving FAQs.
    path("api/faqs", PublicFaqListView.as_view(), name="public-faqs"),
    path("api/job-positions", PublicJobPositionListView.as_view(), name="public-job-positions"),
    path(
        "api/job-positions/<slug:slug>",
        PublicJobPositionDetailView.as_view(),
        name="public-job-position",
    ),
    path("api/page-content", PublicPageContentView.as_view(), name="public-page-content"),
    # Strapi-compatible collection delivery — the blog frontend hits this.
    path("api/", include("delivery.urls")),
    # ── Authoring API (the Content Studio) ────────────────────────────────────
    path("admin-api/", include("content.urls")),
    path("admin-api/", include("catalog.urls")),
    path("admin-api/", include("media.urls")),
    path("admin-api/auth/", include("accounts.urls")),
    # Phase 1 modules
    path("admin-api/", include("sitepages.urls")),
    path("admin-api/", include("faqs.urls")),
    path("admin-api/", include("careers.urls")),
    path("admin-api/", include("siteconfig.urls")),
    path("admin-api/", include("seo.urls")),
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
