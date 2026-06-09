// src/services/apiService.ts
import { fetchApi, FetchApiOptions } from "../utils/fetchApi";

export async function apiCall<T>(
  endpoint: string,
  method: string = "GET",
  body?: object | null,
  init?: FetchApiOptions
): Promise<T> {
  try {
    const response =  await fetchApi<T>(endpoint, method, body, init);
    return response;
  } catch (error) {
    console.error(`Error in apiCall for ${endpoint}:`, error);
    throw error;
  }
}