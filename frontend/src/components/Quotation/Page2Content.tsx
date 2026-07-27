"use client";

import { useQuotationStrings } from "./i18n/QuotationLanguageContext";
import { fill } from "./i18n/quotationStrings";

interface Page2ContentProps {
  monthlyBill: number | "";
  systemSize: string;
}

// Emoji shown beside each appliance row, in the same order as the catalog list.
const APPLIANCE_ICONS = ["❄️", "🔴", "👕", "📺", "💡", "🔌", "🚗"];

export default function Page2Content({ systemSize }: Page2ContentProps) {
  const { page2: t } = useQuotationStrings();
  // Parse system size (e.g. "5 kW" -> 5)
  const sizeKW = parseFloat(systemSize) || 5;

  // Daily generation: ~4 units per kW installed
  const minDaily = Math.round(sizeKW * 3.6);
  const maxDaily = Math.round(sizeKW * 4.4);

  // Monthly value at KSEB rate (~₹7.5/unit average)
  const minMonthlyValue = Math.round(minDaily * 30 * 7.5);
  const maxMonthlyValue = Math.round(maxDaily * 30 * 7.5);

  // Format to nearest 100
  const formatValue = (val: number) => {
    const rounded = Math.round(val / 100) * 100;
    return rounded.toLocaleString("en-IN");
  };

  const appliances = t.appliances;

  const totalUnits = 14;

  // Surplus
  const minSurplus = minDaily - totalUnits;
  const maxSurplus = maxDaily - totalUnits;

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="font-bold text-[#123532] my-1 text-2xl">{t.title}</h1>
        <p className="text-gray-500" style={{ fontSize: "12px" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Green Banner - Daily Solar Generation */}
      <div
        className="rounded-xl px-6 py-4 mb-8 flex items-center justify-between mb-4 shadow-md"
        style={{
          background: "linear-gradient(90deg, #123532 0%, #11625C 50%)",
        }}
      >
        <div>
          <p
            className="text-white opacity-80 mb-0.5"
            style={{ fontSize: "10px" }}
          >
            {t.dailyGenerationLabel}
          </p>
          <p
            className="text-white font-bold leading-tight"
            style={{ fontSize: "28px" }}
          >
            {fill(t.dailyGenerationValue, { min: minDaily, max: maxDaily })}
          </p>
          <p className="text-white opacity-60" style={{ fontSize: "9px" }}>
            {t.dailyGenerationNote}
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-white opacity-80 mb-0.5"
            style={{ fontSize: "10px" }}
          >
            {t.monthlyValueLabel}
          </p>
          <p
            className="text-white font-bold leading-tight"
            style={{ fontSize: "26px" }}
          >
            ₹{formatValue(minMonthlyValue)}–{formatValue(maxMonthlyValue)}
          </p>
          <p className="text-white opacity-60" style={{ fontSize: "9px" }}>
            {t.monthlyValueNote}
          </p>
        </div>
      </div>

      {/* Appliance Usage Table */}
      <div className="mb-10 mx-10">
        <h2 className="text-center font-bold text-[#123532] mb-2 text-xl">
          {t.applianceTitle}
        </h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div
            className="grid grid-cols-4 bg-[#123532] text-white py-1.5 px-3"
            style={{ fontSize: "10px" }}
          >
            <span className="font-semibold">{t.colAppliance}</span>
            <span className="font-semibold pl-5">{t.colQuantity}</span>
            <span className="font-semibold pl-5">{t.colHoursPerDay}</span>
            <span className="font-semibold pl-5">{t.colUnitsPerDay}</span>
          </div>

          {/* Table Rows */}
          {appliances.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 py-1.5 px-3  border-b border-gray-100 items-center"
              style={{ fontSize: "12px" }}
            >
              <span className="flex items-center gap-1.5">
                <span style={{ fontSize: "12px" }}>{APPLIANCE_ICONS[idx]}</span>
                <span className="text-gray-700">{item.name}</span>
              </span>
              <span className="text-gray-700 pl-5">{item.qty}</span>
              <span className="text-[#F88A22] font pl-5">{item.hours}</span>
              <span className="text-[#123532] font pl-5">{item.units}</span>
            </div>
          ))}

          {/* Total Row */}
          <div
            className="grid grid-cols-4 py-1.5 px-3 bg-[#16A34A1A]"
            style={{ fontSize: "13px" }}
          >
            <span className="text-[#16a34a] font-bold">
              {t.totalDailyUsage}
            </span>
            <span></span>
            <span></span>
            <span className="text-[#16a34a] font-bold pl-5">
              {fill(t.totalUnitsValue, { units: totalUnits })}
            </span>
          </div>
        </div>
      </div>

      {/* Solar Flow Cards */}
      <div className="flex items-center justify-center gap-3 mb-10 mx-8">
        {/* Solar Generates */}
        <div
          className="flex-1 rounded-[1.3rem] shadow-sm border border-gray-200"
          style={{ backgroundColor: "#123532" }}
        >
          <div
            className="text-white text-center pt-2 pb-3 font-semibold"
            style={{ fontSize: "12px" }}
          >
            {t.solarGenerates}
          </div>
          <div className="px-4 py-2 text-center bg-white rounded-t-xl rounded-b-xl -mt-2">
            <p
              className="font-bold text-[#123532] leading-tight mb-2"
              style={{ fontSize: "32px" }}
            >
              {minDaily}–{maxDaily}
            </p>
            <p
              className="flex items-center justify-center gap-1.5 mt-1"
              style={{ fontSize: "10px" }}
            >
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: "#F88A22",
                  fontSize: "8px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              <span className="text-gray-600">{t.unitsPerDayAverage}</span>
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div
          className="flex-shrink-0 text-[#F88A22] font-bold"
          style={{ fontSize: "24px" }}
        >
          →
        </div>

        {/* Home Uses */}
        <div
          className="flex-1 rounded-[1.3rem] shadow-sm border border-gray-200"
          style={{ backgroundColor: "#123532" }}
        >
          <div
            className="text-white  text-center pt-2 pb-3 font-semibold"
            style={{ fontSize: "12px" }}
          >
            {t.homeUses}
          </div>
          <div className="px-4 py-2 text-center bg-white rounded-t-xl rounded-b-xl -mt-2">
            <p
              className="font-bold text-[#123532] leading-tight mb-2"
              style={{ fontSize: "32px" }}
            >
              ~{totalUnits}
            </p>
            <p
              className="flex items-center justify-center gap-1.5 mt-1"
              style={{ fontSize: "10px" }}
            >
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: "#F88A22",
                  fontSize: "8px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              <span className="text-gray-600">{t.unitsPerDayAppliances}</span>
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div
          className="flex-shrink-0 text-[#F88A22] font-bold"
          style={{ fontSize: "24px" }}
        >
          →
        </div>

        {/* Surplus Exported */}
        <div
          className="flex-1 rounded-[1.3rem] shadow-sm border border-gray-200"
          style={{ backgroundColor: "#123532" }}
        >
          <div
            className="text-white text-center pt-2 pb-3 font-semibold"
            style={{ fontSize: "12px" }}
          >
            {t.surplusExported}
          </div>
          <div className="px-4 py-2 text-center bg-white rounded-t-xl rounded-b-xl -mt-2">
            <p
              className="font-bold text-[#123532] leading-tight mb-2"
              style={{ fontSize: "32px" }}
            >
              {minSurplus}–{maxSurplus}
            </p>
            <p
              className="flex items-center justify-center gap-1.5 mt-1"
              style={{ fontSize: "10px" }}
            >
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: "#F88A22",
                  fontSize: "8px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              <span className="text-gray-600">{t.unitsPerDayCredits}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Life Comparison Section */}
      <div className="grid grid-cols-2 gap-6 mx-10">
        {/* Your Life Now */}
        <div>
          <h3
            className="font-medium text-[#DC2626] mb-2"
            style={{ fontSize: "17px" }}
          >
            {t.lifeNowTitle}
          </h3>
          <div className="flex flex-col gap-4">
            {t.lifeNow.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    backgroundColor: "#FEE2E2",
                    fontSize: "6px",
                    color: "#DC2626",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </span>
                <div>
                  <p
                    className="text-red-600 leading-tight"
                    style={{ fontSize: "13px" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-gray-500 leading-snug"
                    style={{ fontSize: "11px" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Life with Solar */}
        <div>
          <h3
            className="font-medium text-[#16a34a] mb-2"
            style={{ fontSize: "17px" }}
          >
            {t.lifeSolarTitle}
          </h3>
          <div className="flex flex-col gap-4">
            {t.lifeWithSolar.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    backgroundColor: "#DCFCE7",
                    fontSize: "6px",
                    color: "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                <div>
                  <p
                    className=" text-[#16a34a] leading-tight"
                    style={{ fontSize: "13px" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-gray-500 leading-snug"
                    style={{ fontSize: "11px" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
