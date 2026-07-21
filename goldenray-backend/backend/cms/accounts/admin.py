from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AdminUser


@admin.register(AdminUser)
class AdminUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
    fieldsets = UserAdmin.fieldsets + (("Blog CMS", {"fields": ("role",)}),)
