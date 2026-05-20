// src/services/affiliateProgramService.ts
import { apiCall } from "./apiService";

export interface AffiliateApplicationData {
  full_name: string;
  phone: string;
  email: string;
  profession: string;
  district: string;
  // Honeypot. Must be sent empty. Hidden field on the form; bots that
  // autofill it will fail validation server-side.
  website?: string;
}

export interface AffiliateApplicationResponse {
  message: string;
  status: "success" | "error";
  data?: Omit<AffiliateApplicationData, "website"> & {
    id: number;
    created_at: string;
  };
  errors?: Record<string, string[]>;
}

export async function submitAffiliateApplication(
  data: AffiliateApplicationData
): Promise<AffiliateApplicationResponse> {
  try {
    const response = await apiCall<AffiliateApplicationResponse>(
      "affiliate-applications/",
      "POST",
      data
    );
    return response;
  } catch (error) {
    console.error("Error submitting affiliate application!", error);
    throw error;
  }
}
