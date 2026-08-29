"use client";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import React from "react";

const otherPrograms: string[] = [
  "Paid per lead or per form fill",
  "Multiple vendors, no clear owner",
  "No after-sales — gone at handover",
  "You chase the updates and the payout",
  "High-commission promises — your name on the line",
];

const flarize: string[] = [
  "Paid on completed installations",
  "One accountable team, end to end",
  "Long-term support after install",
  "Live tracking — never chase anyone",
  "Reputation protection first, commission second",
];

const PartnersChooseFlarize = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-4">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Why Referral Partners Choose Flarize
        </h2>
        <p className="text-sm md:text-lg font-normal leading-relaxed text-[#4B5563]">
          Not because the commission is the biggest — because your reputation is
          the safest. The commission matters. Your name matters more.
        </p>
      </div>

      {/* Comparison cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {/* Other Programs */}
        <div className="bg-[#F3F3F3] rounded-3xl p-6 md:p-8 flex flex-col gap-5">
          <AlertTriangle className="w-10 h-10 text-[#F2B705] fill-[#F2B705] stroke-white" />
          <h3 className="text-xl md:text-2xl font-bold text-[#171717]">
            Other Programs
          </h3>
          <ul className="flex flex-col gap-3">
            {otherPrograms.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#E5484D] shrink-0" />
                <span className="text-base md:text-lg font-normal text-[#171717]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Flarize */}
        <div className="bg-[#0A453D] rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <img
            src="https://golden-ray.b-cdn.net/icons/fevi.png"
            alt="Flarize logo"
            className="w-8 h-8"
          />
          <h3 className="text-xl md:text-2xl font-bold text-white">Flarize</h3>
          <ul className="flex flex-col gap-3">
            {flarize.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#7FD1A0] shrink-0" />
                <span className="text-base md:text-lg font-normal text-white">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PartnersChooseFlarize;
