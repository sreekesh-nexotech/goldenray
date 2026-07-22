"use client";

interface Page7ContentProps {
  systemPrice: number;
  systemSize: string;
}

export default function Page7Content({
  systemPrice,
  systemSize,
}: Page7ContentProps) {
  // Tier prices derived from the calculated Smart System price (after subsidy)
  const subsidy = 78000;
  const smartAfterSubsidy = systemPrice;
  const basicAfterSubsidy = smartAfterSubsidy - 70000;
  const premiumAfterSubsidy = smartAfterSubsidy + 70000;

  // Before-subsidy totals
  const smartTotal = smartAfterSubsidy + subsidy;
  const basicTotal = basicAfterSubsidy + subsidy;
  const premiumTotal = premiumAfterSubsidy + subsidy;

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  // System size labels (e.g. "5 kW" -> "5 kW Solar System", "5000 W")
  const sizeKW = parseFloat(systemSize) || 5;
  const sizeLabel = `${sizeKW} kW Solar System`;
  const equivalentW = `${sizeKW * 1000} W`;
  // Technical specification rows: [label, premium, smart, basic]
  const specRows: {
    label: string;
    premium: string;
    smart: string;
    basic: string;
  }[] = [
    {
      label: "Solar Module Brand",
      premium: "Emmvee / Renewsys/ Adani/Equivalent",
      smart: "Emmvee / Renewsys/ Adani/Equivalent",
      basic: "Renew /Premier / Equivalent",
    },
    {
      label: "Module Power (W) and Type",
      premium: "TopCon Bifacial Glass to Glass ( 550-630W)",
      smart: "TopCon Bifacial Glass to Glass ( 550-630W)",
      basic: "Mono PERC Bifacial Halfcut (530–560W)",
    },
    {
      label: "Panel Warranty",
      premium: "12-Year Product & 30 Year Performance Warranty",
      smart: "12-Year Product & 25-30 Year Performance Warranty",
      basic: "12-Year Product & 30 Year Performance Warranty",
    },
    {
      label: "Inverter Type",
      premium: "Micro Inverter (Single Phase)",
      smart: "String Inverter (Single Phase)",
      basic: "String Inverter (Single Phase)",
    },
    {
      label: "Inverter Brand & Warranty",
      premium: "Enphase / Hoymiles (15 Years)",
      smart: "Sungrow / Solis / Equivalent (8 Years)",
      basic: "Premier / Deye / Equivalent (7 Years)",
    },
    {
      label: "Mounting Structure",
      premium: "GI Structure for Flat Roof - Apollo",
      smart: "GI Structure for Flat Roof - Apollo",
      basic: "GP Structure for Flat Roof - Apollo",
    },
    {
      label: "ACDB / DCDB",
      premium: "ABB MCB, Citel SPD (Single Phase)",
      smart: "ETN MCB, Mersen SPD (Single Phase)",
      basic: "Havells",
    },
    {
      label: "DC Cable (mm²)",
      premium: "4 (Polycab / Equivalent)",
      smart: "4 (Polycab / Equivalent)",
      basic: "4 (Wacab / Equivalent)",
    },
    {
      label: "AC Cable (sqmm)",
      premium: "4 sqmm (RR / Finolex)",
      smart: "4 sqmm (RR / Finolex)",
      basic: "4 sqmm (Flexolite)",
    },
    {
      label: "Earthing Wire",
      premium: "10 SWG (20m)",
      smart: "10 SWG (20m)",
      basic: "10 SWG (20m)",
    },
    {
      label: "Earthing Wire",
      premium: "10 SWG (20m)",
      smart: "10 SWG (20m)",
      basic: "10 SWG (20m)",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-2 mb-2">
        <h1 className="text-[24px] leading-tight mb-1">
          <span className="font-bold text-[#123532]">
            Technical Specifications
          </span>{" "}
          <span className="text-[#1a1a1a]">(Equivalent to {equivalentW})</span>
        </h1>
        <p className="text-[11px] text-gray-600">
          Every component, every specification — total transparency for your
          peace of mind.
        </p>
      </div>

      {/* Specification Table */}
      <div className="mx-2 rounded-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-[11px] font-bold text-[#1a1a1a]">Items</span>
          </div>
          <div className="px-2 py-2 border-l border-gray-100">
            <p className="text-[11px] font-bold text-[#1a1a1a] leading-tight">
              Premium System
            </p>
            <p className="text-[9px] text-gray-500">{sizeLabel}</p>
          </div>
          <div className="px-2 py-2 border-l border-gray-100 bg-[#FFF7ED]">
            <p className="text-[11px] font-bold text-[#F88A22] leading-tight">
              Smart System
            </p>
            <p className="text-[9px] text-gray-500">{sizeLabel}</p>
          </div>
          <div className="px-2 py-2 border-l border-gray-100">
            <p className="text-[11px] font-bold text-[#1a1a1a] leading-tight">
              Basic System
            </p>
            <p className="text-[9px] text-gray-500">{sizeLabel}</p>
          </div>
        </div>

        {/* Spec rows */}
        {specRows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 items-stretch"
          >
            <div className="px-3 py-2 flex items-center">
              <span className="text-[9.5px] text-[#1a1a1a] leading-snug">
                {row.label}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[9.5px] text-[#1a1a1a] leading-snug">
                {row.premium}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200 bg-[#FFF7ED]">
              <span className="text-[9.5px] text-[#1a1a1a] leading-snug">
                {row.smart}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[9.5px] text-[#1a1a1a] leading-snug">
                {row.basic}
              </span>
            </div>
          </div>
        ))}

        {/* Total System Cost */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-300 bg-[#F4F4F6] items-stretch">
          <div className="px-3 py-2 flex items-center">
            <span className="text-[10.5px] font-bold text-[#1a1a1a]">
              Total System Cost
            </span>
          </div>
          <div className="px-2 py-2 flex items-center border-l border-gray-200">
            <span className="text-[10.5px] font-bold text-[#1a1a1a]">
              {fmt(premiumTotal)}
            </span>
          </div>
          <div className="px-2 py-2 flex items-center border-l border-gray-200 bg-[#FFF7ED]">
            <span className="text-[10.5px] font-bold text-[#1a1a1a]">
              {fmt(smartTotal)}
            </span>
          </div>
          <div className="px-2 py-2 flex items-center border-l border-gray-200">
            <span className="text-[10.5px] font-bold text-[#1a1a1a]">
              {fmt(basicTotal)}
            </span>
          </div>
        </div>

        {/* Subsidy Amount */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 bg-[#F4F4F6] items-stretch">
          <div className="px-3 py-2 flex items-center">
            <span className="text-[10.5px] font-bold text-[#1a1a1a]">
              Subsidy Amount
            </span>
          </div>
          <div className="px-2 py-2 flex items-center border-l border-gray-200">
            <span className="text-[10.5px] font-bold text-[#16a34a]">
              {fmt(subsidy)}
            </span>
          </div>
          <div className="px-2 py-2 flex items-center border-l border-gray-200 bg-[#FFF7ED]">
            <span className="text-[10.5px] font-bold text-[#16a34a]">
              {fmt(subsidy)}
            </span>
          </div>
          <div className="px-2 py-2 flex items-center border-l border-gray-200">
            <span className="text-[10.5px] font-bold text-[#16a34a]">
              {fmt(subsidy)}
            </span>
          </div>
        </div>

        {/* Total System Cost After Subsidy */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 bg-[#16a34a] items-stretch">
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-[10.5px] font-bold text-white leading-tight">
              Total System Cost After Subsidy
            </span>
          </div>
          <div className="px-2 py-2.5 flex items-center border-l border-[#2fb35d]">
            <span className="text-[10.5px] font-bold text-white">
              {fmt(premiumAfterSubsidy)}
            </span>
          </div>
          <div className="px-2 py-2.5 flex items-center border-l border-[#2fb35d]">
            <span className="text-[10.5px] font-bold text-white">
              {fmt(smartAfterSubsidy)}
            </span>
          </div>
          <div className="px-2 py-2.5 flex items-center border-l border-[#2fb35d]">
            <span className="text-[10.5px] font-bold text-white">
              {fmt(basicAfterSubsidy)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
