/**
 * The short quotation: one system, chosen in the Studio.
 *
 * The full document compares three options. The short copy carries only the
 * chosen one — an on-grid package or a hybrid battery option — so the
 * specification and investment pages read the single `short` block built here
 * instead of the comparison, in the residential and commercial documents alike.
 *
 * Shared by the English and Malayalam data builders. Spec values stay English
 * in both documents, as on the comparison tables.
 */
import { PACKAGE_KEYS, type PackageKey } from "@/components/QuotationV2/financing";
import {
  HYBRID_KEYS,
  HYBRID_OPTION_NAMES,
  HYBRID_RECOMMENDED,
  HYBRID_SPEC_ROWS,
  type HybridKey,
} from "@/components/QuotationV2/hybrid";
import type { PropertyType, SystemType } from "@/components/SolarCalculator/installationType";

export type ShortSystemKey = PackageKey | HybridKey;

const PACKAGE_NAMES: Record<PackageKey, string> = {
  premium: "Elite System (Micro inverter)",
  smart: "Smart System",
  basic: "Essential System",
};

/** The commercial document's names for the same systems, where they differ. */
const COMMERCIAL_NAMES: Partial<Record<ShortSystemKey, string>> = {
  smart: "Smart System (Premium string)",
  basic: "Essential",
  oneBattery: "Hybrid System (With 1 Battery)",
};

function systemName(key: ShortSystemKey, sector?: PropertyType): string {
  const commercial = sector === "commercial" ? COMMERCIAL_NAMES[key] : undefined;
  if (commercial) return commercial;
  return key in PACKAGE_NAMES
    ? PACKAGE_NAMES[key as PackageKey]
    : HYBRID_OPTION_NAMES[key as HybridKey].replace("\n", " ");
}

/** The Studio's system picker, in the order the document lists them. */
export function shortSystemOptions(
  systemType: SystemType,
  sector: PropertyType,
): { value: ShortSystemKey; label: string }[] {
  const keys: ShortSystemKey[] = systemType === "hybrid" ? HYBRID_KEYS : PACKAGE_KEYS;
  return keys.map((value) => ({ value, label: systemName(value, sector) }));
}

export function recommendedShortSystem(systemType: SystemType): ShortSystemKey {
  return systemType === "hybrid" ? HYBRID_RECOMMENDED : "smart";
}

const ONGRID_SPECS: { label: { English: string; Malayalam: string }; values: Record<PackageKey, string> }[] = [
  {
    label: { English: "Solar Module Brand", Malayalam: "സോളാർ പാനൽ ബ്രാൻഡ്" },
    values: {
      premium: "Emmvee / Renewsys/Adani/Equivalent",
      smart: "Emmvee / Renewsys/Adani/Equivalent",
      basic: "Renew /Premier / Equivalent",
    },
  },
  {
    label: { English: "Module Power (W) and Type", Malayalam: "പാനൽ ശേഷിയും ടൈപ്പും" },
    values: {
      premium: "TopCon Bifacial Glass to Glass ( 550-630W)",
      smart: "TopCon Bifacial Glass to Glass ( 550-630W)",
      basic: "Mono PERC Bifacial Halfcut (530–560W)",
    },
  },
  {
    label: { English: "Panel Warranty", Malayalam: "പാനൽ വാറന്റി" },
    values: {
      premium: "12-Year Product & 30 Year Performance Warranty",
      smart: "12-Year Product & 25-30 Year Performance Warranty",
      basic: "12-Year Product & 30 Year Performance Warranty",
    },
  },
  {
    label: { English: "Inverter Type", Malayalam: "ഇൻവെർട്ടർ ടൈപ്പ്" },
    values: {
      premium: "Micro Inverter (Single Phase)",
      smart: "String Inverter (Single Phase)",
      basic: "String Inverter (Single Phase)",
    },
  },
  {
    label: { English: "Inverter Brand & Warranty", Malayalam: "ഇൻവെർട്ടർ ബ്രാൻഡും വാറന്റിയും" },
    values: {
      premium: "Enphase / Hoymiles (15 Years)",
      smart: "Sungrow / Solis / Equivalent (8 Years)",
      basic: "Premier / Deye / Equivalent (7 Years)",
    },
  },
  {
    label: { English: "Mounting Structure", Malayalam: "മൗണ്ടിംഗ് സ്ട്രക്ചർ" },
    values: {
      premium: "GI Structure for Flat Roof - Apollo",
      smart: "GI Structure for Flat Roof - Apollo",
      basic: "GP Structure for Flat Roof - Apollo",
    },
  },
  {
    label: { English: "ACDB / DCDB", Malayalam: "ACDB / DCDB" },
    values: {
      premium: "ABB MCB, Citel SPD (Single Phase)",
      smart: "ETN MCB, Mersen SPD (Single Phase)",
      basic: "Havells",
    },
  },
  {
    label: { English: "DC Cable (mm²)", Malayalam: "DC Cable (mm²)" },
    values: {
      premium: "4 (Polycab / Equivalent)",
      smart: "4 (Polycab / Equivalent)",
      basic: "4 (Wacab / Equivalent)",
    },
  },
  {
    label: { English: "AC Cable (sqmm)", Malayalam: "AC Cable (sqmm)" },
    values: {
      premium: "4 sqmm (RR / Finolex)",
      smart: "4 sqmm (RR / Finolex)",
      basic: "4 sqmm (Flexolite)",
    },
  },
  {
    label: { English: "Earthing Wire", Malayalam: "Earthing Wire" },
    values: { premium: "10 SWG (20m)", smart: "10 SWG (20m)", basic: "10 SWG (20m)" },
  },
  {
    // Same value as the hybrid table's row; the on-grid comparison has no such row.
    label: { English: "Aluminium Cable", Malayalam: "Aluminium Cable" },
    values: {
      premium: "50 sqm-excel earthing",
      smart: "50 sqm-excel earthing",
      basic: "50 sqm-excel earthing",
    },
  },
];

export interface ShortSpecRow {
  label: { English: string; Malayalam: string };
  value: string;
  emphasis?: boolean;
}

export interface ShortSystemTier {
  /** Cost before any subsidy. */
  total: string;
  /** What the customer pays once the subsidy is off. */
  final: string;
  emiRate: string;
  emi: string;
}

export interface ShortSystem {
  name: string;
  sizeKW: number;
  tier: ShortSystemTier;
  /** Payback on this system's own net cost, in whole years. */
  paybackYears: number;
  specs: ShortSpecRow[];
}

/**
 * The chosen system, or null when this is not a single-system copy. A hybrid
 * key on an on-grid quote (or the reverse) reads as no selection.
 */
export function buildShortSystem<T extends ShortSystemTier>(
  input: {
    selectedSystem?: string;
    systemType?: string;
    packageTotals?: Partial<Record<string, number>>;
    sector?: PropertyType;
  },
  {
    sizeKW,
    subsidy,
    avgMonthlySavings,
    packageTotals,
    tiers,
  }: {
    sizeKW: number;
    subsidy: number;
    avgMonthlySavings: number;
    /** The on-grid package totals; a hybrid quote's come from the input. */
    packageTotals: Record<PackageKey, number>;
    tiers: Partial<Record<ShortSystemKey, T>>;
  },
): ShortSystem | null {
  const hybrid = input.systemType === "hybrid";
  const key = input.selectedSystem as ShortSystemKey | undefined;
  if (!key || !(hybrid ? HYBRID_KEYS : PACKAGE_KEYS).some((k) => k === key)) return null;

  const tier = tiers[key];
  const total = hybrid ? input.packageTotals?.[key] : packageTotals[key as PackageKey];
  if (!tier || typeof total !== "number") return null;

  const specs: ShortSpecRow[] = hybrid
    ? HYBRID_SPEC_ROWS.map((row) => ({
        label: row.label,
        value: row.values(sizeKW)[key as HybridKey],
        emphasis: row.emphasis,
      }))
    : ONGRID_SPECS.map((row) => ({ label: row.label, value: row.values[key as PackageKey] }));

  return {
    name: systemName(key, input.sector),
    sizeKW,
    tier,
    paybackYears: Math.round((total - subsidy) / (avgMonthlySavings * 12)),
    specs,
  };
}
