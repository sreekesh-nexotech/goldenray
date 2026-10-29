// Solar Inverter Service — fetches inverter data from the backend API.

import {
  SolarInverter,
  InverterFilterState,
  InverterType,
  RatingTier,
  RatingType,
} from "@/types/solarInverter";
import {
  brandSlug,
  fetchProduct,
  fetchProducts,
  orderingFor,
  type CatalogProduct,
  type CatalogSort,
} from "./catalogApi";

// Backend payload (GET /api/public/v1/products/inverters/): the product profile
// with the technical sheet under `spec`.
interface InverterSpec {
  kw: string | null;
  inverter_type: string | null;
  topology: string | null;
  mppt_count: number | null;
  max_pv_voltage_v: number | null;
  max_input_current_text: string | null;
  max_dc_input_kw: string | null;
  efficiency_pct: string | null;
  european_efficiency_pct: string | null;
  mppt_efficiency_pct: string | null;
  dc_oversizing_pct: number | null;
  ac_overloading_pct: number | null;
  weight_kg: string | null;
  ip_rating: string | null;
  display: string | null;
  suitable_system_size: string | null;
  pid_protection: boolean | null;
  iv_curve_scanning: string | null;
  corrosion_protection: string | null;
  operating_temperature: string | null;
  cooling: string | null;
  noise_level: string | null;
  dc_surge_protection: string | null;
  ac_surge_protection: string | null;
  arc_fault_detection: string | null;
  grid_protection: boolean | null;
  monitoring_app: string | null;
  real_time_monitoring: boolean | null;
  remote_diagnostics: string | null;
  firmware_updates: string | null;
  connectivity: string | null;
  certifications: string[] | null;
  brand_trust: string | null;
  year_founded: number | null;
  countries_served: string | null;
  global_installations: string | null;
}

type BackendInverterData = CatalogProduct<InverterSpec>;

const TIER_MAP: Record<string, RatingTier> = {
  PREMIUM: "Premium",
  MID_RANGE: "Mid-Range",
  VALUE: "Value",
};

const RATING_MAP: Record<string, RatingType> = {
  EXCELLENT: "Excellent",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
};

const num = (value: string | number | null | undefined): number =>
  value === null || value === undefined || value === "" ? 0 : Number(value);

// The UI's four inverter kinds come from two backend fields: hybrid is an
// inverter_type, the rest are topologies of an on-grid one.
function inverterTypeOf(spec: InverterSpec): InverterType {
  if (spec.inverter_type === "HYBRID") return "Hybrid";
  if (spec.topology === "MICRO") return "Microinverter";
  if (spec.topology === "OPTIMIZED_STRING") return "Optimized String";
  return "String";
}

// `id` is the product slug (the comparison pages carry it in the URL).
function transformInverterData(b: BackendInverterData): SolarInverter {
  const spec = b.spec;
  return {
    id: b.slug,
    brand: b.brand_label,
    name: b.headline || b.model,
    type: inverterTypeOf(spec),
    ratingTier: TIER_MAP[b.rating_tier ?? ""] ?? "Mid-Range",
    imageUrl: b.image_url,
    description: b.description || b.summary,
    // The UI works in watts; the backend sends kW.
    ratedOutputPower: Math.round(num(spec.kw) * 1000),
    maximumDcInput: Math.round(num(spec.max_dc_input_kw) * 1000),
    mpptTrackers: num(spec.mppt_count),
    maximumDcVoltage: num(spec.max_pv_voltage_v),
    maximumInputCurrent: spec.max_input_current_text ?? "",
    weight: num(spec.weight_kg),
    display: spec.display ?? "",
    suitableSystemSize: spec.suitable_system_size ?? "",
    maximumEfficiency: num(spec.efficiency_pct),
    europeanEfficiency: num(spec.european_efficiency_pct),
    mpptEfficiency: num(spec.mppt_efficiency_pct),
    dcOversizing: num(spec.dc_oversizing_pct),
    acOverloading: num(spec.ac_overloading_pct),
    pidProtection: Boolean(spec.pid_protection),
    ivCurveScanning: spec.iv_curve_scanning ?? "",
    ipRating: spec.ip_rating ?? "",
    corrosionProtection: spec.corrosion_protection ?? "",
    operatingTemperature: spec.operating_temperature ?? "",
    cooling: spec.cooling ?? "",
    noiseLevel: spec.noise_level ?? "",
    dcSurgeProtection: spec.dc_surge_protection ?? "",
    acSurgeProtection: spec.ac_surge_protection ?? "",
    arcFaultDetection: spec.arc_fault_detection ?? "",
    gridProtection: Boolean(spec.grid_protection),
    monitoringApp: spec.monitoring_app ?? "",
    realTimeMonitoring: Boolean(spec.real_time_monitoring),
    remoteDiagnostics: spec.remote_diagnostics ?? "",
    firmwareUpdates: spec.firmware_updates ?? "",
    connectivity: spec.connectivity ?? "",
    warrantyYears: num(b.warranty.product_years),
    extendableWarrantyYears: b.warranty.extendable_years,
    certifications: spec.certifications || [],
    brandTrust: spec.brand_trust ?? "",
    yearFounded: spec.year_founded,
    countriesServed: spec.countries_served ?? "",
    globalInstallations: spec.global_installations ?? "",
    priceRange: b.price_range_label ?? "",
    keralaClimateScore: num(b.kerala_climate_score),
    ratings: {
      efficiency: num(b.ratings.efficiency),
      reliability: num(b.ratings.reliability),
      warranty: num(b.ratings.warranty),
      keralaClimate: num(b.ratings.kerala_climate),
    },
    overallRating: RATING_MAP[b.overall_rating ?? ""] ?? "Good",
  };
}

export function getAvailableInverterBrands(): string[] {
  return [
    "Enphase",
    "GoodWe",
    "Growatt",
    "Huawei",
    "Solis",
    "Sungrow",
  ].sort();
}

export async function getAllInverters(): Promise<SolarInverter[]> {
  try {
    const rows = await fetchProducts<BackendInverterData>("inverters", new URLSearchParams(), 3600);
    return rows.map(transformInverterData);
  } catch (error) {
    console.error("Error fetching all inverters:", error);
    return [];
  }
}

export async function getInverterById(
  id: string,
): Promise<SolarInverter | null> {
  try {
    return transformInverterData(await fetchProduct<BackendInverterData>("inverter", id));
  } catch (error) {
    console.error(`Error fetching inverter ${id}:`, error);
    return null;
  }
}

export async function getInvertersByIds(
  ids: string[],
): Promise<SolarInverter[]> {
  try {
    const params = new URLSearchParams({ slug: ids.join(",") });
    const rows = await fetchProducts<BackendInverterData>("inverters", params, 3600);
    return rows.map(transformInverterData);
  } catch (error) {
    console.error("Error fetching inverters by IDs:", error);
    return [];
  }
}

const TIER_TO_BACKEND: Record<RatingTier, string> = {
  Premium: "PREMIUM",
  "Mid-Range": "MID_RANGE",
  Value: "VALUE",
};

// Build query parameters for filtering (public API v1 names). The inverter kind
// is a client-side filter (see getFilteredInverters): it spans two backend fields.
function buildFilterQuery(filters: InverterFilterState): URLSearchParams {
  const params = new URLSearchParams();

  filters.ratingTiers.forEach((t) => params.append("rating_tier", TIER_TO_BACKEND[t]));

  if (filters.warranties.fifteenYearsPlus) {
    params.append("min_product_warranty", "15");
  } else if (filters.warranties.tenYearsPlus) {
    params.append("min_product_warranty", "10");
  }

  if (filters.warranties.extendableTo25) {
    params.append("min_extendable_warranty", "25");
  }

  if (filters.brands.length > 0) {
    params.append("brand", filters.brands.map(brandSlug).join(","));
  }

  if (filters.keralaClimateRated) {
    params.append("min_kerala_score", "85");
  }

  return params;
}

export async function getFilteredInverters(
  filters: InverterFilterState,
  sortBy: CatalogSort = "topRated",
): Promise<SolarInverter[]> {
  try {
    const params = buildFilterQuery(filters);
    params.set("ordering", orderingFor(sortBy));
    const rows = await fetchProducts<BackendInverterData>("inverters", params);
    const inverters = rows.map(transformInverterData);
    return filters.inverterTypes.length > 0
      ? inverters.filter((inverter) => filters.inverterTypes.includes(inverter.type))
      : inverters;
  } catch (error) {
    console.error("Error fetching filtered inverters:", error);
    return [];
  }
}
