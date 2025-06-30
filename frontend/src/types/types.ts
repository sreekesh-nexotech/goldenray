

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
export interface SolarCalculatorApiResponse {
  estimated_units: number;
  daily_consumption: number;
  buffered_daily: number;
  solar_capacity_kW: number;
  area_required: number;
  installation_time_days: string;
  total_cost: number;
  subsidy: number;
  loan_available:string;
  pincode: string;
  property_type: string;
  savings:number;
  datasets: {
    data: number[];
}[];
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
    actual_backup_time:string;
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

// New interface for transformed Advanced Calculator response
export interface AdvancedCalculatorApiResponse {
  power_capacity: number;
  time_to_complete: string;
  total_cost: number;
  total_subsidy: number;
  area_required: number;
  final_cost: number;
  battery_capacity: number;
  actual_backup_time: number;
  overall_setup_cost: number;
  graph_without_solar: number[];
  graph_with_solar: number[];
  savings: number;
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
  actual_backup_time:string;
}

export interface Electronic_device {
  id: string;
  device_type: string;
  no_of_units: number;
  daily_usage: number;
  url:string;
}

export interface Electric_vehicle {
  id: string;
  model: string;
  no_of_vehicles: number;
  daily_avg_km: number;
  category: "Car" | "Scooter" | string; 
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
  monthly_bill: number;
  pincode: string;
  property_type: string;
}


// Type for Pincode validation API response
export interface PincodeValidationResponse {
  valid: boolean;
  pincode?: string;
  error?: string;
}


export interface DeviceType {
  name: string;
  show_in_ui: boolean;
  updated_at: string; 
  created_at: string; 
  url?:string;
}

export interface VehicleType {
  name: string;
  category: string;
  show_in_ui: boolean;
  updated_at: string;
  created_at: string;
}



// Interfaces for OTP API requests and responses

export interface SendOtpRequest {
  name: string;
  phone_number: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  code: string;
}

export interface VerifyOtpResponse {
  message: string;
  status:string;
}

// Interface for API errors
export interface CustomApiError extends Error {
  message: string;
}

//interface for metadata
export interface MetadataResponse {
  title: string;
  description: string;
  keywords: string[];
  imageUrl: string;
  ogType: string;
}