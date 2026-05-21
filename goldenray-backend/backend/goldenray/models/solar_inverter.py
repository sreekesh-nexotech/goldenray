from django.db import models


class SolarInverter(models.Model):
    INVERTER_TYPE_CHOICES = [
        ('string', 'String Inverter'),
        ('hybrid', 'Hybrid Inverter'),
        ('microinverter', 'Microinverter'),
        ('optimized-string', 'Optimized String'),
    ]

    RATING_TIER_CHOICES = [
        ('premium', 'Premium'),
        ('mid-range', 'Mid-Range'),
        ('value', 'Value'),
    ]

    OVERALL_RATING_CHOICES = [
        ('excellent', 'Excellent'),
        ('very-good', 'Very Good'),
        ('good', 'Good'),
    ]

    # Basic Information
    brand = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    inverter_type = models.CharField(max_length=30, choices=INVERTER_TYPE_CHOICES)
    rating_tier = models.CharField(max_length=20, choices=RATING_TIER_CHOICES, default='mid-range')
    image_url = models.URLField(max_length=500, blank=True)
    description = models.TextField()

    # The Basics
    rated_output_power = models.IntegerField()  # Watts (AC)
    maximum_dc_input = models.IntegerField()  # Watts
    mppt_trackers = models.IntegerField(default=2)
    maximum_dc_voltage = models.IntegerField()  # Volts
    maximum_input_current = models.CharField(max_length=50)  # e.g., "16 A per MPPT"
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # kg
    display = models.CharField(max_length=100, default='LED + Mobile App')
    suitable_system_size = models.CharField(max_length=100, blank=True)  # e.g., "Ideal for 5-6 kW homes"

    # Performance & Efficiency
    maximum_efficiency = models.DecimalField(max_digits=5, decimal_places=2)  # percentage
    european_efficiency = models.DecimalField(max_digits=5, decimal_places=2)  # percentage
    mppt_efficiency = models.DecimalField(max_digits=5, decimal_places=2)  # percentage
    dc_oversizing = models.IntegerField()  # percentage
    ac_overloading = models.IntegerField()  # percentage
    pid_protection = models.BooleanField(default=True)
    iv_curve_scanning = models.CharField(max_length=100, default='Basic')  # e.g., "Advanced diagnostics" / "Not available"

    # Durability
    ip_rating = models.CharField(max_length=10, default='IP65')
    corrosion_protection = models.CharField(max_length=100, default='Standard coating')  # e.g., "C5 Rated (Coastal protection)"
    operating_temperature = models.CharField(max_length=50, default='-25°C to 60°C')
    cooling = models.CharField(max_length=100, default='Natural convection')
    noise_level = models.CharField(max_length=50, default='<30 dB')

    # Safety Features
    dc_surge_protection = models.CharField(max_length=50, default='Built-in')  # "Built-in" / "Optional"
    ac_surge_protection = models.CharField(max_length=50, default='Built-in')
    arc_fault_detection = models.CharField(max_length=50, default='Built-in')  # AFCI
    grid_protection = models.BooleanField(default=True)

    # Monitoring & Software
    monitoring_app = models.CharField(max_length=100, default='Mobile App')
    real_time_monitoring = models.BooleanField(default=True)
    remote_diagnostics = models.CharField(max_length=100, default='Basic alerts')  # e.g., "Advanced IV Scan"
    firmware_updates = models.CharField(max_length=100, default='OTA Updates')
    connectivity = models.CharField(max_length=100, default='WiFi / Ethernet')

    # Warranty & Brand Trust
    warranty_years = models.IntegerField()  # standard warranty years
    extendable_warranty_years = models.IntegerField(null=True, blank=True)  # e.g., 25 if extendable
    certifications = models.JSONField(default=list)  # ["IEC 62109", "CE", "BIS", ...]
    brand_trust = models.CharField(max_length=50, default='Available')  # text/label
    year_founded = models.IntegerField(null=True, blank=True)
    countries_served = models.CharField(max_length=50, blank=True)  # e.g., "100+ Countries"
    global_installations = models.CharField(max_length=50, blank=True)  # e.g., "269+ GW"

    # Pricing
    price_range = models.CharField(max_length=100)  # e.g., "₹₹₹" or "₹45,000 - ₹60,000"

    # Kerala Climate Specific
    kerala_climate_score = models.IntegerField()  # 0-100

    # Ratings (0-100 scale) — drive progress bars on the card
    efficiency_rating = models.IntegerField()
    reliability_rating = models.IntegerField()
    warranty_rating = models.IntegerField()
    kerala_climate_rating = models.IntegerField()

    # Overall Rating
    overall_rating = models.CharField(max_length=20, choices=OVERALL_RATING_CHOICES)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'solar_inverters'
        ordering = ['-kerala_climate_score']

    def __str__(self):
        return f"{self.brand} {self.name}"
