"use client";
import { useState } from "react";

export default function Working() {
  const [hoveredCard, setHoveredCard] = useState<number>(1); // Default to 2nd card (index 1)

  const steps = [
    {
      number: "01",
      title: "Apply for Free",
      description: "Complete the short application and get approved within 24–48 hours. No fees, no deposits, no targets.",
      badge: "24–48 hour approval",
    },
    {
      number: "02",
      title: "Get Your Referral Link & Kit",
      description:"Receive a unique tracking link, ready-to-use content, and a dedicated partner manager for every lead.",
      badge: "Unique tracking link",
    },
    {
      number: "03",
      title: "Earn on Successful Installations",
      description:
        "When your referral installs solar, your fixed commission is credited to your partner account — tracked end to end.",
      badge: "7–14 day credit",
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
          How the Flarize Solar Referral Partner Program Works
        </h2>

        {/* Three Column Grid */}
        <div className="w-full max-w-7xl flex overflow-x-auto gap-4 lg:grid  lg:grid-cols-3 md:gap-6 no-scrollbar ">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(1)}
              className={`relative  text-start flex flex-col items-start p-4 mt-8 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer min-w-[75vw] max-w-[75vw] lg:min-w-0 lg:max-w-none  ${
                hoveredCard === index
                  ? "bg-white shadow-xl transform -translate-y-5"
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
              <p className="text-[#525252] text-xs md:text-base font-light leading-normal mb-4 sm:mb-5 md:mb-6">
                {step.description}
              </p>

              {/* Badge */}
              <div className="inline-block px-6 py-1 bg-[#16A34A3D] text-[#15803D] text-xs md:text-base font-normal leading-normal rounded-2xl">
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
