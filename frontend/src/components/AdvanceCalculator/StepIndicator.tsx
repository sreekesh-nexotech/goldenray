import React from "react";

interface StepIndicatorProps {
  actualStepNumber: number;
  title: string;
  currentStep: number;
  totalFormSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  actualStepNumber,
  title,
  currentStep,
  totalFormSteps,
}) => {
  const isActive = currentStep >= actualStepNumber; // True if currentStep is at or past this step
  const isCurrentStep = currentStep === actualStepNumber;
  const isCompleted = currentStep > actualStepNumber;

  // Calculate progress percentage for the current step
  const progress =
    actualStepNumber === 1 && currentStep === 1
      ? 50 // Half-filled for Step 1 initially
      : actualStepNumber === currentStep
      ? 50 // Half-filled for the current step
      : isCompleted
      ? 100 // Fully filled for completed steps
      : 0; // No fill for future steps

  // CHANGE: Make showTitle always true, as we want to display all titles
  const showTitle = true; // Always show the title

  return (
    <div className="flex flex-col items-center md:items-start w-full md:flex-col relative">
      {/* Step Number and Title */}
      <div className="flex flex-row items-center w-full max-w-full mb-0 md:mb-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
            isActive ? "bg-[#235C58]" : "bg-gray-300" // Circle color logic remains the same
          }`}
        >
          {actualStepNumber}
        </div>

        {showTitle && ( // showTitle is now always true
          <span
            className={`ml-2 text-sm sm:text-base font-semibold break-words ${
              isActive // CHANGE: Use isActive here for text color
                ? "text-[#123532]" // Active color (dark green)
                : "text-gray-500" // Inactive color (gray)
            } md:ml-3 md:text-lg`}
          >
            {title}
          </span>
        )}
      </div>

      {/* Mobile horizontal progress bar (below step number and title, hidden on md and up) */}
      <div className="w-full mt-2 md:hidden">
        {(actualStepNumber === 1 || isCurrentStep) && (
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

      {/* Vertical line for desktop (visible on md and up) */}
      {actualStepNumber < totalFormSteps && (
        <div
          className={`w-px h-10 ml-4 hidden md:block ${
            isCompleted ? "bg-[#235C58]" : "bg-gray-300" // Line color based on completion
          }`}
        ></div>
      )}
    </div>
  );
};

export default StepIndicator;