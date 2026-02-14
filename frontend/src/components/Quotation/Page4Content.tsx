"use client";

interface Page4ContentProps {
  monthlyBill: number | "";
  systemPrice: number;
  emiPerMonth: number;
  graphData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export default function Page4Content({
  monthlyBill,
  systemPrice,
  emiPerMonth,
  graphData,
}: Page4ContentProps) {
  const billAmount = typeof monthlyBill === "number" ? monthlyBill : 6000;

  // Calculate three tier prices based on the calculated system price (Smart System)
  const smartSystemPrice = systemPrice; // This is the price after subsidy from calculator
  const basicSystemPrice = smartSystemPrice - 70000;
  const premiumSystemPrice = smartSystemPrice + 70000;

  // Calculate before subsidy prices (add ₹78,000 subsidy back)
  const subsidy = 78000;
  const smartSystemBeforeSubsidy = smartSystemPrice + subsidy;
  const basicSystemBeforeSubsidy = basicSystemPrice + subsidy;
  const premiumSystemBeforeSubsidy = premiumSystemPrice + subsidy;

  // Calculate EMI for all three tiers (proportional to price)
  const smartSystemEMI = emiPerMonth; // EMI from backend for Smart System
  const basicSystemEMI = Math.round(
    (basicSystemPrice / smartSystemPrice) * emiPerMonth,
  );
  const premiumSystemEMI = Math.round(
    (premiumSystemPrice / smartSystemPrice) * emiPerMonth,
  );

  // Savings are now calculated dynamically from graph data below

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
      {/* Main Title */}
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
          Three Options. One Smart Choice.
        </h1>
        <p className="text-sm text-gray-600">
          All prices shown after ₹{subsidy.toLocaleString("en-IN")} PM Surya
          Ghar subsidy. Pick what fits your home.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="flex items-center gap-3 mb-5 mt-3">
        {/* Basic System */}
        <div className="flex-1 border border-gray-300 rounded-xl p-4 bg-white self-center">
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-0.5">
            Basic System
          </h3>
          <p className="text-[11px] text-gray-500 mb-3">5 kW Solar System</p>

          <div className="mb-3">
            <p className="text-[11px] text-gray-400 line-through">
              ₹{basicSystemBeforeSubsidy.toLocaleString("en-IN")}
            </p>
            <p className="text-[22px] font-bold text-[#1a1a1a] leading-tight">
              ₹{basicSystemPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-green-600">
              after ₹{subsidy.toLocaleString("en-IN")} subsidy
            </p>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                9 panels (540-550W) – Inmark/Nanow
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                25-year panel performance warranty
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                Standard installation & documentation
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <p className="text-[12px] font-semibold text-[#F88A22]">
              EMI (5yr): ~₹{basicSystemEMI.toLocaleString("en-IN")}/mo
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">
              Net saving: +₹
              {Math.round(billAmount * 0.05).toLocaleString("en-IN")}-
              {Math.round(billAmount * 0.25).toLocaleString("en-IN")}/mo even
              during EMI
            </p>
          </div>
        </div>

        {/* Smart System - Recommended */}
        <div className="flex-1 border-2 border-[#F88A22] rounded-xl p-4 bg-white relative self-center">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F88A22] text-white text-[10px] font-medium px-3 py-1 rounded-full whitespace-nowrap">
            ★ Recommended – Most Popular
          </div>

          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-0.5 mt-2">
            Smart System
          </h3>
          <p className="text-[11px] text-gray-500 mb-3">5 KW Solar System</p>

          <div className="mb-3">
            <p className="text-[11px] text-gray-400 line-through">
              ₹{smartSystemBeforeSubsidy.toLocaleString("en-IN")}
            </p>
            <p className="text-[22px] font-bold text-[#F88A22] leading-tight">
              ₹{smartSystemPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-green-600">
              after ₹{subsidy.toLocaleString("en-IN")} subsidy
            </p>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                9 panels (560-580W) – Adani/Saatvik
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                30-year panel performance warranty
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                Full KGER & subsidy documentation handled
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                Priority installation + WhatsApp support
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                Covers ~90-95% of your bill
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <p className="text-[12px] font-semibold text-[#F88A22]">
              EMI (5yr): ~₹{smartSystemEMI.toLocaleString("en-IN")}/mo
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">
              Net positive from Day 1: saving +₹
              {Math.round(billAmount * 0.02).toLocaleString("en-IN")}-
              {Math.round(billAmount * 0.15).toLocaleString("en-IN")}/mo
            </p>
          </div>
        </div>

        {/* Premium System */}
        <div className="flex-1 border border-gray-300 rounded-xl p-4 bg-white self-center">
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-0.5">
            Premium System
          </h3>
          <p className="text-[11px] text-gray-500 mb-3">5 kW Solar System</p>

          <div className="mb-3">
            <p className="text-[11px] text-gray-400 line-through">
              ₹{premiumSystemBeforeSubsidy.toLocaleString("en-IN")}
            </p>
            <p className="text-[22px] font-bold text-[#1a1a1a] leading-tight">
              ₹{premiumSystemPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-green-600">
              after ₹{subsidy.toLocaleString("en-IN")} subsidy
            </p>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                9 panels (560-580W) – Adani/Saatvik
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                25-year panel performance warranty
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-[11px] mt-0.5">✓</span>
              <p className="text-[10px] text-gray-700">
                Enhanced surge protection + premium finish
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <p className="text-[12px] font-semibold text-[#F88A22]">
              EMI (5yr): ~₹{premiumSystemEMI.toLocaleString("en-IN")}/mo
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">
              Near break-even during EMI; pure savings offer
            </p>
          </div>
        </div>
      </div>

      {/* Your Savings Over Time */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-[#1a1a1a] text-center mb-2">
          Your Savings Over Time
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Graph - matching the shared image style */}
          <div className="bg-[#fafafa] rounded-lg p-2 pt-2 pb-1">
            <h3 className="text-[11px] font-semibold text-[#333] text-center mb-1">
              Cumulative Electricity Costs Over 25 Years
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
                KSEB Costs
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
                Solar + Bills
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
                Monthly Bill Reduction
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-600">Current KSEB Bill</p>
                  <p className="text-base font-bold text-[#1a1a1a]">
                    ₹{billAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-xl">→</div>
                <div>
                  <p className="text-[9px] text-gray-600">With Solar</p>
                  <p className="text-base font-bold text-green-600">
                    ₹300-800/month
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Boxes - dynamic from graph data */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#F88A22] rounded-lg p-2 text-white">
                <p className="text-[10px] mb-0.5">Monthly Savings</p>
                <p className="text-lg font-bold">
                  ~₹{monthlySavingsFromGraph.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-[#123532] rounded-lg p-2 text-white">
                <p className="text-[10px] mb-0.5">25-Year Net Savings</p>
                <p className="text-lg font-bold">
                  ₹{totalSavings25yr.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-[9px] font-semibold text-green-800 mb-0.5">
                Key Takeaway
              </p>
              <p className="text-[10px] text-green-700 leading-snug">
                Your solar system pays for itself within the first few years.
                After that, the next 20+ years are pure savings of ₹
                {totalSavings25yr.toLocaleString("en-IN")}+.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Section */}
      <div className="mt-2">
        <h2 className="text-lg font-bold text-[#1a1a1a] text-center mb-2">
          Book now
        </h2>

        {/* Top row: UPI + Bank Transfer */}
        <div className="grid grid-cols-10 gap-3 mb-2">
          {/* UPI - left */}
          <div className="col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-3 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
              <span className="text-[9px] text-gray-400">QR Code</span>
            </div>
            <p className="text-[11px] font-medium text-[#1a1a1a]">
              UPI ID:{" "}
              <span className="font-semibold text-[#F88A22]">flarize@upi</span>
            </p>
          </div>

          {/* Bank Transfer - right */}
          <div className="col-span-8 bg-gray-50 rounded-xl border border-gray-200 p-3">
            <h3 className="text-[11px] font-semibold text-[#1a1a1a] mb-1.5">
              Bank Transfer
            </h3>
            <div className="space-y-0.5 text-[11px]">
              <p className="text-gray-700">
                Bank:{" "}
                <span className="font-bold text-[#F88A22]">
                  Union Bank of India
                </span>
              </p>
              <p className="text-gray-700">
                A/c Name:{" "}
                <span className="font-bold text-[#F88A22]">
                  Flarize / Golden Ray Renewable Energy LLP
                </span>
              </p>
              <p className="text-gray-700">
                A/c No:{" "}
                <span className="font-bold text-[#F88A22]">XXXXXXXXXXXX</span>
              </p>
              <p className="text-gray-700">
                IFSC:{" "}
                <span className="font-bold text-[#F88A22]">UBIN0XXXXX</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                UPI Ref / NEFT Ref will be your project ID
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: Registration info + EMI info */}
        <div className="grid grid-cols-2 gap-3">
          {/* Registration - lavender/blue */}
          <div className="bg-[#e8e6f5] border border-[#c5c2e0] rounded-xl p-3">
            <p className="text-[11px] text-[#333] leading-snug">
              Pay ₹6,000 for registration, and KSEB refunds 80% of the base
              amount. We take care of the entire process for you.
            </p>
          </div>

          {/* EMI - green */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-[11px] text-green-800 leading-snug">
              🏦 EMI available through banks. 8.75% interest. 5 or 10 year
              options. Your EMI will be lower than your current KSEB bill from
              day one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
