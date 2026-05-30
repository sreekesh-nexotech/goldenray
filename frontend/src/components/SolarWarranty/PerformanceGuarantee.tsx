"use client";

import React, { useState } from "react";

const steps = [
  {
    number: "01",
    title: "System Monitors Generation Daily",
    description:
      "We track your system's actual output against its site-specific modeled figure every billing cycle, using your inverter's cloud monitoring portal. No manual reporting is needed. You see live, transparent performance data inside your customer portal.",
  },
  {
    number: "02",
    title: "Alert Triggered at 8% Gap",
    description:
      "If actual generation falls more than 8% below the expected output for your system size, roof orientation, and Kerala location, our platform flags it automatically. You do not need to notice the shortfall before we act.",
  },
  {
    number: "03",
    title: "If Unresolved, You Get Paid",
    description:
      "Every unit lost beyond the service resolution window is compensated at current KSEB retail rates. In writing. No disputes, no delays, no rate confusion. The Energy Loss Guarantee is built into every Flarize installation and applied through a documented payout process.",
  },
];

const PerformanceGuarantee = () => {
  const [activeIdx, setActiveIdx] = useState<number>(1);

  return (
    <section
      className="relative py-12 sm:py-16 md:py-20"
      style={{
        background: "linear-gradient(0deg, #FFFFFF 0%, #F8F2E1 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            How Our Performance Guarantee Actually Works
          </h2>
          <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563] max-w-full md:max-w-4xl mx-auto">
            If your solar system underperforms its guaranteed baseline output
            due to a covered fault — and we cannot resolve it within our service
            window — you receive cash compensation for every unit lost. Here is
            the exact process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(1)}
              className={`rounded-2xl px-6 py-7 transition-all duration-300 cursor-pointer ${
                activeIdx === idx
                  ? "bg-white shadow-xl -translate-y-1"
                  : "bg-transparent"
              }`}
            >
              <div className="text-sm font-semibold text-[#9CA3AF] mb-3">
                {step.number}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#123532] leading-snug mb-3">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceGuarantee;
