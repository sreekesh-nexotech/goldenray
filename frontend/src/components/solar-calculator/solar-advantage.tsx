// src/components/solar-calculator/solar-advantage.tsx
"use client";
import { ChangeEvent, useState } from "react";
import PageIllustration from "@/components/ui/page-illustration";

interface SolarAdvantageProps {
  onSubmit: (pincode: string, propertyType: string, electricityBill: string) => void;
  initialPincode?: string;
  initialPropertyType?: string;
  initialElectricityBill?: string;
  isLoading: boolean; // Add isLoading prop here
}

export default function SolarAdvantage({
  onSubmit,
  initialPincode = "",
  initialPropertyType = "",
  initialElectricityBill = "",
  isLoading,
}: SolarAdvantageProps) {
  const [pincode, setPincode] = useState(initialPincode);
  const [propertyType, setPropertyType] = useState(initialPropertyType);
  const [electricityBill, setElectricityBill] = useState(initialElectricityBill);
  const [errors, setErrors] = useState({
    pincode: "",
    propertyType: "",
    electricityBill: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { pincode: "", propertyType: "", electricityBill: "" };

    // Pincode validation
    if (!pincode.match(/^\d{6}$/)) {
      newErrors.pincode = "Pincode must be 6 digits.";
      valid = false;
    }

    // Property Type validation
    if (propertyType === "") {
      newErrors.propertyType = "Please select a property type.";
      valid = false;
    }

    // Electricity Bill validation
    if (!electricityBill.match(/^\d+$/) || parseInt(electricityBill) <= 0) {
      newErrors.electricityBill = "Electricity bill must be a positive number.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
    setErrors((prev) => ({ ...prev, propertyType: "" })); // Clear error on change
  };

  const handlePincodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
    setErrors((prev) => ({ ...prev, pincode: "" })); // Clear error on change
  };

  const handleElectricityBillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setElectricityBill(e.target.value);
    setErrors((prev) => ({ ...prev, electricityBill: "" })); // Clear error on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(pincode, propertyType, electricityBill);
    }
  };

  return (
    <div className="relative bg-white py-12 mt-12 scroll-mt-30" id="solar-advantage">
      {/* Grid Background Layer */}
      <PageIllustration isGradient={false} />

      <div className="relative max-w-7xl mx-auto text-center px-4 md:px-0">
        {/* Heading */}
        <h1 className="text-4xl md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15">
          Calculate Your Solar Advantage
        </h1>

        {/* Form Container */}
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-3xl p-10 py-12 max-w-sm mx-auto">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {/* Pincode Input */}
            <div className="mb-4">
              <label
                htmlFor="pincode"
                className="block text-left text-sm font-medium text-gray-700 mb-1"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                placeholder="688503"
                value={pincode}
                onChange={handlePincodeChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.pincode ? "border-red-500" : "border-gray-300 focus:ring-[#F7BA41]"
                }`}
                required
                disabled={isLoading} // Disable input when loading
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1 text-left">{errors.pincode}</p>}
            </div>

            {/* Property Type Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="property-type"
                className="block text-left text-sm font-medium text-gray-700 mb-1"
              >
                Property Type
              </label>
              <select
                id="property-type"
                value={propertyType}
                onChange={handlePropertyTypeChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.propertyType ? "border-red-500" : "border-gray-300 focus:ring-[#F7BA41]"
                } ${propertyType === "" ? "text-gray-400" : "text-black"}`}
                required
                disabled={isLoading} // Disable input when loading
              >
                <option value="" hidden>
                  Select Property Type
                </option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
              {errors.propertyType && <p className="text-red-500 text-xs mt-1 text-left">{errors.propertyType}</p>}
            </div>

            {/* Average Monthly Electricity Bill Input */}
            <div className="mb-6">
              <label
                htmlFor="electricity-bill"
                className="block text-left text-sm font-medium text-gray-700 mb-1"
              >
                Average Monthly Electricity Bill
              </label>
              <input
                type="text"
                id="electricity-bill"
                placeholder="₹ 2500"
                value={electricityBill}
                onChange={handleElectricityBillChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.electricityBill ? "border-red-500" : "border-gray-300 focus:ring-[#F7BA41]"
                }`}
                required
                disabled={isLoading} // Disable input when loading
              />
              {errors.electricityBill && <p className="text-red-500 text-xs mt-1 text-left">{errors.electricityBill}</p>}
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              className={`btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Calculating..." : "Calculate Solar Advantage"}
            </button>
          </form>
        </div>

        {/* Decorative Text Elements */}
        <div className="absolute hidden xl:block top-1/2 left-1/6 transform -translate-x-1/2 -translate-y-1/2 bg-[#D0FBF7] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[-11.87deg]">
          Upto 78,000 Subsidy
        </div>
        <div className="absolute hidden xl:block top-1/2 right-1/6 transform translate-x-1/2 -translate-y-1/2 bg-[#D0FBF7] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[16.14deg]">
          25 Years Lifespan
        </div>
        <div className="absolute hidden xl:block bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 bg-[#E6D0FB] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[10.97deg]">
          Starting From 2000/mo EMI
        </div>
        <div className="absolute hidden xl:block bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 bg-[#FBDFD0] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[-6.84deg]">
          10 Years Warranty
        </div>
      </div>
    </div>
  );
}