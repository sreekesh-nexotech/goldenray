"use client";

import React, { useState } from "react";
import SubsidyHero from "./SubsidyHero";
import SubsidyCalculator from "./SubsidyCalculator";
import SubsidyResults from "./SubsidyResults";
import SubsidySteps from "./subsidy-steps";
import WhyFlarize from "./Why-flarize";
import Booking2 from "./Booking2";
import SubsidyFaq from "./SubsidyFaq";
import HomeTestimonial from "../Home/Testimomial";

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

  return (
    <section className="font-switzer">
      <SubsidyHero />
      {showResults ? (
        <SubsidyResults
          electricityBill={calculatorData.electricityBill}
          propertyType={calculatorData.propertyType}
        />
      ) : (
        <SubsidyCalculator
          onCalculate={handleCalculate}
          isLoading={isLoading}
        />
      )}
      <SubsidySteps />
      <WhyFlarize />
      <HomeTestimonial />

      <Booking2 />

      <SubsidyFaq />
    </section>
  );
}
