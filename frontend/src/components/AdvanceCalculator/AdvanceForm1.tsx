/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceForm1.tsx */
import React from "react";
import Button from "../ui/Button";
import { BasicInfoFormData } from "@/types/calculator";
import Image from "next/image";
import homeIcon from "../../../public/homeIcon.svg"
import onGridIcon from "../../../public/OnGrid.svg"
import hybridIcon from "../../../public/hybrid.svg"
import monthlyIcon from "../../../public/monthly.svg"
import bimonthlyIcon from "../../../public/bimonthly.svg"



interface BasicInformationStepProps {
  formData: BasicInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<BasicInfoFormData>>;
  onNext: () => void;
}

export default function BasicInformationStep({
  formData,
  setFormData,
  onNext,
}: BasicInformationStepProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardSelect = (name: keyof BasicInfoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8  md:p-6">
      {" "}
      {/* Added padding */}
      {/* Home Type Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
          Where are you in your solar journey?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div
            className={` border p-6 flex flex-col gap-2 items-center rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.homeType === "Existing Home"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("homeType", "Existing Home")}
          >
            <Image src={homeIcon} alt="Home Icon"/>
            <h3 className="font-bold text-[#123532]">Existing Home</h3>
            <p className="text-gray-600 text-sm">
              I already have a home and want to add solar power to it.
            </p>
          </div>
          <div
            className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.homeType === "New Home"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("homeType", "New Home")}
          >
            <Image src={homeIcon} alt="Home Icon"/>
            <h3 className="font-bold text-[#123532]">New Home</h3>
            <p className="text-gray-600 text-sm">
              Im planning or building a new home with solar power.
            </p>
          </div>
        </div>
      </div>
      {/* Grid Type Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
          What type of grid system are you considering?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div
            className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.gridType === "On Grid"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("gridType", "On Grid")}
          >
            <Image src={onGridIcon} alt="OnGrid Icon"/>
            <h3 className=" text-[#123532] mb-2 font-bold">On Grid</h3>
            <p className="text-gray-600 text-sm">
              Connected to the utility grid. No backup during power outages.
            </p>
          </div>
          <div
            className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.gridType === "Hybrid"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("gridType", "Hybrid")}
          >
            <Image src={hybridIcon} alt="Hybrid Icon"/>
            <h3 className="font-bold text-[#123532] mb-2">Hybrid</h3>
            <p className="text-gray-600 text-sm">
              Includes battery backup for power outages. More reliable
            </p>
          </div>
        </div>
      </div>
      
      {formData.homeType === "Existing Home" && (
        <>
          {/* Average Electricity Bill Input */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
              Whats your average electricity bill?
            </h2>
            <div className="relative">
              <input
                type="number"
                name="averageBill"
                placeholder="Enter Amount"
                value={formData.averageBill}
                onChange={handleChange}
                className="w-full p-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500  text-2xl">
                ₹
              </span>
            </div>
          </div>
          {/* Bill Frequency Selection */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
              How often do you pay your electricity bill?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div
                className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
                  formData.billFrequency === "Monthly"
                    ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleCardSelect("billFrequency", "Monthly")}
              >
              <Image src={monthlyIcon} alt="Monthly Icon"/>
                <h3 className="font-bold text-[#123532] mb-2">Monthly</h3>
                <p className="text-gray-600 text-sm">
                  You get your electricity bill once every month.
                </p>
              </div>
              <div
                className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
                  formData.billFrequency === "Bi-monthly"
                    ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleCardSelect("billFrequency", "Bi-monthly")}
              >
                <Image src={bimonthlyIcon} alt="Bi Monthly Icon"/>
                <h3 className="font-bold text-[#123532] mb-2">Bi-monthly</h3>
                <p className="text-gray-600 text-sm">
                  You get billed once every two months.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Home Size and Estimated Base Load are now handled in AdvanceForm3 for "New Home" */}
      {formData.homeType === "New Home" && (
        <>
           {/* Input for Home Size */}
      <div>
        <label
          htmlFor="homeSize"
          className="block text-gray-700 text-base font-medium mb-2"
        >
          What size is your new home?
        </label>
        <input
          type="number"
          id="homeSize"
          name="homeSize"
          placeholder="Enter Size (sq. ft.)"
          value={formData.homeSize || ""}
          onChange={handleChange}
          className="w-full p-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
        />
        <p className="text-sm text-gray-500 mt-1">
          Provide the approximate area of your home in square feet.
        </p>
      </div>

      {/* Input for Estimated Base Load */}
      <div>
        <label
          htmlFor="estimatedBaseLoad"
          className="block text-gray-700 text-base font-medium mb-2"
        >
          Estimated monthly base load
        </label>
        <div className="relative">
          <input
            type="number"
            id="estimatedBaseLoad"
            name="estimatedBaseLoad"
            placeholder="Enter Estimated Base Load (kWh)"
            value={formData.estimatedBaseLoad || ""}
            onChange={handleChange}
            className="w-full p-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            kWh
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Estimate your monthly electricity consumption for essential appliances.
        </p>
      </div>
        </>
      )}
      <div className="flex justify-end mt-8">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}