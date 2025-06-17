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
import { BackendData } from "@/data/mock-calculator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BasicResultProps {
  data: BackendData;
}

export default function BasicResult({ data }: BasicResultProps) {
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
        title: {
          display: true,
          text: "Time", // Set x-axis label
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Bill Amount", // Set y-axis label
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-start xl:gap-8 mt-10">
      {/* Box 1: Power, Area, Installation */}
      <div className="flex flex-col gap-2">
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-t-3xl p-6">
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.powerRequirement}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Power Requirement</p>
        </div>
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6">
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.areaRequirement}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Area Requirement</p>
        </div>
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-b-3xl p-6">
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.installationTime}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Installation Time</p>
        </div>
      </div>

      {/* Box 2: Lifetime Savings & Graph */}
      <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-3xl text-left p-6 flex flex-col">
        <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
          {data.lifetimeSavings}
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">Lifetime Savings</p>
        <div className="relative h-48 w-full flex-grow">
          <Line data={chartData} options={chartOptions} />
        </div>
        <p className="text-[#124944] text-sm md:text-base mt-4 text-center bg-[#E8FEFF] border border-[#BCE8E4] rounded-full py-2 px-1">
          {data.monthlyEBReduction}
        </p>
      </div>

      {/* Box 3: Costs & EMI */}
      <div className="rounded-3xl flex flex-col gap-2">
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 rounded-t-3xl">
          <p className="text-gray-600 text-sm md:text-base mb-2">Your overall setup cost</p>
          <h2 className="text-2xl lg:text-[32px] font-semibold text-[#123532] mb-4">
            {data.overallCost}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-2">Govt. Subsidy</p>
          <h2 className="text-2xl lg:text-[32px] font-semibold text-[#123532] flex items-center">
            {data.govSubsidy}
          </h2>
        </div>
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 rounded-b-3xl">
          <div>
            <p className="text-gray-600 text-sm md:text-base mb-2">Your Final Cost</p>
            <h2 className="text-3xl lg:text-5xl font-semibold text-[#123532] mb-2">
              {data.finalCost}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              {data.startingEMI}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}