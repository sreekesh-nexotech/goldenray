// src/services/bomAdminService.ts
//
// Authoring client for the data the BOM calculator reads: the component catalog
// and its engineering specs, the structure templates and tube weights, the
// templates' fixed-price items, and the pricing offers.
//
// These are the four admin surfaces of Golden-Ray-BOM, pointed at endpoints the
// platform already serves (`catalog/components/`, `bom/structure-items/`,
// `bom/tube-weights/`, `bom/fixed-items/`, `pricing/offers/`). No new backend
// was needed for them, so this file is the whole of that half of the port.
//
// ── Two deliberate departures from the source tool ────────────────────────
//
// 1. **Explicit Save, not `onBlur` PUT-per-field.** The source writes each field
//    as the cursor leaves it, so a half-typed rate is live for as long as it
//    takes to finish typing, and a multi-field edit is several independent
//    writes that can partly fail. Rows here are saved as a unit.
//
// 2. **Every write carries `expected_version`.** The platform's CRUD rows are
//    versioned and `expected_version` is *optional* on the wire: omit it and a
//    PATCH silently overwrites whatever someone else saved in the meantime.
//    Since every read already returns `version`, there is no reason to ever
//    omit it -- `versioned()` below makes sending it the default rather than
//    something each panel has to remember.

import { StudioApiError, query, studioRequest, type Paginated } from "./studioService";

/* -------------------------------------------------------------------------- */
/*  Shared row shapes                                                          */
/* -------------------------------------------------------------------------- */

/** Every platform CRUD row: a uid to address it by and a version to write against. */
export interface VersionedRow {
  uid: string;
  version: number;
}

export interface CategoryRef {
  uid: string;
  slug: string;
  name: string;
}

export interface ComponentRef {
  uid: string;
  sku: string;
  name: string;
  status: string;
}

/* -------------------------------------------------------------------------- */
/*  The CRUD factory                                                           */
/* -------------------------------------------------------------------------- */

export interface Crud<TRow, TInput> {
  list: (filters?: object) => Promise<TRow[]>;
  create: (body: TInput) => Promise<TRow>;
  update: (uid: string, body: TInput) => Promise<TRow>;
  remove: (uid: string, expectedVersion?: number) => Promise<void>;
}

/**
 * One resource's list/create/update/delete, against any staff path.
 *
 * Deliberately not reusing `emiConfigService`'s private `crud()`: that one
 * hardcodes `emi/` and these four resources live in three different apps.
 *
 * `pageSize` asks for the whole list in one request. These are configuration
 * tables -- a few hundred rows at most -- and an editor that silently showed
 * page one of the catalog would be worse than a slow one: the row you came to
 * fix appears not to exist.
 */
function crud<TRow, TInput extends object>(
  path: string,
  options: { pageSize?: number } = {},
): Crud<TRow, TInput> {
  const base = `${path}/`;
  const pageSize = options.pageSize ?? 500;
  return {
    list: async (filters = {}) =>
      (await studioRequest<Paginated<TRow>>(`${base}${query({ page_size: pageSize, ...filters })}`)).results,
    create: (body) => studioRequest<TRow>(base, { method: "POST", body }),
    update: (uid, body) => studioRequest<TRow>(`${base}${uid}/`, { method: "PATCH", body }),
    // DELETE takes the version as a query parameter: there is no body to put it in.
    remove: (uid, expectedVersion) =>
      studioRequest<void>(`${base}${uid}/${query({ expected_version: expectedVersion })}`, { method: "DELETE" }),
  };
}

/**
 * Wrap a `toInput` so the row's `version` always rides along as
 * `expected_version`, and drop it for a row that does not exist yet (a create
 * has nothing to be stale against, and the field is rejected there).
 */
export function versioned<TRow extends { uid: string; version?: number }, TInput extends object>(
  toInput: (row: TRow) => TInput,
): (row: TRow) => TInput & { expected_version?: number } {
  return (row) => {
    const body = toInput(row);
    if (row.uid.startsWith("new:") || typeof row.version !== "number") return body;
    return { ...body, expected_version: row.version };
  };
}

/**
 * Turn a failed save into something a user can act on.
 *
 * `stale_version` is the one that needs explaining rather than reporting: the
 * row is fine and the edit is fine, but it was written against a copy someone
 * else has since changed, and the fix is to reload rather than retry.
 */
export function saveErrorMessage(err: unknown): string {
  if (err instanceof StudioApiError) {
    // Keyed on the machine code, not the status: 409 is also how a few other
    // conflicts surface, and only this one is fixed by reloading.
    if (err.code === "stale_version") {
      return "Someone else changed this row while you were editing it. Reload to get their version, then re-apply your change.";
    }
    if (err.status === 403) return "Your role does not include editing this.";
    const fields = err.fieldErrors ? Object.entries(err.fieldErrors) : [];
    if (fields.length) {
      return fields
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : String(v)}`)
        .join("; ");
    }
  }
  return err instanceof Error ? err.message : "Could not save";
}

/* -------------------------------------------------------------------------- */
/*  1. Catalog components (+ engineering specs)                                */
/* -------------------------------------------------------------------------- */

/**
 * The panel specs the string/MPPT engine reads. Without these a quote still
 * prices, but `string_config` comes back absent -- the engine returns nothing
 * rather than guessing a layout an installer might build.
 */
export interface PanelSpec {
  wattage_w?: number | null;
  voc_v?: string | null;
  vmp_v?: string | null;
  isc_a?: string | null;
  imp_a?: string | null;
  temperature_coefficient_voc?: string | null;
  max_system_voltage_v?: number | null;
  /** DCR content. Also a selection gate and a subsidy condition, not just a label. */
  is_dcr?: boolean | null;
  efficiency_pct?: string | null;
}

export interface InverterSpec {
  kw?: string | null;
  inverter_type?: string | null;
  topology?: string | null;
  phase?: string | null;
  mppt_count?: number | null;
  mppt_voltage_min_v?: number | null;
  mppt_voltage_max_v?: number | null;
  max_pv_voltage_v?: number | null;
  max_strings_per_mppt?: number | null;
  max_isc_a?: string | null;
  panels_per_device?: number | null;
}

export interface CatalogComponent extends VersionedRow {
  sku: string;
  name: string;
  model: string;
  category: CategoryRef | null;
  brand_label: string;
  status: string;
  is_public: boolean;
  /**
   * Derived server-side from the live tier rows -- not simply what was last
   * written. Note the catalog spells tiers uppercase (`BASE`) while the BOM
   * quote speaks lowercase (`base`); this is the boundary between the two.
   *
   * A component with no tiers is invisible to every quote, so the editor must
   * not let a row be saved empty.
   */
  tiers: CatalogTier[];
  spec_kind: string | null;
  panel_spec: PanelSpec | null;
  inverter_spec: InverterSpec | null;
  effective_gst_rate: string | null;
  effective_unit: string | null;
}

export type CatalogTier = "BASE" | "VALUE" | "PREMIUM";

export interface CatalogComponentInput {
  name?: string;
  model?: string;
  brand_label?: string;
  is_public?: boolean;
  tiers?: CatalogTier[];
  panel_spec?: PanelSpec | null;
  inverter_spec?: InverterSpec | null;
}

export const components = crud<CatalogComponent, CatalogComponentInput>("catalog/components", { pageSize: 1000 });

export interface CatalogCategory extends VersionedRow {
  slug: string;
  name: string;
  /** What the BOM engine treats the category as: MAIN_PANEL, MAIN_INVERTER, … */
  bom_role: string;
  /** Which spec table its components carry: panel, inverter, battery, structure, or null. */
  spec_kind: "panel" | "inverter" | "battery" | "structure" | null;
  gst_rate: string | null;
  unit: string;
  sort_order: number;
  is_active: boolean;
}

/**
 * Every category, so the catalog editor is complete by construction.
 *
 * The source tool drives its editor off a hand-written `CAT_ORDER` that omits
 * about fourteen of the categories the BOM actually uses, so those rows cannot
 * be edited there at all. Reading the list from the API cannot drift that way.
 */
export const categories = crud<CatalogCategory, never>("catalog/categories");

/* -------------------------------------------------------------------------- */
/*  2. Structure templates, items and tube weights                             */
/* -------------------------------------------------------------------------- */

export interface StructureTemplateRow extends VersionedRow {
  slug: string;
  name: string;
  labour_rate_key: string;
}

export const structureTemplates = crud<StructureTemplateRow, { slug?: string; name?: string; labour_rate_key?: string }>(
  "bom/structure-templates",
);

/** TUBE is priced by weight x the per-kg rate; FIXED is priced per unit. */
export type StructureItemType = "TUBE" | "FIXED";

export interface StructureItemRow extends VersionedRow {
  template_uid: string;
  name: string;
  item_type: StructureItemType;
  tube_size: string;
  weight_kg: string | null;
  unit_price: string | null;
  unit: string;
  length_m_per_kw: string | null;
  qty_rule: unknown;
  sort_order: number;
}

export interface StructureItemInput {
  template_uid?: string;
  name?: string;
  item_type?: StructureItemType;
  tube_size?: string;
  weight_kg?: string | null;
  unit_price?: string | null;
  unit?: string;
  length_m_per_kw?: string | null;
  qty_rule?: unknown;
  sort_order?: number;
}

export const structureItems = crud<StructureItemRow, StructureItemInput>("bom/structure-items");

/**
 * Tube weight per metre, by size.
 *
 * Structure is priced as weight x a per-kg rate, so this table is a direct
 * multiplier on the structure cost of every quote that uses that tube -- the
 * one place in these four editors where a typo moves every price at once.
 */
export interface TubeWeightRow extends VersionedRow {
  tube_size: string;
  weight_kg: string;
}

export const tubeWeights = crud<TubeWeightRow, { tube_size?: string; weight_kg?: string }>("bom/tube-weights");

/* -------------------------------------------------------------------------- */
/*  3. Fixed-price items                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A template's fixed items: the rows priced from the template rather than from
 * the catalog (consumables, labour lines, the structure tubes on the upgrade
 * path). `condition` decides which configurations they appear in.
 */
export interface FixedItemRow extends VersionedRow {
  template_uid: string;
  component: ComponentRef | null;
  category: CategoryRef | null;
  code: string;
  name: string;
  unit_price: string | null;
  gst_rate: string | null;
  qty: string | null;
  qty_rule: unknown;
  condition: Record<string, unknown>;
  section: string;
  unit: string;
  /** Priced by weight through structure costing on the standard path. */
  is_tube: boolean;
  sort_order: number;
}

export interface FixedItemInput {
  template_uid?: string;
  name?: string;
  code?: string;
  unit_price?: string | null;
  gst_rate?: string | null;
  qty?: string | null;
  section?: string;
  unit?: string;
  is_tube?: boolean;
  sort_order?: number;
}

export const fixedItems = crud<FixedItemRow, FixedItemInput>("bom/fixed-items", { pageSize: 1000 });

export interface BomTemplateRow extends VersionedRow {
  system_type: string;
  name: string;
  is_active: boolean;
  sizes: { key: string; label: string }[];
  three_phase_sizes: string[];
  tiers: string[];
  battery_configs: string[];
}

export const templates = crud<BomTemplateRow, never>("bom/templates");

/* -------------------------------------------------------------------------- */
/*  4. Offers                                                                  */
/* -------------------------------------------------------------------------- */

export type OfferType = "FLAT" | "PERCENT";
export type OfferStatus = "DRAFT" | "APPROVED" | "ACTIVE" | "PAUSED" | "EXPIRED" | "ARCHIVED";
export type OfferSystem = "ALL" | "ONGRID" | "HYBRID" | "UPGRADE";
export type OfferTier = "ALL" | "BASE" | "VALUE" | "PREMIUM";

export interface OfferTransition {
  from_status: string;
  to_status: string;
  at: string;
  by: string;
  reason: string;
}

/**
 * A discount offer. Targeting is four explicit `applies_to_*` columns rather
 * than the source's free-form condition blob, so "which offers apply to this
 * quote?" is a query the database answers.
 */
export interface OfferRow extends VersionedRow {
  code: string;
  name: string;
  type: OfferType;
  value: string;
  /** Not writable: `status` only moves through the four transition actions. */
  status: OfferStatus;
  status_changed_at: string | null;
  applies_to_system: OfferSystem;
  applies_to_tier: OfferTier;
  applies_to_size_key: string;
  starts_on: string | null;
  ends_on: string | null;
  print_on_quotation: boolean;
  stackable: boolean;
  description: string;
  /** Bumped by a content edit, which also sends an APPROVED offer back to DRAFT. */
  content_version: number;
  transitions: OfferTransition[];
}

export interface OfferInput {
  code?: string;
  name?: string;
  type?: OfferType;
  value?: string;
  applies_to_system?: OfferSystem;
  applies_to_tier?: OfferTier;
  applies_to_size_key?: string;
  starts_on?: string | null;
  ends_on?: string | null;
  print_on_quotation?: boolean;
  stackable?: boolean;
  description?: string;
}

const offerCrud = crud<OfferRow, OfferInput>("pricing/offers");

/**
 * Offers have a real approval lifecycle, which the source tool does not: an
 * offer is DRAFT until approved, and only an ACTIVE one discounts a quote.
 *
 * This matters for the UI because the four steps are **separately permissioned**
 * (`offers.approve`, `offers.publish`, `offers.archive`) and `status` is not a
 * PATCH-able field. A screen that offered a status dropdown gated on
 * `offers.edit` would present four controls that each 403 -- so each button asks
 * for the verb the API actually enforces.
 *
 * Editing content is also not free: a change to an APPROVED offer returns it to
 * DRAFT and it has to be approved again. That is a deliberate backend rule, and
 * one worth telling the user about before they save rather than after.
 */
export const offers = {
  ...offerCrud,
  approve: (uid: string, body: { reason?: string; expected_version?: number } = {}) =>
    studioRequest<OfferRow>(`pricing/offers/${uid}/approve/`, { method: "POST", body }),
  activate: (uid: string, body: { reason?: string; expected_version?: number } = {}) =>
    studioRequest<OfferRow>(`pricing/offers/${uid}/activate/`, { method: "POST", body }),
  pause: (uid: string, body: { reason?: string; expected_version?: number } = {}) =>
    studioRequest<OfferRow>(`pricing/offers/${uid}/pause/`, { method: "POST", body }),
  archive: (uid: string, body: { reason?: string; expected_version?: number } = {}) =>
    studioRequest<OfferRow>(`pricing/offers/${uid}/archive/`, { method: "POST", body }),
};

/**
 * Which transitions a status allows, and the permission each needs.
 *
 * Mirrors `pricing/views/offers.py`'s `action_permissions`. Note `destroy` is
 * gated on `archive` rather than `edit`, and DRAFT-only -- deleting an offer
 * that has ever been live is not available, by design.
 */
export const OFFER_TRANSITIONS: Record<
  OfferStatus,
  { action: "approve" | "activate" | "pause" | "archive"; label: string; permission: "approve" | "publish" | "archive" }[]
> = {
  DRAFT: [{ action: "approve", label: "Approve", permission: "approve" }],
  APPROVED: [
    { action: "activate", label: "Activate", permission: "publish" },
    { action: "archive", label: "Archive", permission: "archive" },
  ],
  ACTIVE: [
    { action: "pause", label: "Pause", permission: "publish" },
    { action: "archive", label: "Archive", permission: "archive" },
  ],
  PAUSED: [
    { action: "activate", label: "Resume", permission: "publish" },
    { action: "archive", label: "Archive", permission: "archive" },
  ],
  EXPIRED: [{ action: "archive", label: "Archive", permission: "archive" }],
  ARCHIVED: [],
};
