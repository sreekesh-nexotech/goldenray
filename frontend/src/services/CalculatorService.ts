import { apiCall } from './apiService';
import { mockBasicCalculatorData, mockAdvancedCalculatorData } from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicCalculatorData, AdvancedCalculatorData, SolarAdvancedPayload, SolarBasicPayload } from '@/types/calculator';

//endpoints
const SOLAR_CALCULATOR_ENDPOINT = 'solar-calculator/';
const ADVANCED_SOLAR_CALCULATOR_ENDPOINT = 'advanced-solar-calculator/';


//basic calculator api call
export async function getSolarAdvantageData(
  payload: SolarBasicPayload
): Promise<BasicCalculatorData> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBasicCalculatorData);
      }, 1000);
    });
  } else {
    const queryParams = new URLSearchParams({
      pincode: payload.pincode,
      propertyType: payload.propertyType,
      electricityBill: payload.electricityBill,
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


//advanced api call
export async function getSolarAdvancedData(
  payload: SolarAdvancedPayload
): Promise<AdvancedCalculatorData> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAdvancedCalculatorData);
      }, 1000);
    });
  } else {
    const response = await apiCall<AdvancedCalculatorData>(
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