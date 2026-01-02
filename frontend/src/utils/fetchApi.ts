// src/utils/fetchApi.ts
import { API_BASE_URL } from "../config";

export async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  body?: object | null
): Promise<T> {
  // Use relative URL for proxying (uncomment if using next.config.js proxy)
  // const url = `/api/${endpoint}`;
  const url = `${API_BASE_URL}${endpoint}`; // Direct backend URL

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include", // Uncomment only if credentials are required
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Try to parse JSON error response from backend
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // If JSON parsing fails, use text
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      // Throw error with parsed JSON data
      const error: any = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      error.status = response.status;
      error.errorData = errorData;
      throw error;
    }
    return response.json();
  } catch (error) {
    console.error(`Error in fetchApi for ${url}:`, error);
    throw error;
  }
}