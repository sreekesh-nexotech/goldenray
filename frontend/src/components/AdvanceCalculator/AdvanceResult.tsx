/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceResult.tsx */
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import Button from "../ui/Button";
import { BasicCalculatorData } from "@/types/calculator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ResultDisplayProps {
  data: BasicCalculatorData;
  onStartOver: () => void;
  onGetDetailedQuote: () => void;
  gridType:string | null;
  backupHours:number;
}

export default function ResultDisplay({
  data,
  onStartOver,
  onGetDetailedQuote,
  gridType,
  backupHours,
}: ResultDisplayProps) {
    // Create chartData with tension for curved lines
  const chartData = {
    ...data.graphData,
    datasets: data.graphData.datasets.map(dataset => ({
      ...dataset,
      tension: 0.4, // Set tension for smooth curves
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important for controlling chart size
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
          display: false, // Hides Y-axis tick labels, consider if you want to show them for data interpretation
        },
      },
    },
  };

  return (
    <div className="space-y-8 my-6">
      {" "}
      {/* Added padding for better spacing */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch mt-10">
        {" "}
        {/* Adjusted gap and items-stretch */}
        {/* Box 1: Power, Area, Installation */}
        <div className="flex flex-col gap-2">
          {" "}
          {/* Adjusted gap */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
            {" "}
            {/* Added flex-1 and shadow-lg, rounded-xl */}
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
         {/* Box 2 - only on hybrid:  */}
        {gridType === "Hybrid" && (<div className="flex flex-col gap-2  ">
          {" "}
          {/* Adjusted gap */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col justify-between">
            {" "}
            {/* Added flex-1 and shadow-lg, rounded-xl */}
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
          
        </div>)}
        {/* Box 3: Costs & EMI */}
        <div className="flex flex-col gap-4">
          {" "}
          {/* Adjusted gap */}
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
                {data.financialDetails.monthlyEBReduction}
              </p>
            </div>
          </div>
        </div>
       
        {/* Box 4: graph1 */}
        <div className="flex flex-col gap-4">
          {" "}
          {/* Adjusted gap */}
          <div className="bg-white shadow-lg p-6 rounded-xl flex-1 flex flex-col justify-between">
            
          </div>
          
        </div>
        
        {/* Box 5: Lifetime Savings & Graph */}
        <div className={`bg-white shadow-lg rounded-xl text-left p-6 flex flex-col col-span-0 
         ${gridType==="Hybrid" ? "md:col-span-2" : "md:col-span-3" }
        `}>
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.financialDetails.lifetimeSavings}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Lifetime Savings
          </p>
          <div className="relative h-64 w-full flex-grow">
            {" "}
            {/* Increased height for better graph visibility */}
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
        
          
          <Button onClick={onGetDetailedQuote}>Get Detailed Quote</Button>
        
      </div>
    </div>
  );
}