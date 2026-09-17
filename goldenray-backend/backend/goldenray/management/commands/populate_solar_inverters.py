"""Seed the canonical solar inverter comparison set.

Specs verified 17 Sep 2026 against manufacturer datasheets. See
INVERTER_COMPARISON.md at the repo root for the audit trail, sources and the
change log behind this revision.

Field provenance
----------------
Datasheet-verified for every inverter: rated_output_power, maximum_dc_input
(where the sheet prints a recommended max PV power), mppt_trackers,
maximum_dc_voltage, maximum_efficiency, european_efficiency, ip_rating,
operating_temperature, cooling, weight, surge/AFCI fields, certifications.

Warranty is India-specific and sourced per row in INVERTER_COMPARISON.md.
Sungrow and GoodWe are 5 years (APAC / global terms) - the 10 years seen on
Australian and European listings does not apply here.

Derived, not from datasheets:
  * dc_oversizing  = round(maximum_dc_input / rated_output_power * 100)
  * ac_overloading = datasheet max AC power / rated AC power. Sungrow and Solis
    are 100 (max AC equals rated); GoodWe is 110 (5500 W). The previous seed
    had 110 across the board.
  * efficiency_rating = round(90 + (maximum_efficiency - 97.0) / 1.5 * 10),
    capped at 100 - maps the 97.0-98.5% band these all sit in onto 90-100.
  * reliability_rating = mean of the comparison document's Manufacturer Track
    Record and Build Quality ratings, Excellent=95 / Very Good=88 / Good=80.
  * warranty_rating = min(100, 70 + 2 * warranty_years).
  * kerala_climate_score / kerala_climate_rating = the document's Overall
    Kerala Score.

Marked "# UNVERIFIED" inline: values carried from the previous seed or
estimated because the field is not on the retrieved datasheet. price_range in
particular is NOT verified for any inverter and should be replaced with real
dealer pricing before it is shown to customers.
"""

from django.core.management.base import BaseCommand

from goldenray.models import SolarInverter


class Command(BaseCommand):
    help = "Populate the database with the verified solar inverter comparison set"

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-prune",
            action="store_true",
            help="Keep inverters already in the database that are absent from this seed set.",
        )

    def handle(self, *args, **options):
        inverters_data = [
            {
                # INV-001 | Sungrow SG5.0RS
                # Datasheet SG3.0-6.0RS V1.1.1 + current product page (97.9%).
                # NOTE: Sungrow India also sells a cheaper SG5.0RS-L. Its India
                # datasheet lists no AFCI and no C5 rating - the two features
                # this row's coastal verdict rests on. Confirm the exact model
                # before quoting.
                'brand': 'Sungrow',
                'name': 'SG5.0RS',
                'inverter_type': 'string',
                'rating_tier': 'mid-range',
                'image_url': '',
                'description': (
                    "The reliability benchmark for coastal Kerala. Dual-MPPT string inverter with "
                    "an integrated arc-fault interrupter, built-in Type II surge protection on both "
                    "DC and AC, and a C5 corrosion rating - the only inverter here that publishes "
                    "one. PID recovery and an online IV-curve scan come standard via iSolarCloud. "
                    "Standard warranty in India is 5 years under Sungrow's APAC terms, extendable to "
                    "25. Make sure the quote says SG5.0RS, not SG5.0RS-L: the 'L' drops the AFCI and "
                    "C5 claim."
                ),
                'rated_output_power': 5000,
                'maximum_dc_input': 7500,
                'mppt_trackers': 2,
                'maximum_dc_voltage': 600,
                'maximum_input_current': '16 A per MPPT',
                'weight': 10.0,
                'display': 'LED digital display + iSolarCloud app',
                'suitable_system_size': 'Ideal for 5-6 kW homes',
                'maximum_efficiency': 97.9,
                'european_efficiency': 97.3,
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 150,
                'ac_overloading': 100,
                'pid_protection': True,
                'iv_curve_scanning': 'Online IV curve scan and diagnosis',
                'ip_rating': 'IP65',
                'corrosion_protection': 'C5 rated (coastal protection)',
                'operating_temperature': '-25°C to 60°C',
                'cooling': 'Natural cooling',
                'noise_level': 'Not stated on datasheet',
                'dc_surge_protection': 'Built-in Type II',
                'ac_surge_protection': 'Built-in Type II',
                'arc_fault_detection': 'Integrated',
                'grid_protection': True,
                'monitoring_app': 'iSolarCloud',
                'real_time_monitoring': True,
                'remote_diagnostics': 'Online IV curve scan',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'WLAN / Ethernet / RS485',
                'warranty_years': 5,
                'extendable_warranty_years': 25,
                'certifications': [
                    'IEC/EN 62109-1', 'IEC/EN 62109-2', 'IEC/EN 62116',
                    'IEC/EN 61727', 'IEC/EN 61000-6-2/3', 'BIS',
                ],
                'brand_trust': 'Excellent',
                'year_founded': 1997,
                'countries_served': '150+ Countries',  # UNVERIFIED
                'global_installations': '269+ GW',       # UNVERIFIED (2022 figure)
                'price_range': '₹₹₹',  # UNVERIFIED
                'kerala_climate_score': 92,
                'efficiency_rating': 96,
                'reliability_rating': 95,
                'warranty_rating': 80,
                'kerala_climate_rating': 92,
                'overall_rating': 'excellent',
            },
            {
                # INV-002 | GoodWe GW5000-DNS-30 (DNS G3)
                # Datasheet DNS G3 series v4, March 2023.
                'brand': 'GoodWe',
                'name': 'GW5000-DNS-30',
                'inverter_type': 'string',
                'rating_tier': 'mid-range',
                'image_url': '',
                'description': (
                    "Third-generation DNS: IP66, under 25 dB, dual MPPT with 16 A string current "
                    "and 110% AC overload headroom (5500 W). Type III surge protection is built in "
                    "on both sides; Type II SPD and arc-fault detection are optional extras, so "
                    "specify them for an exposed Kerala roof. Strong Indian service presence and "
                    "a 5-year standard warranty extendable to 10. A balanced everyday choice away "
                    "from the immediate coast."
                ),
                'rated_output_power': 5000,
                'maximum_dc_input': 7500,  # UNVERIFIED (150% oversizing per GoodWe listing)
                'mppt_trackers': 2,
                'maximum_dc_voltage': 600,
                'maximum_input_current': '16 A per MPPT',
                'weight': 12.8,
                'display': 'LED (LCD optional) + SEMS app',
                'suitable_system_size': 'Ideal for 5-6 kW homes',
                'maximum_efficiency': 97.9,
                'european_efficiency': 97.3,
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 150,
                'ac_overloading': 110,
                'pid_protection': True,  # UNVERIFIED
                'iv_curve_scanning': 'Basic',
                'ip_rating': 'IP66',
                'corrosion_protection': 'Not specified',
                'operating_temperature': '-25°C to 60°C',
                'cooling': 'Natural convection',
                'noise_level': '<25 dB',
                'dc_surge_protection': 'Type III built-in (Type II optional)',
                'ac_surge_protection': 'Type III built-in (Type II optional)',
                'arc_fault_detection': 'Optional',
                'grid_protection': True,
                'monitoring_app': 'SEMS Portal',
                'real_time_monitoring': True,
                'remote_diagnostics': 'Basic alerts',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'WiFi / LAN / RS485 / 4G (optional)',
                'warranty_years': 5,
                'extendable_warranty_years': 10,
                'certifications': ['IEC 62109', 'IEC 61727', 'IEC 62116', 'BIS'],
                'brand_trust': 'Very Good',
                'year_founded': 2010,
                'countries_served': '100+ Countries',  # UNVERIFIED
                'global_installations': '50 GW+',        # UNVERIFIED
                'price_range': '₹₹',  # UNVERIFIED
                'kerala_climate_score': 88,
                'efficiency_rating': 96,
                'reliability_rating': 88,
                'warranty_rating': 80,
                'kerala_climate_rating': 88,
                'overall_rating': 'very-good',
            },
            {
                # INV-003 | Solis S6-GR1P5K-S
                # India datasheet V1.2, April 2023 (IS 16169 / IS 16221 BIS listed).
                'brand': 'Solis',
                'name': 'S6-GR1P5K-S',
                'inverter_type': 'string',
                'rating_tier': 'mid-range',
                'image_url': '',
                'description': (
                    "Lightest string inverter here at 9 kg, IP66-sealed and under 20 dB. Dual "
                    "MPPT with 16 A string current, integrated surge protection and an arc-fault "
                    "interrupter that ships on the unit but needs activation at commissioning - "
                    "ask the installer to switch it on. Built-in zero-export control suits Kerala "
                    "net-metering rules. The India datasheet carries BIS IS 16221 compliance, and "
                    "Indian distributors list an 8-year warranty."
                ),
                'rated_output_power': 5000,
                'maximum_dc_input': 7500,
                'mppt_trackers': 2,
                'maximum_dc_voltage': 550,
                'maximum_input_current': '16 A per MPPT',
                'weight': 9.0,
                'display': 'LED + SolisCloud app',
                'suitable_system_size': 'Ideal for 5-6 kW homes',
                'maximum_efficiency': 97.7,
                'european_efficiency': 97.1,
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 150,
                'ac_overloading': 100,
                'pid_protection': False,  # not listed on datasheet
                'iv_curve_scanning': 'Basic',
                'ip_rating': 'IP66',
                'corrosion_protection': 'Not specified',
                'operating_temperature': '-25°C to 60°C',
                'cooling': 'Natural convection',
                'noise_level': '<20 dB',
                'dc_surge_protection': 'Built-in (type not stated)',
                'ac_surge_protection': 'Built-in (type not stated)',
                'arc_fault_detection': 'Integrated (activation required)',
                'grid_protection': True,
                'monitoring_app': 'SolisCloud',
                'real_time_monitoring': True,
                'remote_diagnostics': 'Basic alerts',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'RS485 / USB; WiFi or GPRS optional',
                'warranty_years': 8,
                'extendable_warranty_years': None,  # extension available; cap not confirmed
                'certifications': [
                    'IEC 62109-1', 'IEC 62109-2', 'IEC 61727', 'IEC 62116',
                    'IEC 61683', 'IS 16169', 'IS 16221 (BIS)',
                ],
                'brand_trust': 'Very Good',
                'year_founded': 2005,
                'countries_served': '100+ Countries',  # UNVERIFIED
                'global_installations': '',
                'price_range': '₹₹',  # UNVERIFIED
                'kerala_climate_score': 89,
                'efficiency_rating': 95,
                'reliability_rating': 88,
                'warranty_rating': 86,
                'kerala_climate_rating': 89,
                'overall_rating': 'very-good',
            },
            {
                # INV-004 | Growatt MIN 5000TL-X2 (Pro)
                # Growatt also ships a (Pro E) variant; these specs are for (Pro).
                # Growatt's own base warranty is 5 years; the 8-10 years seen in
                # India comes from distributor / registration programmes.
                'brand': 'Growatt',
                'name': 'MIN 5000TL-X2 (Pro)',
                'inverter_type': 'string',
                'rating_tier': 'value',
                'image_url': '',
                'description': (
                    "Highest peak efficiency in this set at 98.4%, IP66, and the widest operating "
                    "range (-30 to 60 C) - at a value price. Type II DC surge protection is built "
                    "in; AC surge protection and arc-fault detection are optional, and no corrosion "
                    "class is published, so keep it under cover and away from direct sea air. "
                    "Indian distributors list 8-10 years of warranty, though Growatt's own base "
                    "term is 5. Solid for cost-conscious inland homes."
                ),
                'rated_output_power': 5000,
                'maximum_dc_input': 7500,  # UNVERIFIED
                'mppt_trackers': 2,
                'maximum_dc_voltage': 550,
                'maximum_input_current': '16 A per MPPT',  # UNVERIFIED
                'weight': 10.8,
                'display': 'LED + ShinePhone app',
                'suitable_system_size': 'Ideal for 5 kW homes',
                'maximum_efficiency': 98.4,
                'european_efficiency': 97.5,
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 150,
                'ac_overloading': 110,  # UNVERIFIED
                'pid_protection': False,
                'iv_curve_scanning': 'Not available',
                'ip_rating': 'IP66',
                'corrosion_protection': 'Not specified',
                'operating_temperature': '-30°C to 60°C',
                'cooling': 'Natural convection',
                'noise_level': '<25 dB',  # UNVERIFIED
                'dc_surge_protection': 'Built-in Type II',
                'ac_surge_protection': 'Optional',  # UNVERIFIED
                'arc_fault_detection': 'Optional',
                'grid_protection': True,
                'monitoring_app': 'ShinePhone',
                'real_time_monitoring': True,
                'remote_diagnostics': 'Basic alerts',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'WiFi / 4G (ShineWiFi-X)',
                'warranty_years': 8,
                'extendable_warranty_years': 10,
                'certifications': ['IEC 62109', 'IEC 61727', 'IEC 62116', 'BIS'],
                'brand_trust': 'Very Good',
                'year_founded': 2011,
                'countries_served': '100+ Countries',  # UNVERIFIED
                'global_installations': '',
                'price_range': '₹₹',  # UNVERIFIED
                'kerala_climate_score': 86,
                'efficiency_rating': 99,
                'reliability_rating': 88,
                'warranty_rating': 86,
                'kerala_climate_rating': 86,
                'overall_rating': 'very-good',
            },
            {
                # INV-005 | Huawei SUN2000-5KTL-L1
                # Huawei's newer LC0 single-phase line exists only at 8/10 kW,
                # so the 5KTL-L1 remains the current 5 kW model.
                'brand': 'Huawei',
                'name': 'SUN2000-5KTL-L1',
                'inverter_type': 'string',
                'rating_tier': 'premium',
                'image_url': '',
                'description': (
                    "Smart string inverter with AI-powered arc-fault detection built in, Type II "
                    "surge protection on both sides, and 98.4% peak efficiency. The upgrade path is "
                    "the draw: add SUN2000-450W-P2 optimizers for panel-level monitoring and shade "
                    "tolerance on a tree-lined Kerala roof, and a LUNA2000 battery later without "
                    "swapping the inverter. Huawei's extensive Indian service network backs a "
                    "5-year standard warranty, extendable to 15."
                ),
                'rated_output_power': 5000,
                'maximum_dc_input': 7500,
                'mppt_trackers': 2,
                'maximum_dc_voltage': 600,
                'maximum_input_current': '12.5 A per MPPT',
                'weight': 12.0,
                'display': 'LED + FusionSolar app',
                'suitable_system_size': 'Ideal for 5-6 kW homes',
                'maximum_efficiency': 98.4,
                'european_efficiency': 97.8,
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 150,
                'ac_overloading': 110,  # UNVERIFIED (5500 VA max apparent)
                'pid_protection': True,  # UNVERIFIED
                'iv_curve_scanning': 'Smart I-V curve diagnosis',
                'ip_rating': 'IP65',
                'corrosion_protection': 'Not specified',
                'operating_temperature': '-25°C to 60°C',
                'cooling': 'Natural convection',
                'noise_level': '<30 dB',  # UNVERIFIED
                'dc_surge_protection': 'Type II compatible',
                'ac_surge_protection': 'Type II compatible',
                'arc_fault_detection': 'Built-in (AI-powered)',
                'grid_protection': True,
                'monitoring_app': 'FusionSolar',
                'real_time_monitoring': True,
                'remote_diagnostics': 'AI arc detection; Smart I-V diagnosis',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'WLAN / 4G / Ethernet (Smart Dongle)',
                'warranty_years': 5,
                'extendable_warranty_years': 15,
                'certifications': ['IEC 62109', 'IEC 61727', 'IEC 62116', 'BIS'],
                'brand_trust': 'Excellent',
                'year_founded': 1987,
                'countries_served': '170+ Countries',  # UNVERIFIED
                'global_installations': '',
                'price_range': '₹₹₹₹',  # UNVERIFIED
                'kerala_climate_score': 91,
                'efficiency_rating': 99,
                'reliability_rating': 95,
                'warranty_rating': 80,
                'kerala_climate_rating': 91,
                'overall_rating': 'excellent',
            },
            {
                # INV-006 | Enphase IQ8P (IQ8P-72-2-INT)
                # India datasheet DSH-00055-6.0, 8 May 2026. Assembled in India.
                # Previous seed had IP68 / 60 V / 540 W / 1.08 kg - all wrong.
                'brand': 'Enphase',
                'name': 'IQ8P Microinverter',
                'inverter_type': 'microinverter',
                'rating_tier': 'premium',
                'image_url': '',
                'description': (
                    "One 480 VA microinverter per panel, so shade on one module never drags the "
                    "rest down and there is no single point of failure - ideal for complex Kerala "
                    "roofs. Low-voltage DC (65 V max) with built-in rapid shutdown, IP67 "
                    "corrosion-resistant polymeric enclosure, -40 to 65 C, and panel-level "
                    "monitoring in the Enphase App. Handles modules up to 670 Wp. Assembled in "
                    "India, BIS-labelled, 15-year warranty with an IQ Gateway installed. Premium "
                    "cost per watt."
                ),
                'rated_output_power': 475,
                'maximum_dc_input': 670,
                'mppt_trackers': 1,
                'maximum_dc_voltage': 65,
                'maximum_input_current': '25 A (max short-circuit)',
                'weight': 1.6,
                'display': 'Enphase App (via IQ Gateway)',
                'suitable_system_size': 'Per-panel - any system size',
                'maximum_efficiency': 97.3,
                'european_efficiency': 97.0,  # IS/IEC weighted, per India datasheet
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 141,
                'ac_overloading': 101,
                'pid_protection': False,  # N/A at 65 V
                'iv_curve_scanning': 'Per-panel monitoring',
                'ip_rating': 'IP67',
                'corrosion_protection': 'Corrosion-resistant polymeric enclosure',
                'operating_temperature': '-40°C to 65°C',
                'cooling': 'Natural convection - no fans',
                'noise_level': 'Silent',
                'dc_surge_protection': 'System dependent',
                'ac_surge_protection': 'System dependent',
                'arc_fault_detection': 'N/A - low-voltage DC; rapid shutdown built in',
                'grid_protection': True,
                'monitoring_app': 'Enphase App',
                'real_time_monitoring': True,
                'remote_diagnostics': 'Panel-level monitoring',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'IQ Gateway (WiFi / Ethernet / cellular)',
                'warranty_years': 15,
                'extendable_warranty_years': 25,  # UNVERIFIED cap; extension offered
                'certifications': [
                    'IEC 61727', 'EN IEC 62109-1', 'EN IEC 62109-2', 'CE', 'RCM', 'BIS',
                ],
                'brand_trust': 'Excellent',
                'year_founded': 2006,
                'countries_served': '150+ Countries',        # UNVERIFIED
                'global_installations': '4 million+ systems',  # UNVERIFIED
                'price_range': '₹₹₹₹',  # UNVERIFIED
                'kerala_climate_score': 94,
                'efficiency_rating': 92,
                'reliability_rating': 95,
                'warranty_rating': 100,
                'kerala_climate_rating': 94,
                'overall_rating': 'excellent',
            },
            {
                # INV-007 | Sungrow SH5.0RS (hybrid)  [NEW]
                # Datasheet SH3.0-6.0RS V18 (2024). The only inverter in the set
                # that keeps the house running through a power cut.
                'brand': 'Sungrow',
                'name': 'SH5.0RS',
                'inverter_type': 'hybrid',
                'rating_tier': 'premium',
                'image_url': '',
                'description': (
                    "The answer to Kerala's power cuts: every other inverter here shuts down with "
                    "the grid, the SH5.0RS switches 5 kW of backup load over in under 10 ms. "
                    "Charges or discharges a Li-ion battery at 30 A across an 80-460 V window, so "
                    "it suits both new builds and retrofits. Same 600 V / dual-MPPT / 16 A front "
                    "end as the SG5.0RS with built-in Type II surge protection and PID Zero. "
                    "Heavier (18.5 kg), a touch louder (<45 dB), and the sheet lists no AFCI or "
                    "corrosion class. 5-year APAC warranty base."
                ),
                'rated_output_power': 5000,
                'maximum_dc_input': 7500,
                'mppt_trackers': 2,
                'maximum_dc_voltage': 600,
                'maximum_input_current': '16 A per MPPT',
                'weight': 18.5,
                'display': 'LED digital display + iSolarCloud app',
                'suitable_system_size': 'Ideal for 5-6 kW homes needing backup',
                'maximum_efficiency': 97.7,
                'european_efficiency': 97.3,
                'mppt_efficiency': 99.5,  # UNVERIFIED
                'dc_oversizing': 150,
                'ac_overloading': 100,
                'pid_protection': True,
                'iv_curve_scanning': 'Online IV curve scan and diagnosis',
                'ip_rating': 'IP65',
                'corrosion_protection': 'Not specified',
                'operating_temperature': '-25°C to 60°C',
                'cooling': 'Natural convection',
                'noise_level': '<45 dB',
                'dc_surge_protection': 'Built-in Type II',
                'ac_surge_protection': 'Built-in Type II',
                'arc_fault_detection': 'Not listed on datasheet',
                'grid_protection': True,
                'monitoring_app': 'iSolarCloud',
                'real_time_monitoring': True,
                'remote_diagnostics': 'Online IV curve scan',
                'firmware_updates': 'OTA Updates',
                'connectivity': 'RS485 / Ethernet / WLAN / CAN',
                'warranty_years': 5,
                'extendable_warranty_years': 25,  # UNVERIFIED cap; APAC extensions "up to 25"
                'certifications': [
                    'IEC/EN 62109-1', 'IEC/EN 62109-2', 'IEC 62116', 'IEC 61727',
                    'IEC/EN 61000-3-11', 'IEC/EN 61000-3-12', 'BIS',
                ],
                'brand_trust': 'Excellent',
                'year_founded': 1997,
                'countries_served': '150+ Countries',  # UNVERIFIED
                'global_installations': '269+ GW',       # UNVERIFIED (2022 figure)
                'price_range': '₹₹₹₹',  # UNVERIFIED
                'kerala_climate_score': 90,
                'efficiency_rating': 95,
                'reliability_rating': 95,
                'warranty_rating': 80,
                'kerala_climate_rating': 90,
                'overall_rating': 'excellent',
            },
        ]

        created_count = 0
        updated_count = 0

        for inverter_data in inverters_data:
            inverter, created = SolarInverter.objects.update_or_create(
                brand=inverter_data['brand'],
                name=inverter_data['name'],
                defaults=inverter_data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"✓ Created: {inverter.brand} {inverter.name}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f"↻ Updated: {inverter.brand} {inverter.name}"))

        # This command defines the canonical comparison set. Rows left over from
        # earlier seeds (SolarEdge SE5000H, Fronius Primo GEN24, and the old
        # "GoodWe GW5000-MS" / "Growatt MIN 5000TL-X" names) would otherwise keep
        # serving superseded specs alongside the corrected ones.
        deleted_count = 0
        if not options['no_prune']:
            seeded = {(i['brand'], i['name']) for i in inverters_data}
            for inverter in SolarInverter.objects.all():
                if (inverter.brand, inverter.name) not in seeded:
                    self.stdout.write(self.style.ERROR(f"✗ Removed: {inverter.brand} {inverter.name}"))
                    inverter.delete()
                    deleted_count += 1

        self.stdout.write(self.style.SUCCESS(f"\n✅ Seeded {len(inverters_data)} solar inverters"))
        self.stdout.write(self.style.SUCCESS(f"   Created: {created_count}"))
        self.stdout.write(self.style.SUCCESS(f"   Updated: {updated_count}"))
        self.stdout.write(self.style.SUCCESS(f"   Removed: {deleted_count}"))
