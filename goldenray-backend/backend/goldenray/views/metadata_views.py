from rest_framework import viewsets
from ..models.metadata import Metadata
from ..serializers.metadata_serializer import MetadataSerializer

class MetadataViewSet(viewsets.ModelViewSet):
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer 