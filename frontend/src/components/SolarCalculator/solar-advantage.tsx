"use client";
import { ChangeEvent, useState } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import { SolarBasicPayload } from "@/types/types";

interface SolarAdvantageProps {
  onSubmit: (pincode: string, property_type: string, monthly_bill: number) => void;
  initialPincode?: string;
  initialproperty_type?: string;
  initialmonthly_bill?: number | "";
  isLoading: boolean;
}

export default function SolarAdvantage({
  onSubmit,
  initialPincode = "",
  initialproperty_type = "",
  initialmonthly_bill = "",
  isLoading,
}: SolarAdvantageProps) {
  const [pincode, setPincode] = useState(initialPincode);
  const [property_type, setproperty_type] = useState(initialproperty_type);
  const [monthly_bill, setmonthly_bill] = useState<number | "">(initialmonthly_bill);
  const [errors, setErrors] = useState({
    pincode: "",
    property_type: "",
    monthly_bill: "",
  });
  const [monthly_label , setmonthly_label] = useState("Average Monthly Bill");

  const validateForm = () => {
    let valid = true;
    const newErrors = { pincode: "", property_type: "", monthly_bill: "" };

    // Pincode validation: Must be 6 digits
    const billValue = Number(monthly_bill);
  if (isNaN(billValue) || billValue <= 0) {
    newErrors.monthly_bill = "Electricity bill must be a positive number.";
    valid = false;
  } 
  // else if (billValue > 7300) {
  //   newErrors.monthly_bill = "Monthly bill cannot exceed ₹7300.";
  //   valid = false;
  // }

    setErrors(newErrors);
    return valid;
  };

  const handleproperty_typeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setproperty_type(e.target.value);
    setErrors((prev) => ({ ...prev, property_type: "" }));
    setmonthly_label(e.target.value === "residential"?"Average bi-Monthly Bill":"Average Monthly Bill");
  };

  const handlePincodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    setPincode(value);
    setErrors((prev) => ({ ...prev, pincode: "" }));
  };

  const handlemonthly_billChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setmonthly_bill(value === "" ? "" : parseFloat(value)); // Allow empty string or parse to number
    setErrors((prev) => ({ ...prev, monthly_bill: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const billValue = Number(monthly_bill);
      const payload: SolarBasicPayload = {
        pincode,
        property_type,
        monthly_bill: billValue,
      };
      console.log("Submitting payload to backend:", payload);
      onSubmit(pincode, property_type, billValue);
    }
  };

  return (
    <div className="relative bg-white py-12 mt-12 scroll-mt-30" id="solar-advantage">
      <PageIllustration isGradient={false} />
      <div className="relative max-w-7xl mx-auto text-center px-4 md:px-0">
        <h1 className="text-4xl md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15">
          Calculate Your Solar Advantage
        </h1>
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
                maxLength={6}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.pincode ? "border-red-500" : "border-gray-300 focus:ring-[#F7BA41]"
                }`}
                required
                disabled={isLoading}
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
                value={property_type}
                onChange={handleproperty_typeChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.property_type ? "border-red-500" : "border-gray-300 focus:ring-[#F7BA41]"
                } ${property_type === "" ? "text-gray-400" : "text-black"}`}
                required
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Select Property Type
                </option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
              {errors.property_type && <p className="text-red-500 text-xs mt-1 text-left">{errors.property_type}</p>}
            </div>

            {/* Average Monthly Electricity Bill Input */}
            <div className="mb-6">
              <label
                htmlFor="electricity-bill"
                className="block text-left text-sm font-medium text-gray-700 mb-1"
              >
                {monthly_label}
              </label>
              <input
                type="number"
                id="electricity-bill"
                placeholder="2500"
                value={monthly_bill}
                onChange={handlemonthly_billChange}
                step="0.01"
                min="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.monthly_bill ? "border-red-500" : "border-gray-300 focus:ring-[#F7BA41]"
                }`}
                required
                disabled={isLoading}
              />
              {errors.monthly_bill && <p className="text-red-500 text-xs mt-1 text-left">{errors.monthly_bill}</p>}
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              className={`btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
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