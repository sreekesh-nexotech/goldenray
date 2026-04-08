"""
Management command: seed_catalog
Usage:
    python manage.py seed_catalog                          # use default catalog.json path
    python manage.py seed_catalog --file /path/to/file    # use custom path
    python manage.py seed_catalog --clear                  # wipe all seeded data first

Populates:
    GlobalCosts, Category, CatalogItem, ItemTier,
    BomTemplate, BomSlot, BomFixedItem,
    MarketRate, StructureTemplate, StructureTemplateItem, TubeWeight
"""

import json
import os

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from bom.models import (
    GlobalCosts,
    Category,
    CatalogItem,
    ItemTier,
    BomTemplate,
    BomSlot,
    BomFixedItem,
    MarketRate,
    StructureTemplate,
    StructureTemplateItem,
    TubeWeight,
)

# Default path: catalog.json sits two levels above manage.py (repo root)
DEFAULT_CATALOG_PATH = os.path.join(
    os.path.dirname(__file__),  # management/commands/
    "..", "..", "..", "..", "..", "..",  # → repo root
    "catalog.json",
)


class Command(BaseCommand):
    help = "Seed the database from catalog.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            default=None,
            help="Absolute path to catalog.json (default: auto-detected repo root)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing seeded records before inserting",
        )

    # ------------------------------------------------------------------
    # Entry point
    # ------------------------------------------------------------------
    def handle(self, *args, **options):
        path = options["file"] or os.path.normpath(DEFAULT_CATALOG_PATH)
        if not os.path.isfile(path):
            raise CommandError(f"catalog.json not found at: {path}")

        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)

        with transaction.atomic():
            if options["clear"]:
                self._clear()

            self._seed_global_costs(data.get("costs", {}))
            category_map = self._seed_categories(data.get("categories", {}))
            self._seed_catalog_items(data.get("categories", {}), category_map)
            self._seed_bom_templates(data.get("bomTemplates", {}), category_map)
            self._seed_market_rates(data.get("marketRates", {}))
            self._seed_structure_templates(data.get("structureTemplates", {}))
            self._seed_tube_weights(data.get("tubeWeights", {}))

        self.stdout.write(self.style.SUCCESS("✓ Seeding complete."))

    # ------------------------------------------------------------------
    # Clear helpers
    # ------------------------------------------------------------------
    def _clear(self):
        self.stdout.write("  Clearing existing data…")
        StructureTemplateItem.objects.all().delete()
        StructureTemplate.objects.all().delete()
        TubeWeight.objects.all().delete()
        MarketRate.objects.all().delete()
        BomFixedItem.objects.all().delete()
        BomSlot.objects.all().delete()
        BomTemplate.objects.all().delete()
        ItemTier.objects.all().delete()
        CatalogItem.objects.all().delete()
        Category.objects.all().delete()
        GlobalCosts.objects.all().delete()
        self.stdout.write("  Done clearing.")

    # ------------------------------------------------------------------
    # GlobalCosts
    # ------------------------------------------------------------------
    def _seed_global_costs(self, costs: dict):
        if not costs:
            return
        obj, created = GlobalCosts.objects.update_or_create(
            pk=1,
            defaults={
                "install_rate": costs.get("installRate", 0),
                "service_rate_year": costs.get("serviceRateYear", 0),
                "service_years": costs.get("serviceYears", 5),
                "transport_rate": costs.get("transportRate", 0),
                "default_dist_km": costs.get("defaultDistKm", 0),
                "miscellaneous": costs.get("miscellaneous", 0),
                "office": costs.get("office", 0),
                "elevated_structure_rate": costs.get("elevatedStructureRate", 0),
                "sheet_structure_rate": costs.get("sheetStructureRate", 0),
                "gp_rate_per_kg": costs.get("gpRatePerKg", 0),
                "gi_rate_per_kg": costs.get("giRatePerKg", 0),
                "structure_labor": costs.get("structureLabor", 0),
                "structure_repair_pct": costs.get("structureRepairPct", 0),
            },
        )
        verb = "Created" if created else "Updated"
        self.stdout.write(f"  {verb} GlobalCosts")

    # ------------------------------------------------------------------
    # Categories
    # ------------------------------------------------------------------
    def _seed_categories(self, categories: dict) -> dict:
        """Returns {slug: Category} map."""
        category_map = {}
        for slug, cat_data in categories.items():
            obj, created = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    "label": cat_data.get("label", slug),
                    "gst_default": cat_data.get("gstDefault", 18),
                },
            )
            category_map[slug] = obj
            verb = "Created" if created else "Updated"
            self.stdout.write(f"  {verb} Category: {slug}")
        return category_map

    # ------------------------------------------------------------------
    # CatalogItems + ItemTiers
    # ------------------------------------------------------------------
    def _seed_catalog_items(self, categories: dict, category_map: dict):
        for slug, cat_data in categories.items():
            category = category_map[slug]
            for item in cat_data.get("items", []):
                item_id = item["id"]
                defaults = {
                    "category": category,
                    "name": item.get("name", ""),
                    "brand": item.get("brand", ""),
                    "price": item.get("price", 0),
                    "gst_override": item.get("gstOverride", None),
                    # Panel fields
                    "watt": item.get("watt", None),
                    "per_watt": item.get("perWatt", None),
                    "dcr": item.get("dcr", None),
                    # Inverter/DCDB fields
                    "phase": item.get("phase", None),
                    # Inverter-only fields
                    "kw": item.get("kw", None),
                    "model": item.get("model", None),
                    "inverter_type": item.get("type", None),
                }
                # item_id max_length is 20; truncate safely
                if len(item_id) > 20:
                    self.stderr.write(
                        f"  WARNING: item_id '{item_id}' exceeds 20 chars — truncating"
                    )
                    item_id = item_id[:20]

                catalog_obj, created = CatalogItem.objects.update_or_create(
                    item_id=item_id,
                    defaults=defaults,
                )
                verb = "Created" if created else "Updated"
                self.stdout.write(f"    {verb} CatalogItem: {item_id}")

                # Tiers
                existing_tiers = set(
                    catalog_obj.item_tiers.values_list("tier", flat=True)
                )
                new_tiers = set(item.get("tiers", []))
                for tier in new_tiers - existing_tiers:
                    ItemTier.objects.create(item=catalog_obj, tier=tier)
                for tier in existing_tiers - new_tiers:
                    catalog_obj.item_tiers.filter(tier=tier).delete()

    # ------------------------------------------------------------------
    # BomTemplates (ongrid / hybrid / upgrade)
    # ------------------------------------------------------------------
    def _seed_bom_templates(self, bom_templates: dict, category_map: dict):
        LABELS = {
            "ongrid": "On-Grid",
            "hybrid": "Hybrid",
            "upgrade": "On-Grid Upgrade",
        }
        for system_type, tmpl_data in bom_templates.items():
            template, created = BomTemplate.objects.update_or_create(
                system_type=system_type,
                defaults={
                    "label": tmpl_data.get("label", LABELS.get(system_type, system_type)),
                    "description": tmpl_data.get("description", ""),
                    "sizes": tmpl_data.get("sizes", {}),
                    "three_phase_sizes": tmpl_data.get("threePhase", []),
                    "available_tiers": tmpl_data.get("tiers", []),
                    "battery_configs": tmpl_data.get("batteryConfigs", []),
                },
            )
            verb = "Created" if created else "Updated"
            self.stdout.write(f"  {verb} BomTemplate: {system_type}")

            self._seed_bom_slots(template, tmpl_data.get("slots", []), category_map)
            self._seed_bom_fixed_items(template, tmpl_data.get("fixedItems", []), category_map)

    def _seed_bom_slots(self, template: BomTemplate, slots: list, category_map: dict):
        existing_positions = set(template.slots.values_list("pos", flat=True))
        new_positions = set()

        for slot in slots:
            pos = slot["pos"]
            new_positions.add(pos)
            cat_slug = slot.get("category", "")
            category = category_map.get(cat_slug)
            if category is None:
                self.stderr.write(
                    f"  WARNING: unknown category '{cat_slug}' for slot pos={pos} in {template.system_type}"
                )
                continue

            BomSlot.objects.update_or_create(
                template=template,
                pos=pos,
                defaults={
                    "category": category,
                    "label": slot.get("label", ""),
                    "variable": slot.get("variable", False),
                    "gst": slot.get("gst", 18),
                    "qty": slot.get("qty", {}),
                    "premium_qty": slot.get("premiumQty", None),
                    "bat_qty": slot.get("batQty", None),
                    "premium_bat_qty": slot.get("premiumBatQty", None),
                    "filter_type": slot.get("filterType", ""),
                    "filter_phase": slot.get("filterPhase", ""),
                    "qty_mode": slot.get("qtyMode", ""),
                    "fixed_qty": slot.get("fixedQty", None),
                },
            )

        # Remove slots no longer in catalog
        stale = existing_positions - new_positions
        if stale:
            template.slots.filter(pos__in=stale).delete()

    def _seed_bom_fixed_items(self, template: BomTemplate, fixed_items: list, category_map: dict):
        # Wipe and re-create to avoid duplicates on name changes
        template.fixed_items.all().delete()

        for fi in fixed_items:
            cat_slug = fi.get("category", "")
            category = category_map.get(cat_slug) if cat_slug else None

            catalog_item = None
            item_id = fi.get("itemId")
            if item_id:
                try:
                    catalog_item = CatalogItem.objects.get(item_id=item_id)
                except CatalogItem.DoesNotExist:
                    pass

            # Determine qty / bat_qty / premium_qty
            qty = fi.get("qty", {})
            bat_qty = fi.get("batQty", None)
            premium_qty = fi.get("premiumQty", None)

            BomFixedItem.objects.create(
                template=template,
                name=fi.get("name", ""),
                gst=fi.get("gst", 18),
                price=fi.get("price", 0),
                catalog_item=catalog_item,
                category=category,
                qty=qty,
                bat_qty=bat_qty,
                premium_qty=premium_qty,
                section=fi.get("_section", ""),
                is_tube=fi.get("isTube", False),
            )

    # ------------------------------------------------------------------
    # MarketRates
    # ------------------------------------------------------------------
    def _seed_market_rates(self, market_rates: dict):
        """
        catalog.json marketRates keys follow these patterns:
          ongrid_<tier>           → {"3": 0, "6": 0, ...}
          hybrid_<tier>_<batcfg>  → {"3": 0, "5": 0, ...}
          upgrade_<from>_<to>     → {"rate": 0}
        """
        for key, rates in market_rates.items():
            parts = key.split("_")

            if parts[0] == "ongrid":
                # ongrid_base / ongrid_value / ongrid_premium
                system_type = "ongrid"
                tier = parts[1] if len(parts) > 1 else ""
                bat_config = ""
                from_size = ""
                to_size = ""
                size_rates = rates

            elif parts[0] == "hybrid":
                # hybrid_<tier>_<batcfg>
                system_type = "hybrid"
                tier = parts[1] if len(parts) > 1 else ""
                bat_config = parts[2] if len(parts) > 2 else ""
                from_size = ""
                to_size = ""
                size_rates = rates

            elif parts[0] == "upgrade":
                # upgrade_<from>_<to>
                system_type = "upgrade"
                tier = ""
                bat_config = ""
                from_size = parts[1] if len(parts) > 1 else ""
                to_size = parts[2] if len(parts) > 2 else ""
                # {"rate": 0} → store as-is
                size_rates = rates

            else:
                self.stderr.write(f"  WARNING: unrecognised marketRate key '{key}' — skipping")
                continue

            obj, created = MarketRate.objects.update_or_create(
                system_type=system_type,
                tier=tier,
                bat_config=bat_config,
                from_size=from_size,
                to_size=to_size,
                defaults={"size_rates": size_rates},
            )
            verb = "Created" if created else "Updated"
            self.stdout.write(f"  {verb} MarketRate: {key}")

    # ------------------------------------------------------------------
    # StructureTemplates
    # ------------------------------------------------------------------
    def _seed_structure_templates(self, structure_templates: dict):
        for slug, tmpl_data in structure_templates.items():
            st, created = StructureTemplate.objects.update_or_create(
                slug=slug,
                defaults={"label": tmpl_data.get("label", slug)},
            )
            verb = "Created" if created else "Updated"
            self.stdout.write(f"  {verb} StructureTemplate: {slug}")

            # Wipe items and re-create
            st.items.all().delete()
            for item in tmpl_data.get("items", []):
                StructureTemplateItem.objects.create(
                    template=st,
                    name=item.get("name", ""),
                    item_type=item.get("type", "fixed"),
                    tube_size=item.get("tubeSize", ""),
                    weight_kg=item.get("weightKg", None),
                    price=item.get("price", None),
                    unit=item.get("unit", ""),
                    qty=item.get("qty", {}),
                )

    # ------------------------------------------------------------------
    # TubeWeights
    # ------------------------------------------------------------------
    def _seed_tube_weights(self, tube_weights: dict):
        for tube_size, weight_kg in tube_weights.items():
            obj, created = TubeWeight.objects.update_or_create(
                tube_size=tube_size,
                defaults={"weight_kg": weight_kg},
            )
            verb = "Created" if created else "Updated"
            self.stdout.write(f"  {verb} TubeWeight: {tube_size} = {weight_kg} kg")
