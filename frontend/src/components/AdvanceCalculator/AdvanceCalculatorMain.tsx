"use client";

import { useState, useMemo, useRef, useEffect} from "react";
import { getSolarAdvancedData } from "@/services/CalculatorService";
import { AdvancedCalculatorData, BasicInfoFormData, UsageDetailsFormData, Chartgraph_data, SolarAdvancedPayload } from "@/types/types";
import BasicInformationStep from "./AdvanceForm1";
import UsageDetailsStep from "./AdvanceForm2";
import NewHomeDetailsStep from "./AdvanceForm3";
import ResultDisplay from "./AdvanceResult";
import StepIndicator from "./StepIndicator";
import FormHeading from "./FormHeading";
import QuotePopup from "@/components/SolarCalculator/QuotePopup"; // Import the new popup component

export default function AdvancedCalculatorMain() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<AdvancedCalculatorData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup

  // Create a ref for the form container
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData>({
    home_type: null,
    grid_type: null,
    average_bill: "",
    bill_frequency: null,
    home_size: "",
    estimated_base_load: "",
    backup_hours: 0,
    actual_backup_time:"",
    electronic_devices: [],
  });

  const [usageDetails, setUsageDetails] = useState<UsageDetailsFormData>({
    electronic_devices: [],
    electric_vehicles: [],
  });

  const totalFormSteps = useMemo(() => {
    return basicInfo.grid_type === "Hybrid" ? 3 : 2;
  }, [basicInfo.grid_type]);

  // Scroll to top of form container when currentStep changes
  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);

  // --- Step Navigation and Validation ---

  const handleBasicInfoSubmit = () => {
    setError(null);
    if (!basicInfo.home_type || !basicInfo.grid_type) {
      setError("Please select a home type and grid type.");
      return;
    }
    if (basicInfo.home_type === "Existing Home") {
      if (!basicInfo.average_bill || !basicInfo.bill_frequency) {
        setError("Please provide your average electricity bill and bill frequency.");
        return;
      }
      if (parseFloat(basicInfo.average_bill) <= 0) {
        setError("Please enter a valid positive number for your average bill.");
        return;
      }
    }
    if (basicInfo.home_type === "New Home") {
      if (!basicInfo.home_size || parseFloat(basicInfo.home_size) <= 0) {
        setError("Please enter a valid Home Size (e.g., a positive number in sq. ft.).");
        return;
      }
      if (basicInfo.estimated_base_load === "" || parseFloat(basicInfo.estimated_base_load) < 0) {
        setError("Please enter a valid Estimated Base Load (e.g., a non-negative number in kWh).");
        return;
      }
    }
    if (basicInfo.average_bill && basicInfo.home_type == "Existing Home") {
      const billAmount = parseFloat(basicInfo.average_bill.replace(/[^0-9.]/g, '')); // Remove non-numeric characters
      if (isNaN(billAmount)) {
        setError("Please enter a valid number for the average bill");
        return;
      } else if (billAmount > 40000) {
        setError("Maximum average bill should be less than 40,000");
        return;
      }
    }
    setCurrentStep(2);
  };

  const handleUsageDetailsSubmit = () => {
    

    if (basicInfo.grid_type === "Hybrid") {
      setCurrentStep(3);
    } else {
      handleCalculate();
    }
  };

  const handleCalculate = async () => {
    // if (basicInfo.grid_type === "Hybrid" && basicInfo.electronic_devices.length === 0) {
    //   setError("Please add at least one electronic device in the 'Home Details' section.");
    //   return;
    // }


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

    console.log(JSON.stringify(finalPayload, null, 2))

    setLoading(true);

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
      setResultData(transformedData);
      setCurrentStep(totalFormSteps + 1);
    } catch (err: unknown) {
      setError(
        "Failed to calculate solar advantage. Please check your inputs and try again. " +
        (err instanceof Error ? err.message : "An unknown error occurred.")
      );
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setBasicInfo({
      home_type: null,
      grid_type: null,
      average_bill: "",
      bill_frequency: null,
      home_size: "",
      estimated_base_load: "",
      backup_hours: 0,
      actual_backup_time:"",
      electronic_devices: [],
    });
    setUsageDetails({
      electronic_devices: [],
      electric_vehicles: [],
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
              {basicInfo.grid_type === "Hybrid" && (
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
          ref={formContainerRef}
          className={`w-full scroll-mt-28 ${
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
              grid_type={basicInfo.grid_type}
            />
          )}

          {currentStep === 3 && basicInfo.grid_type === "Hybrid" && (
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
              grid_type={basicInfo.grid_type}
            />
          )}
        </div>
      </div>
      {isPopupOpen && <QuotePopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}