"use client";
import { useState } from "react";
import SolarBasicResult from "./SolarBasicResult";
import SolarAdvantage from "./solar-advantage";
import {getSolarAdvantageData} from "@/services/CalculatorService"
import { BasicCalculatorData } from "@/types/calculator";

export default function SolarAdvantageMain() {
  const [showResults, setShowResults] = useState(false);
  const [calculatorData, setCalculatorData] = useState<BasicCalculatorData | null>(null);
  const [formInputs, setFormInputs] = useState({
    pincode: "",
    propertyType: "",
    electricityBill: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleCalculateSubmit = async (
    pincode: string,
    propertyType: string,
    electricityBill: string
  ) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    setFormInputs({ pincode, propertyType, electricityBill });
    try {
      const data = await getSolarAdvantageData({pincode, propertyType, electricityBill});
      setCalculatorData(data);
      setShowResults(true); // Show the results component
    } catch (err) {
      setError(err as string); // Set the error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmitChanges = async (
    pincode: string,
    propertyType: string,
    electricityBill: string
  ) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    setFormInputs({ pincode, propertyType, electricityBill });
    try {
      const data = await getSolarAdvantageData({pincode, propertyType, electricityBill});
      setCalculatorData(data); // Update only the data, stay on the results page
    } catch (err) {
      setError(err as string); // Set the error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBackToForm = () => {
    setShowResults(false); // Go back to the input form
    setError(null); // Clear errors when going back
  };

  return (
    <section className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-xl font-semibold text-[#123532]">
            Calculating your solar advantage...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-90 z-10">
          <div className="text-xl font-semibold text-red-700 p-6 rounded-lg shadow-lg">
            Error: {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showResults && calculatorData ? (
        <SolarBasicResult
          initialPincode={formInputs.pincode}
          initialPropertyType={formInputs.propertyType}
          initialElectricityBill={formInputs.electricityBill}
          calculatedData={calculatorData}
          onResubmit={handleResubmitChanges}
          onGoBack={handleGoBackToForm}
        />
      ) : (
        <SolarAdvantage
          onSubmit={handleCalculateSubmit}
          initialPincode={formInputs.pincode}
          initialPropertyType={formInputs.propertyType}
          initialElectricityBill={formInputs.electricityBill}
          isLoading={isLoading} // Pass loading state to disable form
        />
      )}
    </section>
  );
}