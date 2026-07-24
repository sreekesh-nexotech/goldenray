from django.contrib import admin
from django.utils.html import format_html

from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("id", "thumb", "file", "collection", "on_cdn", "alternative_text", "width", "height", "created_at")
    list_filter = ("collection",)
    search_fields = ("file", "alternative_text", "caption", "cdn_url")
    readonly_fields = ("cdn_url", "storage_path", "mime", "size", "width", "height", "created_at", "updated_at")

    @admin.display(description="Preview")
    def thumb(self, obj):
        url = obj.cdn_url
        if not url:
            try:
                url = obj.file.url
            except Exception:
                return "—"
        return format_html('<img src="{}" style="height:40px;border-radius:4px" />', url)

    @admin.display(description="CDN", boolean=True)
    def on_cdn(self, obj):
        return bool(obj.cdn_url)
