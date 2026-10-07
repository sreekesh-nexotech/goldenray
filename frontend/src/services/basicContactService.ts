// golden-ray/frontend/src/services/basicContactService.ts
import { API_BASE_URL } from "../config";
import { apiCall } from "./apiService";
import { newIdempotencyKey } from "../utils/fetchApi";
import { requestPhoneVerification } from "./phoneVerification";
import { getStudioAccessToken, refreshStudioAccessToken } from "./studioService";

/** Which website form an enquiry came from — mirrors LeadCollectionHome.Source. */
export type EnquirySource =
  | "footer"
  | "home_booking"
  | "contact_page"
  | "group_purchase"
  | "quotation"
  | "quote_request"
  | "referral_partner"
  | "warranty_service"
  | "career_application"
  | "other";

export interface ContactFormData {
  name: string;
  phone_number: string;
  source: EnquirySource;
  /** A token from an earlier verification; when absent the customer is asked for a code. */
  verification_token?: string;
  /** Site path the form was submitted from; defaults to the current page. */
  page?: string;
  /** Any extra fields the form collects (address, locality, …). */
  details?: Record<string, string | number | boolean>;
}

export interface ContactResponse {
  message: string;
  status: "success" | "error";
  // Consider adding optional fields for more detailed error responses if your API sends them
  // errors?: { [key: string]: string[] };
}

/** A stored enquiry row as returned by GET lead-collection-home/. */
export interface ContactEnquiry {
  id: number;
  name: string;
  phone_number: string;
  source: EnquirySource;
  source_label: string;
  page: string;
  details: Record<string, string | number | boolean>;
  /** ISO-8601 UTC timestamp of when the enquiry was submitted. */
  created_at: string;
  updated_at: string;
}

// The platform's `form` enum for each website source (leads/ POST).
const LEAD_FORM: Record<EnquirySource, string> = {
  footer: "FOOTER",
  home_booking: "HOME_BOOKING",
  contact_page: "CONTACT_PAGE",
  group_purchase: "GROUP_PURCHASE",
  quotation: "QUOTATION",
  quote_request: "QUOTE_REQUEST",
  referral_partner: "REFERRAL_PARTNER",
  warranty_service: "WARRANTY_SERVICE",
  career_application: "OTHER",
  other: "OTHER",
};

interface LeadApiResponse {
  uid: string;
  number: string;
  message?: string;
}

/**
 * Submit an enquiry to the platform (POST /api/public/v1/leads/). The backend
 * only accepts a lead whose phone number was verified with a one-time code, so
 * the customer is asked for one first (unless a token is passed in).
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  try {
    const page =
      data.page ?? (typeof window !== "undefined" ? window.location.pathname : "");
    const phone = data.phone_number.replace(/\s+/g, "");
    const verificationToken =
      data.verification_token ?? (await requestPhoneVerification(data.name, phone));
    const response = await apiCall<LeadApiResponse>(
      "leads/",
      "POST",
      {
        form: LEAD_FORM[data.source] ?? "OTHER",
        name: data.name,
        phone,
        page,
        details: data.details ?? {},
        verification_token: verificationToken,
      },
      { publicApi: true, idempotencyKey: newIdempotencyKey() }
    );
    return { message: response.message ?? "Request received", status: "success" };
  } catch (error) {
    console.error("Error submitting contact form!", error);
    throw error;
  }
}

/**
 * A customer-facing message for a failed submission: the server's first
 * field error when it sent one, never a raw "HTTP error! Status: 400".
 */
export function contactErrorMessage(error: unknown): string {
  const data = (error as { errorData?: { errors?: Record<string, unknown> } })
    ?.errorData;
  const first = data?.errors && Object.values(data.errors)[0];
  if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  return "We couldn't submit your request. Please try again, or call us directly.";
}

/**
 * Every enquiry captured by the footer / home contact forms, newest first
 * (the API already orders by `-created_at`). Feeds the Content Studio
 * Enquiries screen.
 *
 * Reading the queue needs a Studio token granting `leads` (§6.8); the backend
 * verifies it with the key shared with the CMS. A 401 gets one refresh-and-
 * retry, matching careerApplicationService.
 */
export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const send = (token: string | null) =>
    fetch(`${API_BASE_URL}lead-collection-home/`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  let response = await send(getStudioAccessToken());
  if (response.status === 401) response = await send(await refreshStudioAccessToken());
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data?.detail === "string") detail = data.detail;
    } catch {
      /* keep the generic message */
    }
    throw new Error(detail);
  }
  const rows = (await response.json()) as ContactEnquiry[];
  return Array.isArray(rows) ? rows : [];
}