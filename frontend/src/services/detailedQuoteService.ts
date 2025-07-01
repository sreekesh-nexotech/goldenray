// src/services/detailedQuoteService.ts
import { SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse } from "@/types/types";
import { apiCall } from "./apiService";


export const sendOtp = async (name: string, phoneNumber: string): Promise<SendOtpResponse> => {
  const payload: SendOtpRequest = {
    name,
    phone_number: phoneNumber,
  };
  return await apiCall<SendOtpResponse>("send-otp/", "POST", payload);
};

export const verifyOtp = async (name:string, phoneNumber: string, code: string): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpRequest = {
    phone_number: phoneNumber,
    code,
  };
  return await apiCall<VerifyOtpResponse>("verify-otp/", "POST", payload);
};