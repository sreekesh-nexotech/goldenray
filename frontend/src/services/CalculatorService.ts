// src/services/CalculatorService.ts
import { apiCall } from './apiService';
import { BackendData, mockBackendData } from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicInfoFormData, UsageDetailsFormData } from '@/types/calculator';

const SOLAR_CALCULATOR_ENDPOINT = 'solar-calculator/';
const ADVANCED_SOLAR_CALCULATOR_ENDPOINT = 'advanced-solar-calculator/';

export async function getSolarAdvantageData(
  pincode: string,
  propertyType: string,
  electricityBill: string
): Promise<BackendData> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBackendData);
      }, 1000); // Simulate network delay
    });
  } else {
    const queryParams = new URLSearchParams({
      pincode,
      propertyType,
      electricityBill,
    }).toString();
    const url = `${SOLAR_CALCULATOR_ENDPOINT}?${queryParams}`;
    const response = await apiCall<BackendData>(url, "GET");
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
 * @param basicInfo The basic information form data (homeType, gridType, averageBill, billFrequency, homeSize, estimatedBaseLoad).
 * @param usageDetails The usage details form data (electronicDevices, electricVehicles).
 * @returns A Promise that resolves to the BackendData object.
 * @throws An Error if the API call fails or returns no data.
 */
export async function getSolarAdvancedData(
  basicInfo: BasicInfoFormData,
  usageDetails: UsageDetailsFormData
): Promise<BackendData> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBackendData);
      }, 1000); // Simulate network delay
    });
  } else {
    const payload = {
      homeType: basicInfo.homeType,
      gridType: basicInfo.gridType,
      averageBill: basicInfo.homeType === 'Existing Home' ? basicInfo.averageBill : undefined,
      billFrequency: basicInfo.homeType === 'Existing Home' ? basicInfo.billFrequency : undefined,
      homeSize: basicInfo.homeType === 'New Home' ? basicInfo.homeSize : undefined,
      estimatedBaseLoad: basicInfo.homeType === 'New Home' ? basicInfo.estimatedBaseLoad : undefined,
      electronicDevices: usageDetails.electronicDevices,
      electricVehicles: usageDetails.electricVehicles,
    };

    const response = await apiCall<BackendData>(ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "POST", payload);
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data === null) {
      throw new Error("No data returned from API");
    }
    return response.data;
  }
}