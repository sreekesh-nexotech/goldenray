"use client";
import { useState } from "react";

export default function Working() {
  const [hoveredCard, setHoveredCard] = useState<number>(1); // Default to 2nd card (index 1)

  const steps = [
    {
      number: "1",
      title: "Register for Free",
      description:
        "Fill in the online application form. Our partner team reviews your profile and sends confirmation within 24-48 hours. There is no registration fee, no deposit, and no commitment beyond the partner agreement terms",
      badge: "24–48 hour approval",
    },
    {
      number: "2",
      title: "Receive Your Unique Referral Link and Marketing Materials",
      description:
        "Every approved affiliate receives a personalised tracking link and a set of digital marketing materials — WhatsApp messages, social media graphics, and conversation guides tailored for different partner types. Share through any channel: WhatsApp, Instagram, in-person conversations, or your professional email list",
      badge: "Unique tracking link",
    },
    {
      number: "3",
      title: " Earn Commission Within 7-14 Days of Installation",
      description:
        "When a customer you referred completes their solar installation, your commission is credited to your partner account. Payouts follow a monthly cycle. Every credit is traceable in your real-time partner dashboard — no chasing required",
      badge: "7–14 day credit",
    },
  ];

  return (
    <section
      className="relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24"
      style={{
        background:
          "radial-gradient(114.71% 114.71% at 50% 0%, #F8F2E1 0%, #FFFFFF 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-15">
        {/* Heading */}
        <h2 className="text-center text-3xl xl:text-5xl font-bold text-[#123532] mb-4">
          How the Flarize Solar Affiliate Program Works — 3 Steps
        </h2>
        <p className="text-center hidden sm:block text-[20px] text-[#4B5563]">
            Starting your Kerala solar affiliate journey takes less than five minutes. Once registered you can submit referrals immediately
        </p>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-6 ">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(1)} 
              className={`relative  text-center flex flex-col items-center p-5 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer ${
                hoveredCard === index
                  ? "bg-white shadow-xl"
                  : "bg-transparent"
              }`}
            >
              {/* Number */}
              <div className="text-[#E5E7EB] bg-[#074A4D] rounded-full p-5 w-15 flex items-center justify-center h-15 text-lg sm:text-xl md:text-2xl mb-4 sm:mb-5">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-[#074A4D] font-semibold text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl mb-3 sm:mb-4 leading-tight">
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
