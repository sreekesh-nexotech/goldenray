import React from "react";

const freeItems = [
  "Any defect caused by our installation (within 5-year workmanship warranty)",
  "Inverter failure within the manufacturer warranty period",
  "Mounting or structural failure within the 10-year structural warranty",
  "Roof leak traced directly to our installation work",
  "Year 1 annual inspection (included with every system)",
  "Any visit where we confirm the fault is ours",
  "Performance shortfall within the Energy Loss Guarantee threshold",
];

const chargeableItems = [
  "Damage from third-party tampering or unauthorized DIY modification",
  "Panel cleaning visits beyond your plan's included frequency",
  "Inverter failure after manufacturer warranty expiry (without extended cover)",
  "Panel damage from bird strikes, debris, or storm impact",
  "Additional site visits beyond your plan's annual allowance",
  "System expansion, new panel additions, or capacity upgrades",
  "All charges are quoted in writing upfront — no surprise invoices, ever.",
];

const FreeVsChargeable = () => {
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
            When Is a Service Visit Free vs. Chargeable?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Free Visit */}
          <div className="rounded-2xl border border-[#BFE5C8] bg-[#EAF7EE] p-6 sm:p-8">
            <p className="text-xs tracking-widest font-semibold text-[#15803D] mb-2">
              FREE VISIT
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#123532] mb-5">
              Zero cost to you
            </h3>
            <ul className="space-y-3">
              {freeItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-xs sm:text-sm text-[#1F2937] leading-relaxed"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 12 5 5L20 7"
                      stroke="#16A34A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chargeable Visit */}
          <div className="rounded-2xl border border-[#F3D4B8] bg-[#DC26261A] p-6 sm:p-8">
            <p className="text-xs tracking-widest font-semibold text-[#FF383C] mb-2">
              CHARGEABLE VISIT
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#DC2626] mb-5">
              When costs apply
            </h3>
            <ul className="space-y-3">
              {chargeableItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-xs sm:text-sm text-[#1F2937] leading-relaxed"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#EA580C"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 7v6"
                      stroke="#EA580C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16.5" r="1" fill="#EA580C" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeVsChargeable;
