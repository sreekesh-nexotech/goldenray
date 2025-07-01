// golden-ray/frontend/src/services/basicContactService.ts
import { apiCall } from "./apiService";

export interface ContactFormData {
  name: string;
  phone_number: string; 
}

export interface ContactResponse {
  message: string;
  status: "success" | "error";
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  try {
    const response = await apiCall<ContactResponse>("lead-collection-home/", "POST", data);
    return response;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw new Error("Failed to submit contact form. Please try again.");
  }
}