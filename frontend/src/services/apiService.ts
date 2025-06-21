// services/apiService.ts
import { fetchApi } from "@/utils/fetchApi";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export async function apiCall<T>( 
  url: string,
  method: string = "GET",
  body: object | null = null
): Promise<ApiResponse<T>> {
  try {
    const data = await fetchApi<T>(url, method, body);
    // If data is explicitly `null` or `undefined` from fetchApi, pass it through.
    // Otherwise, assume success. The 'void' type might resolve to `undefined`.
    return { data: data ?? null, error: null };
  } catch (error: unknown) { // Use 'unknown' instead of 'any' for safer type narrowing
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = "An unknown error occurred.";
    }
    return { data: null, error: errorMessage };
  }
}