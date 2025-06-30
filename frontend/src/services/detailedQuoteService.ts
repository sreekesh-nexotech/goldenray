// src/services/detailedQuoteService.ts
import { apiCall } from "./apiService";

interface SendOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  message: string;
  success: boolean;
}

interface SendOtpRequest {
  name: string;
  phone_number: string;
}

interface VerifyOtpRequest {
  phone_number: string;
  code: string;
}

export const sendOtp = async (name: string, phoneNumber: string): Promise<SendOtpResponse> => {
  const payload: SendOtpRequest = {
    name,
    phone_number: phoneNumber,
  };
  return await apiCall<SendOtpResponse>("/api/send-otp/", "POST", payload);
};

export const verifyOtp = async (phoneNumber: string, code: string): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpRequest = {
    phone_number: phoneNumber,
    code,
  };
  return await apiCall<VerifyOtpResponse>("/api/verify-otp/", "POST", payload);
};