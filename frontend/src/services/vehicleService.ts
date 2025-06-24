// golden-ray/frontend/src/services/vehicleService.ts
import { apiCall } from "./apiService";
import { VehicleType } from "@/types/types";
import { USE_MOCK_DATA } from "../config";
import { mockVehicleTypes } from "../data/mock-calculator";

export async function getVehicleTypes(): Promise<VehicleType[]> {
  if (USE_MOCK_DATA) {
    return mockVehicleTypes;
  }

  try {
    // Fetch cars and scooters concurrently
    const [cars, scooters] = await Promise.all([
      apiCall<{ id: number; model: string; battery_capacity: number; claimed_range: number; adjusted_real_world_range: number; ex_showroom_price: number }[]>("ev-cars/", "GET"),
      apiCall<{ id: number; model: string; battery_capacity: number; claimed_range: number; adjusted_real_world_range: number; ex_showroom_price: number }[]>("ev-scooters/", "GET"),
    ]);

    // Combine and format data
    const vehicleTypes: VehicleType[] = [
      ...cars.map((car) => ({
        name: car.model,
        category: "Car",
        show_in_ui: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      ...scooters.map((scooter) => ({
        name: scooter.model,
        category: "Scooter",
        show_in_ui: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    ];

    return vehicleTypes;
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return []; // Fallback to empty array to prevent component crash
  }
}