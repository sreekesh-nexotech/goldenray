"""Seed the canonical solar panel comparison set.

Specs verified 9 Sep 2026 against manufacturer datasheets. See
SOLAR_PANEL_COMPARISON.md at the repo root for the full audit trail, sources
and the change log behind this revision.

Field provenance
----------------
Datasheet-verified for every panel: efficiency, temperature_coefficient,
product_warranty, performance_warranty, and (where the sheet prints a linear
warranty chart) first_year_power_drop / annual_degradation.

Derived, not from datasheets:
  * real_output_at_60c = round(100 + temperature_coefficient * 35), i.e. the
    STC-to-60C loss. Previously these were hand-picked and inconsistent.
  * output_at_year_25 = 100 - first_year_power_drop - annual_degradation * 24.
    NOTE: this field holds a genuine YEAR-25 figure. The previous revision
    stored end-of-warranty (year-30) values here, which made the
    RecommendationSection copy ("...% output even after 25 years") overstate
    retention. End-of-warranty figures live in SOLAR_PANEL_COMPARISON.md.
  * efficiency_rating = round(efficiency / 23.0 * 100)
  * heat_performance_rating / warranty_rating / kerala_climate_rating =
    the 5-point Heat / Warranty / Kerala Weather Fit scores from the comparison
    document, x20. kerala_climate_score mirrors kerala_climate_rating.

Marked "# UNVERIFIED" inline: values carried over from the previous seed or
estimated because the datasheet is image-only. price_range in particular is
NOT verified for any panel and should be replaced with real dealer pricing
before it is shown to customers.
"""

from django.core.management.base import BaseCommand

from goldenray.models import SolarPanel


class Command(BaseCommand):
    help = "Populate the database with the verified solar panel comparison set"

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-prune",
            action="store_true",
            help="Keep panels already in the database that are absent from this seed set.",
        )

    def handle(self, *args, **options):
        panels_data = [
            {
                # PAN-001 | Waaree Ahnay Bi-55-550 (P-type Mono PERC bifacial)
                # Datasheet: WEL/E&PD/520-550/144/MPB/HC/12/03.01.2025
                'brand': 'Waaree',
                'name': 'Ahnay Bi-55-550',
                'wattage': 550,
                'panel_type': 'bifacial',
                'technology': 'p-type-perc',
                'image_url': '/frame (5).png',
                'description': (
                    "Waaree's established P-type Mono PERC bifacial panel in framed dual glass. "
                    "Rated for 5400 Pa snow and 2400 Pa wind with an IP68 split junction box, and "
                    "backed by India's largest module manufacturer. Its -0.34%/C temperature "
                    "coefficient and 82.05% year-30 retention now trail Waaree's own N-type ELITE "
                    "line, so choose this one on price and track record rather than heat performance."
                ),
                'efficiency': 21.36,
                'temperature_coefficient': -0.34,
                'noct': 43,
                'real_output_at_60c': 88,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.5,
                'bifacial_gain': 15,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 2.0,
                'annual_degradation': 0.55,
                'output_at_year_25': 84.80,
                'manufacturing_capacity': '12 GW',
                'bloomberg_tier1': True,
                'pvel_top_performer': True,
                'bis_certified': True,
                'independent_audit': True,
                'certifications': [
                    'ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018',
                    'Black & Veatch assessed',
                ],
                'price_range': '₹28,000 - ₹32,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 96,
                'efficiency_rating': 93,
                'heat_performance_rating': 86,
                'warranty_rating': 96,
                'kerala_climate_rating': 96,
                'overall_rating': 'excellent',
            },
            {
                # PAN-002 | Adani ELAN SHINE TOPCon ASB-M10-144-555 (G2TB)
                # Temp. coefficient -0.32%/C per ENF directory listing for this
                # series. Adani's own Shine-TOPCon-G2TB URL currently serves a
                # P-type PERC sheet, so the manufacturer PDF could not confirm it.
                # The previous seed's -0.26%/C was wrong.
                'brand': 'Adani Solar',
                'name': 'ELAN SHINE TOPCon ASB-M10-144-555',
                'wattage': 555,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "N-type TOPCon bifacial module on a transparent backsheet, built by India's "
                    "first fully integrated solar manufacturer. Zero light-induced degradation, "
                    "80 +/- 5% bifaciality and a 30-year linear warranty holding 87.4% at year 30. "
                    "A strong all-rounder for Kerala rooftops with a wide service network."
                ),
                'efficiency': 21.50,
                'temperature_coefficient': -0.32,
                'noct': 45,
                'real_output_at_60c': 89,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Very Good',
                'weight': 27.0,
                'bifacial_gain': 20,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,
                'annual_degradation': 0.40,
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '3.5 GW',  # UNVERIFIED
                'bloomberg_tier1': True,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': True,
                'certifications': [
                    'IEC 61215', 'IEC 61730', 'UL 61730', 'IEC 61853-1', 'BIS',
                ],
                'price_range': '₹30,000 - ₹35,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 96,
                'efficiency_rating': 93,
                'heat_performance_rating': 90,
                'warranty_rating': 96,
                'kerala_climate_rating': 96,
                'overall_rating': 'excellent',
            },
            {
                # PAN-003 | G-Star GSD7S72T-575WT
                # NOT a Tata Power Solar panel. The datasheet is issued by G-Star
                # (gstarsolar.com, doc version GS-202406) and ENF lists the series
                # under G-STAR; ComparePV mis-attributes it to Tata. Tata's real
                # glass-glass bifacial is TP600LG10B, seeded separately below.
                'brand': 'G-Star Solar',
                'name': 'GSD7S72T-575WT',
                'wattage': 575,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "The longest product warranty in this comparison at 25 years, paired with a "
                    "30-year linear power warranty holding 87.40%. N-type TOPCon in 2 mm + 2 mm "
                    "dual glass with 16 busbars and 80 +/- 5% bifaciality, rated 5400 Pa front. "
                    "Excellent paper specs, but G-Star has limited service presence in India - "
                    "weigh that against the warranty length."
                ),
                'efficiency': 22.26,
                'temperature_coefficient': -0.30,
                'noct': 43,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.0,
                'bifacial_gain': 15,
                'product_warranty': 25,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,
                'annual_degradation': 0.40,
                'output_at_year_25': 89.40,
                'manufacturing_capacity': 'Not disclosed',
                'bloomberg_tier1': False,
                'pvel_top_performer': False,
                'bis_certified': False,
                'independent_audit': False,
                'certifications': [
                    'IEC 61215', 'IEC 61730', 'UL 61730', 'ISO 9001:2015',
                    'ISO 14001:2015', 'ISO 45001:2018',
                ],
                'price_range': '₹30,000 - ₹34,000',  # UNVERIFIED
                'subsidy_eligible': False,
                'kerala_climate_score': 94,
                'efficiency_rating': 97,
                'heat_performance_rating': 96,
                'warranty_rating': 100,
                'kerala_climate_rating': 94,
                'overall_rating': 'very-good',
            },
            {
                # PAN-004 | Vikram Solar PARADEA VSMDH.72.550.05
                # Datasheet VSL/ENG/SC/331-V00/STD covers AAA = 540-565.
                'brand': 'Vikram Solar',
                'name': 'PARADEA VSMDH.72.550.05',
                'wattage': 550,
                'panel_type': 'bifacial',
                'technology': 'p-type-perc',
                'image_url': '/frame (5).png',
                'description': (
                    "PVEL Top Performer glass-glass bifacial module with an integrated blocking "
                    "diode that guards against reverse current, plus tested resistance to salt "
                    "mist, ammonia and sand - useful on Kerala's coast. Passed 45 mm hail at "
                    "27 m/s. P-type PERC, so heat tolerance trails the N-type options here."
                ),
                'efficiency': 21.29,
                'temperature_coefficient': -0.35,  # UNVERIFIED (thermal block is image-only)
                'noct': 45,
                'real_output_at_60c': 88,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.0,  # UNVERIFIED
                'bifacial_gain': 25,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 2.0,
                'annual_degradation': 0.50,
                'output_at_year_25': 86.00,
                'manufacturing_capacity': '4.5 GW',  # UNVERIFIED
                'bloomberg_tier1': True,
                'pvel_top_performer': True,
                'bis_certified': True,
                'independent_audit': True,
                'certifications': [
                    'IEC 61701', 'IEC 62716', 'IEC 60068-2-68', 'IS/IEC 61730',
                    'IS 14286', 'CAN-CSA', 'ISO 9001:2015', 'ISO 14001:2015',
                    'ISO 45001:2018', 'SA 8000:2014',
                ],
                'price_range': '₹27,000 - ₹31,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 90,
                'efficiency_rating': 93,
                'heat_performance_rating': 82,
                'warranty_rating': 90,
                'kerala_climate_rating': 90,
                'overall_rating': 'very-good',
            },
            {
                # PAN-005 | RenewSys DESERV Extreme 144X-565
                # Datasheet EX-144 | AUGUST 2024 | 5 (covers 565-600 Wp).
                # Datasheet prints -0.2915%/C; the model column stores 2 decimals.
                'brand': 'RenewSys',
                'name': 'DESERV Extreme 144X-565',
                'wattage': 565,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "N-type TOPCon bifacial in dual glass from India's most vertically integrated "
                    "manufacturer - RenewSys makes its own encapsulants and backsheets. The "
                    "-0.2915%/C temperature coefficient is the best in this set, and the line is "
                    "independently audited by SOLARBUYER with ALMM listing for subsidy work."
                ),
                'efficiency': 21.90,
                'temperature_coefficient': -0.29,
                'noct': 45,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.0,  # UNVERIFIED
                'bifacial_gain': 10,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,   # UNVERIFIED (chart is image-only)
                'annual_degradation': 0.40,     # UNVERIFIED (chart is image-only)
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '1.5 GW',  # UNVERIFIED
                'bloomberg_tier1': False,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': True,
                'certifications': [
                    'IEC TS 62804-1', 'IEC 61853-1', 'IEC 61853-2',
                    'ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 45001:2018',
                    'ALMM', 'BIS R-63000760',
                ],
                'price_range': '₹29,000 - ₹33,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 94,
                'efficiency_rating': 95,
                'heat_performance_rating': 96,
                'warranty_rating': 96,
                'kerala_climate_rating': 94,
                'overall_rating': 'very-good',
            },
            {
                # PAN-006 | Premier Energies PE-560 THGB 144
                # NOTE: ENF flags this exact model as no longer manufactured.
                # Current equivalents: PE 560-590 THGB 144, and a 132-cell
                # 600-630 W TOPCon module. Review before quoting it to customers.
                'brand': 'Premier Energies',
                'name': 'PE-560 THGB 144',
                'wattage': 560,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "N-type TOPCon bifacial in dual glass from Hyderabad, using SMBB cell "
                    "interconnection for lower resistive loss and strong anti-PID performance. "
                    "Premier is integrated from cell to module, which keeps pricing competitive. "
                    "Confirm current stock - this exact model number is being superseded."
                ),
                'efficiency': 21.68,
                'temperature_coefficient': -0.30,
                'noct': 45,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Very Good',
                'weight': 34.0,
                'bifacial_gain': 15,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,
                'annual_degradation': 0.40,
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '2 GW',  # UNVERIFIED
                'bloomberg_tier1': False,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': False,
                'certifications': ['IEC 61215', 'IEC 61730', 'BIS'],
                'price_range': '₹28,000 - ₹32,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 94,
                'efficiency_rating': 94,
                'heat_performance_rating': 96,
                'warranty_rating': 90,
                'kerala_climate_rating': 94,
                'overall_rating': 'very-good',
            },
            {
                # PAN-007 | Emmvee Titanium Clear E560HCBT144-T
                # Datasheet states "YEAR 2-30 POWER DEGRADATION END OF 30 YEARS
                # 87.40%". The previous 25-year / 89.4% figure was outdated.
                'brand': 'Emmvee',
                'name': 'Titanium Clear E560HCBT144-T',
                'wattage': 560,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "Bengaluru-built N-type TOPCon on a transparent backsheet, which keeps weight "
                    "down versus dual glass while still generating from the rear face at "
                    "80 +/- 5% bifaciality. Among the best low-light and heat behaviour in this "
                    "set, which suits Kerala's overcast monsoon months."
                ),
                'efficiency': 21.68,
                'temperature_coefficient': -0.29,
                'noct': 45,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 28.0,  # UNVERIFIED
                'bifacial_gain': 15,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,
                'annual_degradation': 0.40,
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '3 GW',  # UNVERIFIED
                'bloomberg_tier1': False,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': False,
                'certifications': ['IEC 61215', 'IEC 61730', 'BIS'],
                'price_range': '₹29,000 - ₹33,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 96,
                'efficiency_rating': 94,
                'heat_performance_rating': 98,
                'warranty_rating': 96,
                'kerala_climate_rating': 96,
                'overall_rating': 'very-good',
            },
            {
                # PAN-008 | Goldi Solar GS10-T144-GF (555 Wp)
                # Datasheet TDS-GS10T144GF v1.3 (555-570 Wp). Goldi has since
                # published a 565-595 Wp M10R revision; 555 Wp is being phased out.
                'brand': 'Goldi Solar',
                'name': 'GS10-T144-GF 555Wp',
                'wattage': 555,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "N-type TOPCon glass-glass module rated for high-humidity, windy and dusty "
                    "sites, with zero LID/LeTID and strong anti-PID performance. Goldi quotes "
                    "10-30% additional generation from the rear face depending on mounting and "
                    "albedo. Well suited to coastal Kerala installations."
                ),
                'efficiency': 21.48,
                'temperature_coefficient': -0.30,
                'noct': 45,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.5,
                'bifacial_gain': 10,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,  # UNVERIFIED (chart is image-only)
                'annual_degradation': 0.40,    # UNVERIFIED (chart is image-only)
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '2.5 GW',  # UNVERIFIED
                'bloomberg_tier1': False,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': False,
                'certifications': [
                    'IEC 61215:2021', 'IEC 61730:2021', 'IS 14286', 'IEC 61701',
                    'IEC 62716', 'IEC 62804', 'UL 61730', 'CEC',
                ],
                'price_range': '₹27,000 - ₹31,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 94,
                'efficiency_rating': 93,
                'heat_performance_rating': 90,
                'warranty_rating': 96,
                'kerala_climate_rating': 94,
                'overall_rating': 'very-good',
            },
            {
                # PAN-009 | Waaree ELITE Series BiN-01-555  [NEW]
                # Datasheet WEL/E&PD/555-585/108/BiN-01/HC/02/03.01.2025.
                # Waaree's N-type TOPCon line - the previous seed only carried
                # their older P-type PERC product.
                'brand': 'Waaree',
                'name': 'ELITE Series BiN-01-555',
                'wattage': 555,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "Waaree's N-type TOPCon flagship on large-format G12 cells in framed dual "
                    "glass, and a straight upgrade on the Ahnay PERC panel: -0.30%/C instead of "
                    "-0.34%/C, and 87.4% retained at year 30 instead of 82.05%. Backed by India's "
                    "largest manufacturer at 12 GW capacity with Black & Veatch audited factories."
                ),
                'efficiency': 21.68,
                'temperature_coefficient': -0.30,
                'noct': 43,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.5,
                'bifacial_gain': 15,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,
                'annual_degradation': 0.40,
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '12 GW',
                'bloomberg_tier1': True,
                'pvel_top_performer': True,
                'bis_certified': True,
                'independent_audit': True,
                'certifications': [
                    'ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018',
                    'Black & Veatch assessed',
                ],
                'price_range': '₹30,000 - ₹34,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 96,
                'efficiency_rating': 94,
                'heat_performance_rating': 96,
                'warranty_rating': 96,
                'kerala_climate_rating': 96,
                'overall_rating': 'excellent',
            },
            {
                # PAN-010 | Saatvik SGE 580-144 TGG
                'brand': 'Saatvik',
                'name': 'N-TOPCon SGE 580-144 TGG',
                'wattage': 580,
                'panel_type': 'bifacial',
                'technology': 'n-type-topcon',
                'image_url': '/frame (5).png',
                'description': (
                    "The highest wattage and efficiency in this comparison at 580 Wp and 22.45%, "
                    "so it needs the least roof area per kilowatt - the deciding factor on "
                    "compact Kerala rooftops. N-type TOPCon in dual glass with 16 busbars, "
                    "80 +/- 5% bifaciality and a positive-only power tolerance of 0 to +4.99 Wp."
                ),
                'efficiency': 22.45,
                'temperature_coefficient': -0.30,
                'noct': 45,
                'real_output_at_60c': 90,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Excellent',
                'weight': 32.0,  # UNVERIFIED
                'bifacial_gain': 15,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 1.0,
                'annual_degradation': 0.40,
                'output_at_year_25': 89.40,
                'manufacturing_capacity': '3 GW',  # UNVERIFIED
                'bloomberg_tier1': False,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': True,
                'certifications': [
                    'IEC 61215', 'IEC 61730', 'IEC 61701', 'IEC 61853-1',
                    'IEC 62804', 'IEC 62716', 'UL 61215', 'UL 61730', 'CEC',
                    'IS 14286',
                ],
                'price_range': '₹32,000 - ₹36,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 96,
                'efficiency_rating': 98,
                'heat_performance_rating': 96,
                'warranty_rating': 96,
                'kerala_climate_rating': 96,
                'overall_rating': 'very-good',
            },
            {
                # PAN-011 | Tata Power Solar TP600LG10B (Glass-Glass)  [NEW]
                # Tata's actual glass-glass bifacial module. Mono PERC, NOT
                # TOPCon - the -0.37%/C coefficient is the weakest here and is
                # the reason its Kerala scores are low despite the brand.
                'brand': 'Tata Power Solar',
                'name': 'TP600LG10B (Glass-Glass)',
                'wattage': 600,
                'panel_type': 'bifacial',
                'technology': 'p-type-perc',
                'image_url': '/frame (5).png',
                'description': (
                    "Tata's glass-glass bifacial module, made in India with a heavy-duty 6005-T6 "
                    "frame, IP68 junction box and a published warranty claim rate under 0.07% - "
                    "the strongest service and brand assurance in this comparison. Note it is "
                    "Mono PERC, not N-type: at -0.37%/C it loses the most output in Kerala's heat "
                    "of any panel here. Pick it for brand confidence, not peak summer yield."
                ),
                'efficiency': 21.54,
                'temperature_coefficient': -0.37,
                'noct': 45,
                'real_output_at_60c': 87,
                'ip_rating': 'IP68',
                'wind_load': 5400,
                'moisture_protection': 'Very Good',
                'weight': 36.0,  # UNVERIFIED
                'bifacial_gain': 15,
                'product_warranty': 12,
                'performance_warranty': 30,
                'first_year_power_drop': 2.0,  # UNVERIFIED (chart is image-only)
                'annual_degradation': 0.55,    # UNVERIFIED (chart is image-only)
                'output_at_year_25': 84.80,
                'manufacturing_capacity': '4.9 GW',  # UNVERIFIED
                'bloomberg_tier1': True,
                'pvel_top_performer': False,
                'bis_certified': True,
                'independent_audit': False,
                'certifications': ['IEC 61215', 'IEC 61730', 'BIS'],
                'price_range': '₹32,000 - ₹38,000',  # UNVERIFIED
                'subsidy_eligible': True,
                'kerala_climate_score': 80,
                'efficiency_rating': 94,
                'heat_performance_rating': 76,
                'warranty_rating': 90,
                'kerala_climate_rating': 80,
                'overall_rating': 'good',
            },
        ]

        created_count = 0
        updated_count = 0

        for panel_data in panels_data:
            panel, created = SolarPanel.objects.update_or_create(
                brand=panel_data['brand'],
                name=panel_data['name'],
                defaults=panel_data,
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {panel.brand} {panel.name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'↻ Updated: {panel.brand} {panel.name}'))

        # This command defines the canonical comparison set. Rows left over from
        # earlier seeds (Vikram Prexos, Premier PE-550HB, RenewSys DESERV
        # SGalactic, the mislabelled Tata GSD7S72T) would otherwise keep serving
        # superseded specs alongside the corrected ones.
        deleted_count = 0
        if not options['no_prune']:
            seeded = {(p['brand'], p['name']) for p in panels_data}
            for panel in SolarPanel.objects.all():
                if (panel.brand, panel.name) not in seeded:
                    self.stdout.write(self.style.ERROR(f'✗ Removed: {panel.brand} {panel.name}'))
                    panel.delete()
                    deleted_count += 1

        self.stdout.write(self.style.SUCCESS(f'\n✅ Seeded {len(panels_data)} solar panels'))
        self.stdout.write(self.style.SUCCESS(f'   Created: {created_count}'))
        self.stdout.write(self.style.SUCCESS(f'   Updated: {updated_count}'))
        self.stdout.write(self.style.SUCCESS(f'   Removed: {deleted_count}'))
