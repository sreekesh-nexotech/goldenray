"use client";
import { ChangeEvent, useState } from "react";
import PageIllustration from "@/components/ui/page-illustration";

interface SubsidyCalculatorProps {
  onCalculate: (electricityBill: string, propertyType: string) => void;
  isLoading: boolean;
}

export default function SubsidyCalculator({
  onCalculate,
  isLoading,
}: SubsidyCalculatorProps) {
  const [electricityBill, setElectricityBill] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [errors, setErrors] = useState({
    electricityBill: "",
    propertyType: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      electricityBill: "",
      propertyType: "",
    };

    if (!electricityBill) {
      newErrors.electricityBill = "Please select electricity bill range.";
      valid = false;
    }

    if (!propertyType) {
      newErrors.propertyType = "Please select a property type.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleElectricityBillChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setElectricityBill(e.target.value);
    setErrors((prev) => ({ ...prev, electricityBill: "" }));
  };

  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
    setErrors((prev) => ({ ...prev, propertyType: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate(electricityBill, propertyType);
    }
  };

  return (
    <section
      className="relative py-16 sm:py-18 md:py-20 lg:py-24 xl:py-28 2xl:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(38.63% 65.14% at 50.97% 56.91%, #F8F2E1 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <PageIllustration isGradient={false} />

      <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12">
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-bold text-[#123532] mb-4 sm:mb-5 lg:mb-6 xl:mb-6 2xl:mb-8">
          Check Your Subsidy in 30 Seconds
        </h1>
        <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl text-[#666666] mb-12 sm:mb-14 lg:mb-16 xl:mb-16 2xl:mb-18">
          Free calculator — see your exact subsidy amount instantly
        </p>

        <div className="bg-[#FFF9EF] shadow-lg rounded-3xl p-6 sm:p-8 md:p-10 lg:p-10 xl:p-12 2xl:p-14 max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto relative">
          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="electricity-bill"
                className="block text-left text-sm font-medium text-[#123532] mb-2"
              >
                Average Monthly Electricity Bill
              </label>
              <select
                id="electricity-bill"
                value={electricityBill}
                onChange={handleElectricityBillChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 ${
                  errors.electricityBill
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-[#F7BA41]"
                } ${
                  electricityBill === "" ? "text-gray-400" : "text-[#123532]"
                }`}
                required
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Above ₹2000
                </option>
                <option value="above_2000" className="text-[#123532]">
                  Above ₹2000
                </option>
                <option value="1500_2000" className="text-[#123532]">
                  ₹1500 - ₹2000
                </option>
                <option value="1000_1500" className="text-[#123532]">
                  ₹1000 - ₹1500
                </option>
                <option value="below_1000" className="text-[#123532]">
                  Below ₹1000
                </option>
              </select>
              {errors.electricityBill && (
                <p className="text-red-500 text-xs mt-1 text-left">
                  {errors.electricityBill}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="property-type"
                className="block text-left text-sm font-medium text-[#123532] mb-2"
              >
                Property Type
              </label>
              <select
                id="property-type"
                value={propertyType}
                onChange={handlePropertyTypeChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 ${
                  errors.propertyType
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-[#F7BA41]"
                } ${propertyType === "" ? "text-gray-400" : "text-[#123532]"}`}
                required
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Residential
                </option>
                <option value="residential" className="text-[#123532]">
                  Residential
                </option>
                <option value="commercial" className="text-[#123532]">
                  Commercial
                </option>
              </select>
              {errors.propertyType && (
                <p className="text-red-500 text-xs mt-1 text-left">
                  {errors.propertyType}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-[#F7BA41] hover:bg-[#e5a934] text-[#272218] font-semibold py-4 rounded-xl transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
              aria-label="Check My Subsidy"
            >
              {isLoading ? "Calculating..." : "Check My Subsidy"}
            </button>
          </form>
        </div>

        {/* Decorative badges */}
        <div className="absolute hidden lg:block top-[35%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 bg-[#D0FBF7] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[-11.87deg] shadow-md">
          Upto 78,000 Subsidy
        </div>
        <div className="absolute hidden lg:block top-[35%] right-[10%] transform translate-x-1/2 -translate-y-1/2 bg-[#D0FBF7] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[16.14deg] shadow-md">
          25 Years Lifespan
        </div>
        <div className="absolute hidden lg:block bottom-[20%] left-[15%] transform -translate-x-1/2 translate-y-1/2 bg-[#E6D0FB] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[10.97deg] shadow-md">
          Starting from 2000/mo EMI
        </div>
        <div className="absolute hidden lg:block bottom-[25%] right-[15%] transform translate-x-1/2 translate-y-1/2 bg-[#FBDFD0] text-[#124944] px-4 py-2 rounded-lg text-sm font-semibold rotate-[-6.84deg] shadow-md">
          10 Years Warranty
        </div>
      </div>

      {/* Bottom Features */}
      <div className="relative max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mt-16 sm:mt-18 lg:mt-20 xl:mt-24 2xl:mt-28 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-18">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[#123532] font-medium">100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[#123532] font-medium">No Spam Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[#123532] font-medium">
              No Credit Required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
