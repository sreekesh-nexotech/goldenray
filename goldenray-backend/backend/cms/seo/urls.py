from django.urls import path

from .views import SeoOverviewAPIView

urlpatterns = [
    path("seo/overview/", SeoOverviewAPIView.as_view(), name="seo-overview"),
]
