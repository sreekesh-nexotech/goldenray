from django.contrib import admin, messages

from .models import ContentBlock, Entry, EntryAttributeValue, EntryImage, Seo
from .services import PublishError, duplicate_entry, publish_entry, unpublish_entry


class ContentBlockInline(admin.StackedInline):
    model = ContentBlock
    extra = 1
    fields = ("order", "component", "body")


class EntryImageInline(admin.TabularInline):
    model = EntryImage
    extra = 1
    fields = ("group_key", "position", "media_asset", "external_url")


class EntryAttributeValueInline(admin.TabularInline):
    model = EntryAttributeValue
    extra = 1
    fields = ("slot_key", "value")


class SeoInline(admin.StackedInline):
    model = Seo
    extra = 0
    can_delete = True


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ("title", "collection", "status", "is_featured", "published_on", "updated_at")
    list_filter = ("collection", "status", "is_featured", "template", "categories")
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ()
    filter_horizontal = ("categories", "tags", "badges")
    readonly_fields = ("document_id", "published_at", "created_at", "updated_at")
    inlines = [ContentBlockInline, EntryImageInline, EntryAttributeValueInline, SeoInline]
    actions = ("action_publish", "action_unpublish", "action_duplicate")
    fieldsets = (
        (None, {"fields": ("collection", "template", "title", "slug", "excerpt")}),
        ("Body", {"fields": ("summary", "introduction", "warning", "insights")}),
        ("Card / meta", {"fields": ("read_time", "is_featured", "sort_order", "published_on")}),
        ("Relations", {"fields": ("author", "categories", "tags", "badges", "cover_image")}),
        ("Publish", {"fields": ("status", "published_at")}),
        ("Audit", {"fields": ("document_id", "created_by", "updated_by", "created_at", "updated_at")}),
    )

    def save_model(self, request, obj, form, change):
        if not change and not obj.created_by_id:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

    @admin.action(description="Publish selected entries")
    def action_publish(self, request, queryset):
        ok = 0
        for entry in queryset:
            try:
                publish_entry(entry, user=request.user)
                ok += 1
            except PublishError as exc:
                self.message_user(request, f"{entry.title}: {exc}", level=messages.ERROR)
        if ok:
            self.message_user(request, f"Published {ok} entr{'y' if ok == 1 else 'ies'}.")

    @admin.action(description="Unpublish selected entries")
    def action_unpublish(self, request, queryset):
        for entry in queryset:
            try:
                unpublish_entry(entry, user=request.user)
            except PublishError as exc:
                self.message_user(request, f"{entry.title}: {exc}", level=messages.ERROR)

    @admin.action(description="Duplicate selected entries (as drafts)")
    def action_duplicate(self, request, queryset):
        for entry in queryset:
            duplicate_entry(entry, user=request.user)
        self.message_user(request, f"Duplicated {queryset.count()} entr{'y' if queryset.count() == 1 else 'ies'}.")
