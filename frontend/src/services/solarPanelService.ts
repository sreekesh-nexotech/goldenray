// Solar Panel Service
// This service provides solar panel data from the backend API

import { SolarPanel, FilterState } from "@/types/solarPanel";
import {
  brandSlug,
  fetchProduct,
  fetchProducts,
  orderingFor,
  type CatalogProduct,
  type CatalogSort,
} from "./catalogApi";

// Backend payload (GET /api/public/v1/products/panels/): the product profile
// with the technical sheet under `spec`.
interface PanelSpec {
  wattage_w: number | null;
  panel_type: string | null;
  technology: string | null;
  efficiency_pct: string | null;
  temperature_coefficient: string | null;
  noct_c: number | null;
  real_output_at_60c_pct: number | null;
  ip_rating: string | null;
  wind_load_pa: number | null;
  moisture_protection: string | null;
  weight_kg: string | null;
  bifacial_gain_pct: number | null;
  first_year_drop_pct: string | null;
  annual_degradation_pct: string | null;
  output_at_year_25_pct: string | null;
  bis_certified: boolean | null;
  bloomberg_tier1: boolean | null;
  pvel_top_performer: boolean | null;
  independent_audit: boolean | null;
  certifications: string[] | null;
  manufacturing_capacity: string | null;
}

type BackendPanelData = CatalogProduct<PanelSpec>;

const PANEL_TYPE_MAP: Record<string, SolarPanel["type"]> = {
  MONOCRYSTALLINE: "Monocrystalline",
  POLYCRYSTALLINE: "Polycrystalline",
  BIFACIAL: "Bifacial",
};

const TECHNOLOGY_MAP: Record<string, SolarPanel["technology"]> = {
  N_TYPE_TOPCON: "N-Type TOPCon",
  P_TYPE_PERC: "P-Type PERC",
  HJT: "HJT",
  IBC: "IBC",
};

const RATING_MAP: Record<string, SolarPanel["overallRating"]> = {
  EXCELLENT: "Excellent",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
};

const num = (value: string | number | null | undefined): number =>
  value === null || value === undefined || value === "" ? 0 : Number(value);

// Transform backend data to frontend format. `id` is the product slug (the
// comparison pages carry it in the URL and `?slug=a,b` selects by it).
function transformPanelData(backendPanel: BackendPanelData): SolarPanel {
  const spec = backendPanel.spec;
  const ratings = backendPanel.ratings;
  return {
    id: backendPanel.slug,
    brand: backendPanel.brand_label,
    name: backendPanel.headline || backendPanel.model,
    wattage: num(spec.wattage_w),
    type: PANEL_TYPE_MAP[spec.panel_type ?? ""] ?? "Monocrystalline",
    technology: TECHNOLOGY_MAP[spec.technology ?? ""] ?? "P-Type PERC",
    imageUrl: backendPanel.image_url,
    description: backendPanel.description || backendPanel.summary,
    efficiency: num(spec.efficiency_pct),
    temperatureCoefficient: num(spec.temperature_coefficient),
    noct: num(spec.noct_c),
    realOutputAt60C: num(spec.real_output_at_60c_pct),
    ipRating: spec.ip_rating ?? "",
    windLoad: num(spec.wind_load_pa),
    moistureProtection: spec.moisture_protection ?? "",
    weight: num(spec.weight_kg),
    bifacialGain:
      spec.bifacial_gain_pct === null || spec.bifacial_gain_pct === undefined
        ? null
        : Number(spec.bifacial_gain_pct),
    productWarranty: num(backendPanel.warranty.product_years),
    performanceWarranty: num(backendPanel.warranty.performance_years),
    firstYearPowerDrop: num(spec.first_year_drop_pct),
    annualDegradation: num(spec.annual_degradation_pct),
    outputAtYear25: num(spec.output_at_year_25_pct),
    manufacturingCapacity: spec.manufacturing_capacity ?? "",
    bloombergTier1: Boolean(spec.bloomberg_tier1),
    pvelTopPerformer: Boolean(spec.pvel_top_performer),
    bisCertified: Boolean(spec.bis_certified),
    independentAudit: Boolean(spec.independent_audit),
    certifications: spec.certifications || [],
    priceRange: backendPanel.price_range_label ?? "",
    subsidyEligible: Boolean(backendPanel.subsidy_eligible),
    keralaClimateScore: num(backendPanel.kerala_climate_score),
    ratings: {
      efficiency: num(ratings.efficiency),
      heatPerformance: num(ratings.heat_performance),
      warranty: num(ratings.warranty),
      keralaClimate: num(ratings.kerala_climate),
    },
    overallRating: RATING_MAP[backendPanel.overall_rating ?? ""] ?? "Good",
  };
}

// Get all unique brands from panels
export function getAvailableBrands(): string[] {
  const brands = [
    "Waaree",
    "Adani Solar",
    "Vikram Solar",
    "Premier Energies",
    "Saatvik",
    "RenewSys",
    "Tata Power Solar",
    "Loom Solar",
  ];
  return brands.sort();
}

// Get all panels
export async function getAllPanels(): Promise<SolarPanel[]> {
  try {
    const rows = await fetchProducts<BackendPanelData>("panels", new URLSearchParams(), 3600);
    return rows.map(transformPanelData);
  } catch (error) {
    console.error("Error fetching all panels:", error);
    return [];
  }
}

// Get panel by slug
export async function getPanelById(id: string): Promise<SolarPanel | null> {
  try {
    return transformPanelData(await fetchProduct<BackendPanelData>("panel", id));
  } catch (error) {
    console.error(`Error fetching panel ${id}:`, error);
    return null;
  }
}

// Get panels by slugs (the comparison selection)
export async function getPanelsByIds(ids: string[]): Promise<SolarPanel[]> {
  try {
    const params = new URLSearchParams({ slug: ids.join(",") });
    const rows = await fetchProducts<BackendPanelData>("panels", params, 3600);
    return rows.map(transformPanelData);
  } catch (error) {
    console.error("Error fetching panels by IDs:", error);
    return [];
  }
}

const RATING_TO_BACKEND: Record<string, string> = {
  Excellent: "EXCELLENT",
  "Very Good": "VERY_GOOD",
  Good: "GOOD",
};

// Build query parameters for filtering (public API v1 names)
function buildFilterQuery(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  // Multi-choice filters repeat the parameter.
  filters.panelTypes.forEach((type) => params.append("panel_type", type.toUpperCase()));
  filters.ratings.forEach((rating) =>
    params.append("overall_rating", RATING_TO_BACKEND[rating] ?? rating.toUpperCase()),
  );

  // Efficiency range
  if (filters.efficiencyRange[0] !== 15) {
    params.append("min_efficiency", filters.efficiencyRange[0].toString());
  }
  if (filters.efficiencyRange[1] !== 23) {
    params.append("max_efficiency", filters.efficiencyRange[1].toString());
  }

  // Warranty filters
  if (filters.warranties.productWarranty12Plus) {
    params.append("min_product_warranty", "12");
  }
  if (filters.warranties.performanceWarranty30) {
    params.append("min_performance_warranty", "30");
  }

  // Brands filter (by brand slug)
  if (filters.brands.length > 0) {
    params.append("brand", filters.brands.map(brandSlug).join(","));
  }

  // Kerala Climate Rated
  if (filters.keralaClimateRated) {
    params.append("min_kerala_score", "85");
  }

  return params;
}

// Filter and sort panels
export async function getFilteredPanels(
  filters: FilterState,
  sortBy: CatalogSort = "topRated"
): Promise<SolarPanel[]> {
  try {
    const params = buildFilterQuery(filters);
    params.set("ordering", orderingFor(sortBy));
    const rows = await fetchProducts<BackendPanelData>("panels", params);
    return rows.map(transformPanelData);
  } catch (error) {
    console.error("Error fetching filtered panels:", error);
    return [];
  }
}
