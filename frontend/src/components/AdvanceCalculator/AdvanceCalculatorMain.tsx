"use client";

import { useReducer, useState, useMemo, useRef, useEffect } from "react";
import { getSolarAdvancedData } from "@/services/CalculatorService";
import {
  AdvancedCalculatorData,
  BasicInfoFormData,
  UsageDetailsFormData,
  Chartgraph_data,
  SolarAdvancedPayload,
} from "@/types/types";
import BasicInformationStep from "./AdvanceForm1";
import UsageDetailsStep from "./AdvanceForm2";
import NewHomeDetailsStep from "./AdvanceForm3";
import ResultDisplay from "./AdvanceResult";
import StepIndicator from "./StepIndicator";
import FormHeading from "./FormHeading";
import QuotePopup from "@/components/SolarCalculator/QuotePopup";

interface FlowState {
  currentStep: number;
  error: string | null;
  loading: boolean;
  resultData: AdvancedCalculatorData | null;
  isPopupOpen: boolean;
}

type FlowAction =
  | { type: "GO_TO_STEP"; step: number }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "START_CALCULATING" }
  | { type: "CALCULATION_SUCCESS"; data: AdvancedCalculatorData; step: number }
  | { type: "CALCULATION_FAILURE"; message: string }
  | { type: "OPEN_POPUP" }
  | { type: "CLOSE_POPUP" }
  | { type: "RESET" };

const INITIAL_FLOW_STATE: FlowState = {
  currentStep: 1,
  error: null,
  loading: false,
  resultData: null,
  isPopupOpen: false,
};

const INITIAL_BASIC_INFO: BasicInfoFormData = {
  home_type: null,
  grid_type: null,
  average_bill: "",
  bill_frequency: null,
  home_size: "",
  estimated_base_load: "",
  backup_hours: 0,
  actual_backup_time: "",
  electronic_devices: [],
};

const INITIAL_USAGE_DETAILS: UsageDetailsFormData = {
  electronic_devices: [],
  electric_vehicles: [],
};

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, currentStep: action.step, error: null };
    case "VALIDATION_ERROR":
      return { ...state, error: action.message };
    case "START_CALCULATING":
      return { ...state, loading: true, error: null };
    case "CALCULATION_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        resultData: action.data,
        currentStep: action.step,
      };
    case "CALCULATION_FAILURE":
      return { ...state, loading: false, error: action.message };
    case "OPEN_POPUP":
      return { ...state, isPopupOpen: true };
    case "CLOSE_POPUP":
      return { ...state, isPopupOpen: false };
    case "RESET":
      return INITIAL_FLOW_STATE;
    default:
      return state;
  }
}

export default function AdvancedCalculatorMain() {
  const [flow, dispatch] = useReducer(flowReducer, INITIAL_FLOW_STATE);
  const { currentStep, error, loading, resultData, isPopupOpen } = flow;

  const formContainerRef = useRef<HTMLDivElement>(null);

  const [basicInfo, setBasicInfo] =
    useState<BasicInfoFormData>(INITIAL_BASIC_INFO);
  const [usageDetails, setUsageDetails] = useState<UsageDetailsFormData>(
    INITIAL_USAGE_DETAILS
  );

  const totalFormSteps = useMemo(() => {
    return basicInfo.grid_type === "Hybrid" ? 3 : 2;
  }, [basicInfo.grid_type]);

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);

  // --- Step Navigation and Validation ---

  // --- ADD THIS FUNCTION ---
  // This function handles clicks on the StepIndicator components
  const handleStepNavigation = (step: number) => {
    // Only allow navigation to previous, completed steps
    if (step < currentStep) {
      dispatch({ type: "GO_TO_STEP", step });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch({ type: "GO_TO_STEP", step: currentStep - 1 });
    }
  };

  const fail = (message: string) =>
    dispatch({ type: "VALIDATION_ERROR", message });

  const handleBasicInfoSubmit = () => {
    if (!basicInfo.home_type || !basicInfo.grid_type) {
      fail("Please select a home type and grid type.");
      return;
    }
    if (basicInfo.home_type === "Existing Home") {
      if (!basicInfo.average_bill || !basicInfo.bill_frequency) {
        fail("Please provide your average electricity bill and bill frequency.");
        return;
      }
      if (parseFloat(basicInfo.average_bill) <= 0) {
        fail("Please enter a valid positive number for your average bill.");
        return;
      }
    }
    if (basicInfo.home_type === "New Home") {
      if (!basicInfo.home_size || parseFloat(basicInfo.home_size) <= 0) {
        fail(
          "Please enter a valid Home Size (e.g., a positive number in sq. ft.)."
        );
        return;
      }
    }
    if (basicInfo.average_bill && basicInfo.home_type == "Existing Home") {
      const billAmount = parseFloat(
        basicInfo.average_bill.replace(/[^0-9.]/g, "")
      );
      if (isNaN(billAmount)) {
        fail("Please enter a valid number for the average bill");
        return;
      } else if (billAmount > 40000) {
        fail("Maximum average bill should be less than 40,000");
        return;
      }
    }
    dispatch({ type: "GO_TO_STEP", step: 2 });
  };

  const handleUsageDetailsSubmit = () => {
    if (basicInfo.grid_type === "Hybrid") {
      dispatch({ type: "GO_TO_STEP", step: 3 });
    } else {
      handleCalculate();
    }
  };

  const handleCalculate = async () => {
    const finalPayload: SolarAdvancedPayload = {
      Specifications: {
        home_type: basicInfo.home_type,
        grid_type: basicInfo.grid_type,
        average_bill: basicInfo.average_bill,
        bill_frequency: basicInfo.bill_frequency,
        home_size: basicInfo.home_size,
        estimated_base_load: basicInfo.estimated_base_load,
      },
      usageDetails: {
        usage_electronic_devices: usageDetails.electronic_devices,
        electric_vehicles: usageDetails.electric_vehicles,
      },
      preferenceDetails: {
        backup_hours: basicInfo.backup_hours,
        preference_electronic_devices: basicInfo.electronic_devices,
      },
    };

    dispatch({ type: "START_CALCULATING" });

    try {
      const apiData = await getSolarAdvancedData(finalPayload);
      if (apiData.graph_data.datasets.length !== 2) {
        throw new Error("Expected exactly two datasets in graph_data");
      }
      const transformedgraph_data: Chartgraph_data = {
        labels: apiData.graph_data.labels,
        datasets: [
          {
            label: "Solar Bill",
            data: apiData.graph_data.datasets[0].data,
            borderColor: "#FBC207",
            backgroundColor: "#FBC207",
            fill: false,
          },
          {
            label: "EB Bill",
            data: apiData.graph_data.datasets[1].data,
            borderColor: "#5958CB",
            backgroundColor: "#5958CB",
            fill: false,
          },
        ],
      };
      const transformedData: AdvancedCalculatorData = {
        ...apiData,
        graph_data: transformedgraph_data,
      };
      dispatch({
        type: "CALCULATION_SUCCESS",
        data: transformedData,
        step: totalFormSteps + 1,
      });
    } catch (err: unknown) {
      dispatch({
        type: "CALCULATION_FAILURE",
        message:
          "Failed to calculate solar advantage. Please check your inputs and try again. " +
          (err instanceof Error ? err.message : "An unknown error occurred."),
      });
    }
  };

  const handleStartOver = () => {
    dispatch({ type: "RESET" });
    setBasicInfo(INITIAL_BASIC_INFO);
    setUsageDetails(INITIAL_USAGE_DETAILS);
  };

  return (
    <div>
      {currentStep <= totalFormSteps && (
        <FormHeading
          title="Let’s find your ideal solar setup"
          description="A complete guide to calculating the right solar panel system size for your property and determining how many panels you need."
        />
      )}

      {currentStep === totalFormSteps + 1 && resultData && (
        <FormHeading
          title={`Here's your ideal ${basicInfo.grid_type?.toLowerCase()} solar system recommendation`}
          description="Based on your inputs, we've calculated the perfect solar solution for your needs"
        />
      )}

      <div className="flex flex-col md:flex-row gap-8 mx-auto relative px-4 sm:px-6 lg:px-8 xl:px-36 mb-12">
        {currentStep <= totalFormSteps && (
          <div className="w-full md:w-1/4 flex flex-col items-start">
            <div className="w-full rounded-2xl lg:border border-[#DBD8D8] py-6 lg:py-9 px-4 lg:px-10 flex flex-row items-center justify-around gap-2 md:flex-col md:items-start md:gap-0">
              <StepIndicator
                actualStepNumber={1}
                title="Basic Info"
                currentStep={currentStep}
                totalFormSteps={totalFormSteps}
                // --- MODIFIED ---: Pass the handler to enable clicking
                onStepClick={handleStepNavigation}
              />
              <StepIndicator
                actualStepNumber={2}
                title="Your Usage"
                currentStep={currentStep}
                totalFormSteps={totalFormSteps}
                // --- MODIFIED ---: Pass the handler to enable clicking
                onStepClick={handleStepNavigation}
              />
              {basicInfo.grid_type === "Hybrid" && (
                <StepIndicator
                  actualStepNumber={3}
                  title="Your Preference"
                  currentStep={currentStep}
                  totalFormSteps={totalFormSteps}
                  // --- MODIFIED ---: Pass the handler to enable clicking
                  onStepClick={handleStepNavigation}
                />
              )}
            </div>
          </div>
        )}

        <div
          ref={formContainerRef}
          className={`w-full scroll-mt-28 ${
            currentStep <= totalFormSteps
              ? "md:w-3/4 p-6 rounded-2xl border border-[#DBD8D8]"
              : ""
          } bg-white transition-all duration-300`}
        >
          {currentStep === 1 && (
            <BasicInformationStep
              formData={basicInfo}
              setFormData={setBasicInfo}
              onNext={handleBasicInfoSubmit}
              error={error}
            />
          )}

          {currentStep === 2 && (
            <UsageDetailsStep
              formData={usageDetails}
              setFormData={setUsageDetails}
              onCalculate={handleUsageDetailsSubmit}
              onBack={handleBack}
              loading={loading}
              grid_type={basicInfo.grid_type}
            />
          )}

          {currentStep === 3 && basicInfo.grid_type === "Hybrid" && (
            <NewHomeDetailsStep
              formData={basicInfo}
              setFormData={setBasicInfo}
              onNext={handleCalculate}
              onBack={handleBack}
            />
          )}

          {currentStep === totalFormSteps + 1 && resultData && (
            <ResultDisplay
              data={resultData}
              onStartOver={handleStartOver}
              onGetDetailedQuote={() => dispatch({ type: "OPEN_POPUP" })}
              onBack={handleBack}
              grid_type={basicInfo.grid_type}
            />
          )}
        </div>
      </div>
      {isPopupOpen && (
        <QuotePopup onClose={() => dispatch({ type: "CLOSE_POPUP" })} />
      )}
    </div>
  );
}
