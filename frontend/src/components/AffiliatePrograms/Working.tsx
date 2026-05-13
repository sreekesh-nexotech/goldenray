"use client";
import { useState } from "react";

export default function Working() {
  const [hoveredCard, setHoveredCard] = useState<number>(1); // Default to 2nd card (index 1)

  const steps = [
    {
      number: "01",
      title: "Register for Free",
      description:
        "Fill in the online application form. Our partner team reviews your profile and sends confirmation within 24-48 hours. There is no registration fee, no deposit, and no commitment beyond the partner agreement terms",
      badge: "24–48 hour approval",
    },
    {
      number: "02",
      title: "Receive Your Unique Referral Link and Marketing Materials",
      description:
        "Every approved affiliate receives a personalised tracking link and a set of digital marketing materials — WhatsApp messages, social media graphics, and conversation guides tailored for different partner types. Share through any channel: WhatsApp, Instagram, in-person conversations, or your professional email list",
      badge: "Unique tracking link",
    },
    {
      number: "03",
      title: " Earn Commission Within 7-14 Days of Installation",
      description:
        "When a customer you referred completes their solar installation, your commission is credited to your partner account. Payouts follow a monthly cycle. Every credit is traceable in your real-time partner dashboard — no chasing required",
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
        <h2 className="text-center text-3xl xl:text-5xl font-bold text-[#123532] mb-4">
          How the Flarize Solar Affiliate Program Works — 3 Steps
        </h2>
        <p className="text-center hidden sm:block text-[20px] text-[#4B5563]">
            Starting your Kerala solar affiliate journey takes less than five minutes. Once registered you can submit referrals immediately
        </p>

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
              <div className="text-[#123532] text-base sm:text-lg md:text-xl mb-4 sm:mb-5">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-[#123532] font-semibold text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl mb-3 sm:mb-4 leading-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#525252] text-xs sm:text-sm md:text-sm xl:text-base leading-relaxed mb-4 sm:mb-5 md:mb-6">
                {step.description}
              </p>

              {/* Badge */}
              <div className="inline-block px-6 py-1 bg-[#16A34A3D] text-[#15803D] text-xs sm:text-base font-medium rounded-2xl">
                {step.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
