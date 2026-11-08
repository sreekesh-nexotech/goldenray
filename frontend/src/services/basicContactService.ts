// golden-ray/frontend/src/services/basicContactService.ts
import { apiCall } from "./apiService";
import { newIdempotencyKey } from "../utils/fetchApi";
import { requestPhoneVerification } from "./phoneVerification";
import { studioRequest, type Paginated } from "./studioService";

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
  uid: string;
  /** Human-readable lead reference assigned by the platform (e.g. "L-00123"). */
  number: string;
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

/** One row of `GET /api/v1/leads/`. */
interface PlatformLead {
  uid: string;
  number: string;
  form: string;
  status: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  payload: Record<string, string | number | boolean> | null;
  page: string | null;
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

/** Reverse of LEAD_FORM: the platform's `form` back to a website source. */
const FORM_SOURCE: Record<string, EnquirySource> = Object.entries(LEAD_FORM).reduce(
  (acc, [source, form]) => {
    acc[form] = source as EnquirySource;
    return acc;
  },
  {} as Record<string, EnquirySource>,
);

/**
 * Every enquiry captured by the footer / home contact forms, newest first
 * (`GET /api/v1/leads/` already orders by `-created_at`). Feeds the Content
 * Studio Enquiries screen, and needs the `leads` module.
 *
 * The platform's lead is a richer record than the old `lead_collection_home`
 * row, so it is mapped back onto the shape the screen renders.
 */
export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const page = await studioRequest<Paginated<PlatformLead>>("leads/?page_size=200");
  return page.results.map((row) => ({
    uid: row.uid,
    number: row.number,
    name: row.name,
    phone_number: row.phone,
    source: FORM_SOURCE[row.form] ?? "footer",
    source_label: row.form,
    page: row.page ?? "",
    details: row.payload ?? {},
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}