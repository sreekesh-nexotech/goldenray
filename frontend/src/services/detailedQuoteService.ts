// src/services/detailedQuoteService.ts
//
// Phone one-time codes on the public API v1 (otp/send/, otp/verify/). A verified
// number yields a verification_token that the lead POST (leads/) requires.
import { SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse } from "@/types/types";
import { apiCall } from "./apiService";

const compact = (phone: string) => phone.replace(/\s+/g, "");

export const sendOtp = async (name: string, phoneNumber: string): Promise<SendOtpResponse> => {
  const payload: SendOtpRequest = {
    ...(name.trim() ? { name: name.trim() } : {}),
    phone: compact(phoneNumber),
  };
  return await apiCall<SendOtpResponse>("otp/send/", "POST", payload, { publicApi: true });
};

export const verifyOtp = async (phoneNumber: string, code: string): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpRequest = {
    phone: compact(phoneNumber),
    code: compact(code),
  };
  return await apiCall<VerifyOtpResponse>("otp/verify/", "POST", payload, { publicApi: true });
};
