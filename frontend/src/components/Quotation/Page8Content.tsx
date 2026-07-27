"use client";

import Image from "next/image";
import { useQuotationStrings } from "./i18n/QuotationLanguageContext";
import { fill } from "./i18n/quotationStrings";

interface Page8ContentProps {
  monthlyBill: number | "";
  graphData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export default function Page8Content({
  monthlyBill,
  graphData,
}: Page8ContentProps) {
  const { page8: t } = useQuotationStrings();
  const billAmount = typeof monthlyBill === "number" ? monthlyBill : 6000;

  // 25-year totals for comparison cards
  const yearlyBill = billAmount * 12;
  const totalPaidIn25Years = Math.round((yearlyBill * 25) / 100000); // in lakhs

  // === Graph calculations from backend data ===
  const withoutSolarData = graphData.datasets[0].data; // KSEB Costs
  const withSolarData = graphData.datasets[1].data; // Solar + Bills
  const xLabels = graphData.labels.map((l) => l.replace("Year ", ""));

  // Dynamic savings from graph data
  const totalSavings25yr =
    withoutSolarData[withoutSolarData.length - 1] -
    withSolarData[withSolarData.length - 1];
  const yearlySavingsFromGraph = Math.round(totalSavings25yr / 25);
  const monthlySavingsFromGraph = Math.round(yearlySavingsFromGraph / 12);

  // Calculate max value and round up to a nice number for Y-axis
  const rawMax = Math.max(...withoutSolarData, ...withSolarData);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const niceMax = Math.ceil(rawMax / magnitude) * magnitude;

  // Y-axis tick count and values
  const yTickCount = 5;
  const yStep = niceMax / yTickCount;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round(i * yStep),
  );

  // Format value in lakhs for Y-axis
  const formatLakh = (val: number) => {
    if (val === 0) return "0";
    const inLakhs = val / 100000;
    return inLakhs >= 1 ? `${Math.round(inLakhs)}` : inLakhs.toFixed(1);
  };

  // SVG chart dimensions
  const chartPadding = { top: 15, right: 15, bottom: 25, left: 40 };
  const chartW = 520;
  const chartH = 240;
  const plotW = chartW - chartPadding.left - chartPadding.right;
  const plotH = chartH - chartPadding.top - chartPadding.bottom;

  // Convert data points to SVG coordinates
  const toSvgPoint = (index: number, value: number) => ({
    x: chartPadding.left + (index / (withoutSolarData.length - 1)) * plotW,
    y: chartPadding.top + plotH - (value / niceMax) * plotH,
  });

  // Generate smooth cubic bezier path
  const generateSmoothPath = (dataPoints: number[]) => {
    if (!dataPoints || dataPoints.length < 2) return "";
    const pts = dataPoints.map((v, i) => toSvgPoint(i, v));
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const tension = 0.35;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const ksebPath = generateSmoothPath(withoutSolarData);
  const solarPath = generateSmoothPath(withSolarData);

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mt-2 mb-2">
        <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-1">{t.title}</h1>

        <div className="grid grid-cols-2 gap-3">
          {/* Graph - matching the shared image style */}
          <div className="bg-[#fafafa] rounded-lg p-2 pt-2 pb-1">
            <h3 className="text-[11px] font-semibold text-[#333] text-center mb-1">
              {t.chartTitle}
            </h3>
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full"
              style={{ overflow: "visible" }}
            >
              {/* Legend box - top left inside chart */}
              <rect
                x={chartPadding.left + 8}
                y={chartPadding.top + 2}
                width="115"
                height="36"
                rx="3"
                fill="white"
                stroke="#e0e0e0"
                strokeWidth="0.8"
              />
              <line
                x1={chartPadding.left + 15}
                y1={chartPadding.top + 14}
                x2={chartPadding.left + 35}
                y2={chartPadding.top + 14}
                stroke="#d32f2f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text
                x={chartPadding.left + 40}
                y={chartPadding.top + 17}
                fontSize="9"
                fill="#444"
                fontWeight="500"
              >
                {t.legendKseb}
              </text>
              <line
                x1={chartPadding.left + 15}
                y1={chartPadding.top + 28}
                x2={chartPadding.left + 35}
                y2={chartPadding.top + 28}
                stroke="#2e7d32"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text
                x={chartPadding.left + 40}
                y={chartPadding.top + 31}
                fontSize="9"
                fill="#444"
                fontWeight="500"
              >
                {t.legendSolar}
              </text>

              {/* Horizontal grid lines */}
              {yTicks.map((tick, i) => {
                const y = chartPadding.top + plotH - (tick / niceMax) * plotH;
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={chartPadding.left}
                      y1={y}
                      x2={chartPadding.left + plotW}
                      y2={y}
                      stroke="#e0e0e0"
                      strokeWidth="0.7"
                    />
                    {/* Y-axis label */}
                    <text
                      x={chartPadding.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#888"
                    >
                      {formatLakh(tick)}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis line */}
              <line
                x1={chartPadding.left}
                y1={chartPadding.top}
                x2={chartPadding.left}
                y2={chartPadding.top + plotH}
                stroke="#bbb"
                strokeWidth="1"
              />
              {/* X-axis line */}
              <line
                x1={chartPadding.left}
                y1={chartPadding.top + plotH}
                x2={chartPadding.left + plotW}
                y2={chartPadding.top + plotH}
                stroke="#bbb"
                strokeWidth="1"
              />

              {/* X-axis labels */}
              {xLabels.map((label, i) => {
                const x =
                  chartPadding.left + (i / (xLabels.length - 1)) * plotW;
                return (
                  <text
                    key={`x-${i}`}
                    x={x}
                    y={chartPadding.top + plotH + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#888"
                  >
                    {label}
                  </text>
                );
              })}

              {/* KSEB Costs line (red) */}
              <path
                d={ksebPath}
                stroke="#d32f2f"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Solar + Bills line (green) */}
              <path
                d={solarPath}
                stroke="#2e7d32"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Savings Info */}
          <div className="space-y-2">
            {/* Monthly Bill Reduction */}
            <div className="bg-white border border-gray-200 rounded-lg p-2">
              <h3 className="text-[11px] font-semibold text-[#1a1a1a] mb-1">
                {t.monthlyBillReduction}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-600">
                    {t.currentKsebBill}
                  </p>
                  <p className="text-base font-bold text-[#1a1a1a]">
                    ₹{billAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-xl">→</div>
                <div>
                  <p className="text-[9px] text-gray-600">{t.withSolar}</p>
                  <p className="text-base font-bold text-green-600">
                    {t.withSolarValue}
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Boxes - dynamic from graph data */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#F88A22] rounded-lg p-2 text-white">
                <p className="text-[10px] mb-0.5">{t.monthlySavings}</p>
                <p className="text-lg font-bold">
                  ~₹{monthlySavingsFromGraph.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-[#123532] rounded-lg p-2 text-white">
                <p className="text-[10px] mb-0.5">{t.netSavings25}</p>
                <p className="text-lg font-bold">
                  ₹{totalSavings25yr.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              {t.keyTakeaway && (
                <p className="text-[9px] font-semibold text-green-800 mb-0.5">
                  {t.keyTakeaway}
                </p>
              )}
              <p className="text-[10px] text-green-700 leading-snug">
                {fill(t.keyTakeawayBody, {
                  amount: totalSavings25yr.toLocaleString("en-IN"),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-2 gap-15 my-5 px-4 relative">
        {/* Without Solar */}
        <div className="border-2 border-red-300 rounded-lg p-3 bg-[#FEF2F2]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✕</span>
            </div>
            <span className="text-sm font-semibold text-red-600">
              {t.withoutSolar}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-1 ">
              <span className="text-red-500 text-lg">↘</span>
              <span className="text-2xl font-bold text-red-600">
                ₹{billAmount.toLocaleString("en-IN")}/month
              </span>
            </div>
            <span className="text-xs text-red-500 ml-7">
              {t.foreverIncreasing}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-1">
              <Image
                src="https://golden-ray.b-cdn.net/icons/Vector%20(4).png"
                alt=""
                width={10}
                height={10}
                className="object-contain mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">
                <span className="text-red-600 font-medium">
                  {fill(t.paidToKsebAmount, { amount: totalPaidIn25Years })}
                </span>
                {t.paidToKsebText}
              </span>
            </div>
            <div className="flex items-start gap-1">
              <Image
                src="https://golden-ray.b-cdn.net/icons/Vector%20(3).png"
                alt=""
                width={10}
                height={10}
                className="object-contain mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">
                {t.billIncreasesText}
                <span className="text-red-600 font-medium">
                  {t.billIncreasesValue}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-1">
              <Image
                src="https://golden-ray.b-cdn.net/icons/Vector%20(2).png"
                alt=""
                width={10}
                height={10}
                className="object-contain mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">{t.noOwnership}</span>
            </div>
          </div>
        </div>

        {/* Arrow between cards */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-2.5   border-gray-300">
            <svg
              className="w-6 h-6 text-gray-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* With Solar */}
        <div className="border-2 border-green-500 rounded-lg p-3 bg-[#F0FDF4]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <span className="text-sm font-semibold text-green-700">
              {t.withSolarLabel}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">⚡</span>
              <span className="text-2xl font-bold text-green-700">
                {t.withSolarValue}
              </span>
            </div>
            <span className="text-xs text-green-600 ml-7">
              {t.fixedLowBill}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-1">
              <Image
                src="https://golden-ray.b-cdn.net/icons/Vector%20(5).png"
                alt=""
                width={10}
                height={10}
                className="object-contain mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">
                <span className="text-green-700 font-medium">
                  {fill(t.savedAmount, {
                    amount: Math.round(totalPaidIn25Years * 0.65),
                  })}
                </span>
                {t.savedText}
              </span>
            </div>
            <div className="flex items-start gap-1">
              <Image
                src="https://golden-ray.b-cdn.net/icons/Vector%20(1).png"
                alt=""
                width={10}
                height={10}
                className="object-contain mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">
                {t.protectedFromText}
                <span className="text-green-700 font-medium">
                  {t.protectedFromValue}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-1">
              <Image
                src="https://golden-ray.b-cdn.net/icons/Frame%20(1).png"
                alt=""
                width={10}
                height={10}
                className="object-contain mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">
                {t.ownYourPowerText}
                <span className="text-green-700 font-medium">
                  {t.ownYourPowerValue}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Section */}
      <div className="mt-2">
        <h2 className="text-lg font-bold text-[#1a1a1a] text-center mb-2">
          {t.bookNow}
        </h2>

        {/* Top row: UPI + Bank Transfer */}
        <div className="grid grid-cols-10 gap-3 mb-2">
          {/* UPI - left */}
          <div className="col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-3 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
              <span className="text-[9px] text-gray-400">{t.qrCode}</span>
            </div>
            <p className="text-[11px] font-medium text-[#1a1a1a]">
              {t.upiIdLabel}
              <span className="font-semibold text-[#F88A22]">flarize@upi</span>
            </p>
          </div>

          {/* Bank Transfer - right */}
          <div className="col-span-8 bg-gray-50 rounded-xl border border-gray-200 p-3">
            <h3 className="text-[11px] font-semibold text-[#1a1a1a] mb-1.5">
              {t.bankTransfer}
            </h3>
            <div className="space-y-0.5 text-[11px]">
              <p className="text-gray-700">
                {t.bankLabel}
                <span className="font-bold text-[#F88A22]">
                  Union Bank of India
                </span>
              </p>
              <p className="text-gray-700">
                {t.accountNameLabel}
                <span className="font-bold text-[#F88A22]">
                  Flarize Renewable Energy LLP
                </span>
              </p>
              <p className="text-gray-700">
                {t.accountNoLabel}
                <span className="font-bold text-[#F88A22]">XXXXXXXXXXXX</span>
              </p>
              <p className="text-gray-700">
                {t.ifscLabel}
                <span className="font-bold text-[#F88A22]">UBIN0XXXXX</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{t.refNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="mt-4 bg-[#FAF7EB] rounded-sm px-6 py-4">
        <h2 className="inline-block text-[16px] font-bold text-[#1a1a1a] border-b-[3px] border-[#123532] pb-0.5 mb-3">
          {t.requiredDocuments}
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
          <ol className="space-y-1.5">
            {t.documentsLeft.map((item, idx) => (
              <li key={idx} className="text-[12px] text-[#1a1a1a] pl-2">
                {idx + 1}. {item}
              </li>
            ))}
          </ol>
          <ol className="space-y-1.5">
            {t.documentsRight.map((item, idx) => (
              <li key={idx} className="text-[12px] text-[#1a1a1a] pl-2">
                {idx + 5}. {item}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Additional Structure Cost */}
      <div className="mt-3 border-l-[3px] border-[#F88A22] pl-3 py-0.5">
        <p className="text-[12px] text-gray-700">
          {t.additionalStructureCost}
          <span className="text-gray-500">{t.additionalStructureNote}</span>
        </p>
        <p className="text-[13px] font-bold text-[#1a1a1a] mt-0.5">
          {t.additionalStructureValue}
        </p>
      </div>
    </div>
  );
}
