from rest_framework.routers import DefaultRouter

from .views import CareerPageViewSet, PageViewSet

router = DefaultRouter()
router.register("pages", PageViewSet, basename="page")
# §6.16 — same screen, narrower grant (see CareerPageViewSet).
router.register("career-page", CareerPageViewSet, basename="career-page")

urlpatterns = router.urls
