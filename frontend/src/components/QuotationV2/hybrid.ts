/**
 * The hybrid residential quotation, shared by the English and Malayalam
 * documents.
 *
 * A hybrid quote is the on-grid document with three differences: page 5's
 * three packages are battery options (none / one / two) instead of tiers, the
 * on-grid service comparison grid under them becomes the "Our Hybrid Service
 * Promise" panel, and page 7's specification table gains a Battery row.
 *
 * The prices come from the BOM calculator (`bom/views/quotation.py`), which
 * runs the engine once per battery option and sends `systemType: "hybrid"`
 * with `packageTotals` / `financing` keyed by `HybridKey`. Without those
 * fields the document is the on-grid one.
 */
import {
  localPackageFinancing,
  type PackageFinancing,
} from "@/components/QuotationV2/financing";

export type HybridKey = "noBattery" | "oneBattery" | "twoBattery";

/** Left to right, as the design lays the three options out. */
export const HYBRID_KEYS: HybridKey[] = ["noBattery", "oneBattery", "twoBattery"];

/** The recommended option: the middle card and the highlighted spec column. */
export const HYBRID_RECOMMENDED: HybridKey = "oneBattery";

/** The quotation-input fields a hybrid quote adds. */
export interface HybridQuotationInput {
  /** "hybrid" from the BOM calculator; absent / "ongrid" otherwise. */
  systemType?: string;
  /** Pre-subsidy total per option, from the BOM engine. */
  packageTotals?: Partial<Record<string, number>>;
  /** Per-option financing from the EMI calculator's engine. */
  financing?: Partial<Record<string, PackageFinancing>>;
}

/** Card and column names; the design uses the English names in both languages. */
export const HYBRID_OPTION_NAMES: Record<HybridKey, string> = {
  noBattery: "Hybrid System\n(Without Battery)",
  oneBattery: "Hybrid System\n(With Battery)",
  twoBattery: "Hybrid System\n(With 2 Battery)",
};

/**
 * Each option's figures, or null when this is not a hybrid quote.
 *
 * `build` turns a total and its financing into the document's tier shape, so
 * each language's data builder formats the money its own way.
 */
export function buildHybridOptions<T>(
  input: HybridQuotationInput,
  subsidy: number,
  build: (total: number, financing: PackageFinancing) => T,
): Record<HybridKey, T> | null {
  if (input.systemType !== "hybrid") return null;
  const totals = input.packageTotals ?? {};
  if (!HYBRID_KEYS.every((key) => typeof totals[key] === "number")) return null;

  const out = {} as Record<HybridKey, T>;
  for (const key of HYBRID_KEYS) {
    const total = totals[key] as number;
    out[key] = build(total, input.financing?.[key] ?? localPackageFinancing(total, subsidy));
  }
  return out;
}

// ── Page 7: specification rows ──────────────────────────────────────────────
// Only the row labels are translated; the values stay English in both
// documents, as on the on-grid table.

export interface HybridSpecRow {
  label: { English: string; Malayalam: string };
  values: (sizeKW: number) => Record<HybridKey, string>;
  /** The Battery row: the one row a hybrid table adds, set apart in the design. */
  emphasis?: boolean;
}

const same = (value: string) => () => ({ noBattery: value, oneBattery: value, twoBattery: value });

export const HYBRID_SPEC_ROWS: HybridSpecRow[] = [
  {
    label: { English: "Solar Module Brand", Malayalam: "സോളാർ പാനൽ ബ്രാൻഡ്" },
    values: same("Renewsys/Emmvee / Equivalent"),
  },
  {
    label: { English: "Module Power (W) and Type", Malayalam: "പാനൽ ശേഷിയും ടൈപ്പും" },
    values: () => ({
      noBattery: "545-560",
      oneBattery: "550-560",
      twoBattery: "Mono PERC Bifacial Halfcut (530–560W)",
    }),
  },
  {
    label: { English: "Panel Warranty", Malayalam: "പാനൽ വാറന്റി" },
    values: same("12-Year Product & 30 Year Performance Warranty"),
  },
  {
    label: { English: "Inverter Type", Malayalam: "ഇൻവെർട്ടർ ടൈപ്പ്" },
    values: (kw) => same(`${kw}KW 48V Hybrid Inverter`)(),
  },
  {
    label: { English: "Inverter Brand & Warranty", Malayalam: "ഇൻവെർട്ടർ ബ്രാൻഡും വാറന്റിയും" },
    values: same("Deye (10 years)"),
  },
  {
    label: { English: "Mounting Structure", Malayalam: "മൗണ്ടിംഗ് സ്ട്രക്ചർ" },
    values: same("GI Structure for Flat Roof - Apollo"),
  },
  {
    label: { English: "ACDB / DCDB", Malayalam: "ACDB / DCDB" },
    values: same("ETN MCB, Mersen SPD (Single Phase) hybrid Tribox"),
  },
  {
    label: { English: "DC Cable (mm²)", Malayalam: "DC Cable (mm²)" },
    values: same("4 (Polycab / Equivalent)"),
  },
  {
    label: { English: "AC Cable (sqmm)", Malayalam: "AC Cable (sqmm)" },
    values: same("6 (Polycab / Finolex)"),
  },
  {
    label: { English: "Earthing Wire", Malayalam: "Earthing Wire" },
    values: same("10 SWG (20m)"),
  },
  {
    label: { English: "Aluminium Cable", Malayalam: "Aluminium Cable" },
    values: same("50 sqm-excel earthing"),
  },
  {
    label: { English: "Battery", Malayalam: "ബാറ്ററി" },
    values: () => ({
      noBattery: "No Battery",
      oneBattery: "5 unit lithium phosphate battery-DEYE 48V",
      twoBattery: "10 unit lithium phosphate battery-DEYE 48V",
    }),
    emphasis: true,
  },
];

// ── Page 5: service promise ─────────────────────────────────────────────────

export type HybridServiceIcon =
  | "installation"
  | "response"
  | "warranty"
  | "emergencyVisit"
  | "whatsapp"
  | "maintenance"
  | "healthCheck"
  | "panelCleaning"
  | "inverter"
  | "priority"
  | "audit"
  | "emergencySupport"
  | "amc";

export interface HybridServiceItem {
  icon: HybridServiceIcon;
  title: { English: string; Malayalam: string };
  /** English in both documents, as the design has it. */
  detail?: string;
}

/** In reading order: left, right, left, right … */
export const HYBRID_SERVICES: HybridServiceItem[] = [
  { icon: "installation", title: { English: "Installation", Malayalam: "ഇൻസ്റ്റലേഷൻ" }, detail: "5–10 Working Days" },
  { icon: "response", title: { English: "Service Response", Malayalam: "സർവീസ് റെസ്പോൺസ്" }, detail: "Within 7 Working Hours" },
  { icon: "warranty", title: { English: "Standard Warranty Support", Malayalam: "സ്റ്റാൻഡേർഡ് വാറന്റി സപ്പോർട്ട്" } },
  { icon: "emergencyVisit", title: { English: "Emergency Visit", Malayalam: "എമർജൻസി വിസിറ്റ്" } },
  { icon: "whatsapp", title: { English: "WhatsApp Support", Malayalam: "വാട്സ്ആപ്പ് സപ്പോർട്ട്" } },
  { icon: "maintenance", title: { English: "Preventive Maintenance", Malayalam: "പ്രിവന്റീവ് മെയിന്റനൻസ്" }, detail: "5 Years" },
  { icon: "healthCheck", title: { English: "Annual Health Check", Malayalam: "വാർഷിക പരിശോധന" }, detail: "2 Free Visits (1st Year)" },
  { icon: "panelCleaning", title: { English: "Panel Cleaning Visit", Malayalam: "പാനൽ ക്ലീനിംഗ് സേവനം" }, detail: "2 Free Visit (1st Year)" },
  { icon: "inverter", title: { English: "Standby Inverter Access", Malayalam: "സ്റ്റാൻഡ് ബൈ ഇൻവെർട്ടർ" } },
  { icon: "priority", title: { English: "Priority Service Queue", Malayalam: "പ്രയോറിറ്റി സർവീസ് ക്യൂ" } },
  { icon: "audit", title: { English: "Annual Energy Audit & Report", Malayalam: "വാർഷിക എനർജി ഓഡിറ്റ് & റിപ്പോർട്ട്" } },
  { icon: "emergencySupport", title: { English: "Emergency Support", Malayalam: "എമർജൻസി സപ്പോർട്ട്" }, detail: "5–10 Working Days" },
  { icon: "amc", title: { English: "AMC Discount", Malayalam: "AMC ഡിസ്കൗണ്ട്" } },
];
