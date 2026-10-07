// src/services/bomService.ts
//
// Builds the "Bill of Materials" object used by the quotation PDF (Page 5).
//
// The customer-facing Solar Calculator has no configuration-selection step, so
// we derive a sensible default configuration (on-grid, "value"/recommended tier,
// residential PM Surya Ghar subsidy) and ask the already-migrated Django BOM
// engine (`POST /api/public/v1/bom/quote/`) to generate the real line items + pricing for
// the system size the calculator computed.
import { PUBLIC_API_BASE_URL } from "@/config";

const BOM_QUOTE_URL = `${PUBLIC_API_BASE_URL}bom/quote/`;

// ── Shape consumed by Page7Content ──────────────────────────────────────────
export interface QuotationBomLine {
  name: string;
  qty: number;
  unit: string;
}

export interface QuotationBom {
  lines: QuotationBomLine[];
  basePrice: number;
  addOnTotal: number;
  discountAmt: number;
  discountLabel: string;
  finalPrice: number;
  subsidy: number;
  subsidyLabel: string;
  priceAfterSubsidy: number;
  customerName: string;
  salesPerson: string;
  systemLabel: string;
  tierLabel: string;
}

// ── Raw backend response (public BOM quote; no cost breakdown or totals) ────
interface BomApiLine {
  name: string;
  qty: number;
  unit: string;
  [key: string]: unknown;
}

interface BomApiResponse {
  bom_lines: BomApiLine[];
  pricing: {
    market_rate: number;
    customer_price: number;
    discount_amt: number;
    discount_label: string;
    final_price: number;
    subsidy_amt: number;
    subsidy_label: string;
    price_after_subsidy: number;
  };
  meta: { size: string; tier: string };
}

// On-grid sizes offered by the BOM template. We prefer the single-phase 5 kW
// option ("5sp") for a residential default.
const ONGRID_SIZES: { kw: number; key: string }[] = [
  { kw: 3, key: "3" },
  { kw: 5, key: "5sp" },
  { kw: 6, key: "6" },
  { kw: 8, key: "8" },
  { kw: 10, key: "10" },
];

// Sizes the hybrid BOM template offers.
const HYBRID_SIZES: { kw: number; key: string }[] = [
  { kw: 3, key: "3" },
  { kw: 5, key: "5" },
  { kw: 8, key: "8" },
  { kw: 10, key: "10" },
];

/** Map a system size like "5 kW" to the nearest BOM `size` key. */
function mapSystemSizeToKey(
  systemSize: string,
  sizes = ONGRID_SIZES,
): { key: string; kw: number } {
  const parsed = parseFloat(systemSize) || 3;
  let best = sizes[0];
  for (const s of sizes) {
    if (Math.abs(s.kw - parsed) < Math.abs(best.kw - parsed)) best = s;
  }
  return { key: best.key, kw: best.kw };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The recommended tier the customer-facing quotations are priced at. */
const TIER = "value";

interface BomRun {
  sysType: "ongrid" | "hybrid";
  sizeKey: string;
  kw: number;
  batConfig: string;
  customerName: string;
  salesPerson: string;
}

/** One run of the BOM engine, or null if it is unavailable / unseeded. */
async function runBom({ sysType, sizeKey, kw, batConfig, customerName, salesPerson }: BomRun): Promise<QuotationBom | null> {
  try {
    const res = await fetch(BOM_QUOTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sys_type: sysType,
        size: sizeKey,
        tier: TIER,
        bat_config: batConfig,
        subsidy_type: "residential",
      }),
    });

    if (!res.ok) {
      console.error("BOM calculate failed:", res.status);
      return null;
    }

    const data: BomApiResponse = await res.json();
    const pricing = data.pricing;

    return {
      lines: (data.bom_lines || []).map((l) => ({
        name: l.name,
        qty: l.qty,
        unit: l.unit || "nos",
      })),
      basePrice: pricing.customer_price ?? pricing.market_rate ?? 0,
      addOnTotal: 0,
      discountAmt: pricing.discount_amt ?? 0,
      discountLabel: pricing.discount_label ?? "",
      finalPrice: pricing.final_price ?? 0,
      subsidy: pricing.subsidy_amt ?? 0,
      subsidyLabel: pricing.subsidy_label ?? "",
      priceAfterSubsidy: pricing.price_after_subsidy ?? 0,
      customerName,
      salesPerson,
      systemLabel: `${sysType === "hybrid" ? "Hybrid" : "On-Grid"} ${kw}kW`,
      tierLabel: capitalize(TIER),
    };
  } catch (err) {
    console.error("BOM calculate error:", err);
    return null;
  }
}

interface GetQuotationBomArgs {
  systemSize: string;
  customerName: string;
  salesPerson?: string;
}

/**
 * Fetch the Bill of Materials for the quotation. Best-effort: returns `null`
 * if the backend BOM engine is unavailable/unseeded so the quote can still be
 * generated (Page 5 degrades gracefully).
 */
export async function getQuotationBom({
  systemSize,
  customerName,
  salesPerson = "",
}: GetQuotationBomArgs): Promise<QuotationBom | null> {
  const { key, kw } = mapSystemSizeToKey(systemSize);
  return runBom({ sysType: "ongrid", sizeKey: key, kw, batConfig: "0", customerName, salesPerson });
}

/** A hybrid quote's three battery options, priced by the BOM engine. */
export interface HybridBoms {
  /** The hybrid template's nearest size to the calculator's, in kW. */
  kw: number;
  noBattery: QuotationBom;
  oneBattery: QuotationBom;
  twoBattery: QuotationBom;
}

/**
 * Price the hybrid system with no battery, one and two (battery configs
 * "0" / "1" / "2"). Unlike the on-grid BOM this is not optional — the hybrid
 * document's prices come from it — so it returns null if any run fails.
 */
export async function getHybridBoms({
  systemSize,
  customerName,
  salesPerson = "",
}: GetQuotationBomArgs): Promise<HybridBoms | null> {
  const { key, kw } = mapSystemSizeToKey(systemSize, HYBRID_SIZES);
  const run = (batConfig: string) =>
    runBom({ sysType: "hybrid", sizeKey: key, kw, batConfig, customerName, salesPerson });
  const [noBattery, oneBattery, twoBattery] = await Promise.all([run("0"), run("1"), run("2")]);
  if (!noBattery || !oneBattery || !twoBattery) return null;
  return { kw, noBattery, oneBattery, twoBattery };
}
