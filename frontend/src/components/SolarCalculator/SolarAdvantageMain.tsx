/* golden-ray/frontend/src/components/SolarCalculator/SolarAdvantageMain.tsx */
"use client";
import { useRef, useState } from "react";
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
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculateSubmit = async (
    pincode: string,
    property_type: string,
    monthly_bill: number
  ) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    setFormInputs({ pincode, property_type, monthly_bill });

    try {
      const payload: SolarBasicPayload = {
        pincode,
        property_type,
        monthly_bill,
      };
      const data = await getSolarAdvantageData(payload);
      if (!data) {
        throw new Error("No data returned from the API.");
      }
      setCalculatorData(data);
      setShowResults(true);
    } catch (err) {
      let errorMessage = "Something went wrong, please try again later.";
      if (err instanceof Error) {
        if (err.message.includes("Pincode not found in database")) {
          errorMessage = "Based on your pincode, our service is not currently available in your area.";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network error: Could not connect to the server. Please check your internet connection.";
        } else {
          errorMessage = err.message; // Capture more specific API errors
        }
      }
      console.error("API Error:", err);
      setError(errorMessage);
      setShowResults(false); // Stay on the form if there's an error
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
    setError(null); // Clear errors for resubmission
    setFormInputs({ pincode, property_type, monthly_bill });

    try {
      const payload: SolarBasicPayload = {
        pincode,
        property_type,
        monthly_bill,
      };
      const data = await getSolarAdvantageData(payload);
      if (!data) {
        throw new Error("No data returned from the API.");
      }
      setCalculatorData(data);
      setError(null); // Clear any previous error on successful resubmission
    } catch (err) {
      let errorMessage = "Failed to resubmit solar advantage data. Please try again.";
      if (err instanceof Error) {
        if (err.message.includes("Pincode not found in database")) {
          errorMessage = "Based on your pincode, our service is not currently available in your area.";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network error: Could not connect to the server. Please check your internet connection.";
        } else {
          errorMessage = err.message; // Capture more specific API errors
        }
      }
      console.error("API Error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBackToForm = () => {
    setShowResults(false);
    setError(null); // Clear errors when going back
  };

  return (
    <section className="relative" ref={resultsRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-xl font-semibold text-[#123532]">
            Calculating your solar advantage...
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
          apiError={error} 
        />
      ) : (
        <SolarAdvantage
          onSubmit={handleCalculateSubmit}
          initialPincode={formInputs.pincode}
          initialproperty_type={formInputs.property_type}
          initialmonthly_bill={formInputs.monthly_bill}
          isLoading={isLoading}
          fetchError={error}
        />
      )}
    </section>
  );
}