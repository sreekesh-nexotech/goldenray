import React from "react";

const QuotePreview = () => {
  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: text + callouts */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#123532] mb-5 tracking-tight">
            See exactly what you&apos;re getting into
          </h2>
          <p className="text-sm md:text-lg font-normal leading-relaxed text-[#4B5563] max-w-lg mb-8">
            We don&apos;t just give you a price check. We analyze the technical compatibility of your inverter, the authenticity of panels, and the structural integrity of your mounting.
          </p>

          {/* Red Flags */}
          <div className="bg-[#F8F2E1]/60 border border-[#F0E6C8] rounded-xl p-4 sm:p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 3 2 21h20L12 3Z"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10v5"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="18" r="1" fill="#DC2626" />
                </svg>
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold text-[#123532] mb-1">
                  Red Flags Detected
                </p>
                <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed">
                  Missing DC surge protection, Non-AL structure specified.
                </p>
              </div>
            </div>
          </div>

          {/* Good Signs */}
          <div className="bg-[#F8F2E1]/60 border border-[#F0E6C8] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#16A34A"
                    strokeWidth="2"
                  />
                  <path
                    d="m8 12 3 3 5-6"
                    stroke="#16A34A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold text-[#123532] mb-1">
                  Good Signs
                </p>
                <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed">
                  Tier-1 Waaree panels, 25-year performance warranty.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: scorecard */}
        <div className="relative">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header row */}
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs sm:text-sm font-semibold text-[#6B7280] tracking-widest uppercase">
                Quote Score
              </p>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#F8F2E1] text-[#123532] text-xs font-bold tracking-wide uppercase">
                Fair Deal
              </span>
            </div>

            {/* Score */}
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-5xl sm:text-6xl font-bold text-[#123532] leading-none">
                6.5
              </span>
              <span className="text-xl sm:text-2xl text-[#9CA3AF] font-medium">
                /10
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 sm:h-2.5 rounded-full bg-[#F1F1F1] overflow-hidden mb-6">
              <div
                className="h-full rounded-full bg-[#F7BA41]"
                style={{ width: "65%" }}
              />
            </div>

            {/* AI Advice card */}
            <div className="bg-[#FBF6E6] border border-[#F0E6C8] rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect
                    x="4"
                    y="7"
                    width="16"
                    height="13"
                    rx="3"
                    stroke="#074A4D"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 3v4"
                    stroke="#074A4D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="13" r="1.2" fill="#074A4D" />
                  <circle cx="15" cy="13" r="1.2" fill="#074A4D" />
                  <path
                    d="M2 13v3M22 13v3"
                    stroke="#074A4D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-sm sm:text-base font-semibold text-[#123532]">
                  AI Solar Expert Advice
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                &ldquo;This quote uses premium panels but cuts costs on safety components. Ask the installer to include Type II DC SPD and earthing strips for a more reliable setup in Kerala&apos;s monsoon weather.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotePreview;
