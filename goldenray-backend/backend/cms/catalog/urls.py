from rest_framework.routers import DefaultRouter

from .views import (
    AuthorViewSet,
    BadgeViewSet,
    CategoryViewSet,
    CollectionViewSet,
    TagViewSet,
    TemplateAttributeSlotViewSet,
    TemplateImageGroupViewSet,
    TemplateViewSet,
)

router = DefaultRouter()
router.register("collections", CollectionViewSet, basename="collection")
router.register("templates", TemplateViewSet, basename="template")
router.register("template-image-groups", TemplateImageGroupViewSet, basename="template-image-group")
router.register("template-attribute-slots", TemplateAttributeSlotViewSet, basename="template-attribute-slot")
router.register("authors", AuthorViewSet, basename="author")
router.register("categories", CategoryViewSet, basename="category")
router.register("tags", TagViewSet, basename="tag")
router.register("badges", BadgeViewSet, basename="badge")

urlpatterns = router.urls
