// src/services/quotationSettingsService.ts
//
// The summary-page offer banner for the quotation document, managed by admin
// in the platform backend and served in the public company profile
// (GET /api/public/v1/company/ → quotation.offer). The GET is public. EMI figures come from the
// EMI calculator instead — see quotationEmiService.ts.
import { PUBLIC_API_BASE_URL } from "@/config";
import {
  DEFAULT_QUOTATION_SETTINGS,
  type QuotationDocumentSettings,
} from "@/components/QuotationV2/financing";

// Capped so a request that hangs (e.g. the PDF renderer inside the server
// reaching the public API) falls back to defaults instead of stalling the page.
const TIMEOUT_MS = 8000;
const ENDPOINT = `${PUBLIC_API_BASE_URL}company/`;

interface QuotationOfferApi {
  enabled: boolean;
  title: string;
  description: string;
  details: string;
  title_ml: string;
  description_ml: string;
  details_ml: string;
  valid_from: string | null;
  valid_until: string | null;
  /** The uploaded image if there is one, else the configured URL. */
  image_src: string;
}

/**
 * The admin's settings, or the built-in defaults if the backend cannot be
 * reached — a quotation must still render when the backend is down.
 */
export async function getQuotationSettings(): Promise<QuotationDocumentSettings> {
  try {
    const res = await fetch(ENDPOINT, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const company: { quotation?: { offer?: QuotationOfferApi } } = await res.json();
    const o = company.quotation?.offer;
    if (!o) throw new Error("company profile has no quotation offer");
    const d = DEFAULT_QUOTATION_SETTINGS;
    return {
      offer: {
        enabled: Boolean(o.enabled),
        title: o.title ?? "",
        description: o.description ?? "",
        details: o.details ?? "",
        titleMl: o.title_ml ?? "",
        descriptionMl: o.description_ml ?? "",
        detailsMl: o.details_ml ?? "",
        validFrom: o.valid_from ?? "",
        validUntil: o.valid_until ?? "",
        imageUrl: o.image_src || d.offer.imageUrl,
      },
    };
  } catch (error) {
    console.error("Failed to fetch quotation settings; using defaults:", error);
    return DEFAULT_QUOTATION_SETTINGS;
  }
}
