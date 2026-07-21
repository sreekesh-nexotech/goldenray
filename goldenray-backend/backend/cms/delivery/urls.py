from django.urls import path

from .views import CollectionDeliveryView

urlpatterns = [
    # Per-collection route. The frontend hits /api/articles.
    path("<slug:api_uid>", CollectionDeliveryView.as_view(), name="delivery-collection"),
    path("<slug:api_uid>/", CollectionDeliveryView.as_view(), name="delivery-collection-slash"),
]
