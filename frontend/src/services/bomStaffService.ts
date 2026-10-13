// src/services/bomStaffService.ts
//
// Client for the staff BOM calculator on the new platform backend
// (`/api/v1/bom/quote/`, `/api/v1/bom/quote-options/`).
//
// There is no separate sign-in: it sends the Content Studio access token. The
// platform verifies that token (shared signing key), maps its e-mail to a
// platform account, and authorises from that account's platform role —
// `bom.view` for the calculator; the cost breakdown/totals additionally need
// `pricing_internal.view`. A Studio user with no matching platform account (or
// without `bom.view`) gets an error, not data.


/* -------------------------------------------------------------------------- */
/*  Shapes                                                                     */
/* -------------------------------------------------------------------------- */

export type BomSystemType = "ongrid" | "hybrid" | "upgrade";
export type BomTier = "base" | "value" | "premium";
export type BomStructureType = "flatRoof" | "elevated" | "sheetRoof";
export type BomSubsidyType = "none" | "residential" | "ghs";
export type BomAmountType = "percent" | "flat";
/**
 * Module content. It decides three things at once, which is why it is not just a
 * subsidy toggle: which panels may be offered, whether PM Surya Ghar applies, and
 * (hybrid only) which price list the quote reads.
 */
export type BomModuleDcr = "dcr" | "ndcr";

export interface BomQuoteRequest {
  sys_type: BomSystemType;
  size: string;
  tier: BomTier;
  bat_config?: string;
  dist_km?: number;
  structure_type?: BomStructureType;
  subsidy_type?: BomSubsidyType;
  module_dcr?: BomModuleDcr;
  ghs_houses?: number;
  selected_offer_id?: string | null;
  custom_discount?: { type: BomAmountType; value: number } | null;
  margin_type?: BomAmountType;
  margin_val?: number;
  upgrade_from_kw?: number;
  upgrade_to_kw?: number;
  upgrade_sections?: Record<string, boolean>;
}

export interface BomQuoteLine {
  pos: number;
  name: string;
  brand: string;
  qty: number;
  unit: string;
  unit_price: number;
  amount: number;
  gst_pct: number;
  gst_amt: number;
  section: string;
  is_variable: boolean;
}

export interface BomCostBreakdown {
  install: number;
  service: number;
  transport: number;
  misc: number;
  office: number;
  structure_base: number;
  structure_extra: number;
  structure_labor: number;
  structure_repair: number;
  cost_total: number;
}

export interface BomTotals {
  material_ex_gst: number;
  /**
   * Per-category GST buckets. Zero under the composite regime, where the whole bill is
   * taxed once — there they are written only by custom items. Kept because the
   * quotations snapshots and packs read them.
   */
  gst_5: number;
  gst_12: number;
  gst_18: number;
  /** GST on the material, whichever regime produced it. */
  gst_total: number;
  material_with_gst: number;
  /**
   * Composite regime only: the cost the margin is taken on, and the single GST charge on
   * (cost + profit). Null under the per-line regime, where margin is taken on a
   * GST-inclusive subtotal.
   */
  pre_gst_subtotal: number | null;
  gst_on_sale: number | null;
  subtotal: number;
  margin: number;
  grand_total: number;
}

export interface BomQuotePricing {
  market_rate: number;
  customer_price: number;
  discount_amt: number;
  discount_label: string;
  final_price: number;
  subsidy_amt: number;
  subsidy_label: string;
  price_after_subsidy: number;
}

export interface BomOffer {
  offer_id: string;
  name: string;
  offer_type: string;
  value: number;
}

export interface BomQuoteResponse {
  bom_lines: BomQuoteLine[];
  /** Present only for callers holding `pricing_internal.view`. */
  cost_breakdown?: BomCostBreakdown;
  totals?: BomTotals;
  pricing: BomQuotePricing;
  // Upgrade quotes carry additional keys; the standard shape is typed here.
  meta: Record<string, unknown>;
  available_offers: BomOffer[];
}

export interface BomSizeOption {
  key: string;
  label: string;
}

export interface BomSystemOptions {
  name: string;
  sizes: BomSizeOption[];
  three_phase_sizes: string[];
  tiers: BomTier[];
  battery_configs: string[];
}

export interface BomQuoteOptions {
  system_types: Partial<Record<BomSystemType, BomSystemOptions>>;
  structure_types: BomStructureType[];
  subsidy_types: BomSubsidyType[];
}

export class BomApiError extends Error {
  status: number;
  code: string | null;
  fieldErrors: Record<string, string[]>;
  constructor(status: number, message: string, code: string | null = null, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/* -------------------------------------------------------------------------- */
/*  Requests                                                                   */
/* -------------------------------------------------------------------------- */

async function parse<T>(res: Response): Promise<T> {
  if (res.ok) return (await res.json()) as T;
  let body: { code?: string; message?: string; errors?: Record<string, string[]> } = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON error body */
  }
  throw new BomApiError(res.status, body.message || `Request failed (${res.status})`, body.code ?? null, body.errors ?? {});
}

/**
 * One call to the staff API through the Studio's BFF, which holds the token and
 * does the refresh-and-retry. The Studio now signs in to the platform directly,
 * so the old CMS-token bridge (and its "no matching platform account" case) is
 * gone: a 401 here simply means the session is over.
 */
async function request<T>(path: string, init: { method: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/fe-api/studio/proxy/${path}`, {
      method: init.method,
      headers: { "Content-Type": "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch {
    throw new BomApiError(0, "Can’t reach the server — check your connection and try again.", "network_error");
  }
  if (res.status === 401) {
    throw new BomApiError(401, "Your Studio session expired. Sign in again.", "session_expired");
  }
  return parse<T>(res);
}

/* -------------------------------------------------------------------------- */
/*  Endpoints                                                                  */
/* -------------------------------------------------------------------------- */

export const getBomQuoteOptions = () => request<BomQuoteOptions>("bom/quote-options/", { method: "GET" });

export const runBomQuote = (body: BomQuoteRequest) =>
  request<BomQuoteResponse>("bom/quote/", { method: "POST", body });
