"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const QuotationPdfGenerator = dynamic(
  () => import("@/components/Quotation/QuotationPdfGenerator"),
  { ssr: false },
);

interface CustomerDetailsPopupProps {
  onClose: () => void;
  pincode: string;
  monthlyBill: number | "";
  systemSize: string;
  systemPrice: number;
  emiPerMonth: number;
  graphData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export interface QuotationData {
  customerName: string;
  address: string;
  phoneNumber: string;
  pincode: string;
  monthlyBill: number | "";
  systemSize: string;
  systemPrice: number;
  emiPerMonth: number;
  graphData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export default function CustomerDetailsPopup({
  onClose,
  pincode,
  monthlyBill,
  systemSize,
  systemPrice,
  emiPerMonth,
  graphData,
}: CustomerDetailsPopupProps) {
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfData, setPdfData] = useState<QuotationData | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Name is required.";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber =
        "Please enter a valid 10-digit Indian mobile number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const quotationData: QuotationData = {
        customerName,
        address,
        phoneNumber,
        pincode,
        monthlyBill,
        systemSize,
        systemPrice,
        emiPerMonth,
        graphData,
      };

      // Also store in sessionStorage for the /quotation page fallback
      sessionStorage.setItem("quotationData", JSON.stringify(quotationData));

      // Trigger PDF generation
      setIsGenerating(true);
      setPdfData(quotationData);
    }
  };

  const handlePdfComplete = () => {
    setIsGenerating(false);
    setPdfData(null);
    onClose();
  };

  const handlePdfError = (error: string) => {
    setIsGenerating(false);
    setPdfData(null);
    alert(error);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-10 pb-10 rounded-2xl shadow-lg w-full max-w-md relative">
        <div className="flex items-end justify-end">
          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700"
            aria-label="Close form"
          >
            Close
          </button>
        </div>

        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-[#123532] mb-4">
            Enter Your Details
          </h2>

          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., 9876543210"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full cursor-pointer px-8 py-3 bg-[#F7BA41] text-black font-semibold rounded-lg hover:bg-[#e6a73a] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating PDF...
                </span>
              ) : (
                "Get Quotation"
              )}
            </button>
          </div>
        </form>

        {/* PDF Generator - renders off-screen and generates PDF */}
        {pdfData && (
          <QuotationPdfGenerator
            data={pdfData}
            onComplete={handlePdfComplete}
            onError={handlePdfError}
          />
        )}
      </div>
    </div>
  );
}
