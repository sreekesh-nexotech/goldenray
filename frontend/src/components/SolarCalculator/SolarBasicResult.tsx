/* golden-ray/frontend/src/components/SolarCalculator/SolarBasicResult.tsx */
"use client";

import { useState, ChangeEvent } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import Button from "../ui/Button";
import BasicResult from "./basic-result";
import { BasicCalculatorData } from "@/types/types";
import QuotePopup from "./QuotePopup";

interface SolarBasicResultProps {
  initialPincode: string;
  initialproperty_type: string;
  initialmonthly_bill: number | "";
  calculatedData: BasicCalculatorData;
  onResubmit: (pincode: string, property_type: string, monthly_bill: number) => void;
  onGoBack: () => void;
  apiError?: string | null;
}

export default function SolarBasicResult({
  initialPincode,
  initialproperty_type,
  initialmonthly_bill,
  calculatedData,
  onResubmit,
  onGoBack,
  apiError,
}: SolarBasicResultProps) {
  const [pincode, setPincode] = useState(initialPincode);
  const [property_type, setproperty_type] = useState(initialproperty_type || "residential");
  const [monthly_bill, setmonthly_bill] = useState<number | "">(initialmonthly_bill);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [monthly_label, setmonthly_label] = useState(
    initialproperty_type === "residential" ? "Average bi-Monthly Bill" : "Average Monthly Bill"
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Pincode validation: must be 6 digits
    if (!pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(pincode.replace(/\s/g, ""))) {
      newErrors.pincode = "Please enter a valid 6-digit pincode.";
    }

    // Property type validation: must be selected
    if (!property_type) {
      newErrors.property_type = "Please select a property type.";
    }

    // Monthly bill validation: must be a positive number
    const billValue = Number(monthly_bill);
    if (!monthly_bill) {
      newErrors.monthly_bill = "Monthly bill is required.";
    } else if (isNaN(billValue) || billValue <= 0) {
      newErrors.monthly_bill = "Please enter a valid bill greater than 0.";
    } else if (billValue > 40000) {
      newErrors.monthly_bill = "Monthly bill cannot exceed ₹40,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleproperty_typeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setproperty_type(e.target.value);
    setmonthly_label(e.target.value === "residential" ? "Average bi-Monthly Bill" : "Average Monthly Bill");
    // Clear property type error on change
    setErrors((prev) => ({ ...prev, property_type: "" }));
  };

  const handlemonthly_billChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setmonthly_bill(value === "" ? "" : parseFloat(value));
    // Clear monthly bill error on change
    setErrors((prev) => ({ ...prev, monthly_bill: "" }));
  };

  const handlePincodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
    // Clear pincode error on change
    setErrors((prev) => ({ ...prev, pincode: "" }));
  };

  const handleResubmit = () => {
    if (validateForm()) {
      const billValue = Number(monthly_bill);
      onResubmit(pincode, property_type, billValue);
    }
  };

  // Prepare all error messages for display
  const allErrors: string[] = [];
  if (apiError) {
    allErrors.push(apiError);
  }
  Object.values(errors).forEach(errMsg => {
    if (errMsg) { // Only add non-empty error messages
      allErrors.push(errMsg);
    }
  });


  return (
    <div className="relative py-12 mt-12 scroll-mt-30" id="solar-advantage-results">
      <PageIllustration />
      <div className="relative px-4 sm:px-6 lg:px-8 xl:px-36">
        <h1 className="text-4xl text-center md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15">
          Calculate Your Solar Advantage
        </h1>
        {allErrors.length > 0 && ( // Display a single error message container if there are any errors
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <ul className="mt-2 list-disc list-inside">
                {allErrors.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col lg:flex-row justify-between gap-5 text-center lg:items-end mb-10">
          {/* Pincode */}
          <div>
            <label htmlFor="pincode-result" className="block text-left text-sm font-medium text-gray-700 mb-1">
              Your Property Pincode
            </label>
            <input
              type="text"
              id="pincode-result"
              value={pincode}
              onChange={handlePincodeChange}
              className={`bg-white shadow-md w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] ${
                errors.pincode ? "border-red-600" : "" // Keep the red border
              }`}
              placeholder="Enter 6-digit pincode"
              required
            />
            {/* Specific error message removed, now part of the common list */}
          </div>
          {/* Property Type */}
          <div className="block text-left">
            <label htmlFor="property-type-result" className="text-left text-sm font-medium text-gray-700 mb-1">
              Your Property Type
            </label>
            <select
              id="property-type-result"
              value={property_type}
              onChange={handleproperty_typeChange}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] shadow-md bg-white ${
                property_type === "" ? "text-gray-400" : "text-black"
              } ${errors.property_type ? "border-red-600" : ""}`}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            {/* Specific error message removed, now part of the common list */}
          </div>
          {/* Average Monthly/Bi-Monthly Bill */}
          <div>
            <label htmlFor="electricity-bill-result" className="block text-left text-sm font-medium text-gray-700 mb-1">
              Your {monthly_label}
            </label>
            <input
              type="number"
              id="electricity-bill-result"
              value={monthly_bill}
              onChange={handlemonthly_billChange}
              step="0.01"
              min="0.01"
              className={`bg-white shadow-md w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] ${
                errors.monthly_bill ? "border-red-600" : "" // Keep the red border
              }`}
              placeholder="Enter bill amount"
              required
            />
            {/* Specific error message removed, now part of the common list */}
          </div>
          {/* Resubmit Button */}
          <button
            onClick={handleResubmit}
            className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] px-8 py-3 rounded-lg"
          >
            Resubmit Changes
          </button>
          {/* Advanced Calculator Link */}
          <a
            href="/advanced-calculator"
            target="new"
            className="text-[#007E85] font-bold border border-[#007E85] rounded-2xl hover:bg-[#007E85] hover:text-white transition-all ease-in-out text-sm px-5 py-3 md:text-base md:ml-4"
          >
            Advanced Calculator
          </a>
        </div>
        <BasicResult data={calculatedData} monthlyBill={initialmonthly_bill} />
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          <Button onClick={() => setIsPopupOpen(true)}>Get Detailed Quote</Button>
          <button
            onClick={onGoBack}
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg"
          >
            Go Back to Form
          </button>
        </div>
        {isPopupOpen && <QuotePopup onClose={() => setIsPopupOpen(false)} />}
      </div>
    </div>
  );
}