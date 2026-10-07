// src/services/deviceService.ts
import { apiCall } from "./apiService";
import { DeviceType } from "@/types/types";
import { USE_MOCK_DATA } from "../config";
import { mockDeviceTypes } from "../data/mock-calculator";

export async function getDeviceTypes(): Promise<DeviceType[]> {
  if (USE_MOCK_DATA) {
    return mockDeviceTypes;
  }

  try {
    const data = await apiCall<{ results: DeviceType[] }>(
      "reference/device-types/?page_size=200",
      "GET",
      null,
      { publicApi: true }
    );
    return data.results;
  } catch (error) {
    console.error("Error fetching device types:", error);
    return []; // Fallback to empty array to prevent component crash
  }
}