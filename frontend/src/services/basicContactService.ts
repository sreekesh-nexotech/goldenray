// golden-ray/frontend/src/services/basicContactService.ts
import { apiCall } from "./apiService";

export interface ContactFormData {
  name: string;
  phone_number: string;
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
  /** ISO-8601 UTC timestamp of when the enquiry was submitted. */
  created_at: string;
  updated_at: string;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  try {
    const response = await apiCall<ContactResponse>("lead-collection-home/", "POST", data);
    return response;
  } catch (error) {
    console.error("Error submitting contact form!", error);
    throw error;
  }
}

/**
 * Every enquiry captured by the footer / home contact forms, newest first
 * (the API already orders by `-created_at`). Feeds the Content Studio
 * Enquiries screen.
 */
export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const response = await apiCall<ContactEnquiry[]>("lead-collection-home/");
  return Array.isArray(response) ? response : [];
}