"use client";

import { useState, useMemo} from "react";
import { getSolarAdvancedData } from "@/services/CalculatorService";
import { AdvancedCalculatorData, BasicInfoFormData, UsageDetailsFormData, ChartGraphData } from "@/types/calculator";
import BasicInformationStep from "./AdvanceForm1";
import UsageDetailsStep from "./AdvanceForm2";
import NewHomeDetailsStep from "./AdvanceForm3";
import ResultDisplay from "./AdvanceResult";
import StepIndicator from "./StepIndicator";
import FormHeading from "./FormHeading";
import QuotePopup from "@/components/Solar-calculator/QuotePopup"; // Import the new popup component

export default function AdvancedCalculatorMain() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<AdvancedCalculatorData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup

  
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData>({
    homeType: null,
    gridType: null,
    averageBill: "",
    billFrequency: null,
    homeSize: "",
    estimatedBaseLoad: "",
    backupHours: 9,
    electronicDevices: [],
  });

  const [usageDetails, setUsageDetails] = useState<UsageDetailsFormData>({
    electronicDevices: [],
    electricVehicles: [],
  });

  const totalFormSteps = useMemo(() => {
    return basicInfo.gridType === "Hybrid" ? 3 : 2;
  }, [basicInfo.gridType]);

  // --- Step Navigation and Validation ---

  const handleBasicInfoSubmit = () => {
    setError(null);
    if (!basicInfo.homeType || !basicInfo.gridType) {
      setError("Please select a home type and grid type.");
      return;
    }
    if (basicInfo.homeType === "Existing Home") {
      if (!basicInfo.averageBill || !basicInfo.billFrequency) {
        setError("Please provide your average electricity bill and bill frequency.");
        return;
      }
      if (parseFloat(basicInfo.averageBill) <= 0) {
        setError("Please enter a valid positive number for your average bill.");
        return;
      }
    }
    if (basicInfo.homeType === "New Home") {
      if (!basicInfo.homeSize || parseFloat(basicInfo.homeSize) <= 0) {
        setError("Please enter a valid Home Size (e.g., a positive number in sq. ft.).");
        return;
      }
      if (basicInfo.estimatedBaseLoad === "" || parseFloat(basicInfo.estimatedBaseLoad) < 0) {
        setError("Please enter a valid Estimated Base Load (e.g., a non-negative number in kWh).");
        return;
      }
    }
    setCurrentStep(2);
  };

  const handleUsageDetailsSubmit = () => {
    if (usageDetails.electronicDevices.length === 0) {
      setError("Please add at least one electronic device in the 'Your Usage' section.");
      return;
    }

    if (basicInfo.gridType === "Hybrid") {
      setCurrentStep(3);
    } else {
      handleCalculate();
    }
  };

  const handleCalculate = async () => {
    if (basicInfo.gridType === "Hybrid" && basicInfo.electronicDevices.length === 0) {
      setError("Please add at least one electronic device in the 'Home Details' section.");
      return;
    }

    const finalPayload = {
      Specifications: {
        homeType: basicInfo.homeType,
        gridType: basicInfo.gridType,
        averageBill: basicInfo.averageBill,
        billFrequency: basicInfo.billFrequency,
        homeSize: basicInfo.homeSize,
        estimatedBaseLoad: basicInfo.estimatedBaseLoad,
      },
      usageDetails: {
        usageElectronicDevices: usageDetails.electronicDevices,
        electricVehicles: usageDetails.electricVehicles,
      },
      preferenceDetails: {
        backupHours: basicInfo.backupHours,
        preferenceElectronicDevices: basicInfo.electronicDevices,
      },
    };

    console.log(JSON.stringify(finalPayload, null, 2))

    setLoading(true);

    try {
      const apiData = await getSolarAdvancedData(finalPayload);
      if (apiData.graphData.datasets.length !== 2) {
        throw new Error("Expected exactly two datasets in graphData");
      }
      const transformedGraphData: ChartGraphData = {
        labels: apiData.graphData.labels,
        datasets: [
          {
            label: "Solar Bill",
            data: apiData.graphData.datasets[0].data,
            borderColor: "#FBC207",
            backgroundColor: "#FBC207",
            fill: false,
          },
          {
            label: "EB Bill",
            data: apiData.graphData.datasets[1].data,
            borderColor: "#5958CB",
            backgroundColor: "#5958CB",
            fill: false,
          },
        ],
      };
      const transformedData: AdvancedCalculatorData = {
        ...apiData,
        graphData: transformedGraphData,
      };
      setResultData(transformedData);
      setCurrentStep(totalFormSteps + 1);
    } catch (err: unknown) {
      setError(
        "Failed to calculate solar advantage. Please check your inputs and try again. " +
        (err instanceof Error ? err.message : "An unknown error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setBasicInfo({
      homeType: null,
      gridType: null,
      averageBill: "",
      billFrequency: null,
      homeSize: "",
      estimatedBaseLoad: "",
      backupHours: 9,
      electronicDevices: [],
    });
    setUsageDetails({
      electronicDevices: [],
      electricVehicles: [],
    });
    setResultData(null);
    setError(null);
    setIsPopupOpen(false); // Close popup on start over
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
          title="Here's your ideal on-grid solar system recommendation"
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
              />
              <StepIndicator
                actualStepNumber={2}
                title="Your Usage"
                currentStep={currentStep}
                totalFormSteps={totalFormSteps}
              />
              {basicInfo.gridType === "Hybrid" && (
                <StepIndicator
                  actualStepNumber={3}
                  title="Your Preference"
                  currentStep={currentStep}
                  totalFormSteps={totalFormSteps}
                />
              )}
            </div>
          </div>
        )}

        <div
          className={`w-full ${
            currentStep <= totalFormSteps ? "md:w-3/4 p-6 rounded-2xl border border-[#DBD8D8]" : ""
          } bg-white transition-all duration-300`}
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {currentStep === 1 && (
            <BasicInformationStep
              formData={basicInfo}
              setFormData={setBasicInfo}
              onNext={handleBasicInfoSubmit}
            />
          )}

          {currentStep === 2 && (
            <UsageDetailsStep
              formData={usageDetails}
              setFormData={setUsageDetails}
              onCalculate={handleUsageDetailsSubmit}
              loading={loading}
              gridType={basicInfo.gridType}
            />
          )}

          {currentStep === 3 && basicInfo.gridType === "Hybrid" && (
            <NewHomeDetailsStep
              formData={basicInfo}
              setFormData={setBasicInfo}
              onNext={handleCalculate}
            />
          )}

          {currentStep === totalFormSteps + 1 && resultData && (
            <ResultDisplay
              data={resultData}
              onStartOver={handleStartOver}
              onGetDetailedQuote={() => setIsPopupOpen(true)}
              gridType={basicInfo.gridType}
              backupHours={basicInfo.backupHours}
            />
          )}
        </div>
      </div>
      {isPopupOpen && <QuotePopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}