

// Data structure for Basic Calculator API response
export interface BasicCalculatorData {
  specifications: {
    powerRequirement: string;
    areaRequirement: string;
    installationTime: string;
  };
  financialDetails: {
    lifetimeSavings: string;
    overallCost: string;
    governmentSubsidy: string;
    finalCost: string;
    monthlyEBReduction: string;
    startingEMI: string;
  };
  backupDetails: {
    batteryRequirement: string;
    autonomyRate: string;
  };
  graphData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

// Type for the API's graphData response (Advanced Calculator)
export interface ApiGraphData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

// Type for Chart.js-compatible graphData
export interface ChartGraphData {
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
    powerRequirement: string;
    areaRequirement: string;
    installationTime: string;
  };
  financialDetails: {
    lifetimeSavings: string;
    overallCost: string;
    governmentSubsidy: string;
    finalCost: string;
    startingEMI: string;
  };
  backupDetails: {
    batteryRequirement: string;
    autonomyRate: string;
  };
  graphData: ApiGraphData; // Backend response
  lifetimeBillComparison: {
    withoutSolarAmount: number;
    withSolarAmountPayable: number;
    withSolarAmountSaved: number;
  };
}

// Interfaces for form data
export interface BasicInfoFormData {
  homeType: "Existing Home" | "New Home" | null;
  gridType: "On Grid" | "Hybrid" | null;
  averageBill: string;
  billFrequency: "Monthly" | "Bi-monthly" | null;
  homeSize: string;
  estimatedBaseLoad: string;
  backupHours: number;
  electronicDevices: ElectronicDevice[];
}

export interface ElectronicDevice {
  id: string;
  deviceType: string;
  noOfUnits: number;
  wattage: number;
  dailyUsage: number;
}

export interface ElectricVehicle {
  id: string;
  deviceType: string;
  noOfUnits: number;
  wattage: number;
  dailyUsage: number;
}

export interface UsageDetailsFormData {
  electronicDevices: ElectronicDevice[];
  electricVehicles: ElectricVehicle[];
}

export interface BackupPowerFormData {
  backupHours: number;
}

// Combined structure for the Advanced Calculator API call
export interface SolarAdvancedPayload {
  Specifications: {
    homeType: string | null;
    gridType: string | null;
    averageBill: string;
    billFrequency: string | null;
    homeSize: string;
    estimatedBaseLoad: string;
  };
  usageDetails: {
    usageElectronicDevices: ElectronicDevice[];
    electricVehicles: ElectricVehicle[];
  };
  preferenceDetails: {
    backupHours: number;
    preferenceElectronicDevices: ElectronicDevice[]; // Form 3 devices (Hybrid only)
  }
}

// Combined structure for the Basic Calculator API call
export interface SolarBasicPayload {
  pincode: string;
  propertyType: string;
  electricityBill: string;
}