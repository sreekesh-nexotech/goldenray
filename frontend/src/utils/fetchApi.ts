// utils/fetchApi.ts
import { API_BASE_URL } from "@/config"; 

export async function fetchApi<T>( 
  endpoint: string,
  method: string = "GET",
  body: object | null = null
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important for sending cookies (e.g., for session authentication)
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorDetail: string;
      try {
        const errorBody = await response.json();
        // Prioritize common error fields, then fall back to stringifying the whole error object
        errorDetail = errorBody.message || errorBody.detail || JSON.stringify(errorBody);
      } catch (e: unknown) { // Use 'e: unknown' here for the inner catch
        // If parsing JSON fails, use status text or a generic message
        // Use 'e' in the console.error to make sure it's "used"
        console.error("Error parsing API error response:", e); // <--- USED 'e' HERE
        errorDetail = response.statusText || "Unknown error parsing response.";
      }
      throw new Error(`HTTP error! Status: ${response.status} - ${errorDetail}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      // If the API endpoint is expected to return JSON but doesn't, or returns 204 No Content
      // Decide how you want to handle non-JSON responses. Returning an empty object as T
      // might cause type issues if T expects specific properties.
      // A more robust approach might be to throw an error for unexpected content types
      // or to return `undefined` if `T` can be `T | undefined`.
      // For a typical "success without body" (e.g., DELETE), T might be `void` or `{}`.
      // For now, returning an empty object to align with previous behavior, but be aware.
      return {} as T;
    }
  } catch (error) {
    console.error("fetchApi error:", error);
    // Re-throw the error to be caught by apiCall for consistent handling
    throw error;
  }
}