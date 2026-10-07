// src/services/quotationTestimonialsService.ts
//
// Page 6 testimonials for the quotation, from the platform backend's library
// (GET /api/public/v1/testimonials/, paginated). The GET is public.
import { PUBLIC_API_BASE_URL } from "@/config";
import type { TestimonialEntry } from "@/components/QuotationV2/testimonials";

// Capped so a request that hangs (e.g. the PDF renderer inside the server
// reaching the public API) falls back to defaults instead of stalling the page.
const TIMEOUT_MS = 8000;
const ENDPOINT = `${PUBLIC_API_BASE_URL}testimonials/?page_size=50`;

/** Active testimonials in display order; [] (the built-in three) if unreachable. */
export async function getQuotationTestimonials(): Promise<TestimonialEntry[]> {
  try {
    const res = await fetch(ENDPOINT, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body: { results?: (Omit<TestimonialEntry, "photo_src"> & { photo_src: string | null })[] } = await res.json();
    // photo_src is null when no photo is set; the cards expect an empty string.
    return Array.isArray(body.results)
      ? body.results.map((r) => ({ ...r, photo_src: r.photo_src ?? "" }))
      : [];
  } catch (error) {
    console.error("Failed to fetch quotation testimonials; using the defaults:", error);
    return [];
  }
}
