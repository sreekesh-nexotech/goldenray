// components/StepIndicator.tsx
import React from "react";

interface StepIndicatorProps {
  actualStepNumber: number;
  title: string;
  currentStep: number;
  totalFormSteps: number;
  homeType: "Existing Home" | "New Home" | null;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  actualStepNumber,
  title,
  currentStep,
  totalFormSteps,
  homeType,
}) => {
  let displayStepNumber = actualStepNumber;

  if (homeType === "New Home") {
    if (actualStepNumber === 2) displayStepNumber = 2;
    if (actualStepNumber === 3) displayStepNumber = 3;
    if (actualStepNumber === totalFormSteps + 1) displayStepNumber = 4; // Result step for New Home
  } else {
    if (actualStepNumber === 2) displayStepNumber = 2;
    if (actualStepNumber === totalFormSteps + 1) displayStepNumber = 3; // Result step for Existing Home
  }

  const isActive = currentStep >= actualStepNumber;

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center mb-2 md:mb-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
            isActive ? "bg-[#235C58]" : "bg-gray-300"
          }`}
        >
          {displayStepNumber}
        </div>
        <span
          className={`ml-3 text-lg ${
            isActive ? "text-[#123532]" : "text-gray-500"
          }`}
        >
          {title}
        </span>
      </div>
      {actualStepNumber < totalFormSteps && (
        <div className="w-px h-10 bg-gray-300 ml-4"></div>
      )}
    </div>
  );
};

export default StepIndicator;