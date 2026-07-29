"use client";

import { useQuotationStrings } from "./i18n/QuotationLanguageContext";
import { fill } from "./i18n/quotationStrings";
import { quotationPricing } from "./subsidy";

interface Page7ContentProps {
  systemPrice: number;
  systemSize: string;
  /** PM Surya Ghar subsidy applicable to this customer; 0 for Non-DCR. */
  subsidy: number;
}

export default function Page7Content({
  systemPrice,
  systemSize,
  subsidy,
}: Page7ContentProps) {
  const { page7: t } = useQuotationStrings();
  const hasSubsidy = subsidy > 0;

  // Tier costs derived from the calculated Smart System price. The tiers sit
  // ±₹70,000 around it on the gross (pre-subsidy) cost.
  const { grossCost: smartTotal } = quotationPricing(systemPrice, 0, subsidy);
  const basicTotal = smartTotal - 70000;
  const premiumTotal = smartTotal + 70000;

  // What each tier costs after the applicable subsidy — the same totals when
  // the customer is not eligible.
  const smartFinal = smartTotal - subsidy;
  const basicFinal = basicTotal - subsidy;
  const premiumFinal = premiumTotal - subsidy;

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  // System size labels (e.g. "5 kW" -> "5 kW Solar System", "5000 W")
  const sizeKW = parseFloat(systemSize) || 5;
  const sizeLabel = fill(t.sizeLabel, { size: sizeKW });
  const equivalentW = `${sizeKW * 1000} W`;
  // Technical specification rows. Row labels come from the string catalog by
  // index; the values are component brands, models and ratings and stay as-is.
  const specValues: {
    premium: string;
    smart: string;
    basic: string;
  }[] = [
    {
      premium: "Emmvee / Renewsys/ Adani/Equivalent",
      smart: "Emmvee / Renewsys/ Adani/Equivalent",
      basic: "Renew /Premier / Equivalent",
    },
    {
      premium: "TopCon Bifacial Glass to Glass ( 550-630W)",
      smart: "TopCon Bifacial Glass to Glass ( 550-630W)",
      basic: "Mono PERC Bifacial Halfcut (530–560W)",
    },
    {
      premium: "12-Year Product & 30 Year Performance Warranty",
      smart: "12-Year Product & 25-30 Year Performance Warranty",
      basic: "12-Year Product & 30 Year Performance Warranty",
    },
    {
      premium: "Micro Inverter (Single Phase)",
      smart: "String Inverter (Single Phase)",
      basic: "String Inverter (Single Phase)",
    },
    {
      premium: "Enphase / Hoymiles (15 Years)",
      smart: "Sungrow / Solis / Equivalent (8 Years)",
      basic: "Premier / Deye / Equivalent (7 Years)",
    },
    {
      premium: "GI Structure for Flat Roof - Apollo",
      smart: "GI Structure for Flat Roof - Apollo",
      basic: "GP Structure for Flat Roof - Apollo",
    },
    {
      premium: "ABB MCB, Citel SPD (Single Phase)",
      smart: "ETN MCB, Mersen SPD (Single Phase)",
      basic: "Havells",
    },
    {
      premium: "4 (Polycab / Equivalent)",
      smart: "4 (Polycab / Equivalent)",
      basic: "4 (Wacab / Equivalent)",
    },
    {
      premium: "4 sqmm (RR / Finolex)",
      smart: "4 sqmm (RR / Finolex)",
      basic: "4 sqmm (Flexolite)",
    },
    {
      premium: "10 SWG (20m)",
      smart: "10 SWG (20m)",
      basic: "10 SWG (20m)",
    },
    {
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
          <span className="font-bold text-[#123532]">{t.titleBold}</span>
          {t.titleSuffix && (
            <span className="text-[#1a1a1a]">
              {" "}
              {fill(t.titleSuffix, { watts: equivalentW })}
            </span>
          )}
        </h1>
        <p className="text-[12px] text-gray-600">{t.subtitle}</p>
      </div>

      {/* Specification Table */}
      <div className="mx-2 rounded-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-[13px] font-bold text-[#1a1a1a]">
              {t.itemsHeader}
            </span>
          </div>
          <div className="px-2 py-2 border-l border-gray-100">
            <p className="text-[13px] font-bold text-[#1a1a1a] leading-tight">
              {t.premiumName}
            </p>
            <p className="text-[9px] text-gray-500">{sizeLabel}</p>
          </div>
          <div className="px-2 py-2 border-l border-gray-100 bg-[#FFF7ED]">
            <p className="text-[13px] font-bold text-[#F88A22] leading-tight">
              {t.smartName}
            </p>
            <p className="text-[9px] text-gray-500">{sizeLabel}</p>
          </div>
          <div className="px-2 py-2 border-l border-gray-100">
            <p className="text-[13px] font-bold text-[#1a1a1a] leading-tight">
              {t.basicName}
            </p>
            <p className="text-[9px] text-gray-500">{sizeLabel}</p>
          </div>
        </div>

        {/* Spec rows */}
        {specValues.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 items-stretch"
          >
            <div className="px-3 py-2 flex items-center">
              <span className="text-[13px] text-[#1a1a1a] leading-snug">
                {t.specLabels[idx]}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[13px] text-[#1a1a1a] leading-snug">
                {row.premium}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200 bg-[#FFF7ED]">
              <span className="text-[13px] text-[#1a1a1a] leading-snug">
                {row.smart}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[13px] text-[#1a1a1a] leading-snug">
                {row.basic}
              </span>
            </div>
          </div>
        ))}

        {/* Total System Cost — without a subsidy this equals the final cost
            below, so only the highlighted row is kept */}
        {hasSubsidy && (
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-300 bg-[#F4F4F6] items-stretch">
            <div className="px-3 py-2 flex items-center">
              <span className="text-[14px] font-bold text-[#1a1a1a]">
                {t.totalSystemCost}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[14px] font-bold text-[#1a1a1a]">
                {fmt(premiumTotal)}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200 bg-[#FFF7ED]">
              <span className="text-[14px] font-bold text-[#1a1a1a]">
                {fmt(smartTotal)}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[14px] font-bold text-[#1a1a1a]">
                {fmt(basicTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Subsidy Amount — dropped entirely for a Non-DCR customer */}
        {hasSubsidy && (
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 bg-[#F4F4F6] items-stretch">
            <div className="px-3 py-2 flex items-center">
              <span className="text-[14px] font-bold text-[#1a1a1a]">
                {t.subsidyAmount}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[14px] font-bold text-[#16a34a]">
                {fmt(subsidy)}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200 bg-[#FFF7ED]">
              <span className="text-[14px] font-bold text-[#16a34a]">
                {fmt(subsidy)}
              </span>
            </div>
            <div className="px-2 py-2 flex items-center border-l border-gray-200">
              <span className="text-[14px] font-bold text-[#16a34a]">
                {fmt(subsidy)}
              </span>
            </div>
          </div>
        )}

        {/* Final cost the customer pays */}
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-t border-gray-200 bg-[#16a34a] items-stretch">
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-[14px] font-bold text-white leading-tight">
              {hasSubsidy ? t.totalAfterSubsidy : t.totalSystemCost}
            </span>
          </div>
          <div className="px-2 py-2.5 flex items-center border-l border-[#2fb35d]">
            <span className="text-[14px] font-bold text-white">
              {fmt(premiumFinal)}
            </span>
          </div>
          <div className="px-2 py-2.5 flex items-center border-l border-[#2fb35d]">
            <span className="text-[14px] font-bold text-white">
              {fmt(smartFinal)}
            </span>
          </div>
          <div className="px-2 py-2.5 flex items-center border-l border-[#2fb35d]">
            <span className="text-[14px] font-bold text-white">
              {fmt(basicFinal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
