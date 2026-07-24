from django.conf import settings
from rest_framework import serializers

from .models import MediaAsset


def absolute_media_url(url: str | None) -> str | None:
    """Turn a stored file URL into a fully-qualified URL for the delivery API.

    The frontend already prefixes relative URLs with its host, but we emit
    absolute URLs so images resolve regardless of where the blog is served.
    """
    if not url:
        return None
    if url.startswith("http://") or url.startswith("https://"):
        return url
    return f"{settings.PUBLIC_MEDIA_BASE_URL}{url}"


class MediaAssetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = (
            "id",
            "file",
            "collection",
            "url",
            "cdn_url",
            "mime",
            "size",
            "width",
            "height",
            "alternative_text",
            "caption",
            "created_at",
        )
        read_only_fields = ("cdn_url", "mime", "size", "width", "height", "created_at")

    def update(self, instance, validated_data):
        # The file is immutable after upload (CDN path is derived from it) —
        # metadata only. Replacing an image means uploading a new asset.
        validated_data.pop("file", None)
        return super().update(instance, validated_data)

    def get_url(self, obj):
        # CDN copy wins; local file is the fallback.
        if obj.cdn_url:
            return obj.cdn_url
        try:
            return absolute_media_url(obj.file.url)
        except ValueError:
            return None
