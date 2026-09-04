"use client";

// import React, { useState } from "react";
import SubsidyHero from "./SubsidyHero";
import SubsidyDeadline from "./SubsidyDeadline";
import SubsidyAmountTable from "./SubsidyAmountTable";
// import SubsidyCalculator from "./SubsidyCalculator";
// import SubsidyResults from "./SubsidyResults";
import SubsidySteps from "./SubsidySteps";
import SubsidyEligibility from "./SubsidyEligibility";
import Activate from "../GroupPurchase/Activate";
import SubsidyMistakes from "./SubsidyMistakes";
import KeralaSubsidyInfo from "./KeralaSubsidyInfo";
import SubsidyResources from "./SubsidyResources";
import Faq from "./SubsidyFaq";


export default function SubsidyMain() {
  // const [showResults, setShowResults] = useState(false);
  // const [calculatorData, setCalculatorData] = useState({
  //   electricityBill: "",
  //   propertyType: "",
  // });
  // const [isLoading, setIsLoading] = useState(false);

  // const handleCalculate = (electricityBill: string, propertyType: string) => {
  //   setIsLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setCalculatorData({ electricityBill, propertyType });
  //     setShowResults(true);
  //     setIsLoading(false);
  //   }, 500);
  // };

  return (
    <section className="font-switzer">
      <SubsidyHero />
      <SubsidyDeadline />
      <SubsidyAmountTable />

      <SubsidyEligibility />
      {/* {showResults ? (
        <SubsidyResults
          electricityBill={calculatorData.electricityBill}
          propertyType={calculatorData.propertyType}
        />
      ) : (
        <SubsidyCalculator
          onCalculate={handleCalculate}
          isLoading={isLoading}
        />
      )} */}
      <SubsidySteps />

      <SubsidyMistakes/>
      <KeralaSubsidyInfo />
      <SubsidyResources />
      <Faq/>
      <Activate/>
    </section>
  );
}
