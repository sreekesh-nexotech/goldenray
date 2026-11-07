/**
 * The commercial specification table. Hybrid uses the residential hybrid rows;
 * these are the on-grid rows, with the residential on-grid table's values, and
 * the column names the commercial designs use.
 */
import type { SpecColumn, SpecRow } from "@/components/QuotationV2/HybridBlocks";
import type { PackageKey } from "@/components/QuotationV2/financing";
import type { HybridKey } from "@/components/QuotationV2/hybrid";

export const COMMERCIAL_HYBRID_NAMES: Record<HybridKey, string> = {
  noBattery: "Hybrid System\n(Without Battery)",
  oneBattery: "Hybrid System\n(With 1 Battery)",
  twoBattery: "Hybrid System\n(With 2 Battery)",
};

export const ONGRID_COLUMNS: SpecColumn<PackageKey>[] = [
  { key: "premium", name: "Elite System\n(Micro inverter)" },
  { key: "smart", name: "Smart System\n(Premium string)", featured: true },
  { key: "basic", name: "Essential" },
];

export const HYBRID_COLUMNS: SpecColumn<HybridKey>[] = [
  { key: "noBattery", name: COMMERCIAL_HYBRID_NAMES.noBattery },
  { key: "oneBattery", name: COMMERCIAL_HYBRID_NAMES.oneBattery, featured: true },
  { key: "twoBattery", name: COMMERCIAL_HYBRID_NAMES.twoBattery },
];

const tiers = (premium: string, smart: string, basic: string) => () => ({ premium, smart, basic });

export const ONGRID_SPEC_ROWS: SpecRow<PackageKey>[] = [
  {
    label: { English: "Solar Module Brand", Malayalam: "സോളാർ പാനൽ ബ്രാൻഡ്" },
    values: tiers("Emmvee / Renewsys/Adani/Equivalent", "Emmvee / Renewsys/Adani/Equivalent", "Renew /Premier / Equivalent"),
  },
  {
    label: { English: "Module Power (W) and Type", Malayalam: "പാനൽ ശേഷിയും ടൈപ്പും" },
    values: tiers(
      "TopCon Bifacial Glass to Glass ( 550-630W)",
      "TopCon Bifacial Glass to Glass ( 550-630W)",
      "Mono PERC Bifacial Halfcut (530–560W)",
    ),
  },
  {
    label: { English: "Panel Warranty", Malayalam: "പാനൽ വാറന്റി" },
    values: tiers(
      "12-Year Product & 30 Year Performance Warranty",
      "12-Year Product & 25-30 Year Performance Warranty",
      "12-Year Product & 30 Year Performance Warranty",
    ),
  },
  {
    label: { English: "Inverter Type", Malayalam: "ഇൻവെർട്ടർ ടൈപ്പ്" },
    values: tiers("Micro Inverter (Single Phase)", "String Inverter (Single Phase)", "String Inverter (Single Phase)"),
  },
  {
    label: { English: "Inverter Brand & Warranty", Malayalam: "ഇൻവെർട്ടർ ബ്രാൻഡും വാറന്റിയും" },
    values: tiers("Enphase / Hoymiles (15 Years)", "Sungrow / Solis / Equivalent (8 Years)", "Premier / Deye / Equivalent (7 Years)"),
  },
  {
    label: { English: "Mounting Structure", Malayalam: "മൗണ്ടിംഗ് സ്ട്രക്ചർ" },
    values: tiers("GI Structure for Flat Roof - Apollo", "GI Structure for Flat Roof - Apollo", "GP Structure for Flat Roof - Apollo"),
  },
  {
    label: { English: "ACDB / DCDB", Malayalam: "ACDB / DCDB" },
    values: tiers("ABB MCB, Citel SPD (Single Phase)", "ETN MCB, Mersen SPD (Single Phase)", "Havells"),
  },
  {
    label: { English: "DC Cable (mm²)", Malayalam: "DC Cable (mm²)" },
    values: tiers("4 (Polycab / Equivalent)", "4 (Polycab / Equivalent)", "4 (Wacab / Equivalent)"),
  },
  {
    label: { English: "AC Cable (sqmm)", Malayalam: "AC Cable (sqmm)" },
    values: tiers("4 sqmm (RR / Finolex)", "4 sqmm (RR / Finolex)", "4 sqmm (Flexolite)"),
  },
  {
    label: { English: "Earthing Wire", Malayalam: "Earthing Wire" },
    values: tiers("10 SWG (20m)", "10 SWG (20m)", "10 SWG (20m)"),
  },
  {
    label: { English: "Earthing Wire", Malayalam: "Earthing Wire" },
    values: tiers("10 SWG (20m)", "10 SWG (20m)", "10 SWG (20m)"),
  },
];
