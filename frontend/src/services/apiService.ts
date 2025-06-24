// src/services/apiService.ts
import { fetchApi } from "../utils/fetchApi";

export async function apiCall<T>(
  endpoint: string,
  method: string = "GET",
  body?: object | null
): Promise<T> {
  try {
    return await fetchApi<T>(endpoint, method, body);
  } catch (error) {
    console.error(`Error in apiCall for ${endpoint}:`, error);
    throw error;
  }
}