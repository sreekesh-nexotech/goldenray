// components/mockData.ts
export type BackendData = {
  powerRequirement: string;
  areaRequirement: string;
  installationTime: string;
  lifetimeSavings: string;
  overallCost: string;
  govSubsidy: string;
  finalCost: string;
  monthlyEBReduction: string;
  startingEMI: string;
  graphData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
}

export const mockBackendData: BackendData = {
  powerRequirement: "4 kW",
  areaRequirement: "320 sqft",
  installationTime: "4 days",
  lifetimeSavings: "₹7,50,000",
  overallCost: "₹2,72,000",
  govSubsidy: "₹78,000",
  finalCost: "₹1,94,000",
  monthlyEBReduction: "Reduce monthly EB from ₹6,000 to just ₹1,416",
  startingEMI: "Starting from ₹2,000/mo EMI",
  graphData: {
    labels: ["Year 0", "", "", "", "", "Year 5"],
    datasets: [
      {
        label: "Solar power",
        data: [0, 100000, 200000, 100000, 600000, 70000],
        borderColor: "#F7BA41",
        backgroundColor: "#F7BA41",
        fill: false,
      },
      {
        label: "Current source",
        data: [0, 150000, 300000, 450000, 600000, 750000],
        borderColor: "#5B6BD7",
        backgroundColor: "#5B6BD7",
        fill: false,
      },
    ],
  },
};