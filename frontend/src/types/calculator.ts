// This file centralizes the data structures for the calculator.

// Keep the BackendData type as it defines the API response
export type { BackendData } from '@/data/mock-calculator';

// Defines the data for the first step of the form
export interface BasicInfoFormData {
  pincode: string;
  homeType: 'Existing Home' | 'New Home' | null;
  gridType: 'On Grid' | 'Hybrid' | null;
  // Fields for Existing Home
  averageBill: string;
  billFrequency: 'Monthly' | 'Bi-monthly' | null;
  // Fields for New Home
  homeSize: string;
  estimatedBaseLoad: string;
}

// Defines a single device or vehicle entry
export interface Device {
  id: string;
  deviceType: string;
  noOfUnits: string;
  wattage: string;
  dailyUsage: string;
}

// Defines the data for the usage details step
export interface UsageDetailsFormData {
  electronicDevices: Device[];
  electricVehicles: Device[];
}

// Combined structure for the final API call
export interface FullCalculatorPayload extends BasicInfoFormData, UsageDetailsFormData {}