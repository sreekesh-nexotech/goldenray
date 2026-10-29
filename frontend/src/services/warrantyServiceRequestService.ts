// src/services/warrantyServiceRequestService.ts
import { apiCall } from "./apiService";
import { newIdempotencyKey } from "../utils/fetchApi";

export interface WarrantyServiceRequestData {
  full_name: string;
  phone: string;
  issue_type: string;
  description?: string;
  // Honeypot. Must be sent empty. Hidden field on the form; bots that
  // autofill it will fail validation server-side.
  website?: string;
}

export interface WarrantyServiceRequestResponse {
  uid: string;
  full_name: string;
  issue_type: string;
  status: string;
  created_at: string;
  message: string;
}

export async function submitWarrantyServiceRequest(
  data: WarrantyServiceRequestData
): Promise<WarrantyServiceRequestResponse> {
  try {
    const response = await apiCall<WarrantyServiceRequestResponse>(
      "warranty-requests/",
      "POST",
      data,
      { publicApi: true, idempotencyKey: newIdempotencyKey() }
    );
    return response;
  } catch (error) {
    console.error("Error submitting warranty service request!", error);
    throw error;
  }
}
