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

urlpatterns = [
    path("admin/", admin.site.urls),
    # Public delivery API (Strapi-compatible) — the blog frontend hits this.
    path("api/", include("delivery.urls")),
    # Authoring API for a future custom admin front-end.
    path("admin-api/", include("content.urls")),
    path("admin-api/", include("catalog.urls")),
    path("admin-api/", include("media.urls")),
    path("admin-api/auth/", include("accounts.urls")),
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
