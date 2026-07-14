// src/services/bomService.ts
//
// Builds the "Bill of Materials" object used by the quotation PDF (Page 5).
//
// The customer-facing Solar Calculator has no configuration-selection step, so
// we derive a sensible default configuration (on-grid, "value"/recommended tier,
// residential PM Surya Ghar subsidy) and ask the already-migrated Django BOM
// engine (`/bom/api/calculate/`) to generate the real line items + pricing for
// the system size the calculator computed.
import { API_BASE_URL } from "@/config";

// The BOM app is mounted at `/bom/` on the backend, not under `/api/`.
// API_BASE_URL is e.g. "http://127.0.0.1:8000/api/" → derive ".../bom/".
const BOM_BASE_URL = API_BASE_URL.replace(/api\/?$/, "bom/");
const BOM_CALCULATE_ENDPOINT = "api/calculate/";

// ── Shape consumed by Page5Content ──────────────────────────────────────────
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

// ── Raw backend response (`BomCalculateView.compute()`) ─────────────────────
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

/** Map a system size like "5 kW" to the nearest on-grid BOM `size` key. */
function mapSystemSizeToKey(systemSize: string): { key: string; kw: number } {
  const parsed = parseFloat(systemSize) || 3;
  let best = ONGRID_SIZES[0];
  for (const s of ONGRID_SIZES) {
    if (Math.abs(s.kw - parsed) < Math.abs(best.kw - parsed)) best = s;
  }
  return { key: best.key, kw: best.kw };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
  const tier = "value";

  try {
    const res = await fetch(`${BOM_BASE_URL}${BOM_CALCULATE_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sys_type: "ongrid",
        size: key,
        tier,
        bat_config: "0",
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
      systemLabel: `On-Grid ${kw}kW`,
      tierLabel: capitalize(tier),
    };
  } catch (err) {
    console.error("BOM calculate error:", err);
    return null;
  }
}
