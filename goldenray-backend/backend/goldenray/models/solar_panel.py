from django.db import models


class SolarPanel(models.Model):
    PANEL_TYPE_CHOICES = [
        ('monocrystalline', 'Monocrystalline'),
        ('polycrystalline', 'Polycrystalline'),
        ('bifacial', 'Bifacial'),
    ]

    TECHNOLOGY_CHOICES = [
        ('n-type-topcon', 'N-Type TOPCon'),
        ('p-type-perc', 'P-Type PERC'),
        ('hjt', 'HJT'),
        ('ibc', 'IBC'),
    ]

    RATING_CHOICES = [
        ('excellent', 'Excellent'),
        ('very-good', 'Very Good'),
        ('good', 'Good'),
    ]

    # Basic Information
    brand = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    wattage = models.IntegerField()  # in Wp
    panel_type = models.CharField(max_length=50, choices=PANEL_TYPE_CHOICES)
    technology = models.CharField(max_length=50, choices=TECHNOLOGY_CHOICES)
    image_url = models.URLField(max_length=500)
    description = models.TextField()

    # Performance Specifications
    efficiency = models.DecimalField(max_digits=4, decimal_places=2)  # percentage
    temperature_coefficient = models.DecimalField(max_digits=4, decimal_places=2)  # %/°C (negative value)
    noct = models.IntegerField()  # Normal Operating Cell Temperature in °C
    real_output_at_60c = models.IntegerField()  # percentage of rated output

    # Durability Specifications
    ip_rating = models.CharField(max_length=10, default="IP67")
    wind_load = models.IntegerField()  # in Pa (Pascals)
    moisture_protection = models.CharField(max_length=50)

    # Construction
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # in kg
    bifacial_gain = models.IntegerField(null=True, blank=True)  # percentage, null if not bifacial

    # Warranty & Degradation
    product_warranty = models.IntegerField()  # years
    performance_warranty = models.IntegerField()  # years
    first_year_power_drop = models.DecimalField(max_digits=4, decimal_places=2)  # percentage
    annual_degradation = models.DecimalField(max_digits=4, decimal_places=2)  # percentage
    output_at_year_25 = models.DecimalField(max_digits=5, decimal_places=2)  # percentage of original

    # Brand Trust & Certifications
    manufacturing_capacity = models.CharField(max_length=50)  # e.g., "12 GW"
    bloomberg_tier1 = models.BooleanField(default=False)
    pvel_top_performer = models.BooleanField(default=False)
    bis_certified = models.BooleanField(default=True)
    independent_audit = models.BooleanField(default=False)
    certifications = models.JSONField(default=list)  # Array of certification names

    # Pricing
    price_range = models.CharField(max_length=100)  # e.g., "₹25,000 - ₹30,000"

    # DCR (Domestic Content Requirement) for subsidy
    subsidy_eligible = models.BooleanField(default=True)

    # Kerala Climate Specific
    kerala_climate_score = models.IntegerField()  # 0-100

    # Ratings (0-100 scale)
    efficiency_rating = models.IntegerField()
    heat_performance_rating = models.IntegerField()
    warranty_rating = models.IntegerField()
    kerala_climate_rating = models.IntegerField()

    # Overall Rating
    overall_rating = models.CharField(max_length=20, choices=RATING_CHOICES)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "solar_panels"
        ordering = ['-kerala_climate_score']

    def __str__(self):
        return f"{self.brand} {self.name} - {self.wattage}Wp"
