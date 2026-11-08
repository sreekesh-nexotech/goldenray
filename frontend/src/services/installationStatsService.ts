// src/services/installationStatsService.ts
import { apiCall } from "./apiService";

export interface InstallationStats {
  pincode: string;
  district: string;
  pincode_installations: number;
  district_installations: number;
  current_year_installations: number;
  year: number;
}

/**
 * Fetch installation statistics for a given pincode
 * @param pincode - The pincode to query
 * @returns Installation statistics including pincode and district counts
 */
export async function getInstallationStats(
  pincode: string
): Promise<InstallationStats> {
  try {
    const response = await apiCall<InstallationStats>(
      `installations/stats/?pincode=${encodeURIComponent(pincode)}`,
      "GET",
      null,
      { publicApi: true }
    );
    return response;
  } catch (error) {
    console.error("Error fetching installation stats:", error);
    throw error;
  }
}
