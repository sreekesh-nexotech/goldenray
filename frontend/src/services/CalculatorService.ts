import { apiCall } from './apiService';
import { mockBasicCalculatorData, mockAdvancedCalculatorData } from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicCalculatorData, AdvancedCalculatorData, SolarAdvancedPayload, SolarBasicPayload } from '@/types/types';

// Endpoints
const SOLAR_CALCULATOR_ENDPOINT = 'calculate-solar/';
const ADVANCED_SOLAR_CALCULATOR_ENDPOINT = 'calculate-solar/';

// Basic calculator API call
export async function getSolarAdvantageData(
  payload: SolarBasicPayload
): Promise<BasicCalculatorData> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for getSolarAdvantageData");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBasicCalculatorData);
      }, 1000);
    });
  }

  try {
    const queryParams = new URLSearchParams({
      pincode: payload.pincode,
      property_type: payload.property_type,
      electricity_bill: payload.electricity_bill,
    }).toString();
    const url = `${SOLAR_CALCULATOR_ENDPOINT}?${queryParams}`;
    console.log("Making API call to:", url);
    
    const response = await apiCall<BasicCalculatorData>(url, "GET");
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data === null) {
      throw new Error("No data returned from the API");
    }
    console.log("API response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getSolarAdvantageData:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Advanced calculator API call
export async function getSolarAdvancedData(
  payload: SolarAdvancedPayload
): Promise<AdvancedCalculatorData> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for getSolarAdvancedData");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAdvancedCalculatorData);
      }, 1000);
    });
  }

  try {
    console.log("Making API call to:", ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "with payload:", payload);
    const response = await apiCall<AdvancedCalculatorData>(
      ADVANCED_SOLAR_CALCULATOR_ENDPOINT,
      "POST",
      payload
    );
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data === null) {
      throw new Error("No data returned from the API");
    }
    console.log("API response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getSolarAdvancedData:", error);
    throw error;
  }
}