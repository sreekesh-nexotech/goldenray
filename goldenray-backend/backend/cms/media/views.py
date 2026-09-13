from rest_framework import mixins, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from accounts.modules import Module
from accounts.permissions import HasModulePermission

from .models import MediaAsset
from .serializers import MediaAssetSerializer


class MediaAssetViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """Upload / list / edit metadata / delete media assets (authoring API).

    PATCH is for metadata (alternative_text, caption, collection) — the file
    itself is immutable; replace an image by uploading a new asset.
    """

    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    # The shared Media mechanism (§6.6, §7): every role that replaces images
    # holds this module, and nobody else reaches the library.
    permission_classes = [HasModulePermission]
    permission_module = Module.MEDIA
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = MediaAsset.objects.all()
        params = self.request.query_params
        if (col := params.get("collection")):
            qs = qs.filter(collection__api_uid=col) if not col.isdigit() else qs.filter(collection_id=col)
        if (search := params.get("search")):
            qs = qs.filter(file__icontains=search) | qs.filter(alternative_text__icontains=search)
        return qs.distinct()
