// src/services/quotationTestimonialsService.ts
//
// Page 6 testimonials for the quotation, from the Django BOM app's library
// (Django admin → Quotation testimonials). The GET is public.
import { API_BASE_URL } from "@/config";
import type { TestimonialEntry } from "@/components/QuotationV2/testimonials";

// The BOM app is mounted at `/bom/` on the backend, not under `/api/`.
const ENDPOINT = `${API_BASE_URL.replace(/api\/?$/, "bom/")}api/quotation-testimonials/`;

/** Active testimonials in display order; [] (the built-in three) if unreachable. */
export async function getQuotationTestimonials(): Promise<TestimonialEntry[]> {
  try {
    const res = await fetch(ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows: TestimonialEntry[] = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Failed to fetch quotation testimonials; using the defaults:", error);
    return [];
  }
}
