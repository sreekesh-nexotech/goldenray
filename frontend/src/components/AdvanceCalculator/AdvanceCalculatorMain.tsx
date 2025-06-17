// app/AdvancedCalculatorMain.tsx
"use client";

import { useState, useMemo } from "react";
import { getSolarAdvancedData } from "@/services/CalculatorService";
import { BackendData } from "@/data/mock-calculator";
import BasicInformationStep from "./AdvanceForm1";
import UsageDetailsStep from "./AdvanceForm2";
import NewHomeDetailsStep from "./AdvanceForm3";
import ResultDisplay from "./AdvanceResult";
import StepIndicator from "./StepIndicator";

// Interfaces for form data (assuming these are in a shared types file or defined here)
export interface BasicInfoFormData {
  homeType: "Existing Home" | "New Home" | null;
  gridType: "On Grid" | "Hybrid" | null;
  averageBill: string;
  billFrequency: "Monthly" | "Bi-monthly" | null;
  homeSize?: string;
  estimatedBaseLoad?: string;
}

export interface ElectronicDevice {
  id: string;
  deviceType: string;
  noOfUnits: string;
  wattage: string;
  dailyUsage: string;
}

export interface ElectricVehicle {
  id: string;
  deviceType: string;
  noOfUnits: string;
  wattage: string;
  dailyUsage: string;
}

export interface UsageDetailsFormData {
  electronicDevices: ElectronicDevice[];
  electricVehicles: ElectricVehicle[];
}

export default function AdvancedCalculatorMain() {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData>({
    homeType: null,
    gridType: null,
    averageBill: "",
    billFrequency: null,
    homeSize: "",
    estimatedBaseLoad: "",
  });
  const [usageDetails, setUsageDetails] = useState<UsageDetailsFormData>({
    electronicDevices: [],
    electricVehicles: [],
  });
  const [resultData, setResultData] = useState<BackendData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Determine total form steps dynamically based on homeType
  const totalFormSteps = useMemo(() => {
    return basicInfo.homeType === "New Home" ? 3 : 2;
  }, [basicInfo.homeType]);

  const handleBasicInfoSubmit = () => {
    setError(null);

    if (!basicInfo.homeType || !basicInfo.gridType) {
      setError("Please select a home type and grid type.");
      return;
    }

    if (basicInfo.homeType === "Existing Home") {
      if (
        !basicInfo.averageBill ||
        basicInfo.averageBill.trim() === "" ||
        !basicInfo.billFrequency
      ) {
        setError(
          "Please provide your average electricity bill and bill frequency for your existing home."
        );
        return;
      }
      if (
        isNaN(parseFloat(basicInfo.averageBill)) ||
        parseFloat(basicInfo.averageBill) <= 0
      ) {
        setError(
          "Please enter a valid positive number for your average electricity bill."
        );
        return;
      }
    }

    setCurrentStep(2);
  };

  const handleUsageDetailsSubmit = () => {
    setError(null);

    if (
      usageDetails.electronicDevices.length === 0 &&
      usageDetails.electricVehicles.length === 0
    ) {
      setError("Please add at least one electronic device or electric vehicle to proceed.");
      return;
    }

    const isElectronicDeviceDataValid = usageDetails.electronicDevices.every(
      (device) =>
        device.deviceType.trim() !== "" &&
        !isNaN(parseFloat(device.noOfUnits)) &&
        parseFloat(device.noOfUnits) > 0 &&
        !isNaN(parseFloat(device.wattage)) &&
        parseFloat(device.wattage) > 0 &&
        !isNaN(parseFloat(device.dailyUsage)) &&
        parseFloat(device.dailyUsage) > 0
    );

    const isElectricVehicleDataValid = usageDetails.electricVehicles.every(
      (vehicle) =>
        vehicle.deviceType.trim() !== "" &&
        !isNaN(parseFloat(vehicle.noOfUnits)) &&
        parseFloat(vehicle.noOfUnits) > 0 &&
        !isNaN(parseFloat(vehicle.wattage)) &&
        parseFloat(vehicle.wattage) > 0 &&
        !isNaN(parseFloat(vehicle.dailyUsage)) &&
        parseFloat(vehicle.dailyUsage) > 0
    );

    if (!isElectronicDeviceDataValid || !isElectricVehicleDataValid) {
      setError(
        "Please ensure all added device fields (type, units, wattage, daily usage) are filled correctly with positive numbers."
      );
      return;
    }

    if (basicInfo.homeType === "New Home") {
      setCurrentStep(3);
    } else {
      handleCalculate();
    }
  };

  const handleNewHomeDetailsSubmit = () => {
    setError(null);

    if (
      !basicInfo.homeSize ||
      basicInfo.homeSize.trim() === "" ||
      !basicInfo.estimatedBaseLoad ||
      basicInfo.estimatedBaseLoad.trim() === ""
    ) {
      setError("Please provide your new home's size and an estimated base load.");
      return;
    }
    if (isNaN(parseFloat(basicInfo.homeSize)) || parseFloat(basicInfo.homeSize) <= 0) {
      setError("Please enter a valid Home Size (e.g., a positive number in sq. ft.).");
      return;
    }
    if (
      isNaN(parseFloat(basicInfo.estimatedBaseLoad)) ||
      parseFloat(basicInfo.estimatedBaseLoad) < 0
    ) {
      setError(
        "Please enter a valid Estimated Base Load (e.g., a non-negative number in kWh)."
      );
      return;
    }

    handleCalculate();
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      let consumptionValueForBackend: string;
      if (basicInfo.homeType === "Existing Home") {
        consumptionValueForBackend = basicInfo.averageBill || "";
      } else {
        consumptionValueForBackend = basicInfo.estimatedBaseLoad || "";
      }

      const data = await getSolarAdvancedData(
        basicInfo.homeType || "",
        consumptionValueForBackend
      );
      setResultData(data);
      setCurrentStep(totalFormSteps + 1);
    } catch (err: unknown) {
      console.error("Calculation error:", err);
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
    });
    setUsageDetails({
      electronicDevices: [],
      electricVehicles: [],
    });
    setResultData(null);
    setError(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mx-auto relative px-4 sm:px-6 lg:px-8 xl:px-36">
      {currentStep <= totalFormSteps && (
        <div className="w-full md:w-1/4 flex flex-col items-start">
          <StepIndicator
            actualStepNumber={1}
            title="Basic Information"
            currentStep={currentStep}
            totalFormSteps={totalFormSteps}
            homeType={basicInfo.homeType}
          />
          <StepIndicator
            actualStepNumber={2}
            title="Your Usage"
            currentStep={currentStep}
            totalFormSteps={totalFormSteps}
            homeType={basicInfo.homeType}
          />
          {basicInfo.homeType === "New Home" && (
            <StepIndicator
              actualStepNumber={3}
              title="Home Details"
              currentStep={currentStep}
              totalFormSteps={totalFormSteps}
              homeType={basicInfo.homeType}
            />
          )}
        </div>
      )}
      <div
        className={`w-full ${
          currentStep <= totalFormSteps ? "md:w-3/4 p-6 rounded-lg shadow-md" : ""
        } bg-white `}
      >
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
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
            homeType={basicInfo.homeType}
          />
        )}
        {currentStep === 3 && basicInfo.homeType === "New Home" && (
          <NewHomeDetailsStep
            formData={basicInfo}
            setFormData={setBasicInfo}
            onNext={handleNewHomeDetailsSubmit}
          />
        )}
        {currentStep === totalFormSteps + 1 && resultData && (
          <ResultDisplay
            data={resultData}
            onStartOver={handleStartOver}
            onGetDetailedQuote={() => alert("Get Detailed Quote clicked!")}
          />
        )}
      </div>
    </div>
  );
}