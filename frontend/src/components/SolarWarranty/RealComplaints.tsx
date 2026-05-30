"use client";

import React, { useState } from "react";

const complaints = [
  {
    tag: "CONCERN #1 — INSTALLER ACCOUNTABILITY",
    quote:
      "My installer stopped answering calls three months after installation. Phone switched off. No service for over eight months.",
    source: "— Real complaint, Ernakulam",
    problemTitle: "THE PROBLEM",
    problem:
      "Most solar companies in Kerala subcontract installations to third-party teams. Once the project payment clears, the incentive to support you long-term disappears. Your warranty becomes worthless if the company folds or exits the market.",
    solutionTitle: "THE SOLUTION",
    solution:
      "Your solar service contract is with Flarize directly — not with an individual installer or subcontractor. Even if a field partner leaves our network, your 25-year service obligation continues unchanged. We maintain digital records of your installation, system specs, and full service history so MyFlarize.com.",
  },
  {
    tag: "CONCERN #2 — LOW GENERATION",
    quote:
      "My 3kW system is producing only 12 units per day in peak summer. The company says no one else is complaining.",
    source: "— Real complaint, Thrissur",
  },
  {
    tag: "CONCERN #3 — WARRANTY CLAIM REJECTION",
    quote:
      "The inverter failed in Year 4. The manufacturer said the warranty is voided because there are no documented maintenance records.",
    source: "— Real complaint, Kozhikode",
  },
];

const RealComplaints = () => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Real Complaints. Honest Answers.
          </h2>
          <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563] max-w-full md:max-w-4xl mx-auto">
            These aren&apos;t hypothetical questions. Every concern below comes
            directly from Kerala&apos;s largest solar community — 500+ members
            sharing real post-install experiences.
          </p>
        </div>

        <div className="space-y-4">
          {complaints.map((c, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={c.tag}
                className="rounded-2xl bg-[#F6F2EF] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full px-5 sm:px-6 py-5 sm:py-6 text-left flex items-start gap-4 cursor-pointer"
                  aria-label="toggle concern"
                >
                  <div className="flex-1">
                    <p className="text-xs tracking-widest font-semibold text-[#6B7280] mb-3">
                      {c.tag}
                    </p>
                    <div className="flex items-start gap-3">
                      <span
                        className="text-xl leading-none shrink-0"
                        aria-hidden="true"
                      >
                        🗣️
                      </span>
                      <p className="text-sm md:text-base font-medium text-[#111827] leading-snug">
                        &ldquo;{c.quote}&rdquo;{" "}
                        <span className="text-[#111827] font-normal">
                          {c.source}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-2xl text-[#111827] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ⌃
                  </span>
                </button>

                {isOpen && c.problem && c.solution && (
                  <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="rounded-xl border border-[#E7DDD4] bg-[#F6F2EF] p-5 sm:p-6">
                      <p className="text-xs tracking-widest font-semibold text-[#DC2626] mb-3">
                        {c.problemTitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[#DC2626] leading-relaxed">
                        {c.problem}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#E7DDD4] bg-[#F6F2EF] p-5 sm:p-6">
                      <p className="text-xs tracking-widest font-semibold text-[#16A34A] mb-3">
                        {c.solutionTitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[#16A34A] leading-relaxed">
                        {c.solution}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RealComplaints;
