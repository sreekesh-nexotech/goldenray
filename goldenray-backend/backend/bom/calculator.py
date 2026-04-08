"""
BOM Calculator — pure Python, no ORM calls.

The view fetches all required DB records and passes them in.
All Decimal fields are converted to float before arithmetic.
"""
from __future__ import annotations

import math
from datetime import date
from typing import Any


# Category-to-upgrade-section mapping (mirrors upgSectionMap in App.jsx)
UPG_SECTION_MAP = {
    "panel": "panels",
    "solar_clamp": "structure",
    "ss_screw": "structure",
    "structure_material": "structure",
    "painting_material": "structure",
    "welding_material": "structure",
    "inverter": "inverter",
    "dcdb": "inverter",
    "acdb": "inverter",
    "battery": "battery",
    "mccb_box": "battery",
    "change_over": "battery",
    "battery_cable": "battery",
    "dc_cable": "wiring",
    "ac_cable": "wiring",
    "armoured_cable": "wiring",
    "mc4_connector": "wiring",
    "cable_tie": "wiring",
    "copper_lug": "wiring",
    "insulation_tape": "wiring",
    "conduit_pipe": "wiring",
    "meter": "inverter",
    "ug_cable": "wiring",
}

KNOWN_PATHS = {"3_5": 4, "5_8": 5, "5_10": 9, "8_10": 4}


class BomCalculator:
    def __init__(
        self,
        costs,          # GlobalCosts instance
        template,       # BomTemplate instance (prefetched slots + fixed_items)
        cat_map: dict,  # {slug: Category} with prefetched items and item_tiers
        structure_templates: dict,   # {slug: StructureTemplate} with prefetched items
        tube_weights: dict,          # {tube_size: weight_kg float}
        market_rates: list,          # list of MarketRate instances
        offers: list,                # list of active Offer instances (date-filtered)
        params: dict,
    ):
        self.costs = costs
        self.template = template
        self.cat_map = cat_map
        self.structure_templates = structure_templates
        self.tube_weights = tube_weights
        self.market_rates = market_rates
        self.offers = offers
        self.p = params

    # ── Public entry point ────────────────────────────────────────────────────

    def compute(self) -> dict:
        p = self.p
        sys_type = p["sys_type"]

        if sys_type == "upgrade":
            return self._compute_upgrade()
        return self._compute_standard()

    # ── Standard BOM (ongrid / hybrid) ────────────────────────────────────────

    def _compute_standard(self) -> dict:
        p = self.p
        size = p["size"]
        tier = p["tier"]
        bat_config = p["bat_config"]

        is_three_phase = size in (self.template.three_phase_sizes or [])

        bom_lines = self._get_slot_lines(size, tier, bat_config, is_three_phase)
        bom_lines += self._get_fixed_lines(size, tier, bat_config)

        totals = self._calc_totals(bom_lines)
        kw = self._size_to_kw(size)
        cost_bd = self._calc_costs(totals["material_with_gst"], kw)
        subtotal = totals["material_with_gst"] + cost_bd["cost_total"]
        margin = self._calc_margin(subtotal)
        grand_total = subtotal + margin

        market_rate = self._lookup_market_rate()
        customer_price = market_rate if market_rate > 0 else grand_total

        subsidy = self._calc_subsidy(kw)
        discount_info = self._calc_discount(customer_price)
        final_price = max(0, discount_info["discount_base"] - discount_info["discount_amt"])
        price_after_subsidy = max(0, final_price - subsidy)

        available_offers = self._applicable_offers()

        return {
            "bom_lines": bom_lines,
            "cost_breakdown": cost_bd,
            "totals": {
                **totals,
                "subtotal": subtotal,
                "margin": margin,
                "grand_total": grand_total,
            },
            "pricing": {
                "market_rate": market_rate,
                "customer_price": customer_price,
                "discount_amt": discount_info["discount_amt"],
                "discount_label": discount_info["discount_label"],
                "final_price": final_price,
                "subsidy_amt": subsidy,
                "subsidy_label": self._subsidy_label(kw),
                "price_after_subsidy": price_after_subsidy,
            },
            "meta": {
                "system_type": p["sys_type"],
                "size": size,
                "tier": tier,
                "bat_config": bat_config,
                "is_three_phase": is_three_phase,
                "new_panels": None,
            },
            "available_offers": available_offers,
        }

    # ── Slot lines ────────────────────────────────────────────────────────────

    def _get_slot_lines(self, size, tier, bat_config, is_three_phase) -> list:
        lines = []
        for slot in self.template.slots.all():
            qty = slot.get_qty(size, bat_config=bat_config, tier=tier)
            if not qty:
                continue

            cat = self.cat_map.get(slot.category.slug)
            if not cat:
                continue

            item = self._select_item(cat, tier, slot, is_three_phase, self._size_to_kw(size))
            if not item:
                continue

            unit_price = float(item.price)
            amount = qty * unit_price
            gst_pct = slot.gst
            gst_amt = round(amount * gst_pct / 100)

            lines.append({
                "pos": slot.pos,
                "name": item.name,
                "brand": item.brand,
                "qty": qty,
                "unit": "m" if slot.category.slug in ("dc_cable", "ac_cable", "armoured_cable", "ug_cable") else "nos",
                "unit_price": unit_price,
                "amount": amount,
                "gst_pct": gst_pct,
                "gst_amt": gst_amt,
                "section": slot.category.slug,
                "is_variable": slot.variable,
            })
        return lines

    # ── Fixed lines ───────────────────────────────────────────────────────────

    def _get_fixed_lines(self, size, tier, bat_config) -> list:
        lines = []
        pos_offset = 500
        for fi in self.template.fixed_items.all():
            if fi.is_tube:
                # Tube items are handled via structure cost, not as BOM lines
                continue

            # Qty resolution: premium_qty → bat_qty → qty
            if tier == "premium" and fi.premium_qty:
                qty = fi.premium_qty.get(size, 0)
            elif fi.bat_qty:
                bat_map = fi.bat_qty.get(bat_config, fi.bat_qty.get("0", {}))
                qty = bat_map.get(size, 0) if isinstance(bat_map, dict) else 0
            else:
                qty = fi.qty.get(size, 0) if fi.qty else 0

            if not qty:
                continue

            unit_price = float(fi.price)
            amount = qty * unit_price
            gst_pct = fi.gst
            gst_amt = round(amount * gst_pct / 100)

            lines.append({
                "pos": pos_offset,
                "name": fi.name,
                "brand": fi.catalog_item.brand if fi.catalog_item else "",
                "qty": qty,
                "unit": "nos",
                "unit_price": unit_price,
                "amount": amount,
                "gst_pct": gst_pct,
                "gst_amt": gst_amt,
                "section": fi.section or (fi.category.slug if fi.category else "misc"),
                "is_variable": False,
            })
            pos_offset += 1
        return lines

    # ── Item selection ────────────────────────────────────────────────────────

    def _select_item(self, category, tier, slot, is_three_phase, kw_num):
        available = []
        for item in category.items.all():
            # Must be in the requested tier
            if not item.item_tiers.filter(tier=tier).exists():
                continue

            # filter_type
            ft = slot.filter_type
            if ft == "hybrid":
                if item.inverter_type != "hybrid":
                    continue
            elif ft == "ongrid":
                if item.inverter_type and item.inverter_type != "ongrid":
                    continue

            # filter_phase / phase matching
            fp = slot.filter_phase
            if fp == "HYB":
                if not item.phase or "HYB" not in item.phase:
                    continue
                if is_three_phase and "3P" not in item.phase:
                    continue
                if not is_three_phase and "1P" not in item.phase:
                    continue
            elif item.phase:
                if is_three_phase:
                    if "3P" not in item.phase:
                        continue
                else:
                    if "3P" in item.phase:
                        continue

            available.append(item)

        if not available:
            return None

        # For inverter category, pick closest kW
        if slot.category.slug == "inverter" and any(i.kw for i in available):
            return min(available, key=lambda i: abs(float(i.kw or 0) - kw_num))

        return available[0]

    # ── Structure cost ────────────────────────────────────────────────────────

    def _get_structure_qty(self, item, kw: float) -> int:
        """Port of getStructureQty() from App.jsx lines 20-39."""
        qty_map = item.qty or {}
        if not qty_map:
            return 0
        sizes = sorted(float(k) for k in qty_map.keys())
        if kw <= sizes[0]:
            return qty_map[str(int(sizes[0]) if sizes[0] == int(sizes[0]) else sizes[0])] or qty_map[list(qty_map.keys())[0]]
        if kw >= sizes[-1]:
            last_key = str(int(sizes[-1]) if sizes[-1] == int(sizes[-1]) else sizes[-1])
            # try both int and float string forms
            last_qty = qty_map.get(last_key) or qty_map.get(str(sizes[-1]))
            if last_qty is None:
                last_qty = list(qty_map.values())[-1]
            return math.ceil(last_qty * kw / sizes[-1])
        for i in range(len(sizes) - 1):
            lo, hi = sizes[i], sizes[i + 1]
            if lo <= kw <= hi:
                lo_key = str(int(lo) if lo == int(lo) else lo)
                hi_key = str(int(hi) if hi == int(hi) else hi)
                lo_qty = qty_map.get(lo_key) or qty_map.get(str(lo), 0)
                hi_qty = qty_map.get(hi_key) or qty_map.get(str(hi), 0)
                ratio = (kw - lo) / (hi - lo)
                return math.ceil(lo_qty + ratio * (hi_qty - lo_qty))
        return list(qty_map.values())[-1]

    def _calc_structure_cost(self, slug: str, kw: float) -> dict:
        """Port of calcStructureCost() from App.jsx lines 42-57."""
        tmpl = self.structure_templates.get(slug)
        if not tmpl:
            return {"total": 0, "lines": []}

        costs = self.costs
        tier = self.p["tier"]
        tube_rate = float(costs.gp_rate_per_kg) if tier == "base" else float(costs.gi_rate_per_kg)

        total = 0
        lines = []
        for item in tmpl.items.all():
            qty = self._get_structure_qty(item, kw)
            if item.item_type == "tube":
                weight_kg = float(item.weight_kg or 0)
                cost = round(weight_kg * tube_rate * qty)
            else:
                cost = round(float(item.price or 0) * qty)
            total += cost
            lines.append({"name": item.name, "type": item.item_type, "qty": qty, "cost": cost})

        return {"total": total, "lines": lines}

    # ── Cost breakdown ────────────────────────────────────────────────────────

    def _calc_costs(self, mat_with_gst: float, kw: float) -> dict:
        c = self.costs
        p = self.p
        dist_km = p["dist_km"]
        struct_type = p["structure_type"]

        install = float(c.install_rate) * kw
        service = float(c.service_rate_year) * float(c.service_years)
        transport = dist_km * float(c.transport_rate)
        extra_km = max(0, dist_km - int(c.default_dist_km))
        transport += extra_km * 35
        misc = float(c.miscellaneous)
        office = float(c.office)

        flat_cost = self._calc_structure_cost("flatRoof", kw)
        structure_base = flat_cost["total"]

        structure_extra = 0
        structure_labor = 0
        structure_repair = 0

        if struct_type != "flatRoof":
            selected_cost = self._calc_structure_cost(struct_type, kw)
            structure_extra = max(0, selected_cost["total"] - structure_base)
            structure_labor = float(c.structure_labor)
            structure_repair = round((structure_extra + structure_labor) * float(c.structure_repair_pct) / 100)

        cost_total = (install + service + transport + misc + office
                      + structure_base + structure_extra + structure_labor + structure_repair)

        return {
            "install": round(install),
            "service": round(service),
            "transport": round(transport),
            "misc": round(misc),
            "office": round(office),
            "structure_base": structure_base,
            "structure_extra": structure_extra,
            "structure_labor": round(structure_labor),
            "structure_repair": structure_repair,
            "cost_total": round(cost_total),
        }

    # ── Totals ────────────────────────────────────────────────────────────────

    def _calc_totals(self, lines: list) -> dict:
        mat_ex_gst = sum(l["amount"] for l in lines)
        gst_5 = sum(l["gst_amt"] for l in lines if l["gst_pct"] == 5)
        gst_12 = sum(l["gst_amt"] for l in lines if l["gst_pct"] == 12)
        gst_18 = sum(l["gst_amt"] for l in lines if l["gst_pct"] == 18)
        mat_with_gst = mat_ex_gst + gst_5 + gst_12 + gst_18
        return {
            "material_ex_gst": round(mat_ex_gst),
            "gst_5": round(gst_5),
            "gst_12": round(gst_12),
            "gst_18": round(gst_18),
            "material_with_gst": round(mat_with_gst),
        }

    # ── Margin ────────────────────────────────────────────────────────────────

    def _calc_margin(self, subtotal: float) -> float:
        p = self.p
        if p["margin_type"] == "percent":
            return round(subtotal * p["margin_val"] / 100)
        return round(p["margin_val"])

    # ── Market rate ───────────────────────────────────────────────────────────

    def _lookup_market_rate(self) -> float:
        p = self.p
        sys_type = p["sys_type"]
        tier = p["tier"]
        bat_config = p["bat_config"]
        size = p["size"]

        for mr in self.market_rates:
            if mr.system_type != sys_type:
                continue
            if sys_type == "ongrid":
                if mr.tier == tier and not mr.bat_config and not mr.from_size:
                    val = (mr.size_rates or {}).get(size, 0)
                    return float(val) if val else 0
            elif sys_type == "hybrid":
                if mr.tier == tier and mr.bat_config == bat_config:
                    val = (mr.size_rates or {}).get(size, 0)
                    return float(val) if val else 0
        return 0

    # ── Subsidy ───────────────────────────────────────────────────────────────

    def _size_to_kw(self, size: str) -> float:
        """Convert size key like '5sp', '5tp', '10' to float kW."""
        s = size.replace("sp", "").replace("tp", "")
        try:
            return float(s)
        except ValueError:
            return 3.0

    def _calc_subsidy(self, kw: float) -> float:
        p = self.p
        stype = p["subsidy_type"]
        if stype == "none":
            return 0
        if stype == "residential":
            if kw <= 2:
                return kw * 30000
            elif kw <= 3:
                return 60000 + (kw - 2) * 18000
            else:
                return 78000
        if stype == "ghs":
            houses = max(1, int(p.get("ghs_houses", 1)))
            per_house_kw = min(kw, 3)
            raw = per_house_kw * 18000 * houses
            cap = min(500, houses * 3) * 18000
            return min(raw, cap)
        return 0

    def _subsidy_label(self, kw: float) -> str:
        stype = self.p["subsidy_type"]
        if stype == "residential":
            return f"PM Surya Ghar (Residential, {kw}kW)"
        if stype == "ghs":
            return f"PM Surya Ghar (GHS, {self.p.get('ghs_houses',1)} houses)"
        return ""

    # ── Discount / Offers ─────────────────────────────────────────────────────

    def _applicable_offers(self) -> list:
        p = self.p
        result = []
        today = date.today()
        for o in self.offers:
            if o.start_date and o.start_date > today:
                continue
            if o.end_date and o.end_date < today:
                continue
            if o.applies_to not in ("all", p["sys_type"]):
                continue
            if o.applies_to_tier not in ("all", p["tier"]):
                continue
            result.append({
                "offer_id": o.offer_id,
                "name": o.name,
                "offer_type": o.offer_type,
                "value": float(o.value),
            })
        return result

    def _calc_discount(self, base_price: float) -> dict:
        p = self.p
        offer_id = p.get("selected_offer_id")
        custom = p.get("custom_discount")

        if offer_id:
            applicable = self._applicable_offers()
            match = next((o for o in applicable if o["offer_id"] == offer_id), None)
            if match:
                if match["offer_type"] == "percent":
                    amt = round(base_price * match["value"] / 100)
                else:
                    amt = round(float(match["value"]))
                return {"discount_amt": amt, "discount_label": match["name"], "discount_base": base_price}

        if custom and custom.get("value"):
            val = float(custom["value"])
            if custom.get("type") == "percent":
                amt = round(base_price * val / 100)
                label = f"Custom {val}% discount"
            else:
                amt = round(val)
                label = f"Custom ₹{amt:,} discount"
            return {"discount_amt": amt, "discount_label": label, "discount_base": base_price}

        return {"discount_amt": 0, "discount_label": "", "discount_base": base_price}

    # ── Upgrade BOM ───────────────────────────────────────────────────────────

    def _compute_upgrade(self) -> dict:
        p = self.p
        from_kw = float(p.get("upgrade_from_kw", 3))
        to_kw = float(p.get("upgrade_to_kw", 5))
        tier = p["tier"]
        sections = p.get("upgrade_sections", {
            "panels": True, "structure": True, "inverter": True,
            "hybrid_inv": False, "battery": False, "wiring": True,
        })

        new_panels = max(1, round((to_kw - from_kw) / 0.55))
        is_hyb_upgrade = sections.get("hybrid_inv", False)

        lines = []
        pos = 0

        # ── Variable slots ────────────────────────────────────────────────────
        slots = list(self.template.slots.all())

        # For hybrid upgrade: replace ongrid inverter slot logic
        inv_idx = next((i for i, s in enumerate(slots) if s.category.slug == "inverter"), None)

        for slot in slots:
            cat_slug = slot.category.slug
            section = UPG_SECTION_MAP.get(cat_slug, "panels")

            # Inverter slot: use hybrid_inv section if hybrid upgrade
            if cat_slug == "inverter":
                effective_section = "hybrid_inv" if is_hyb_upgrade else "inverter"
            else:
                effective_section = section

            if not sections.get(effective_section, False):
                continue

            cat = self.cat_map.get(cat_slug)
            if not cat:
                continue

            # Qty for upgrade slots
            qty_mode = slot.qty_mode or ""
            if qty_mode == "newPanels":
                qty = new_panels
            elif qty_mode == "fixed":
                qty = slot.fixed_qty or 0
            else:
                # Use slot qty for to_kw size
                size_key = str(int(to_kw)) if to_kw == int(to_kw) else str(to_kw)
                qty = slot.qty.get(size_key, 0) if slot.qty else 0

            if not qty:
                continue

            is_3p = to_kw >= 5 and cat_slug in ("inverter", "acdb")
            # Create a simple object to pass phase info
            item = self._select_item_upgrade(cat, tier, slot, is_3p, to_kw, is_hyb_upgrade)
            if not item:
                continue

            unit_price = float(item.price)
            amount = qty * unit_price
            gst_pct = slot.gst or (cat.gst_default if cat else 18)
            gst_amt = round(amount * gst_pct / 100)

            lines.append({
                "pos": pos,
                "name": item.name,
                "brand": item.brand,
                "qty": qty,
                "unit": "m" if cat_slug in ("dc_cable", "ac_cable", "armoured_cable", "ug_cable") else "nos",
                "unit_price": unit_price,
                "amount": amount,
                "gst_pct": gst_pct,
                "gst_amt": gst_amt,
                "section": section,
                "is_variable": True,
            })
            pos += 1

        # ── Fixed items ───────────────────────────────────────────────────────
        path_key = f"{round(from_kw)}_{round(to_kw)}"

        for fi in self.template.fixed_items.all():
            if fi.is_tube:
                continue
            cat_slug = fi.category.slug if fi.category else ""
            section = fi.section or UPG_SECTION_MAP.get(cat_slug, "panels")

            if not sections.get(section, False):
                continue

            cat = self.cat_map.get(cat_slug) if cat_slug else None
            item = fi.catalog_item
            if not item:
                continue

            qty = 0
            if fi.qty:
                if path_key in fi.qty:
                    qty = fi.qty[path_key]
                else:
                    # Auto-scale: find closest known path by panel count
                    def panels_for_key(k):
                        if k in KNOWN_PATHS:
                            return KNOWN_PATHS[k]
                        parts = k.split("_")
                        try:
                            return max(1, round((float(parts[1]) - float(parts[0])) / 0.55))
                        except (IndexError, ValueError):
                            return 4

                    available_keys = list(fi.qty.keys())
                    if available_keys:
                        closest = min(available_keys, key=lambda k: abs(panels_for_key(k) - new_panels))
                        ref_qty = fi.qty.get(closest, 0)
                        ref_panels = panels_for_key(closest)
                        all_same = len(set(fi.qty.values())) == 1
                        qty = ref_qty if all_same else max(1, round(ref_qty * new_panels / ref_panels))

            if not qty:
                continue

            unit_price = float(item.price)
            amount = qty * unit_price
            gst_pct = fi.gst or (cat.gst_default if cat else 18)
            gst_amt = round(amount * gst_pct / 100)

            lines.append({
                "pos": pos,
                "name": item.name,
                "brand": item.brand,
                "qty": qty,
                "unit": "nos",
                "unit_price": unit_price,
                "amount": amount,
                "gst_pct": gst_pct,
                "gst_amt": gst_amt,
                "section": section,
                "is_variable": False,
            })
            pos += 1

        # ── Totals & pricing ──────────────────────────────────────────────────
        totals = self._calc_totals(lines)
        install_kw = to_kw - from_kw
        install = float(self.costs.install_rate) * install_kw
        dist_km = p["dist_km"]
        transport = dist_km * float(self.costs.transport_rate)
        misc = float(self.costs.miscellaneous)
        office = float(self.costs.office)
        cost_total = round(install + transport + misc + office)

        subtotal = totals["material_with_gst"] + cost_total
        margin = self._calc_margin(subtotal)
        grand_total = subtotal + margin

        # Upgrade market rate
        market_rate = self._lookup_upgrade_market_rate(from_kw, to_kw)
        customer_price = market_rate if market_rate > 0 else grand_total

        subsidy = self._calc_subsidy(to_kw)
        discount_info = self._calc_discount(customer_price)
        final_price = max(0, discount_info["discount_base"] - discount_info["discount_amt"])
        price_after_subsidy = max(0, final_price - subsidy)

        cost_bd = {
            "install": round(install),
            "service": 0,
            "transport": round(transport),
            "misc": round(misc),
            "office": round(office),
            "structure_base": 0,
            "structure_extra": 0,
            "structure_labor": 0,
            "structure_repair": 0,
            "cost_total": cost_total,
        }

        return {
            "bom_lines": lines,
            "cost_breakdown": cost_bd,
            "totals": {
                **totals,
                "subtotal": subtotal,
                "margin": margin,
                "grand_total": grand_total,
            },
            "pricing": {
                "market_rate": market_rate,
                "customer_price": customer_price,
                "discount_amt": discount_info["discount_amt"],
                "discount_label": discount_info["discount_label"],
                "final_price": final_price,
                "subsidy_amt": subsidy,
                "subsidy_label": self._subsidy_label(to_kw),
                "price_after_subsidy": price_after_subsidy,
            },
            "meta": {
                "system_type": "upgrade",
                "size": f"{from_kw}→{to_kw}",
                "tier": self.p["tier"],
                "bat_config": "0",
                "is_three_phase": to_kw >= 5,
                "new_panels": new_panels,
            },
            "available_offers": self._applicable_offers(),
        }

    def _select_item_upgrade(self, category, tier, slot, is_3p: bool, to_kw: float, is_hyb: bool):
        """Item selection for upgrade BOM — simplified phase logic from App.jsx lines 1060-1088."""
        available = []
        for item in category.items.all():
            if not item.item_tiers.filter(tier=tier).exists():
                continue

            ft = slot.filter_type
            if ft == "hybrid":
                if item.inverter_type != "hybrid":
                    continue
            elif ft == "ongrid":
                if item.inverter_type and item.inverter_type != "ongrid":
                    continue

            if item.phase:
                if is_3p:
                    if ft == "hybrid":
                        if not (item.phase and "HYB" in item.phase and "3P" in item.phase):
                            continue
                    else:
                        if "3P" not in item.phase:
                            continue
                else:
                    if ft == "hybrid":
                        if not (item.phase and "HYB" in item.phase and "1P" in item.phase):
                            continue
                    else:
                        if "3P" in item.phase:
                            continue

            available.append(item)

        if not available:
            return None

        if slot.category.slug == "inverter" and any(i.kw for i in available):
            return min(available, key=lambda i: abs(float(i.kw or 0) - to_kw))

        return available[0]

    def _lookup_upgrade_market_rate(self, from_kw: float, to_kw: float) -> float:
        from_str = str(int(round(from_kw)))
        to_str = str(int(round(to_kw)))
        for mr in self.market_rates:
            if mr.system_type == "upgrade" and mr.from_size == from_str and mr.to_size == to_str:
                val = (mr.size_rates or {}).get("rate", 0)
                return float(val) if val else 0
        return 0
