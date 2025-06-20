// This file centralizes the data structures for the calculator.

// Keep the BackendData type as it defines the API response
export interface BasicCalculatorData {
  specifications:{
    powerRequirement: string;
    areaRequirement: string;
    installationTime: string;
  }
  financialDetails:{
    lifetimeSavings: string;
    overallCost: string;
    governmentSubsidy: string;
    finalCost: string;
     monthlyEBReduction: string;
    startingEMI: string;
  }
  backupDetails:{
    batteryRequirement:string;
    autonomyRate:string;
  }
  graphData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
}
// Interfaces for form data (assuming these are in a shared types file or defined here)
export interface BasicInfoFormData {
  homeType: "Existing Home" | "New Home" | null;
  gridType: "On Grid" | "Hybrid" | null;
  averageBill: string;
  billFrequency: "Monthly" | "Bi-monthly" | null;
  homeSize: string;
  estimatedBaseLoad: string;
  backupHours: number;
  electronicDevices: ElectronicDevice[]; // ADDED: to hold devices from form 3
}

export interface ElectronicDevice {
  id: string;
  deviceType: string;
  noOfUnits: string;
  wattage: string;
  dailyUsage: string;
}

export interface ElectricVehicle {
  id: string;
  deviceType: string;
  noOfUnits: string;
  wattage: string;
  dailyUsage: string;
}

export interface UsageDetailsFormData {
  electronicDevices: ElectronicDevice[];
  electricVehicles: ElectricVehicle[];
}

export interface BackupPowerFormData {
  backupHours: number;
}


// Combined structure for the final API call
export interface FullCalculatorPayload extends BasicInfoFormData, UsageDetailsFormData {}