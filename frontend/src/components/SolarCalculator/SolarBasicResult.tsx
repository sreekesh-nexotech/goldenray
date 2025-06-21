"use client";
import { useState, ChangeEvent, useEffect } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import Button from "../ui/Button";
import BasicResult from "./basic-result";
import { BasicCalculatorData } from "@/types/calculator";
import QuotePopup from "./QuotePopup";

interface SolarBasicResultProps {
  initialPincode: string;
  initialPropertyType: string;
  initialElectricityBill: string;
  calculatedData: BasicCalculatorData;
  onResubmit: (pincode: string, propertyType: string, electricityBill: string) => void;
  onGoBack: () => void;
}

export default function SolarBasicResult({
  initialPincode,
  initialPropertyType,
  initialElectricityBill,
  calculatedData,
  onResubmit,
  onGoBack,
}: SolarBasicResultProps) {
  const [pincode, setPincode] = useState(initialPincode);
  const [propertyType, setPropertyType] = useState(initialPropertyType || "residential");
  const [electricityBill, setElectricityBill] = useState(initialElectricityBill);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup
  
  //prevent scrolling the body when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "auto";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, 0);
    };
  }, [isPopupOpen]);


  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("Property type changed to:", e.target.value);
    setPropertyType(e.target.value);
  };

  const handleResubmit = () => {
    console.log("Resubmitting:", { pincode, propertyType, electricityBill });
    onResubmit(pincode, propertyType, electricityBill);
  };

  return (
    <div className="relative py-12 mt-12 scroll-mt-30" id="solar-advantage">
      <PageIllustration />
      <div className="relative px-4 sm:px-6 lg:px-8 xl:px-36 ">
        {/* Heading */}
        <h1 className="text-4xl text-center md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15">
          Calculate Your Solar Advantage
        </h1>
        <div className=" flex flex-col lg:flex-row justify-between gap-5 text-center lg:items-end  mb-10">
          {/* pincode */}
          <div>
            <label htmlFor="pincode-result" className="block text-left text-sm font-medium text-gray-700 mb-1">
              Your Property Pincode
            </label>
            <input
              type="text"
              id="pincode-result"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="bg-white shadow-md w-full px-4 py-2  rounded-lg  focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            />
          </div>
          {/* property type */}
          <div className="block text-left">
            <label htmlFor="property-type-result" className="text-left text-sm font-medium text-gray-700 mb-1">
              Your Property Type
            </label>
            <select
              id="property-type-result"
              value={propertyType}
              onChange={handlePropertyTypeChange}
              className={`w-full px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] shadow-md bg-white ${
                propertyType === "" ? "text-gray-400" : "text-black"
              }`}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
          {/* avg monthly bill */}
          <div>
            <label htmlFor="electricity-bill-result" className="block text-left text-sm font-medium text-gray-700 mb-1">
              Your Avg Monthly Current Bill
            </label>
            <input
              type="text"
              id="electricity-bill-result"
              value={electricityBill}
              onChange={(e) => setElectricityBill(e.target.value)}
              className="bg-white shadow-md  w-full px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            />
          </div>
          {/* form resubmission button */}
              <button
            onClick={handleResubmit}
            className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] px-8 py-3 rounded-lg"
          >
            Resubmit Changes
          </button>
          {/* advance calculator link */}
          <a href="/advancedCalculator" target="new" className="text-[#007E85] hover:underline text-sm px-8 py-3  md:text-base md:ml-4">
            Advanced Calculator
          </a>
        </div>
        <BasicResult data={calculatedData} />
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          {/* Get detailed quote link */}
          <Button
            onClick={() => setIsPopupOpen(true)}
          >Get Detailed Quote</Button>
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