import React from "react";

const rows = [
  {
    component: "Solar Panels (Tier 1)",
    subtitle: "Monocrystalline / Bifacial",
    standard: "10–12 Years",
    flarize: "25–30 Years Performance",
    saving: "₹1.2L – ₹2.5L",
  },
  {
    component: "Solar Inverter",
    subtitle: "On-grid / Hybrid",
    standard: "5 Years",
    flarize: "10 Years Extended",
    saving: "₹45,000 – ₹85,000",
  },
  {
    component: "Mounting Structure",
    subtitle: "HDGI / Aluminium Rails",
    standard: "1 Year",
    flarize: "10 Years Structural",
    saving: "₹25,000+",
  },
  {
    component: "Workmanship",
    subtitle: "Installation quality",
    standard: "None",
    flarize: "5 Years Guaranteed",
    saving: "₹15,000/visit",
  },
];

const WarrantyGrid = () => {
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
            What&apos;s Covered and for How Long?
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#F0E6C8]">
          {/* Header */}
          <div className="hidden md:grid grid-cols-4 bg-[#0E3A3A] text-white">
            <div className="px-6 py-4 text-sm font-semibold tracking-wide">
              Component
            </div>
            <div className="px-6 py-4 text-sm font-semibold tracking-wide">
              Standard Warranty
            </div>
            <div className="px-6 py-4 text-sm font-semibold tracking-wide">
              Flarize Protection
            </div>
            <div className="px-6 py-4 text-sm font-semibold tracking-wide">
              Out-Of-Pocket Saving
            </div>
          </div>

          {/* Rows */}
          <div className="bg-[#FBF3E2]">
            {rows.map((row, idx) => (
              <div
                key={row.component}
                className={`grid grid-cols-1 md:grid-cols-4 gap-y-2 md:gap-y-0 px-6 py-5 md:py-7 ${
                  idx < rows.length - 1 ? "border-b border-[#F0E6C8]" : ""
                }`}
              >
                <div>
                  <div className="text-sm md:text-base font-semibold text-[#123532]">
                    {row.component}
                  </div>
                  <div className="text-xs md:text-sm text-[#6B7280] mt-0.5">
                    {row.subtitle}
                  </div>
                </div>
                <div className="text-sm md:text-base font-semibold text-[#111827] md:flex md:items-center">
                  <span className="md:hidden text-xs text-[#6B7280] mr-2">
                    Standard:
                  </span>
                  {row.standard}
                </div>
                <div className="text-sm md:text-base font-semibold text-[#111827] md:flex md:items-center">
                  <span className="md:hidden text-xs text-[#6B7280] mr-2">
                    Flarize:
                  </span>
                  {row.flarize}
                </div>
                <div className="text-sm md:text-base font-semibold text-[#15803D] md:flex md:items-center">
                  <span className="md:hidden text-xs text-[#6B7280] mr-2">
                    Saving:
                  </span>
                  {row.saving}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-xs sm:text-sm leading-relaxed text-[#4B5563]">
          <span className="font-semibold text-[#FF8A1E]">Important:</span> Flarize
          workmanship warranty covers faults caused by our installation. We assist
          with all manufacturer warranty claims at no extra charge.
        </div>
      </div>
    </section>
  );
};

export default WarrantyGrid;
