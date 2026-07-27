"use client";

import { useQuotationStrings } from "./i18n/QuotationLanguageContext";

export default function Page9Content() {
  const { page9: t } = useQuotationStrings();

  const steps = t.steps;
  const weHandle = t.weHandle;
  const youNeedToDo = t.youNeedToDo;

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-[28px] font-semibold">
          <span className="text-[#F88A22]">{t.titlePart1}</span>
          <span className="text-[#123532]">{t.titlePart2}</span>
        </h1>
      </div>

      {/* Horizontal Timeline */}
      <div className="relative mx-4 mb-8">
        {/* Connecting dotted line */}
        <div
          className="absolute left-[8%] right-[8%] top-[22px] border-t-2 border-dotted border-gray-300"
          style={{ zIndex: 0 }}
        />

        <div className="grid grid-cols-6 gap-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Day circle */}
              <div className="relative z-10 flex-shrink-0 w-[44px] h-[44px] rounded-full bg-[#123532] flex flex-col items-center justify-center mb-4">
                <span className="text-white text-[12px] font-bold leading-none">
                  {step.day}
                </span>
                <span className="text-white text-[5.5px] font-semibold tracking-widest uppercase mt-[2px]">
                  {t.daysLabel}
                </span>
              </div>

              {/* Content */}
              <div className="text-left w-full">
                <h3 className="text-[10px] font-bold text-[#1a1a1a] mb-1.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[8.5px] text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund from KSEB box */}
      <div className="mx-4 mb-6 border-l-3 border-l-[#F88A22] px-5 py-3">
        <h4 className="text-[12px] font-bold text-[#1a1a1a] tracking-wide mb-1 uppercase">
          {t.refundTitle}
        </h4>
        <p className="text-[9.5px] text-gray-600 mb-1.5">{t.refundNote}</p>
        <p className="text-[11px] font-bold text-[#1a1a1a]">{t.refundValue}</p>
      </div>

      {/* Bottom Two Columns */}
      <div className="mx-4 grid grid-cols-2 gap-3 mb-2">
        {/* What We Handle */}
        <div className="rounded-lg p-4 bg-[#FEF3E8]">
          <h4 className="text-[11px] font-bold text-[#1a1a1a] tracking-wide mb-3 uppercase">
            {t.whatWeHandle}
          </h4>
          <ul className="space-y-2.5">
            {weHandle.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-[12px] h-[12px] rounded-full bg-[#F88A22] flex items-center justify-center mt-[2px]">
                  <svg
                    className="w-[7px] h-[7px] text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-[9.5px] text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You Need To Do */}
        <div className="rounded-lg p-4 bg-[#16A34A1A]">
          <h4 className="text-[11px] font-bold text-[#1a1a1a] tracking-wide mb-3 uppercase">
            {t.whatYouNeedToDo}
          </h4>
          <ul className="space-y-2.5">
            {youNeedToDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-[12px] h-[12px] rounded-full border-[3px] border-[#F88A22] mt-[2px]" />
                <span className="text-[9.5px] text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
