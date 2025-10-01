/* golden-ray/frontend/src/components/AdvanceCalculator/StepIndicator.tsx */
import React from "react";

interface StepIndicatorProps {
  actualStepNumber: number;
  title: string;
  currentStep: number;
  totalFormSteps: number;
  // --- NEW ---: Add a callback prop for handling clicks
  onStepClick: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  actualStepNumber,
  title,
  currentStep,
  totalFormSteps,
  onStepClick, // --- NEW ---
}) => {
  const isActive = currentStep >= actualStepNumber;
  const isCurrentStep = currentStep === actualStepNumber;
  const isCompleted = currentStep > actualStepNumber;

  // --- NEW ---: A step is clickable only if it has been completed.
  const isClickable = isCompleted;

  const progress =
    actualStepNumber === 1 && currentStep === 1
      ? 50
      : actualStepNumber === currentStep
      ? 50
      : isCompleted
      ? 100
      : 0;

  const showTitle = true;

  const handleStepClick = () => {
    if (isClickable) {
      onStepClick(actualStepNumber);
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start w-full md:flex-col relative">
      {/* --- MODIFIED ---: Wrapped the step number and title in a button for interactivity */}
      <button
        onClick={handleStepClick}
        disabled={!isClickable}
        className={`flex flex-row items-center w-full max-w-full mb-0 md:mb-4 text-left ${
          isClickable ? "cursor-pointer" : "cursor-default"
        }`}
        aria-label={`Go to step ${actualStepNumber}: ${title}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 transition-colors ${
            isActive ? "bg-[#235C58]" : "bg-gray-300"
          }`}
        >
          {actualStepNumber}
        </div>

        {showTitle && (
          <span
            className={`ml-2 text-sm sm:text-base font-semibold break-words transition-colors ${
              isActive ? "text-[#123532]" : "text-gray-500"
            } md:ml-3 md:text-lg`}
          >
            {title}
          </span>
        )}
      </button>

      {/* Mobile horizontal progress bar (no changes needed) */}
      <div className="w-full mt-2 md:hidden">
        {(actualStepNumber === 1 || isCurrentStep || isCompleted) && (
          <div className="flex items-center w-full">
            <div className="h-1 flex-1 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#235C58] rounded-full"
                style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Vertical line for desktop (no changes needed) */}
      {actualStepNumber < totalFormSteps && (
        <div
          className={`w-px h-10 ml-4 hidden md:block ${
            isCompleted ? "bg-[#235C58]" : "bg-gray-300"
          }`}
        ></div>
      )}
    </div>
  );
};

export default StepIndicator;