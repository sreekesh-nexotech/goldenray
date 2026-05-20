"use client";
import { useState } from "react";

export default function FourSteps() {
  const [hoveredCard, setHoveredCard] = useState<number>(1); 

  const steps = [
    {
      number: "01",
      title: "Calculate Your EMI",
      description:
        "Use the calculator above. Know your exact EMI, break-even date, and best bank match. No personal details needed yet.",
      badge: "30 seconds",
    },
    {
      number: "02",
      title: "Free Site Survey",
      description:
        "Our engineer visits your home. Roof assessment, shadow analysis, system design. Zero cost. Zero obligation. Written quote guaranteed.",
      badge: "Same or next day",
    },
    {
      number: "03",
      title: "Loan + Subsidy Filed Together",
      description:
        "We submit your SBI loan and PM Surya Ghar subsidy simultaneously — saving 2–3 weeks vs applying separately. We handle every document.",
      badge: "3–7 days approval",
    },
    {
      number: "04",
      title: "Install, Activate, Save",
      description:
        "Certified team installs your system. We handle KSEB net metering approval. Your meter runs backward. Savings start day one.",
      badge: "2–6 days install",
    },
  ];

  return (
    <section
      id="working"
      className="scroll-mt-10 relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24"
      style={{
        background:
          "radial-gradient(114.71% 114.71% at 50% 0%, #F8F2E1 0%, #FFFFFF 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-2 space-y-15">
        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          From This Page to Free Electricity — 4 Steps
        </h2>
        <p className="text-center hidden sm:block text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          Not just a solar company. Your solar partner. We handle the loan, the subsidy, the KSEB approval — you handle the lifestyle upgrade.
        </p>

        {/* Three Column Grid */}
        <div className="w-full max-w-7xl flex overflow-x-auto gap-4 lg:grid  lg:grid-cols-4 md:gap-6 no-scrollbar ">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(1)}
              className={`relative  text-start flex flex-col items-start p-4 mt-8 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer min-w-[75vw] max-w-[75vw] lg:min-w-0 lg:max-w-none  ${
                hoveredCard === index
                  ? "bg-white shadow-lg transform -translate-y-5"
                  : "bg-transparent"
              }`}
            >
              {/* Number */}
              <div className="text-[#123532] text-xl md:text-2xl font-semibold leading-snug mb-4 sm:mb-5">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-[#123532] text-xl md:text-2xl font-semibold leading-snug mb-3 sm:mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#525252] text-xs md:text-base font-normal leading-normal mb-4 sm:mb-5 md:mb-6">
                {step.description}
              </p>

              {/* Badge */}
              <div className="inline-block text-[#074A4D] text-xs md:text-base font-medium leading-normal ">
                {step.badge}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
