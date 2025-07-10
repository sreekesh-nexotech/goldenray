import React from "react";
import Button from "../ui/Button";
import { BasicInfoFormData } from "@/types/types";
import Image from "next/image";
import homeIcon from "../../../public/homeIcon.svg";
import onGridIcon from "../../../public/OnGrid.svg";
import hybridIcon from "../../../public/hybrid.svg";
import monthlyIcon from "../../../public/monthly.svg";
import bimonthlyIcon from "../../../public/bimonthly.svg";

interface BasicInformationStepProps {
  formData: BasicInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<BasicInfoFormData>>;
  onNext: () => void;
  error:string | null;
}

export default function BasicInformationStep({
  formData,
  setFormData,
  onNext,
  error,
}: BasicInformationStepProps) {

  // Handles changes for standard input fields (like text and number)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles selection for the clickable card components
  const handleCardSelect = (
    name: keyof BasicInfoFormData,
    value: "Existing Home" | "New Home" | "On Grid" | "Hybrid" | "Monthly" | "Bi-monthly"
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Set Bi-monthly as default if bill_frequency is not set
  React.useEffect(() => {
    if (formData.home_type === "Existing Home" && !formData.bill_frequency) {
      setFormData((prev) => ({ ...prev, bill_frequency: "Bi-monthly" }));
    }
  }, [formData.home_type, formData.bill_frequency, setFormData]);

  return (
    <div className="space-y-8 md:p-6">
      {/* Form heading */}
      
      {/* --- Home Type Selection --- */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
          Where are you in your solar journey?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div
            className={` border p-6 flex flex-col gap-2 items-center rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.home_type === "Existing Home"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("home_type", "Existing Home")}
          >
            <Image src={homeIcon} alt="Home Icon" />
            <h3 className="font-bold text-[#123532]">Existing Home</h3>
            <p className="text-gray-600 text-sm">
              I already have a home and want to add solar power to it.
            </p>
          </div>
          <div
            className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.home_type === "New Home"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("home_type", "New Home")}
          >
            <Image src={homeIcon} alt="Home Icon" />
            <h3 className="font-bold text-[#123532]">New Home</h3>
            <p className="text-gray-600 text-sm">
              I`m planning or building a new home with solar power.
            </p>
          </div>
        </div>
      </div>

      {/* --- Grid Type Selection --- */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
          What type of grid system are you considering?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div
            className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.grid_type === "On Grid"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("grid_type", "On Grid")}
          >
            <Image src={onGridIcon} alt="OnGrid Icon" />
            <h3 className=" text-[#123532] mb-2 font-bold">On Grid</h3>
            <p className="text-gray-600 text-sm">
              Connected to the utility grid. No backup during power outages.
            </p>
          </div>
          <div
            className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
              formData.grid_type === "Hybrid"
                ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => handleCardSelect("grid_type", "Hybrid")}
          >
            <Image src={hybridIcon} alt="Hybrid Icon" />
            <h3 className="font-bold text-[#123532] mb-2">Hybrid</h3>
            <p className="text-gray-600 text-sm">
              Includes battery backup for power outages. More reliable.
            </p>
          </div>
        </div>
      </div>

      {/* --- Conditional Fields for EXISTING HOME --- */}
      {formData.home_type === "Existing Home" && (
        <>
          {/* Average Electricity Bill Input */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
              What`s your average electricity bill?
            </h2>
            <div className="relative">
              <input
                type="number"
                name="average_bill"
                placeholder="Enter Amount"
                value={formData.average_bill}
                onChange={handleChange}
                className="w-full p-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl">
                ₹
              </span>
            </div>
          </div>
          {/* Bill Frequency Selection */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
              How often do you pay your electricity bill?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div
                className="flex flex-col gap-2 items-center border p-6 rounded-2xl opacity-50 cursor-not-allowed transition-all duration-200 ease-in-out bg-gray-100 border-gray-300"
              >
                <Image src={monthlyIcon} alt="Monthly Icon" />
                <h3 className="font-bold text-gray-500 mb-2">Monthly</h3>
                <p className="text-gray-500 text-sm">
                  You get your electricity bill once every month.
                </p>
              </div>
              <div
                className={`flex flex-col gap-2 items-center border p-6 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${
                  formData.bill_frequency === "Bi-monthly"
                    ? "border-[#F7BA41] bg-[#FFFBEB] shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleCardSelect("bill_frequency", "Bi-monthly")}
              >
                <Image src={bimonthlyIcon} alt="Bi Monthly Icon" />
                <h3 className="font-bold text-[#123532] mb-2">Bi-monthly</h3>
                <p className="text-gray-600 text-sm">
                  You get billed once every two months.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Conditional Fields for NEW HOME --- */}
      {formData.home_type === "New Home" && (
        <>
          {/* Input for Home Size */}
          <div className="space-y-4">
            <label htmlFor="home_size" className="text-xl md:text-2xl font-semibold text-[#123532] block">
              What size is your new home?
            </label>
            <input
              type="number"
              id="home_size"
              name="home_size"
              placeholder="Enter size in sq. ft."
              value={formData.home_size || ""}
              onChange={handleChange}
              className="w-full p-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            />
          </div>

          {/* Input for Estimated Base Load */}
          <div className="space-y-4">
            <label htmlFor="estimated_base_load" className="text-xl md:text-2xl font-semibold text-[#123532] block">
              Want to add an estimated base load?
            </label>
            <div className="relative">
              <input
                type="number"
                id="estimated_base_load"
                name="estimated_base_load"
                placeholder="Enter Estimated Base Load (kWh)"
                value={formData.estimated_base_load || ""}
                onChange={handleChange}
                className="w-full p-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                kWh
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Suggested base load for 3 BHK: 300 units(1units = 1KWh)
            </p>
          </div>
        </>
      )}

      {/* --- Navigation Button --- */}
      <div className={`flex ${error ? 'justify-between':'justify-end'} items-center mt-8`}>
         {error && (
            <div className=" text-red-700  relative " role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}