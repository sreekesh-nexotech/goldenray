// src/services/quotationSettingsService.ts
//
// EMI interest rates and the summary-page offer banner for the quotation
// document, managed by admin in the Django BOM app (Django admin → Quotation
// Settings, or PATCH /bom/api/quotation-settings/). The GET is public.
import { API_BASE_URL } from "@/config";
import {
  DEFAULT_QUOTATION_SETTINGS,
  type QuotationDocumentSettings,
} from "@/components/QuotationV2/financing";

// The BOM app is mounted at `/bom/` on the backend, not under `/api/`.
const BOM_BASE_URL = API_BASE_URL.replace(/api\/?$/, "bom/");
const ENDPOINT = `${BOM_BASE_URL}api/quotation-settings/`;

interface QuotationSettingsApi {
  emi_rate_up_to_3kw: string;
  emi_rate_above_3kw: string;
  offer_enabled: boolean;
  offer_title: string;
  offer_description: string;
  offer_details: string;
  offer_title_ml: string;
  offer_description_ml: string;
  offer_details_ml: string;
  offer_valid_from: string | null;
  offer_valid_until: string | null;
  /** The uploaded image if there is one, else the configured URL. */
  offer_image_src: string;
}

const rate = (value: string, fallback: number) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * The admin's settings, or the built-in defaults if the backend cannot be
 * reached — a quotation must still render when the BOM service is down.
 */
export async function getQuotationSettings(): Promise<QuotationDocumentSettings> {
  try {
    const res = await fetch(ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const s: QuotationSettingsApi = await res.json();
    const d = DEFAULT_QUOTATION_SETTINGS;
    return {
      emiRates: {
        upTo3kW: rate(s.emi_rate_up_to_3kw, d.emiRates.upTo3kW),
        above3kW: rate(s.emi_rate_above_3kw, d.emiRates.above3kW),
      },
      offer: {
        enabled: Boolean(s.offer_enabled),
        title: s.offer_title ?? "",
        description: s.offer_description ?? "",
        details: s.offer_details ?? "",
        titleMl: s.offer_title_ml ?? "",
        descriptionMl: s.offer_description_ml ?? "",
        detailsMl: s.offer_details_ml ?? "",
        validFrom: s.offer_valid_from ?? "",
        validUntil: s.offer_valid_until ?? "",
        imageUrl: s.offer_image_src || d.offer.imageUrl,
      },
    };
  } catch (error) {
    console.error("Failed to fetch quotation settings; using defaults:", error);
    return DEFAULT_QUOTATION_SETTINGS;
  }
}
