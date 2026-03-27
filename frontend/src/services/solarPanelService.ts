// Solar Panel Service
// This service provides solar panel data from the backend API

import { SolarPanel, FilterState, PanelType } from "@/types/solarPanel";
import { apiCall } from "./apiService";

// Backend response interface
interface SolarPanelsResponse {
  data: any[];
  meta?: {
    total: number;
  };
}

interface SinglePanelResponse {
  data: any;
}

// Transform backend data to frontend format
function transformPanelData(backendPanel: any): SolarPanel {
  return {
    id: backendPanel.id.toString(),
    brand: backendPanel.brand,
    name: backendPanel.name,
    wattage: backendPanel.wattage,
    type: backendPanel.panel_type === 'monocrystalline' ? 'Monocrystalline' :
          backendPanel.panel_type === 'polycrystalline' ? 'Polycrystalline' :
          backendPanel.panel_type === 'bifacial' ? 'Bifacial' : 'Monocrystalline',
    technology: backendPanel.technology === 'n-type-topcon' ? 'N-Type TOPCon' :
                backendPanel.technology === 'p-type-perc' ? 'P-Type PERC' :
                backendPanel.technology === 'hjt' ? 'HJT' :
                backendPanel.technology === 'ibc' ? 'IBC' : 'P-Type PERC',
    imageUrl: backendPanel.image_url,
    description: backendPanel.description,
    efficiency: parseFloat(backendPanel.efficiency),
    temperatureCoefficient: parseFloat(backendPanel.temperature_coefficient),
    noct: backendPanel.noct,
    realOutputAt60C: backendPanel.real_output_at_60c,
    ipRating: backendPanel.ip_rating,
    windLoad: backendPanel.wind_load,
    moistureProtection: backendPanel.moisture_protection,
    weight: parseFloat(backendPanel.weight),
    bifacialGain: backendPanel.bifacial_gain,
    productWarranty: backendPanel.product_warranty,
    performanceWarranty: backendPanel.performance_warranty,
    firstYearPowerDrop: parseFloat(backendPanel.first_year_power_drop),
    annualDegradation: parseFloat(backendPanel.annual_degradation),
    outputAtYear25: parseFloat(backendPanel.output_at_year_25),
    manufacturingCapacity: backendPanel.manufacturing_capacity,
    bloombergTier1: backendPanel.bloomberg_tier1,
    pvelTopPerformer: backendPanel.pvel_top_performer,
    bisCertified: backendPanel.bis_certified,
    independentAudit: backendPanel.independent_audit,
    certifications: backendPanel.certifications || [],
    priceRange: backendPanel.price_range,
    subsidyEligible: backendPanel.subsidy_eligible,
    keralaClimateScore: backendPanel.kerala_climate_score,
    ratings: {
      efficiency: backendPanel.efficiency_rating,
      heatPerformance: backendPanel.heat_performance_rating,
      warranty: backendPanel.warranty_rating,
      keralaClimate: backendPanel.kerala_climate_rating,
    },
    overallRating: backendPanel.overall_rating === 'excellent' ? 'Excellent' :
                   backendPanel.overall_rating === 'very-good' ? 'Very Good' :
                   backendPanel.overall_rating === 'good' ? 'Good' : 'Good',
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
    const response = await apiCall<SolarPanelsResponse>(
      "solar-panels",
      "GET"
    );
    return response.data.map(transformPanelData);
  } catch (error) {
    console.error("Error fetching all panels:", error);
    return [];
  }
}

// Get panel by ID
export async function getPanelById(id: string): Promise<SolarPanel | null> {
  try {
    const response = await apiCall<SinglePanelResponse>(
      `solar-panels/${id}`,
      "GET"
    );
    return transformPanelData(response.data);
  } catch (error) {
    console.error(`Error fetching panel ${id}:`, error);
    return null;
  }
}

// Get panels by IDs
export async function getPanelsByIds(ids: string[]): Promise<SolarPanel[]> {
  try {
    const idsParam = ids.join(",");
    const response = await apiCall<SolarPanelsResponse>(
      `solar-panels?ids=${idsParam}`,
      "GET"
    );
    return response.data.map(transformPanelData);
  } catch (error) {
    console.error("Error fetching panels by IDs:", error);
    return [];
  }
}

// Build query parameters for filtering
function buildFilterQuery(filters: FilterState): string {
  const params = new URLSearchParams();

  // Panel types filter - convert to backend format
  if (filters.panelTypes.length > 0) {
    const backendTypes = filters.panelTypes.map(type =>
      type.toLowerCase()
    );
    params.append("type", backendTypes.join(","));
  }

  // Ratings filter - convert to backend format
  if (filters.ratings.length > 0) {
    const backendRatings = filters.ratings.map(rating =>
      rating === "Very Good" ? "very-good" : rating.toLowerCase()
    );
    params.append("rating", backendRatings.join(","));
  }

  // Efficiency range
  if (filters.efficiencyRange[0] !== 15) {
    params.append("minEfficiency", filters.efficiencyRange[0].toString());
  }
  if (filters.efficiencyRange[1] !== 23) {
    params.append("maxEfficiency", filters.efficiencyRange[1].toString());
  }

  // Warranty filters
  if (filters.warranties.productWarranty12Plus) {
    params.append("minProductWarranty", "12");
  }
  if (filters.warranties.performanceWarranty30) {
    params.append("minPerformanceWarranty", "30");
  }

  // Brands filter
  if (filters.brands.length > 0) {
    params.append("brand", filters.brands.join(","));
  }

  // Kerala Climate Rated
  if (filters.keralaClimateRated) {
    params.append("minKeralaScore", "85");
  }

  return params.toString();
}

// Filter and sort panels
export async function getFilteredPanels(
  filters: FilterState,
  sortBy: "topRated" | "efficiency" | "price" | "warranty" = "topRated"
): Promise<SolarPanel[]> {
  try {
    // Build query string
    const filterQuery = buildFilterQuery(filters);
    const sortParam = sortBy;
    const queryString = filterQuery
      ? `${filterQuery}&sort=${sortParam}&order=desc`
      : `sort=${sortParam}&order=desc`;

    const response = await apiCall<SolarPanelsResponse>(
      `solar-panels?${queryString}`,
      "GET"
    );

    return response.data.map(transformPanelData);
  } catch (error) {
    console.error("Error fetching filtered panels:", error);
    return [];
  }
}
