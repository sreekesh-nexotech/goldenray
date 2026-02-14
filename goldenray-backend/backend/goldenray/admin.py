from django.contrib import admin
from .models import Battery, SolarInstallationNew, CustomerInstallation

# Register your models here.
admin.site.register(Battery)
admin.site.register(SolarInstallationNew)


@admin.register(CustomerInstallation)
class CustomerInstallationAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'pincode', 'system_size', 'installation_date', 'status')
    list_filter = ('status', 'installation_date', 'pincode')
    search_fields = ('customer_name', 'phone_number', 'pincode', 'address')
    date_hierarchy = 'installation_date'
    ordering = ('-installation_date',)
