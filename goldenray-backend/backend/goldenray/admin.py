from django.contrib import admin
from .models import Battery, SolarInstallationNew, CustomerInstallation, SolarPanel
from .models.affiliate_application import AffiliateApplication
from .models.warranty_service_request import WarrantyServiceRequest
from .models.job_application import JobApplication

# Register your models here.
admin.site.register(Battery)
admin.site.register(SolarInstallationNew)


@admin.register(AffiliateApplication)
class AffiliateApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'email', 'profession', 'district', 'created_at')
    list_filter = ('profession', 'district', 'created_at')
    search_fields = ('full_name', 'phone', 'email')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(CustomerInstallation)
class CustomerInstallationAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'pincode', 'system_size', 'installation_date', 'status')
    list_filter = ('status', 'installation_date', 'pincode')
    search_fields = ('customer_name', 'phone_number', 'pincode', 'address')
    date_hierarchy = 'installation_date'
    ordering = ('-installation_date',)


@admin.register(WarrantyServiceRequest)
class WarrantyServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'issue_type', 'created_at')
    list_filter = ('issue_type', 'created_at')
    search_fields = ('full_name', 'phone', 'description')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'email', 'phone', 'location', 'created_at')
    list_filter = ('position', 'total_experience', 'notice_period', 'heard_about_us', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'current_company', 'current_role')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(SolarPanel)
class SolarPanelAdmin(admin.ModelAdmin):
    list_display = ('brand', 'name', 'wattage', 'panel_type', 'efficiency', 'kerala_climate_score', 'overall_rating')
    list_filter = ('panel_type', 'technology', 'overall_rating', 'subsidy_eligible', 'bloomberg_tier1')
    search_fields = ('brand', 'name', 'description')
    ordering = ('-kerala_climate_score',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('brand', 'name', 'wattage', 'panel_type', 'technology', 'image_url', 'description')
        }),
        ('Performance Specifications', {
            'fields': ('efficiency', 'temperature_coefficient', 'noct', 'real_output_at_60c')
        }),
        ('Durability', {
            'fields': ('ip_rating', 'wind_load', 'moisture_protection', 'weight', 'bifacial_gain')
        }),
        ('Warranty & Degradation', {
            'fields': ('product_warranty', 'performance_warranty', 'first_year_power_drop', 'annual_degradation', 'output_at_year_25')
        }),
        ('Brand Trust', {
            'fields': ('manufacturing_capacity', 'bloomberg_tier1', 'pvel_top_performer', 'bis_certified', 'independent_audit', 'certifications')
        }),
        ('Pricing & Subsidy', {
            'fields': ('price_range', 'subsidy_eligible')
        }),
        ('Kerala Climate Ratings', {
            'fields': ('kerala_climate_score', 'efficiency_rating', 'heat_performance_rating', 'warranty_rating', 'kerala_climate_rating', 'overall_rating')
        }),
    )

