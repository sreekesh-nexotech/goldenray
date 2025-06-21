import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import Button from "../ui/Button";
import { AdvancedCalculatorData } from "@/types/calculator";
import { useEffect, useState } from "react";
import QuotePopup from "@/components/SolarCalculator/QuotePopup"; // Import the new popup component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResultDisplayProps {
  data: AdvancedCalculatorData;
  onStartOver: () => void;
  onGetDetailedQuote: () => void;
  gridType: string | null;
  backupHours: number;
}

export default function ResultDisplay({
  data,
  onStartOver,
  gridType,
  backupHours,
}: ResultDisplayProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //prevent scrolling the body when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "auto";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, 0);
    };
  }, [isPopupOpen]);

  // Create chartData with tension for curved lines (for the Line chart)
  const chartData = {
    ...data.graphData,
    datasets: data.graphData.datasets.map((dataset) => ({
      ...dataset,
      tension: 0.4, // Set tension for smooth curves
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Bill amount",
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  // Data and Options for the Lifetime Bill Comparison Bar Chart
  const lifetimeBillChartData = {
    labels: ["Without Solar", "With Solar"],
    datasets: [
      {
        label: "Amount Paid",
        data: [
          data.lifetimeBillComparison.withoutSolarAmount,
          data.lifetimeBillComparison.withSolarAmountPayable,
        ],
        backgroundColor: "#FBE8DA",
        borderColor: "#FBE8DA",
        borderWidth: 1,
      },
      {
        label: "Amount Saved",
        data: [0, data.lifetimeBillComparison.withSolarAmountSaved],
        backgroundColor: "#C3E0BD",
        borderColor: "#C3E0BD",
        borderWidth: 1,
      },
    ],
  };

  const lifetimeBillChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Lifetime Bill Comparison",
        font: {
          size: 18,
          weight: "bold" as const,
          family: "Arial, sans-serif",
        },
        color: "#333",
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: false,
        },
        ticks: {
          callback: function (value: string | number) {
            const val = typeof value === "string" ? parseFloat(value) : value;
            if (val >= 100000) {
              return (val / 100000).toFixed(0) + "L";
            }
            return value;
          },
          font: {
            size: 14,
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className="space-y-8 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch mt-10">
        {/* Box 1: Power, Area, Installation */}
        <div className="flex flex-col gap-2">
          <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
                {data.specifications.powerRequirement}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Power Requirement
              </p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
                {data.specifications.areaRequirement}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Area Requirement
              </p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
                {data.specifications.installationTime}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Installation Time
              </p>
            </div>
          </div>
        </div>
        {/* Box 2 - only on hybrid: */}
        {gridType === "Hybrid" && (
          <div className="flex flex-col gap-2">
            <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
                  {data.backupDetails.batteryRequirement}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Battery Requirement
                </p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
                  ~{backupHours}hrs
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Battery Duration
                </p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
                  {data.backupDetails.autonomyRate}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Autonomy Rate
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Box 3: Costs & EMI */}
        <div className="flex flex-col gap-4">
          <div className="bg-white shadow-lg p-6 rounded-xl flex-1 flex flex-col justify-evenly">
            <div>
              <p className="text-gray-600 text-sm md:text-base mb-2">
                Your overall setup cost
              </p>
              <h2 className="text-2xl lg:text-[32px] font-semibold text-[#123532] mb-4">
                {data.financialDetails.overallCost}
              </h2>
            </div>
            <div>
              <p className="text-gray-600 text-sm md:text-base mb-2">
                Govt. Subsidy
              </p>
              <h2 className="text-2xl lg:text-[32px] font-semibold text-[#123532] flex items-center">
                {data.financialDetails.governmentSubsidy}
              </h2>
            </div>
            <div>
              <p className="text-gray-600 text-sm md:text-base mb-2">
                Your Final Cost
              </p>
              <h2 className="text-3xl lg:text-5xl font-semibold text-[#123532] mb-2">
                {data.financialDetails.finalCost}
              </h2>
              <p className="text-[#124944] text-sm md:text-base mt-4 text-center bg-[#E8FEFF] border border-[#BCE8E4] rounded-full py-2 px-1">
                Starting from <b>{data.financialDetails.startingEMI}/mo</b> EMI
              </p>
            </div>
          </div>
        </div>
        {/* Box 4: graph1 (Lifetime Bill Comparison) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white shadow-lg p-6 rounded-xl flex-1 flex flex-col justify-between">
            <div className="relative h-64 w-full flex-grow">
              <Bar data={lifetimeBillChartData} options={lifetimeBillChartOptions} />
            </div>
          </div>
        </div>
        {/* Box 5: Lifetime Savings & Graph (Line Chart) */}
        <div
          className={`bg-white shadow-lg rounded-xl text-left p-6 flex flex-col col-span-0 
          ${gridType === "Hybrid" ? "md:col-span-2" : "md:col-span-3"}`}
        >
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.financialDetails.lifetimeSavings}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Lifetime Savings
          </p>
          <div className="relative h-64 w-full flex-grow">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <button
          onClick={onStartOver}
          className="btn cursor-pointer px-8 py-3 border-2 border-[#074A4D] bg-transparent text-black font-semibold rounded-lg hover:bg-[#074A4D] hover:text-white transition-colors duration-200"
        >
          Start Over
        </button>
        <Button
          onClick={() => setIsPopupOpen(true)}
        >Get Detailed Quote</Button>
      </div>
      {isPopupOpen && <QuotePopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}