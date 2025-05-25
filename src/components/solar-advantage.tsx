"use client";
import { ChangeEvent, useState } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import ButtonYellow from "@/components/ui/Button-yellow";

export default function SolarAdvantage() {
  const [propertyType, setPropertyType] = useState("");

  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  return (
    <div className="relative bg-white py-12 mt-12 scroll-mt-30" id="solar-advantage">
      {/* Grid Background Layer */}
      <PageIllustration />

      <div className="relative max-w-7xl mx-auto text-center px-4 md:px-0">
        {/* Heading */}
        <h1 className="text-4xl md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15">
          Calculate Your Solar Advantage
        </h1>

        {/* Form Container */}
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-3xl p-10 py-12 max-w-sm mx-auto">
          <form className="flex flex-col">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${
                  propertyType === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" hidden>
                  Residential
                </option>
                <option value="residential">Residential</option>
                <option value="residential1">Commercial</option>
                <option value="residential2">Industrial</option>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Calculate Button */}
            <ButtonYellow content="Calculate Solar Advantage" ButtonLink="/"/>
            
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