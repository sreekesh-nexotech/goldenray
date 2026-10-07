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
      apiCall<{ results: { uid: string; model: string; battery_capacity: number; claimed_range: number; adjusted_real_world_range: number; ex_showroom_price: number }[] }>("reference/ev-cars/?page_size=200", "GET", null, { publicApi: true }),
      apiCall<{ results: { uid: string; model: string; battery_capacity: number; claimed_range: number; adjusted_real_world_range: number; ex_showroom_price: number }[] }>("reference/ev-scooters/?page_size=200", "GET", null, { publicApi: true }),
    ]);

    const vehicleTypes: VehicleType[] = [
      ...cars.results.map((car) => ({
        name: car.model,
        category: "Car", // Category is now explicitly "Car"
        show_in_ui: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      ...scooters.results.map((scooter) => ({
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