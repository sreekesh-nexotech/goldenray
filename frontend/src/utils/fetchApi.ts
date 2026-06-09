// src/utils/fetchApi.ts
import { API_BASE_URL } from "../config";

// Optional caching controls, forwarded to the Next.js fetch layer.
// `revalidate` opts the request into the Next.js Data Cache (ISR) for the
// given number of seconds. Leave undefined for the default `no-store` behavior
// (correct for mutations / per-request data).
export interface FetchApiOptions {
  revalidate?: number;
}

export async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  body?: object | null,
  init?: FetchApiOptions
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

  if (typeof init?.revalidate === "number") {
    options.next = { revalidate: init.revalidate };
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Clone response to read body twice if needed
      const responseClone = response.clone();

      // Try to parse JSON error response from backend
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // If JSON parsing fails, use text from clone
        try {
          const errorText = await responseClone.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
          );
        } catch {
          throw new Error(
            `HTTP error! Status: ${response.status}`
          );
        }
      }

      // Throw error with parsed JSON data
      const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`) as Error & {
        status: number;
        errorData: typeof errorData;
      };
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