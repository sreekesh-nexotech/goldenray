"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { sendOtp,verifyOtp } from "@/services/detailedQuoteService";

interface QuotePopupProps {
  onClose: () => void;
}

export default function QuotePopup({ onClose }: QuotePopupProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    }  else if (!/^[6-9]\d{9}$/.test(phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).";
    }
    if (showOtpInput && !code.trim()) {
      newErrors.code = "OTP is required.";
    } else if (showOtpInput && !/^\d{6}$/.test(code.replace(/\s/g, ""))) {
      newErrors.code = "Please enter a valid 6-digit OTP.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Reset API error state

    if (validateForm()) {
      try {
        if (!showOtpInput) {
          // Send OTP
          const response = await sendOtp(name, phoneNumber);
          console.log("Send OTP response:", response);
          setShowOtpInput(true);
        } else {
          // Verify OTP
          const response = await verifyOtp(name, phoneNumber, code);
          console.log("Verify OTP response:", response);
          if (response.status == "approved") {
            setFormSubmitted(true);
            setTimeout(() => {
              onClose();
            }, 3000);
          } else {
            setApiError("Invalid OTP. Please try again.");
          }
        }
      } catch (error: any) {
        console.error("API error:", error);

        // Check if it's a rate limiting error (429)
        if (error.status === 429 && error.errorData) {
          const { message, days_remaining } = error.errorData;
          setApiError(message || `You have already requested a quote recently. Please try again after ${days_remaining} days or contact our team directly.`);
        } else if (error.errorData?.error === 'rate_limit_exceeded') {
          // Fallback check for rate limit error
          setApiError(error.errorData.message || "You have already requested a quote recently. Please try again after 30 days or contact our team directly.");
        } else {
          setApiError("Something went wrong. Please try again later.");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-10 pb-10 rounded-2xl shadow-lg w-full max-w-md relative">
        <div className="flex items-end justify-end">
          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700"
            aria-label="Close quote request form"
          >
            Close
          </button>
        </div>

        {formSubmitted ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-[#123532] mb-4">
              Thank You!
            </h2>
            <p className="text-gray-700">
              Your request for a detailed quote has been received.
            </p>
            <p className="text-gray-700 mt-2">
              We&apos;ll get back to you shortly on your phone number.
            </p>
          </div>
        ) : (
          <form className="space-y-4 pt-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Whatsapp Number
              </label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 9876543210"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            {showOtpInput && (
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>
            )}

            {apiError && <p className="text-sm text-red-600">{apiError}</p>}

            <Button onClick={handleSubmit} className="w-full">
              {showOtpInput ? "Verify OTP" : "Get Detailed Quote"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}