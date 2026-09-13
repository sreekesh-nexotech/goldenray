from rest_framework.routers import DefaultRouter

from .views import FaqCategoryViewSet, FaqViewSet

router = DefaultRouter()
router.register("faqs", FaqViewSet, basename="faq")
router.register("faq-categories", FaqCategoryViewSet, basename="faq-category")

urlpatterns = router.urls
