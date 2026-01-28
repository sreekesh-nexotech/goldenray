"use client";

import React, { useState } from "react";
import SubsidyHero from "./SubsidyHero";
import SubsidyCalculator from "./SubsidyCalculator";
import SubsidyResults from "./SubsidyResults";
import SubsidySteps from "./subsidy-steps";
import WhyFlarize from "./Why-flarize";
import FlarizeReview from "./Flarize-review";
import Booking2 from "./Booking2";
import SubsidyFaq from "./SubsidyFaq";

export default function SubsidyMain() {
  const [showResults, setShowResults] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    electricityBill: "",
    propertyType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (electricityBill: string, propertyType: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCalculatorData({ electricityBill, propertyType });
      setShowResults(true);
      setIsLoading(false);
    }, 500);
  };

  const handleRecalculate = () => {
    setShowResults(false);
  };

  return (
    <section className="font-switzer">
      <SubsidyHero />
      {showResults ? (
        <SubsidyResults
          electricityBill={calculatorData.electricityBill}
          propertyType={calculatorData.propertyType}
          onRecalculate={handleRecalculate}
        />
      ) : (
        <SubsidyCalculator
          onCalculate={handleCalculate}
          isLoading={isLoading}
        />
      )}
      <SubsidySteps />
      <WhyFlarize />
      <FlarizeReview />

      <Booking2 />

      <SubsidyFaq />
    </section>
  );
}
