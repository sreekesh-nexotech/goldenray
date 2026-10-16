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
  /**
   * Required on create and never sent on update: a component's category decides
   * which spec table it carries, so moving one is a different operation from
   * editing it.
   */
  category?: string;
  /** Blank asks the server for the next `<PREFIX>-0001`; fixed once the row leaves DRAFT. */
  sku?: string;
  name?: string;
  model?: string;
  brand_label?: string;
  is_public?: boolean;
  is_premium?: boolean;
  tiers?: CatalogTier[];
  panel_spec?: PanelSpec | null;
  inverter_spec?: InverterSpec | null;
}

const componentsCrud = crud<CatalogComponent, CatalogComponentInput>("catalog/components", {
  pageSize: 1000,
});

/**
 * Components, plus the two lifecycle steps a newly created one needs.
 *
 * A component is born DRAFT, and **a DRAFT component is invisible to every
 * quote** -- the same silent disappearance as having no tier. So the editor
 * that creates one has to be able to activate it, which is a separate endpoint
 * and a separate permission (`catalog.approve`, not `catalog.edit`).
 */
export const components = {
  ...componentsCrud,
  activate: (uid: string, body: { expected_version?: number; reason?: string } = {}) =>
    studioRequest<CatalogComponent>(`catalog/components/${uid}/activate/`, { method: "POST", body }),
  retire: (uid: string, body: { expected_version?: number; reason?: string } = {}) =>
    studioRequest<CatalogComponent>(`catalog/components/${uid}/retire/`, { method: "POST", body }),
};

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
/**
 * What `POST catalog/categories/` accepts.
 *
 * `bom_role` is the consequential field: it decides which spec table the
 * category's components carry (MAIN_PANEL -> panel, MAIN_INVERTER -> inverter,
 * BATTERY, STRUCTURE), and everything else carries none. Picking the wrong one
 * means the engineering fields the string engine needs never appear.
 */
export interface CatalogCategoryInput {
  slug: string;
  name: string;
  bom_role?: string;
  /** A fraction, not a percentage: 0.18 is 18 %. */
  gst_rate: string;
  hsn_code?: string;
  unit?: string;
  sku_prefix: string;
  sort_order?: number;
  is_active?: boolean;
}

/** The BOM roles, and the spec table each one gives its components. */
export const BOM_ROLES: { value: string; label: string; spec: string | null }[] = [
  { value: "MAIN_PANEL", label: "Main panel", spec: "panel" },
  { value: "MAIN_INVERTER", label: "Main inverter", spec: "inverter" },
  { value: "BATTERY", label: "Battery", spec: "battery" },
  { value: "STRUCTURE", label: "Structure", spec: "structure" },
  { value: "PROTECTION", label: "Protection", spec: null },
  { value: "CABLE", label: "Cable", spec: null },
  { value: "EARTHING", label: "Earthing", spec: null },
  { value: "SERVICE", label: "Service", spec: null },
  { value: "MISC", label: "Miscellaneous", spec: null },
];

export const CATEGORY_UNITS = ["NOS", "M", "KG", "SET"] as const;

export const categories = crud<CatalogCategory, CatalogCategoryInput>("catalog/categories");

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

/* -------------------------------------------------------------------------- */
/*  5. Cost config (installation, service, transport, structure rates, margin) */
/* -------------------------------------------------------------------------- */

/**
 * One configurable cost key.
 *
 * `internal` keys are margin data: without `pricing_internal.view` the API
 * returns them with `value: null` and `hidden: true` rather than omitting them,
 * so the screen can say "you may not see this" instead of implying the key does
 * not exist.
 */
export interface CostKeySpec {
  key: string;
  group: string;
  kind: "money" | "integer" | "fraction" | "document";
  description: string;
  internal: boolean;
}

export interface CostRow {
  uid: string;
  key: string;
  value: unknown;
  hidden: boolean;
  effective_from: string;
  effective_to: string | null;
  note: string;
  version: number;
}

export interface CostConfigBody {
  keys: CostKeySpec[];
  current: CostRow[];
}

/**
 * Cost config is **append-only and dated**: a save writes a new effective row
 * and closes the previous one, rather than overwriting a value. So the history
 * of what a quote was priced against survives, and `effective_from` cannot be
 * backdated before the current row or set in the future.
 *
 * It is also a **batch** PUT. That is the point: the source tool writes each
 * cost field as the cursor leaves it, so changing the GP and GI rates together
 * is two writes that can half-succeed, leaving the two tiers priced against
 * different vintages. One call, one effective date.
 *
 * `current_uid` is the staleness check — the uid of the row the client saw. It
 * is per entry rather than per request because each key has its own current row.
 */
export const costConfig = {
  get: () => studioRequest<CostConfigBody>("pricing/cost-config/"),
  put: (body: {
    entries: { key: string; value: unknown; current_uid?: string | null }[];
    effective_from?: string;
    note?: string;
  }) =>
    studioRequest<{ written: CostRow[]; current: CostRow[] }>("pricing/cost-config/", {
      method: "PUT",
      body,
    }),
};

/**
 * The cost keys the BOM calculator reads, in the order the source tool shows
 * them. Every one maps to an existing registry key — the port needed no new
 * configuration, only an editor for it.
 */
export const BOM_COST_KEYS: { key: string; label: string; hint?: string }[] = [
  { key: "install_rate", label: "Installation", hint: "Per kW." },
  { key: "service_rate_year", label: "Service", hint: "Per year." },
  { key: "service_years", label: "Service years" },
  { key: "transport_rate_per_km", label: "Transport", hint: "Per km, for the whole distance." },
  {
    key: "transport_base_km",
    label: "Distance included",
    hint: "Beyond this, the extra-km rate is added on top of the market rate — not into the cost.",
  },
  { key: "transport_extra_rate_per_km", label: "Extra distance", hint: "Per km beyond the included distance." },
  { key: "miscellaneous", label: "Miscellaneous", hint: "Per project." },
  { key: "office_per_project", label: "Office", hint: "Per project." },
  { key: "elevated_structure_rate", label: "Elevated structure" },
  { key: "sheet_structure_rate", label: "Sheet-roof structure" },
  { key: "gp_rate_per_kg", label: "GP tube", hint: "Per kg. Base tier." },
  { key: "gi_rate_per_kg", label: "GI tube", hint: "Per kg. Value and premium tiers." },
  { key: "structure_labor", label: "Structure labour", hint: "Per project." },
  { key: "structure_repair_pct", label: "Structure repair", hint: "A fraction: 0.1 is 10%." },
];

/* -------------------------------------------------------------------------- */
/*  6. The electricity tariff (`energy.config`)                                */
/* -------------------------------------------------------------------------- */

/**
 * The tariff lives in the **same** `CostConfig` registry as the cost rates above, under
 * the key `energy.config`, validated server-side by `engines.energy.validate_energy_config`.
 *
 * It deliberately has no model of its own. A dedicated table would duplicate what
 * `CostConfig` already provides -- append-only dated rows, an audit trail, a validator and
 * `pricing.edit` gating -- and would fork where the tariff lives: `engines/energy.py`
 * reads `cost_config["energy.config"]`, so a second home means two answers to "what is
 * the current tariff?". The editor is new; the storage is not.
 */

/** One slab: everything up to `upToUnits` is charged at `ratePerUnit`. */
export interface TariffSlab {
  upToUnits: number | null;
  ratePerUnit: number;
  note?: string;
}

/** Fixed charge for a consumption band. Separate tables per connection phase. */
export interface FixedChargeSlab {
  upToUnits: number | null;
  chargeBiMonthly: number;
  note?: string;
}

export interface TariffRegion {
  regionId?: string;
  regionName?: string;
  discom?: string;
  tariffName?: string;
  tariffVersion?: string;
  tariffAuthority?: string;
  tariffOrder?: string;
  effectivePeriod?: string;
  tariffCategory?: string;
  billingPeriod?: string;
  note?: string;
  /**
   * Above this many units the tariff stops being telescopic: the **entire** consumption
   * is charged at one flat rate from `nonTelescopicSlabs`, not just the excess. Getting
   * this boundary wrong changes the bill by multiples, not percentages.
   */
  nonTelescopicThreshold?: number;
  electricityDutyPct?: number;
  electricityDutyBasis?: string;
  tariffSlabs: TariffSlab[];
  nonTelescopicSlabs: TariffSlab[];
  fixedChargeSlabs: { singlePhase: FixedChargeSlab[]; threePhase: FixedChargeSlab[]; note?: string };
  meterRent: { singlePhaseBiMonthly: number; threePhaseBiMonthly: number; note?: string };
  yield: { dailyGenPerKw: number; unit?: string; source?: string; note?: string };
  sizing: { coverageTarget: number; note?: string };
}

export interface EnergyConfig {
  configVersion: string;
  regions: Record<string, TariffRegion>;
}

export const ENERGY_CONFIG_KEY = "energy.config";

/**
 * Read the tariff out of a cost-config body.
 *
 * Returns null when the key has never been set (which is what the bill helper reports as
 * "no electricity tariff is configured") and when the value is hidden or malformed --
 * all three mean "there is nothing here to edit", and a half-built form over a broken
 * document is worse than an empty state.
 */
export function readEnergyConfig(body: CostConfigBody): EnergyConfig | null {
  const row = body.current.find((r) => r.key === ENERGY_CONFIG_KEY);
  const value = row?.value as EnergyConfig | undefined;
  if (!value || typeof value !== "object" || !value.regions) return null;
  return value;
}

/**
 * What the server's validator insists on, checked here first so a mistake is a message
 * next to the field rather than a 400 after the save.
 *
 * Deliberately not a full re-implementation of `validate_energy_config`: this catches the
 * errors a person actually makes in a form -- an out-of-order slab, a missing rate, a
 * coverage target typed as 85 instead of 0.85 -- and leaves the schema's own guarantees
 * to the server, which is the only side that can be authoritative about them.
 */
export function validateTariff(region: TariffRegion): string[] {
  const problems: string[] = [];

  const checkSlabs = (slabs: { upToUnits: number | null }[], label: string) => {
    if (!slabs.length) {
      problems.push(`${label}: at least one slab is needed.`);
      return;
    }
    let previous = 0;
    slabs.forEach((slab, i) => {
      const last = i === slabs.length - 1;
      if (slab.upToUnits === null || slab.upToUnits === undefined) {
        // A null ceiling means "everything above", which only makes sense last.
        if (!last) problems.push(`${label}: only the final slab may be open-ended.`);
        return;
      }
      if (!(slab.upToUnits > previous)) {
        problems.push(`${label}: slab ${i + 1} must cover more units than the one before it.`);
      }
      previous = slab.upToUnits;
    });
  };

  checkSlabs(region.tariffSlabs ?? [], "Telescopic slabs");
  checkSlabs(region.nonTelescopicSlabs ?? [], "Non-telescopic slabs");
  checkSlabs(region.fixedChargeSlabs?.singlePhase ?? [], "Fixed charge (single phase)");
  checkSlabs(region.fixedChargeSlabs?.threePhase ?? [], "Fixed charge (three phase)");

  for (const [slabs, label] of [
    [region.tariffSlabs ?? [], "Telescopic slabs"],
    [region.nonTelescopicSlabs ?? [], "Non-telescopic slabs"],
  ] as [TariffSlab[], string][]) {
    if (slabs.some((s) => !(s.ratePerUnit > 0))) problems.push(`${label}: every slab needs a rate above zero.`);
  }

  const coverage = region.sizing?.coverageTarget;
  if (!(typeof coverage === "number" && coverage > 0 && coverage <= 1)) {
    problems.push("Coverage target must be a fraction between 0 and 1 — 0.85 for 85%.");
  }
  if (!(region.yield?.dailyGenPerKw > 0)) {
    problems.push("Daily generation per kW must be above zero.");
  }
  const duty = region.electricityDutyPct;
  if (duty !== undefined && !(duty >= 0 && duty <= 100)) {
    problems.push("Electricity duty must be a percentage between 0 and 100.");
  }
  return problems;
}

/* -------------------------------------------------------------------------- */
/*  7. Market rates — the price list                                           */
/* -------------------------------------------------------------------------- */

/**
 * Market rates are what a customer is actually quoted when a price exists for
 * their configuration: the engine uses `market_rate + add-ons + price deltas`
 * and ignores the cost-plus ladder entirely. So this is the largest single lever
 * on a quote, and it is versioned accordingly.
 *
 * Two platform rules the UI must follow rather than fight:
 *
 * 1. **Only DRAFT sets are editable.** An ACTIVE set is what customers are being
 *    quoted from; changing it in place would rewrite history. To revise prices
 *    you clone it (`copy_from_uid`), edit the copy, then activate.
 * 2. **Exactly one set is ACTIVE**, and activating retires the previous one. The
 *    engine reads only the ACTIVE set, so a DRAFT set -- however complete -- is
 *    priced as if it did not exist, and every quote falls back to cost-plus.
 */
export type RateSetStatus = "DRAFT" | "ACTIVE" | "RETIRED";

export interface MarketRateSet {
  uid: string;
  name: string;
  status: RateSetStatus;
  activated_at: string | null;
  retired_at: string | null;
  note: string;
  rate_count: number;
  version: number;
}

export interface MarketRate {
  uid: string;
  /** The Flarize key, e.g. `hybrid_value_0_dcr_up5` — what the price list calls this cell. */
  key: string;
  system_type: "ONGRID" | "HYBRID" | "UPGRADE";
  tier: "" | "BASE" | "VALUE" | "PREMIUM";
  battery_config: string;
  size_key: string;
  size_kw: string | null;
  phase: string;
  from_size_key: string;
  /** HYBRID only: which module content this price is for. Blank on on-grid. */
  dcr: "" | "dcr" | "ndcr";
  /** Upgrade-ready: panels at `size_key` now, everything else built for this size. */
  future_size_key: string;
  /** `diffBase` rows carry a baseline for price deltas, not a price. */
  variant: string;
  customer_price_incl_gst: string;
  sort_order: number;
}

/** What `put_rates` accepts. Note it is **replace-all**: see `replaceRates`. */
export interface MarketRateInput {
  system_type: string;
  tier?: string;
  battery_config?: string;
  size_key: string;
  from_size_key?: string;
  dcr?: string;
  future_size_key?: string;
  variant?: string;
  customer_price_incl_gst: string;
  sort_order?: number;
}

export interface ReplaceOutcome {
  created: number;
  updated: number;
  unchanged: number;
  deleted: number;
}

export const rateSets = {
  list: async () =>
    (await studioRequest<Paginated<MarketRateSet>>(`pricing/market-rate-sets/${query({ page_size: 100 })}`)).results,

  rates: async (uid: string) =>
    (await studioRequest<Paginated<MarketRate>>(`pricing/market-rate-sets/${uid}/rates/${query({ page_size: 1000 })}`))
      .results,

  /**
   * Replace **every** rate in the set.
   *
   * `put_rates` upserts what it is given and deletes what it is not, so a caller
   * that sent only the rows it had edited would silently wipe the rest of the
   * price list. The whole set goes every time; `replaceRates` exists partly to
   * make that hard to get wrong by accident.
   */
  replaceRates: (uid: string, rates: MarketRateInput[], expectedVersion?: number) =>
    studioRequest<{ set: MarketRateSet; outcome: ReplaceOutcome }>(`pricing/market-rate-sets/${uid}/rates/`, {
      method: "PUT",
      body: { rates, ...(expectedVersion === undefined ? {} : { expected_version: expectedVersion }) },
    }),

  /** A new DRAFT set. `copy_from_uid` clones an existing set's rates into it. */
  create: (body: { name: string; note?: string; copy_from_uid?: string }) =>
    studioRequest<MarketRateSet>("pricing/market-rate-sets/", { method: "POST", body }),

  /** Makes this set the one quotes are priced from, and retires the previous one. */
  activate: (uid: string, body: { note?: string; expected_version?: number } = {}) =>
    studioRequest<MarketRateSet>(`pricing/market-rate-sets/${uid}/activate/`, { method: "POST", body }),

  /**
   * Soft-delete a set. The ACTIVE one is refused (`market_rate_set_active`), and so is
   * any set a `PriceRelease` points at (`market_rate_set_released`) — a release is a
   * record of what was quoted, so the prices behind it are kept for good.
   */
  remove: (uid: string, expectedVersion?: number) =>
    studioRequest<void>(`pricing/market-rate-sets/${uid}/${query({ expected_version: expectedVersion })}`, {
      method: "DELETE",
    }),
};

/**
 * Whether this set can be deleted, mirroring `delete_set`.
 *
 * Returns the reason rather than a bare false, so the UI can say why instead of
 * showing a dead control. "Released" is not knowable from the set payload, so a
 * released set still shows the button and fails on the server with its own
 * message — better than hiding deletion from every set in case one is released.
 */
export function deletableReason(set: MarketRateSet): string | null {
  if (set.status === "ACTIVE") return "The live price list cannot be deleted. Activate another one first.";
  return null;
}

/** A rate row back into the shape `put_rates` accepts. */
export function toRateInput(rate: MarketRate): MarketRateInput {
  return {
    system_type: rate.system_type,
    tier: rate.tier,
    battery_config: rate.battery_config,
    size_key: rate.size_key,
    from_size_key: rate.from_size_key,
    dcr: rate.dcr,
    future_size_key: rate.future_size_key,
    variant: rate.variant,
    customer_price_incl_gst: rate.customer_price_incl_gst,
    sort_order: rate.sort_order,
  };
}
