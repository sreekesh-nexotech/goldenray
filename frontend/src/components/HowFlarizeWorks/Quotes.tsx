"use client";

import { Check } from "lucide-react";
import React, { useState } from "react";

const QUOTES = [
  {
    label: "Base",
    price: "₹1.30 – 1.50 lakh",
    tag: "Best Price",
    tagClass: "bg-[#EEF2FF] text-[#2563EB]",
    border: "border-[#E5E5E5]",
    system: "3kW On-Grid",
    panels: "Adani Solar",
    inverter: "Growatt",
    structure: "GP Structure",
    features: ["Full Flarize guarantee", "Same installation quality"],
  },
  {
    label: "Value",
    price: "₹1.50 – 2 lakh",
    tag: "Most Popular",
    tagClass: "bg-[#16A34A] text-white",
    centered: true,
    border: "border-[#074A4D]",
    system: "3kW On-Grid",
    panels: "Waaree HJT",
    inverter: "Sungrow",
    structure: "GI Structure",
    features: ["Full Flarize guarantee", "Best monsoon performance"],
  },
  {
    label: "Premium",
    price: "₹2 – 3 lakh",
    tag: "Best Performance",
    tagClass: "bg-[#FEF3C7] text-[#B45309]",
    border: "border-[#E5E5E5]",
    system: "3kW On-Grid",
    panels: "Waaree HJT",
    inverter: "Enphase",
    structure: "GI Structure",
    features: ["Full Flarize guarantee", "30-year performance warranty"],
  },
];

const Quotes = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          What your 3 quotes look like
        </h2>
        <p className="hidden sm:block text-base md:text-lg font-normal md:font-normal leading-snug text-[#4B5563]">
          Same system size. Same Flarize quality guarantee. Different brands and
          budgets — you choose.
        </p>
      </div>

      {/* Quotes Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUOTES.map((q, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(1)}
              className={`relative bg-white rounded-xl p-6 flex flex-col gap-2 border-2 transition-all ${
                isActive ? "border-[#074A4D] shadow-lg scale-[1.02]" : q.border
              }`}
            >
              {q.centered && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 ${q.tagClass} text-xs md:text-base font-light leading-normal px-3 py-1 rounded-xl whitespace-nowrap`}
                >
                  {q.tag}
                </span>
              )}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div
                  className={`text-base md:text-xl font-normal md:font-normal leading-snug text-[#525252] ${
                    q.centered ? "mt-2 md:mt-0" : ""
                  }`}
                >
                  {q.label}
                </div>
                {!q.centered && (
                  <span
                    className={`${q.tagClass} text-xs md:text-sm font-medium leading-normal px-3 py-1 rounded-lg whitespace-nowrap`}
                  >
                    {q.tag}
                  </span>
                )}
              </div>
              <div className="flex md:flex-col items-center md:items-start justify-between">
                <div className="text-xl md:text-2xl font-semibold leading-snug flex items-center  gap-2 text-[#059669] mb-1">
                  {q.price} <span className="text-sm md:text-base font-normal leading-normal text-[#757575]">(After Subsidy)</span>
                </div>
                <div className="text-sm md:text-lg font-normal leading-relaxed text-[#525252] mb-2">
                  {q.system}
                </div>
              </div>
              <hr className="border-b-0 border-[#C3C1C1B2]" />
              <div className="text-sm md:text-lg font-normal leading-relaxed text-[#757575] mb-1">
                Panels:{" "}
                <span className="font-semibold text-[#444444]">{q.panels}</span>
              </div>
              <div className="text-sm md:text-lg font-normal leading-relaxed text-[#757575] mb-1">
                Inverter:{" "}
                <span className="font-semibold text-[#444444]">
                  {q.inverter}
                </span>
              </div>
              <div className="text-sm md:text-lg font-normal leading-relaxed text-[#757575] mb-2">
                Structure:{" "}
                <span className="font-semibold text-[#444444]">
                  {q.structure}
                </span>
              </div>
              <ul className="text-sm md:text-lg font-normal leading-relaxed text-[#074A4D] space-y-1 mt-2">
                {q.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Quotes;
