// src/utils/fetchApi.ts
import { API_BASE_URL, PUBLIC_API_BASE_URL } from "../config";

// Optional caching controls, forwarded to the Next.js fetch layer.
// `revalidate` opts the request into the Next.js Data Cache (ISR) for the
// given number of seconds. Leave undefined for the default `no-store` behavior
// (correct for mutations / per-request data).
//
// `publicApi` targets the new platform backend (/api/public/v1/). `idempotencyKey`
// is sent as the Idempotency-Key header so a retried public POST replays the first
// response instead of creating a duplicate.
export interface FetchApiOptions {
  revalidate?: number;
  publicApi?: boolean;
  idempotencyKey?: string;
}

// Fresh Idempotency-Key, matching the backend's `^[A-Za-z0-9_\-:.]{8,128}$`.
//
// `crypto.randomUUID()` only exists in a **secure context** (HTTPS, or
// localhost). The staging site is served over plain HTTP, where it is
// undefined — calling it threw `crypto.randomUUID is not a function` and took
// down every public form that sends an idempotency key, before the request was
// even made. `crypto.getRandomValues()` has no such restriction, so it is the
// first fallback; `Math.random()` is the last resort, since a duplicate key
// only costs a replayed response, while throwing costs the whole submission.
export function newIdempotencyKey(): string {
  const cryptoApi = globalThis.crypto;

  if (typeof cryptoApi?.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }

  const hex = (bytes: Uint8Array) =>
    Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  if (typeof cryptoApi?.getRandomValues === "function") {
    return hex(cryptoApi.getRandomValues(new Uint8Array(16)));
  }

  // No Web Crypto at all (very old browsers). Still 32 chars, still unique
  // enough for a replay window: the key is not a security token.
  return (
    Date.now().toString(16).padStart(12, "0") +
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 16).toString(16)).join("") +
    Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")
  ).slice(0, 32);
}

export async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  body?: object | null,
  init?: FetchApiOptions
): Promise<T> {
  // Use relative URL for proxying (uncomment if using next.config.js proxy)
  // const url = `/api/${endpoint}`;
  const base = init?.publicApi ? PUBLIC_API_BASE_URL : API_BASE_URL;
  const url = `${base}${endpoint}`; // Direct backend URL

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (init?.idempotencyKey) {
    headers["Idempotency-Key"] = init.idempotencyKey;
  }

  const options: RequestInit = {
    method,
    headers,
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