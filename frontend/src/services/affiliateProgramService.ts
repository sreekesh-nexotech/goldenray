// src/services/affiliateProgramService.ts
import { apiCall } from "./apiService";
import { newIdempotencyKey } from "../utils/fetchApi";

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
  uid: string;
  full_name: string;
  profession: string;
  district: string;
  status: string;
  created_at: string;
  message: string;
}

export async function submitAffiliateApplication(
  data: AffiliateApplicationData
): Promise<AffiliateApplicationResponse> {
  try {
    const response = await apiCall<AffiliateApplicationResponse>(
      "affiliate-applications/",
      "POST",
      data,
      { publicApi: true, idempotencyKey: newIdempotencyKey() }
    );
    return response;
  } catch (error) {
    console.error("Error submitting affiliate application!", error);
    throw error;
  }
}
