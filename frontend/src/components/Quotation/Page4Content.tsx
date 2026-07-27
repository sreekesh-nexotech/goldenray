"use client";

import { useQuotationStrings } from "./i18n/QuotationLanguageContext";

export default function Page4Content() {
  const { page4: t } = useQuotationStrings();

  // Feature comparison table rows: value is text, "check" or "dash"
  const comparisonRows = t.comparisonRows;

  // Render a table cell value: green check circle, gray dash circle, or text
  const renderCell = (value: string) => {
    if (value === "check") {
      return (
        <span className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#16a34a]">
          <svg
            className="w-[9px] h-[9px] text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      );
    }
    if (value === "dash") {
      return (
        <span className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#b8b8c0]">
          <span className="block w-[7px] h-[2px] bg-white rounded-full" />
        </span>
      );
    }
    return <span className="text-[10px] text-[#1a1a1a]">{value}</span>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Title */}
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">{t.title}</h1>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </div>

      {/* Pricing Cards */}
      <div className="flex items-center gap-3 mb-5 mt-3">
        {/* Premium System */}
        <div className="flex-1 border border-gray-300 rounded-xl p-4 bg-white self-center">
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-0.5">
            {t.premiumName}
          </h3>
          <p className="text-[11px] text-gray-500 mb-3">{t.systemSizeLabel}</p>

          <div className="mb-3">
            <p className="text-[11px] text-gray-400 line-through">₹3,38,000</p>
            <p className="text-[22px] font-bold text-[#1a1a1a] leading-tight">
              ₹2,60,000
            </p>
            <p className="text-[10px] text-green-600">{t.afterSubsidy}</p>
          </div>

          <div className="border-t border-gray-200 pt-2 text-center">
            <p className="text-[12px] font-semibold text-[#F88A22]">
              {t.premiumEmi}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">
              {t.premiumEmiNote}
            </p>
          </div>
        </div>

        {/* Smart System - Recommended */}
        <div className="flex-1 border-2 border-[#F88A22] rounded-xl p-4 pb-5 bg-[#FFF7ED] relative self-stretch flex flex-col justify-center">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F88A22] text-white text-[10px] font-medium px-3 py-1 rounded-full whitespace-nowrap">
            {t.recommendedBadge}
          </div>

          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-0.5 mt-2">
            {t.smartName}
          </h3>
          <p className="text-[11px] text-gray-500 mb-3">{t.systemSizeLabel}</p>

          <div className="mb-3">
            <p className="text-[11px] text-gray-400 line-through">₹2,68,000</p>
            <p className="text-[22px] font-bold text-[#F88A22] leading-tight">
              ₹1,90,000
            </p>
            <p className="text-[10px] text-green-600">{t.afterSubsidy}</p>
          </div>

          <div className="border-t border-[#F8D9B8] pt-2 text-center">
            <p className="text-[12px] font-semibold text-[#F88A22]">
              {t.smartEmi}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">{t.smartEmiNote}</p>
          </div>
        </div>

        {/* Basic System */}
        <div className="flex-1 border border-gray-300 rounded-xl p-4 bg-white self-center">
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-0.5">
            {t.basicName}
          </h3>
          <p className="text-[11px] text-gray-500 mb-3">{t.systemSizeLabel}</p>

          <div className="mb-3">
            <p className="text-[11px] text-gray-400 line-through">₹1,98,000</p>
            <p className="text-[22px] font-bold text-[#1a1a1a] leading-tight">
              ₹1,20,000
            </p>
            <p className="text-[10px] text-green-600">{t.afterSubsidy}</p>
          </div>

          <div className="border-t border-gray-200 pt-2 text-center">
            <p className="text-[12px] font-semibold text-[#F88A22]">
              {t.basicEmi}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">{t.basicEmiNote}</p>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] bg-[#F4F4F6] items-center">
          <div className="px-3 py-2.5">
            <span className="text-[12px] font-bold text-[#1a1a1a]">
              {t.itemsHeader}
            </span>
          </div>
          <div className="px-2 py-1.5 text-center border-l border-white">
            <p className="text-[12px] font-bold text-[#1a1a1a] leading-tight">
              {t.premiumName}
            </p>
            <p className="text-[10px] text-[#1a1a1a]">₹2,60,000</p>
          </div>
          <div className="px-2 py-1.5 text-center border-l border-white">
            <p className="text-[12px] font-bold text-[#1a1a1a] leading-tight">
              {t.smartName}
            </p>
            <p className="text-[10px] text-[#1a1a1a]">₹1,90,000</p>
          </div>
          <div className="px-2 py-1.5 text-center border-l border-white">
            <p className="text-[12px] font-bold text-[#1a1a1a] leading-tight">
              {t.basicName}
            </p>
            <p className="text-[10px] text-[#1a1a1a]">₹1,20,000</p>
          </div>
        </div>

        {/* Rows */}
        {comparisonRows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 items-stretch"
          >
            <div className="px-3 py-1.5 flex items-center">
              <span className="text-[10px] text-[#1a1a1a] leading-snug">
                {row.label}
              </span>
            </div>
            <div className="px-2 py-1.5 flex items-center justify-center border-l border-gray-200">
              {renderCell(row.premium)}
            </div>
            <div className="px-2 py-1.5 flex items-center justify-center border-l border-gray-200">
              {renderCell(row.smart)}
            </div>
            <div className="px-2 py-1.5 flex items-center justify-center border-l border-gray-200">
              {renderCell(row.basic)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
