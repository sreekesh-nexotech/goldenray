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
import { BasicCalculatorData } from "@/types/types";

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
  data: BasicCalculatorData;
  monthlyBill:number | "";
}

export default function BasicResult({ data,monthlyBill }: BasicResultProps) {
  if (!data.graph_data.labels.length || !data.graph_data.datasets.length) {
    return (
      <div className="text-center text-gray-600 p-6">
        No graph data available.
      </div>
    );
  }
  // Create chartData with tension for curved lines and hardcoded chart properties
  const chartData = {
    labels: data.graph_data.labels,
    datasets: data.graph_data.datasets.map((dataset, index) => ({
      ...dataset,
      label: index === 0 ? "Without Solar" : "With Solar",
      borderColor: index === 0 ? "#5958CB" : "#FBC207",
      backgroundColor: index === 0 ? "#5958CB" : "#FBC207",
      fill: false,
      tension: 0.4, // Set tension for smooth curves
      pointRadius: 0,
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
    hover: {
      mode: 'index' as const,
      intersect: false, // Crucial: allows tooltip to trigger when mouse is near the line, not just on a point
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
            {data.specifications.power_requirement}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Power Requirement</p>
        </div>
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6">
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.specifications.area_requirement}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Area Requirement</p>
        </div>
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-b-3xl p-6">
          <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
            {data.specifications.installation_time}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Installation Time</p>
        </div>
      </div>

      {/* Box 2: Lifetime Savings & Graph */}
      <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-3xl text-left p-6 flex flex-col">
        <h2 className="text-4xl lg:text-[40px] font-semibold text-[#123532] mb-2">
          {data.financialDetails.lifetime_savings}
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">Lifetime Savings</p>
        <div className="relative h-48 w-full flex-grow">
          <Line data={chartData} options={chartOptions} />
        </div>
        <p className="text-[#124944] text-sm md:text-base mt-4 text-center bg-[#E8FEFF] border border-[#BCE8E4] rounded-full py-2 px-1">
          Reduce EB from <b>₹{monthlyBill}</b> to just <b>{data.financialDetails.monthlyEBReduction}</b>
        </p>
      </div>

      {/* Box 3: Costs & EMI */}
      <div className="rounded-3xl flex flex-col gap-2">
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 rounded-t-3xl">
          <p className="text-gray-600 text-sm md:text-base mb-2">Your overall setup cost</p>
          <h2 className="text-2xl lg:text-[32px] font-semibold text-[#123532] mb-4">
            {data.financialDetails.overall_cost}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-2">Govt. Subsidy</p>
          <h2 className="text-2xl lg:text-[32px] font-semibold text-[#123532] flex items-center">
            {data.financialDetails.government_subsidy}
          </h2>
        </div>
        <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 rounded-b-3xl">
          <div>
            <p className="text-gray-600 text-sm md:text-base mb-2">Your Final Cost</p>
            <h2 className="text-3xl lg:text-5xl font-semibold text-[#123532] mb-2">
              {data.financialDetails.final_cost}
            </h2>
            <p className="text-[#124944] text-sm md:text-base mt-4 text-center bg-[#E8FEFF] border border-[#BCE8E4] rounded-full py-2 px-1">
              starting from <b>{data.financialDetails.starting_EMI}/mo</b> EMI 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}