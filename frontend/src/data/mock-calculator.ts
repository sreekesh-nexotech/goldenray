import { BasicCalculatorData, AdvancedCalculatorData } from "@/types/calculator";

// Mock data for Basic Calculator
export const mockBasicCalculatorData: BasicCalculatorData = {
  specifications: {
    powerRequirement: "5 kW",
    areaRequirement: "500 sq.ft",
    installationTime: "3-5 days",
  },
  financialDetails: {
    lifetimeSavings: "₹15,00,000",
    overallCost: "₹3,50,000",
    governmentSubsidy: "₹80,000",
    finalCost: "₹2,70,000",
    monthlyEBReduction: "Reduce monthly EB from ₹6,000 to just ₹1,416",
    startingEMI: "₹5,000",
  },
  backupDetails: {
    batteryRequirement: "N/A",
    autonomyRate: "",
  },
    graphData: {
    labels: ["Year 1", "Year 5", "Year 10", "Year 15", "Year 20"],
    datasets: [
      {
        data: [50000, 60000, 75000, 90000, 110000],
      },
      {
        data: [15000, 18000, 22500, 27000, 33000],
      },
    ],
  },
};

// Mock data for Advanced Calculator
export const mockAdvancedCalculatorData: AdvancedCalculatorData = {
  specifications: {
    powerRequirement: "7 kW",
    areaRequirement: "700 sq.ft",
    installationTime: "5-7 days",
  },
  financialDetails: {
    lifetimeSavings: "₹20,00,000",
    overallCost: "₹5,00,000",
    governmentSubsidy: "₹1,00,000",
    finalCost: "₹4,00,000",
    startingEMI: "₹7,500",
  },
  backupDetails: {
    batteryRequirement: "10 kWh",
    autonomyRate: "85%",
  },
  graphData: {
    labels: ["Year 1", "Year 5", "Year 10", "Year 15", "Year 20", "Year 25"],
    datasets: [
      {
        data: [60000, 72000, 90000, 108000, 132000, 160000],
      },
      {
        data: [60000, 14400, 18000, 21600, 26400, 32000],
      },
    ],
  },
  lifetimeBillComparison: {
    withoutSolarAmount: 2250000, // ₹22,50,000
    withSolarAmountPayable: 600000, // ₹6,00,000
    withSolarAmountSaved: 1650000, // ₹16,50,000
  },
};