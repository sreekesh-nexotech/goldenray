"use client";
import { useState } from "react";
import SolarBasicResult from "./SolarBasicResult";
import SolarAdvantage from "./solar-advantage";
import { BasicCalculatorData, SolarBasicPayload } from "@/types/types";
import { getSolarAdvantageData } from "@/services/CalculatorService";

export default function SolarAdvantageMain() {
  const [showResults, setShowResults] = useState(false);
  const [calculatorData, setCalculatorData] = useState<BasicCalculatorData | null>(null);
  const [formInputs, setFormInputs] = useState({
    pincode: "",
    property_type: "",
    monthly_bill: "" as number | "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculateSubmit = async (
    pincode: string,
    property_type: string,
    monthly_bill: number
  ) => {
    setIsLoading(true);
    setError(null);
    setFormInputs({ pincode, property_type, monthly_bill });

    try {
      const payload: SolarBasicPayload = {
        pincode,
        property_type,
        monthly_bill,
      };
      console.log("Sending payload to API:", payload);
      const data = await getSolarAdvantageData(payload);
      if (!data) {
        throw new Error("No data returned from the API.");
      }
      setCalculatorData(data);
      setShowResults(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch solar advantage data. Please try again.";
      console.error("API Error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmitChanges = async (
    pincode: string,
    property_type: string,
    monthly_bill: number
  ) => {
    setIsLoading(true);
    setError(null);
    setFormInputs({ pincode, property_type, monthly_bill });

    try {
      const payload: SolarBasicPayload = {
        pincode,
        property_type,
        monthly_bill,
      };
      console.log("Resubmitting payload to API:", payload);
      const data = await getSolarAdvantageData(payload);
      if (!data) {
        throw new Error("No data returned from the API.");
      }
      setCalculatorData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resubmit solar advantage data. Please try again.";
      console.error("API Error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBackToForm = () => {
    setShowResults(false);
    setError(null);
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
            {error}
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
          initialproperty_type={formInputs.property_type}
          initialmonthly_bill={formInputs.monthly_bill}
          calculatedData={calculatorData}
          onResubmit={handleResubmitChanges}
          onGoBack={handleGoBackToForm}
        />
      ) : (
        <SolarAdvantage
          onSubmit={handleCalculateSubmit}
          initialPincode={formInputs.pincode}
          initialproperty_type={formInputs.property_type}
          initialmonthly_bill={formInputs.monthly_bill}
          isLoading={isLoading}
        />
      )}
    </section>
  );
}