

// Data structure for Basic Calculator API response
export interface BasicCalculatorData {
  specifications: {
    power_requirement: string;
    area_requirement: string;
    installation_time: string;
  };
  financialDetails: {
    lifetime_savings: string;
    overall_cost: string;
    government_subsidy: string;
    final_cost: string;
    monthlyEBReduction: string;
    starting_EMI: string;
  };

  graph_data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

// Type for the API's graph_data response (Advanced Calculator)
export interface Apigraph_data {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

// Type for Chart.js-compatible graph_data
export interface Chartgraph_data {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

// Data structure for Advanced Calculator API response
export interface AdvancedCalculatorData {
  specifications: {
    power_requirement: string;
    area_requirement: string;
    installation_time: string;
  };
  financialDetails: {
    lifetime_savings: string;
    overall_cost: string;
    government_subsidy: string;
    final_cost: string;
    starting_EMI: string;
  };
  backupDetails: {
    battery_requirement: string;
    autonomy_rate: string;
  };
  graph_data: Apigraph_data; // Backend response
  lifetime_bill_comparison: {
    without_solar_amount: number;
    with_solar_amount_payable: number;
    with_solar_amount_saved: number;
  };
}

// Interfaces for form data
export interface BasicInfoFormData {
  home_type: "Existing Home" | "New Home" | null;
  grid_type: "On Grid" | "Hybrid" | null;
  average_bill: string;
  bill_frequency: "Monthly" | "Bi-monthly" | null;
  home_size: string;
  estimated_base_load: string;
  backup_hours: number;
  electronic_devices: Electronic_device[];
}

export interface Electronic_device {
  id: string;
  device_type: string;
  no_of_units: number;
  wattage: number;
  daily_usage: number;
}

export interface Electric_vehicle {
  id: string;
  device_type: string;
  no_of_units: number;
  wattage: number;
  daily_usage: number;
}

export interface UsageDetailsFormData {
  electronic_devices: Electronic_device[];
  electric_vehicles: Electric_vehicle[];
}

export interface BackupPowerFormData {
  backup_hours: number;
}

// Combined structure for the Advanced Calculator API call
export interface SolarAdvancedPayload {
  Specifications: {
    home_type: string | null;
    grid_type: string | null;
    average_bill: string;
    bill_frequency: string | null;
    home_size: string;
    estimated_base_load: string;
  };
  usageDetails: {
    usage_electronic_devices: Electronic_device[];
    electric_vehicles: Electric_vehicle[];
  };
  preferenceDetails: {
    backup_hours: number;
    preference_electronic_devices: Electronic_device[]; // Form 3 devices (Hybrid only)
  }
}

// Combined structure for the Basic Calculator API call
export interface SolarBasicPayload {
  pincode: string;
  property_type: string;
  electricity_bill: string;
}

export interface DeviceType {
  name: string;
  show_in_ui: boolean;
  updated_at: string; 
  created_at: string; 
}