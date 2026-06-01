// src/services/warrantyServiceRequestService.ts
import { apiCall } from "./apiService";

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
  message: string;
  status: "success" | "error";
  data?: Omit<WarrantyServiceRequestData, "website"> & {
    id: number;
    created_at: string;
  };
  errors?: Record<string, string[]>;
}

export async function submitWarrantyServiceRequest(
  data: WarrantyServiceRequestData
): Promise<WarrantyServiceRequestResponse> {
  try {
    const response = await apiCall<WarrantyServiceRequestResponse>(
      "warranty-service-requests/",
      "POST",
      data
    );
    return response;
  } catch (error) {
    console.error("Error submitting warranty service request!", error);
    throw error;
  }
}
