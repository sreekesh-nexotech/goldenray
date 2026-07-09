import React from "react";

const InstallationDifference = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Other companies take weeks. Flarize takes days.
        </h2>
        <p className="hidden sm:block text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          The difference is structural — not just operational. A conventional
          solar company orders materials after each customer confirms, ships
          from a central warehouse, and sends an installation crew from a
          central office. Flarize pre-packs system kits and assigns the nearest
          local installer automatically. You start saving sooner
        </p>
      </div>

      {/* Comparison Chart */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Typical Solar Company */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-base md:text-xl font-normal md:font-semibold leading-snug text-[#111827]">
              Typical Solar Company
            </span>
            <span className="text-base md:text-xl font-normal md:font-semibold leading-snug text-[#DC2626]">
              3–6 Weeks
            </span>
          </div>
          <div className="flex rounded-xl overflow-hidden min-h-12 w-full bg-[#F7F2F2]">
            <div className="flex-1 flex items-center justify-center text-center px-1 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#F7F2F2] ">
              ORDER
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-1 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#DFDADA] ">
              SHIPPING
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-1 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#D2D0D0] ">
              TRAVEL
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-1 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#B2B2B2]">
              INSTALL
            </div>
          </div>
        </div>

        {/* Flarize */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-base md:text-xl font-normal md:font-semibold leading-snug text-[#111827]">
              Flarize
            </span>
            <span className="text-base md:text-xl font-normal md:font-semibold leading-snug text-[#15803D]">
              5–12 Days
            </span>
          </div>
          <div className="flex rounded-xl overflow-hidden min-h-12 w-full">
            <div className="flex-1 flex items-center justify-center text-left sm:text-center px-2 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#FFE5B2]">
              PRE-PACKED SYSTEM
            </div>
            <div className="flex-1 flex items-center justify-center text-left sm:text-center px-2 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#FFDA91]">
              CERTIFIED INSTALLER
            </div>
            <div className="flex-1 flex items-center justify-center text-left sm:text-center px-2 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#FFCA61]">
              QUALITY CHECK
            </div>
            <div className="flex-1 flex items-center justify-center text-left sm:text-center px-2 text-xs md:text-base font-normal leading-tight text-[#222] bg-[#F7BA41]">
              HANDOVER
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstallationDifference;
