import { apiCall } from './apiService';
import { mockBasicCalculatorData } from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicCalculatorData, ElectronicDevice, ElectricVehicle } from '@/types/calculator';

// Define the expected payload type for getSolarAdvancedData
interface SolarAdvancedPayload {
  Specifications: {
    homeType: string | null;
    gridType: string | null;
    averageBill: string;
    billFrequency: string | null;
    homeSize: string;
    estimatedBaseLoad: string;
    backupHours: number;
  };
  usageDetails: {
    usageElectronicDevices: ElectronicDevice[];
    preferenceElectronicDevices: ElectronicDevice[];
    electricVehicles: ElectricVehicle[];
  };
}

const SOLAR_CALCULATOR_ENDPOINT = 'solar-calculator/';
const ADVANCED_SOLAR_CALCULATOR_ENDPOINT = 'advanced-solar-calculator/';

export async function getSolarAdvantageData(
  pincode: string,
  propertyType: string,
  electricityBill: string
): Promise<BasicCalculatorData> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBasicCalculatorData);
      }, 1000); // Simulate network delay
    });
  } else {
    const queryParams = new URLSearchParams({
      pincode,
      propertyType,
      electricityBill,
    }).toString();
    const url = `${SOLAR_CALCULATOR_ENDPOINT}?${queryParams}`;
    const response = await apiCall<BasicCalculatorData>(url, "GET");
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data === null) {
      throw new Error("No data returned from API");
    }
    return response.data;
  }
}

/**
 * Fetches advanced solar data based on the provided parameters.
 * If USE_MOCK_DATA is true, returns mock data; otherwise, makes an API call.
 * @param payload The structured payload containing system specifications and usage details.
 * @returns A Promise that resolves to the BasicCalculatorData object.
 * @throws An Error if the API call fails or returns no data.
 */
export async function getSolarAdvancedData(
  payload: SolarAdvancedPayload
): Promise<BasicCalculatorData> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBasicCalculatorData);
      }, 1000); // Simulate network delay
    });
  } else {
    const response = await apiCall<BasicCalculatorData>(
      ADVANCED_SOLAR_CALCULATOR_ENDPOINT,
      "POST",
      payload
    );
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data === null) {
      throw new Error("No data returned from API");
    }
    return response.data;
  }
}