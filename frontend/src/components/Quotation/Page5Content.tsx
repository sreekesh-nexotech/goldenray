"use client";

interface Page5ContentProps {
  systemPrice: number;
}

export default function Page5Content({ systemPrice }: Page5ContentProps) {
  // Calculate three tier prices (same logic as Page4)
  const smartSystemPrice = systemPrice;
  const basicSystemPrice = smartSystemPrice - 70000;
  const premiumSystemPrice = smartSystemPrice + 70000;

  const subsidy = 78000;
  const smartSystemBeforeSubsidy = smartSystemPrice + subsidy;
  const basicSystemBeforeSubsidy = basicSystemPrice + subsidy;
  const premiumSystemBeforeSubsidy = premiumSystemPrice + subsidy;

  const formatPrice = (val: number) => `₹${val.toLocaleString("en-IN")}`;

  // Specification data
  const solarPanelRows = [
    {
      item: "Module Brand",
      basic: "Premier / Renew",
      recommended: "Adani / Saatvik",
      premium: "Adani / Saatvik",
    },
    {
      item: "Module Power",
      basic: "540–550W",
      recommended: "560–580W",
      premium: "560–580W",
    },
    {
      item: "Number of Panels",
      basic: "9",
      recommended: "9",
      premium: "9",
    },
    {
      item: "Total Capacity",
      basic: "~4.9–5.0 kW",
      recommended: "~5.0–5.2 kW",
      premium: "~5.0–5.2 kW",
    },
    {
      item: "Panel Type",
      basic: "Bifacial half-cut",
      recommended: "Bifacial / TopCon",
      premium: "Bifacial / TopCon",
    },
    {
      item: "Panel Warranty",
      basic: "12yr product / 25yr perf",
      recommended: "12yr product / 30yr perf",
      premium: "12yr product / 25yr perf",
    },
  ];

  const inverterRows = [
    {
      item: "Type",
      basic: "String (Single Phase)",
      recommended: "String (Single Phase)",
      premium: "Microinverter",
    },
    {
      item: "Brand",
      basic: "Deye / equivalent",
      recommended: "PV Blink / Foxess / Sungrow",
      premium: "Enphase / Hoymiles",
    },
    {
      item: "Warranty",
      basic: "8 years",
      recommended: "7 years",
      premium: "15 years",
    },
  ];

  const balanceRows = [
    {
      item: "Mounting Structure",
      basic: "GP Structure – Apollo",
      recommended: "GI Structure – Apollo",
      premium: "GI Structure – Apollo",
    },
    {
      item: "ACDB / DCDB",
      basic: "Havells",
      recommended: "ETN-MCB, Mersen-SPD",
      premium: "ABB-MCB, Citel-SPD",
    },
    {
      item: "DC Cable",
      basic: "4 mm² (generic)",
      recommended: "4 mm² (Polycab)",
      premium: "4 mm² (Polycab)",
    },
    {
      item: "AC Cable",
      basic: "4 sqm (Flexolite)",
      recommended: "4 sqm (Polycab)",
      premium: "4 sqm (Polycab)",
    },
    {
      item: "Earthing",
      basic: "4 FT – 100 micron",
      recommended: "4 FT – 250 micron",
      premium: "4 FT – 250 micron",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-4 mb-1">
        <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-1">
          Technical Specifications
        </h1>
        <p className="text-[13px] text-gray-500 italic">
          Every component, every specification — total transparency for your
          peace of mind.
        </p>
      </div>

      {/* Specifications Table */}
      <div className="mt-5 mx-2">
        <table className="w-full border-collapse text-[11px]">
          {/* Column widths */}
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          {/* Header */}
          <thead>
            <tr>
              <th className="text-left py-2.5 px-3 text-white text-[11.5px] font-semibold bg-[#123532] rounded-tl-lg">
                Item
              </th>
              <th className="text-center py-2.5 px-3 text-white text-[11.5px] font-semibold bg-[#123532]">
                Basic
              </th>
              <th className="text-center py-2.5 px-3 text-white text-[11.5px] font-semibold bg-[#F88A22]">
                ★ Recommended
              </th>
              <th className="text-center py-2.5 px-3 text-white text-[11.5px] font-semibold bg-[#1B5E20] rounded-tr-lg">
                Premium
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Solar Panels Section Header */}
            <tr>
              <td
                colSpan={2}
                className="py-2 px-3 text-[11.5px] font-bold text-[#1a1a1a] bg-gray-50"
              >
                Solar Panels
              </td>
              <td className="py-2 px-3 bg-[#F88A224D]"></td>
              <td className="py-2 px-3 bg-gray-50"></td>
            </tr>

            {/* Solar Panel Rows */}
            {solarPanelRows.map((row, idx) => (
              <tr key={`sp-${idx}`} className="border-b border-gray-100">
                <td className="py-[7px] px-3 text-[11px] text-gray-700 font-medium">
                  {row.item}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center">
                  {row.basic}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center bg-[#F88A224D]">
                  {row.recommended}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center">
                  {row.premium}
                </td>
              </tr>
            ))}

            {/* Blank separator row */}
            <tr>
              <td className="py-4"></td>
              <td className="py-4"></td>
              <td className="py-4 bg-[#F88A224D]"></td>
              <td className="py-4"></td>
            </tr>

            {/* Inverter Rows (no section header per the image) */}
            {inverterRows.map((row, idx) => (
              <tr key={`inv-${idx}`} className="border-b border-gray-100">
                <td className="py-[7px] px-3 text-[11px] text-gray-700 font-medium">
                  {row.item}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center">
                  {row.basic}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center bg-[#F88A224D]">
                  {row.recommended}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center">
                  {row.premium}
                </td>
              </tr>
            ))}

            {/* Balance of System Section Header */}
            <tr>
              <td
                colSpan={2}
                className="py-2 px-3 text-[11.5px] font-bold text-[#1a1a1a] bg-gray-50"
              >
                Balance of System
              </td>
              <td className="py-2 px-3 bg-[#F88A224D]"></td>
              <td className="py-2 px-3 bg-gray-50"></td>
            </tr>

            {/* Balance of System Rows */}
            {balanceRows.map((row, idx) => (
              <tr key={`bos-${idx}`} className="border-b border-gray-100">
                <td className="py-[7px] px-3 text-[11px] text-gray-700 font-medium">
                  {row.item}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center">
                  {row.basic}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center bg-[#F88A224D]">
                  {row.recommended}
                </td>
                <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center">
                  {row.premium}
                </td>
              </tr>
            ))}

            {/* Blank row before pricing */}
            <tr>
              <td className="py-1"></td>
              <td className="py-1"></td>
              <td className="py-1 bg-[#F88A224D]"></td>
              <td className="py-1"></td>
            </tr>

            {/* System Cost Row */}
            <tr className="border-b border-gray-100">
              <td className="py-[7px] px-3 text-[11px] text-gray-700 font-medium">
                System Cost
              </td>
              <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center font-semibold">
                {formatPrice(basicSystemBeforeSubsidy)}
              </td>
              <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center font-semibold bg-[#F88A224D]">
                {formatPrice(smartSystemBeforeSubsidy)}
              </td>
              <td className="py-[7px] px-3 text-[11px] text-gray-700 text-center font-semibold">
                {formatPrice(premiumSystemBeforeSubsidy)}
              </td>
            </tr>

            {/* Subsidy Row */}
            <tr className="border-b border-gray-100">
              <td className="py-[7px] px-3 text-[11px] text-[#16a34a] font-medium">
                Subsidy
              </td>
              <td className="py-[7px] px-3 text-[11px] text-[#16a34a] text-center font-semibold">
                – {formatPrice(subsidy)}
              </td>
              <td className="py-[7px] px-3 text-[11px] text-[#16a34a] text-center font-semibold bg-[#F88A224D]">
                – {formatPrice(subsidy)}
              </td>
              <td className="py-[7px] px-3 text-[11px] text-[#16a34a] text-center font-semibold">
                – {formatPrice(subsidy)}
              </td>
            </tr>

            {/* After Subsidy Row - orange bar */}
            <tr>
              <td className="py-2.5 px-3 text-[12px] text-white font-bold bg-[#F88A22] rounded-bl-lg">
                After Subsidy
              </td>
              <td className="py-2.5 px-3 text-[13px] text-white font-bold text-center bg-[#F88A22]">
                {formatPrice(basicSystemPrice)}
              </td>
              <td className="py-2.5 px-3 text-[13px] text-white font-bold text-center bg-[#F88A22]">
                {formatPrice(smartSystemPrice)}
              </td>
              <td className="py-2.5 px-3 text-[13px] text-white font-bold text-center bg-[#F88A22] rounded-br-lg">
                {formatPrice(premiumSystemPrice)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Notes */}
      <div className="mt-5 mx-2 space-y-3">
        {/* 5-Year Warranty Note */}
        <div
          className="rounded-lg p-3.5 bg-[#16A34A1A]"
          style={{
            borderWidth: "0px 5px 0px 5px",
            borderStyle: "solid",
            borderColor: "#16A34A",
          }}
        >
          <p className="text-[11px] text-[#16a34a] leading-relaxed">
            <span className="font-bold ">✓ </span>
            <span className="font-semibold">
              5-Year Comprehensive Installation Warranty
            </span>{" "}
            — covers all manufacturing and technical defects. All components
            from MNRE-approved Tier-1 manufacturers.
          </p>
        </div>

        {/* Zero Downtime Promise Note */}
        <div
          className="rounded-lg p-3.5 bg-[#1E40AF33]"
          style={{
            borderWidth: "0px 5px 0px 5px",
            borderStyle: "solid",
            borderColor: "#1E3A8A",
          }}
        >
          <p className="text-[11px] text-[#1E3A8A] leading-relaxed">
            <span className="font-bold">✨ </span>
            <span className="font-semibold">Zero Downtime Promise</span> —
            standby inverter provided during any inverter failure or repair
            period. Your system keeps generating without interruption.
          </p>
        </div>
      </div>
    </div>
  );
}
