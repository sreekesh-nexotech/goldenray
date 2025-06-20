// components/mockData.ts
import { BasicCalculatorData } from "@/types/calculator";

export const mockBasicCalculatorData: BasicCalculatorData = {
  specifications: {
    powerRequirement: "4 kW",
    areaRequirement: "320 sqft",
    installationTime: "4 days",
  },
  financialDetails: {
    lifetimeSavings: "₹7,50,000",
    overallCost: "₹2,72,000",
    governmentSubsidy: "₹78,000",
    finalCost: "₹1,94,000",
    startingEMI: "Starting from ₹2,000/mo EMI",
    monthlyEBReduction: "Reduce monthly EB from ₹6,000 to just ₹1,416",
  },
  backupDetails:{
    batteryRequirement:"8 KWh",
    autonomyRate:"70-80%"
  },
  graphData: {
    labels: ["Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], // Improved labels for clarity
    datasets: [
      {
        label: "Solar Power",
        data: [0, 100000, 200000, 100000, 600000, 70000],
        borderColor: "#F7BA41",
        backgroundColor: "#F7BA41",
        fill: false,
      },
      {
        label: "Current Source",
        data: [0, 150000, 300000, 450000, 600000, 750000],
        borderColor: "#5B6BD7",
        backgroundColor: "#5B6BD7",
        fill: false,
      },
    ],
  },
};