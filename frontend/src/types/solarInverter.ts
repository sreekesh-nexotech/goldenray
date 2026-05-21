// Types for Solar Inverter Comparison Page

export type InverterType =
  | "String"
  | "Hybrid"
  | "Microinverter"
  | "Optimized String";

export type RatingTier = "Premium" | "Mid-Range" | "Value";
export type RatingType = "Excellent" | "Very Good" | "Good";

export interface SolarInverter {
  id: string;
  brand: string;
  name: string;
  type: InverterType;
  ratingTier: RatingTier;
  imageUrl: string;
  description: string;

  // The Basics
  ratedOutputPower: number; // Watts AC
  maximumDcInput: number; // Watts
  mpptTrackers: number;
  maximumDcVoltage: number; // Volts
  maximumInputCurrent: string;
  weight: number; // kg
  display: string;
  suitableSystemSize: string;

  // Performance & Efficiency
  maximumEfficiency: number; // %
  europeanEfficiency: number; // %
  mpptEfficiency: number; // %
  dcOversizing: number; // %
  acOverloading: number; // %
  pidProtection: boolean;
  ivCurveScanning: string;

  // Durability
  ipRating: string;
  corrosionProtection: string;
  operatingTemperature: string;
  cooling: string;
  noiseLevel: string;

  // Safety Features
  dcSurgeProtection: string; // "Built-in" / "Optional"
  acSurgeProtection: string;
  arcFaultDetection: string;
  gridProtection: boolean;

  // Monitoring & Software
  monitoringApp: string;
  realTimeMonitoring: boolean;
  remoteDiagnostics: string;
  firmwareUpdates: string;
  connectivity: string;

  // Warranty & Brand Trust
  warrantyYears: number;
  extendableWarrantyYears: number | null;
  certifications: string[];
  brandTrust: string;
  yearFounded: number | null;
  countriesServed: string;
  globalInstallations: string;

  // Pricing
  priceRange: string;

  // Kerala Climate
  keralaClimateScore: number;
  ratings: {
    efficiency: number; // 0-100
    reliability: number; // 0-100
    warranty: number; // 0-100
    keralaClimate: number; // 0-100
  };

  overallRating: RatingType;
}

export interface InverterFilterState {
  inverterTypes: InverterType[];
  ratingTiers: RatingTier[];
  warranties: {
    tenYearsPlus: boolean;
    fifteenYearsPlus: boolean;
    extendableTo25: boolean;
  };
  brands: string[];
  keralaClimateRated: boolean;
}

export const DEFAULT_INVERTER_FILTER_STATE: InverterFilterState = {
  inverterTypes: [],
  ratingTiers: [],
  warranties: {
    tenYearsPlus: false,
    fifteenYearsPlus: false,
    extendableTo25: false,
  },
  brands: [],
  keralaClimateRated: false,
};
