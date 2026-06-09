// Solar Inverter Service — fetches inverter data from the backend API.

import {
  SolarInverter,
  InverterFilterState,
  InverterType,
  RatingTier,
  RatingType,
} from "@/types/solarInverter";
import { apiCall } from "./apiService";

// Backend response interfaces
interface BackendInverterData {
  id: number;
  brand: string;
  name: string;
  inverter_type: string;
  rating_tier: string;
  image_url: string;
  description: string;
  rated_output_power: number;
  maximum_dc_input: number;
  mppt_trackers: number;
  maximum_dc_voltage: number;
  maximum_input_current: string;
  weight: string;
  display: string;
  suitable_system_size: string;
  maximum_efficiency: string;
  european_efficiency: string;
  mppt_efficiency: string;
  dc_oversizing: number;
  ac_overloading: number;
  pid_protection: boolean;
  iv_curve_scanning: string;
  ip_rating: string;
  corrosion_protection: string;
  operating_temperature: string;
  cooling: string;
  noise_level: string;
  dc_surge_protection: string;
  ac_surge_protection: string;
  arc_fault_detection: string;
  grid_protection: boolean;
  monitoring_app: string;
  real_time_monitoring: boolean;
  remote_diagnostics: string;
  firmware_updates: string;
  connectivity: string;
  warranty_years: number;
  extendable_warranty_years: number | null;
  certifications: string[];
  brand_trust: string;
  year_founded: number | null;
  countries_served: string;
  global_installations: string;
  price_range: string;
  kerala_climate_score: number;
  efficiency_rating: number;
  reliability_rating: number;
  warranty_rating: number;
  kerala_climate_rating: number;
  overall_rating: string;
}

interface SolarInvertersResponse {
  data: BackendInverterData[];
  meta?: { total: number };
}

interface SingleInverterResponse {
  data: BackendInverterData;
}

const TYPE_MAP: Record<string, InverterType> = {
  string: "String",
  hybrid: "Hybrid",
  microinverter: "Microinverter",
  "optimized-string": "Optimized String",
};

const TIER_MAP: Record<string, RatingTier> = {
  premium: "Premium",
  "mid-range": "Mid-Range",
  value: "Value",
};

const RATING_MAP: Record<string, RatingType> = {
  excellent: "Excellent",
  "very-good": "Very Good",
  good: "Good",
};

function transformInverterData(b: BackendInverterData): SolarInverter {
  return {
    id: b.id.toString(),
    brand: b.brand,
    name: b.name,
    type: TYPE_MAP[b.inverter_type] ?? "String",
    ratingTier: TIER_MAP[b.rating_tier] ?? "Mid-Range",
    imageUrl: b.image_url,
    description: b.description,
    ratedOutputPower: b.rated_output_power,
    maximumDcInput: b.maximum_dc_input,
    mpptTrackers: b.mppt_trackers,
    maximumDcVoltage: b.maximum_dc_voltage,
    maximumInputCurrent: b.maximum_input_current,
    weight: parseFloat(b.weight),
    display: b.display,
    suitableSystemSize: b.suitable_system_size,
    maximumEfficiency: parseFloat(b.maximum_efficiency),
    europeanEfficiency: parseFloat(b.european_efficiency),
    mpptEfficiency: parseFloat(b.mppt_efficiency),
    dcOversizing: b.dc_oversizing,
    acOverloading: b.ac_overloading,
    pidProtection: b.pid_protection,
    ivCurveScanning: b.iv_curve_scanning,
    ipRating: b.ip_rating,
    corrosionProtection: b.corrosion_protection,
    operatingTemperature: b.operating_temperature,
    cooling: b.cooling,
    noiseLevel: b.noise_level,
    dcSurgeProtection: b.dc_surge_protection,
    acSurgeProtection: b.ac_surge_protection,
    arcFaultDetection: b.arc_fault_detection,
    gridProtection: b.grid_protection,
    monitoringApp: b.monitoring_app,
    realTimeMonitoring: b.real_time_monitoring,
    remoteDiagnostics: b.remote_diagnostics,
    firmwareUpdates: b.firmware_updates,
    connectivity: b.connectivity,
    warrantyYears: b.warranty_years,
    extendableWarrantyYears: b.extendable_warranty_years,
    certifications: b.certifications || [],
    brandTrust: b.brand_trust,
    yearFounded: b.year_founded,
    countriesServed: b.countries_served,
    globalInstallations: b.global_installations,
    priceRange: b.price_range,
    keralaClimateScore: b.kerala_climate_score,
    ratings: {
      efficiency: b.efficiency_rating,
      reliability: b.reliability_rating,
      warranty: b.warranty_rating,
      keralaClimate: b.kerala_climate_rating,
    },
    overallRating: RATING_MAP[b.overall_rating] ?? "Good",
  };
}

export function getAvailableInverterBrands(): string[] {
  return [
    "Enphase",
    "Fronius",
    "SolarEdge",
    "Sungrow",
    "GoodWe",
    "Growatt",
  ].sort();
}

export async function getAllInverters(): Promise<SolarInverter[]> {
  try {
    const response = await apiCall<SolarInvertersResponse>(
      "solar-inverters",
      "GET",
      null,
      { revalidate: 3600 },
    );
    return response.data.map(transformInverterData);
  } catch (error) {
    console.error("Error fetching all inverters:", error);
    return [];
  }
}

export async function getInverterById(
  id: string,
): Promise<SolarInverter | null> {
  try {
    const response = await apiCall<SingleInverterResponse>(
      `solar-inverters/${id}`,
      "GET",
    );
    return transformInverterData(response.data);
  } catch (error) {
    console.error(`Error fetching inverter ${id}:`, error);
    return null;
  }
}

export async function getInvertersByIds(
  ids: string[],
): Promise<SolarInverter[]> {
  try {
    const idsParam = ids.join(",");
    const response = await apiCall<SolarInvertersResponse>(
      `solar-inverters?ids=${idsParam}`,
      "GET",
      null,
      { revalidate: 3600 },
    );
    return response.data.map(transformInverterData);
  } catch (error) {
    console.error("Error fetching inverters by IDs:", error);
    return [];
  }
}

const TYPE_TO_BACKEND: Record<InverterType, string> = {
  String: "string",
  Hybrid: "hybrid",
  Microinverter: "microinverter",
  "Optimized String": "optimized-string",
};

const TIER_TO_BACKEND: Record<RatingTier, string> = {
  Premium: "premium",
  "Mid-Range": "mid-range",
  Value: "value",
};

function buildFilterQuery(filters: InverterFilterState): string {
  const params = new URLSearchParams();

  if (filters.inverterTypes.length > 0) {
    params.append(
      "type",
      filters.inverterTypes.map((t) => TYPE_TO_BACKEND[t]).join(","),
    );
  }

  if (filters.ratingTiers.length > 0) {
    params.append(
      "tier",
      filters.ratingTiers.map((t) => TIER_TO_BACKEND[t]).join(","),
    );
  }

  if (filters.warranties.fifteenYearsPlus) {
    params.append("minWarranty", "15");
  } else if (filters.warranties.tenYearsPlus) {
    params.append("minWarranty", "10");
  }

  if (filters.warranties.extendableTo25) {
    params.append("extendableTo", "25");
  }

  if (filters.brands.length > 0) {
    params.append("brand", filters.brands.join(","));
  }

  if (filters.keralaClimateRated) {
    params.append("minKeralaScore", "85");
  }

  return params.toString();
}

export async function getFilteredInverters(
  filters: InverterFilterState,
  sortBy: "topRated" | "efficiency" | "price" | "warranty" = "topRated",
): Promise<SolarInverter[]> {
  try {
    const filterQuery = buildFilterQuery(filters);
    const queryString = filterQuery
      ? `${filterQuery}&sort=${sortBy}&order=desc`
      : `sort=${sortBy}&order=desc`;

    const response = await apiCall<SolarInvertersResponse>(
      `solar-inverters?${queryString}`,
      "GET",
    );
    return response.data.map(transformInverterData);
  } catch (error) {
    console.error("Error fetching filtered inverters:", error);
    return [];
  }
}
