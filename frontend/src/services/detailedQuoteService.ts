// src/services/detailedQuoteService.ts
import { apiCall } from "./apiService";
// Interfaces for OTP API requests and responses

export interface SendOtpRequest {
  name: string;
  phone_number: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  code: string;
}

export interface VerifyOtpResponse {
  message: string;
  status:string;
}

// Interface for API errors
export interface CustomApiError extends Error {
  message: string;
}

export const sendOtp = async (name: string, phoneNumber: string): Promise<SendOtpResponse> => {
  const payload: SendOtpRequest = {
    name,
    phone_number: phoneNumber,
  };
  return await apiCall<SendOtpResponse>("send-otp/", "POST", payload);
};

export const verifyOtp = async (phoneNumber: string, code: string): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpRequest = {
    phone_number: phoneNumber,
    code,
  };
  return await apiCall<VerifyOtpResponse>("verify-otp/", "POST", payload);
};