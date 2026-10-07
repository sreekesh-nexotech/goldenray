// src/services/catalogApi.ts
//
// Shared plumbing for the public product catalog (GET /api/public/v1/products/).
// Lists are paginated ({count, results}); every catalog list is far shorter than
// the 200-row page cap, so one page holds the whole category.
import { apiCall } from "./apiService";

export interface Paginated<T> {
  count: number;
  results: T[];
}

/** Fields every product payload carries (the panel/inverter specs hang off `spec`). */
export interface CatalogProduct<S> {
  slug: string;
  name: string;
  model: string;
  brand_label: string;
  headline: string;
  summary: string;
  description?: string;
  image_url: string;
  price_range_label: string | null;
  subsidy_eligible: boolean | null;
  kerala_climate_score: number | null;
  overall_rating: string | null;
  rating_tier: string | null;
  ratings: Record<string, number | null>;
  warranty: {
    product_years: number | null;
    performance_years: number | null;
    extendable_years: number | null;
  };
  spec: S;
}

/** "Adani Solar" → "adani-solar": the brand slug the backend filters on. */
export function brandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CatalogSort = "topRated" | "efficiency" | "price" | "warranty";

/**
 * `?ordering=` for a UI sort. The backend has no price ordering, so "price"
 * falls back to its default order (Kerala score, best first).
 */
export function orderingFor(sortBy: CatalogSort): string {
  switch (sortBy) {
    case "efficiency":
      return "-efficiency";
    case "warranty":
      return "-product_warranty";
    default:
      return "-kerala_climate_score";
  }
}

export async function fetchProducts<T>(
  category: "panels" | "inverters" | "batteries",
  params: URLSearchParams = new URLSearchParams(),
  revalidate?: number,
): Promise<T[]> {
  params.set("page_size", "200");
  const response = await apiCall<Paginated<T>>(
    `products/${category}/?${params.toString()}`,
    "GET",
    null,
    { publicApi: true, ...(revalidate !== undefined ? { revalidate } : {}) },
  );
  return response.results;
}

export async function fetchProduct<T>(
  category: "panel" | "inverter" | "battery",
  slug: string,
): Promise<T> {
  return apiCall<T>(`products/${category}/${encodeURIComponent(slug)}/`, "GET", null, {
    publicApi: true,
  });
}
