from django.contrib import admin

from .models import (
    Author,
    Badge,
    Category,
    Collection,
    Tag,
    Template,
    TemplateAttributeSlot,
    TemplateImageGroup,
)


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("plural_name", "api_uid", "is_active")
    prepopulated_fields = {"api_uid": ("plural_name",)}
    list_filter = ("is_active",)


class TemplateImageGroupInline(admin.TabularInline):
    model = TemplateImageGroup
    extra = 1


class TemplateAttributeSlotInline(admin.TabularInline):
    model = TemplateAttributeSlot
    extra = 1


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("is_active",)
    inlines = [TemplateImageGroupInline, TemplateAttributeSlotInline]


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "role")
    search_fields = ("name",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ("label", "color")
