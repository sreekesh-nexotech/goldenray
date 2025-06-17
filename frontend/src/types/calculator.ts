// This file centralizes the data structures for the calculator.

// Keep the BackendData type as it defines the API response
export type { BackendData } from '@/data/mock-calculator';
// Interfaces for form data (assuming these are in a shared types file or defined here)
export interface BasicInfoFormData {
  homeType: "Existing Home" | "New Home" | null;
  gridType: "On Grid" | "Hybrid" | null;
  averageBill: string;
  billFrequency: "Monthly" | "Bi-monthly" | null;
  homeSize?: string;
  estimatedBaseLoad?: string;
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

// Combined structure for the final API call
export interface FullCalculatorPayload extends BasicInfoFormData, UsageDetailsFormData {}