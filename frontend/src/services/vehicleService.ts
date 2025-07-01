import { apiCall } from "./apiService";
import { VehicleType } from "@/types/types";
import { USE_MOCK_DATA } from "../config";
import { mockVehicleTypes } from "../data/mock-calculator";

export async function getVehicleTypes(): Promise<VehicleType[]> {
  if (USE_MOCK_DATA) {
    return mockVehicleTypes;
  }

  try {
    const [cars, scooters] = await Promise.all([
      apiCall<{ id: number; model: string; battery_capacity: number; claimed_range: number; adjusted_real_world_range: number; ex_showroom_price: number }[]>("ev-cars/", "GET"),
      apiCall<{ id: number; model: string; battery_capacity: number; claimed_range: number; adjusted_real_world_range: number; ex_showroom_price: number }[]>("ev-scooters/", "GET"),
    ]);

    const vehicleTypes: VehicleType[] = [
      ...cars.map((car) => ({
        name: car.model,
        category: "Car", // Category is now explicitly "Car"
        show_in_ui: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      ...scooters.map((scooter) => ({
        name: scooter.model,
        category: "Scooter", // Category is now explicitly "Scooter"
        show_in_ui: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    ];

    return vehicleTypes;
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return [];
  }
}