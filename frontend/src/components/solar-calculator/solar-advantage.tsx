// src/components/solar-calculator/solar-advantage.tsx
"use client";
import { ChangeEvent, useState } from "react";
import PageIllustration from "@/components/ui/page-illustration";

interface SolarAdvantageProps {
  onSubmit: (pincode: string, propertyType: string, electricityBill: string) => void;
  // Add initial values if you want to pre-fill the form when going back
  initialPincode?: string;
  initialPropertyType?: string;
  initialElectricityBill?: string;
}

export default function SolarAdvantage({
  onSubmit,
  initialPincode = "",
  initialPropertyType = "",
  initialElectricityBill = "",
}: SolarAdvantageProps) {
  const [pincode, setPincode] = useState(initialPincode);
  const [propertyType, setPropertyType] = useState(initialPropertyType);
  const [electricityBill, setElectricityBill] = useState(initialElectricityBill);

  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("Property type changed to:", e.target.value); // Debugging
    setPropertyType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pincode, propertyType, electricityBill);
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
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
                required
              />
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
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] ${
                  propertyType === "" ? "text-gray-400" : "text-black"
                }`}
                required
              >
                <option value="" hidden>
                  Residential
                </option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option> {/* Corrected value */}
                <option value="industrial">Industrial</option> {/* Corrected value */}
              </select>
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
                onChange={(e) => setElectricityBill(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
                required
              />
            </div>

            {/* Calculate Button */}
            <button type="submit" className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218]">Calculate Solar Advantage</button>

          </form>
        </div>
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
  );
}