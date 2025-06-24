
// golden-ray/frontend/src/services/basicContactService.ts
import { apiCall } from "./apiService";
import { USE_MOCK_DATA } from "../config";

export interface ContactFormData {
  name: string;
  mobileNumber: string;
}

export interface ContactResponse {
  message: string;
  status: "success" | "error";
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: `Form submitted successfully for ${data.name}!`,
          status: "success",
        });
      }, 1000);
    });
  }

  try {
    const response = await apiCall<ContactResponse>("/api/contact-us", "POST", data);
    return response;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw new Error("Failed to submit contact form. Please try again.");
  }
}