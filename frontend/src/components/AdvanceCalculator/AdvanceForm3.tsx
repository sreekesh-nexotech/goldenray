/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceForm3.tsx */
import React from "react";
import { BasicInfoFormData } from "./AdvanceCalculatorMain";
import Button from "../ui/Button";

interface NewHomeDetailsStepProps {
  formData: BasicInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<BasicInfoFormData>>;
  onNext: () => void;
}

export default function NewHomeDetailsStep({
  formData,
  setFormData,
  onNext,
}: NewHomeDetailsStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      {" "}
      {/* Added padding */}
      <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-6">
        Tell us more about your new home
      </h2>

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
          className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
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
            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            kWh
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Estimate your monthly electricity consumption for essential appliances.
        </p>
      </div>

      <div className="flex justify-end mt-8">
                <Button onClick={onNext}>Next</Button>
        
      </div>
    </div>
  );
}