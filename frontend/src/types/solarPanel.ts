// Types for Solar Panel Comparison Page

export type PanelType = "Monocrystalline" | "Polycrystalline" | "Bifacial";
export type RatingType = "Excellent" | "Very Good" | "Good";
export type TechnologyType = "N-Type TOPCon" | "P-Type PERC" | "HJT" | "IBC";

export interface SolarPanel {
  id: string;
  brand: string;
  name: string;
  wattage: number; // Wp
  type: PanelType;
  technology: TechnologyType;
  imageUrl: string;
  description: string;

  // Performance specs
  efficiency: number; // percentage
  temperatureCoefficient: number; // %/°C (negative value like -0.30)
  noct: number; // Normal Operating Cell Temperature in °C
  realOutputAt60C: number; // percentage of rated output

  // Durability specs
  ipRating: string; // e.g., "IP68"
  windLoad: number; // Pa (Pascals)
  moistureProtection: string; // e.g., "Excellent", "Good"

  // Construction
  weight: number; // kg
  bifacialGain: number | null; // percentage, null if not bifacial

  // Warranty & Degradation
  productWarranty: number; // years
  performanceWarranty: number; // years
  firstYearPowerDrop: number; // percentage
  annualDegradation: number; // percentage
  outputAtYear25: number; // percentage of original

  // Brand trust & certifications
  manufacturingCapacity: string; // e.g., "12 GW"
  bloombergTier1: boolean;
  pvelTopPerformer: boolean;
  bisCertified: boolean;
  independentAudit: boolean;
  certifications: string[]; // e.g., ["IEC 61215", "IEC 61730", "UL 1703"]

  // Pricing
  priceRange: string; // e.g., "₹25,000 - ₹30,000"

  // DCR (Domestic Content Requirement) for subsidy
  subsidyEligible: boolean;

  // Kerala Climate specific
  keralaClimateScore: number; // 0-100
  ratings: {
    efficiency: number; // 0-100
    heatPerformance: number; // 0-100
    warranty: number; // 0-100
    keralaClimate: number; // 0-100
  };

  // Overall rating
  overallRating: RatingType;
}

export interface FilterState {
  panelTypes: PanelType[];
  ratings: RatingType[];
  efficiencyRange: [number, number]; // min, max percentage
  warranties: {
    productWarranty12Plus: boolean;
    performanceWarranty30: boolean;
  };
  brands: string[];
  keralaClimateRated: boolean;
}

export interface SortOption {
  value: "topRated" | "efficiency" | "price" | "warranty";
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "topRated", label: "Top Rated" },
  { value: "efficiency", label: "Highest Efficiency" },
  { value: "price", label: "Price: Low to High" },
  { value: "warranty", label: "Longest Warranty" },
];

export const DEFAULT_FILTER_STATE: FilterState = {
  panelTypes: [],
  ratings: [],
  efficiencyRange: [15, 23],
  warranties: {
    productWarranty12Plus: false,
    performanceWarranty30: false,
  },
  brands: [],
  keralaClimateRated: false,
};
