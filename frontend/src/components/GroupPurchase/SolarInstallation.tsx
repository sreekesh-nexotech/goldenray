"use client";
import { useState } from "react";

export default function SolarInstallation() {
  const [hoveredCard, setHoveredCard] = useState<number>(1); // Default to 2nd card (index 1)

  const steps = [
    {
      number: "01",
      title: "Book with ₹1,000 (fully refundable)",
      description:
        "Reserve your spot in this month's group solar purchase. Takes 2 minutes online.",
      badge: "Fully Refundable",
    },
    {
      number: "02",
      title: "We match your home with nearby families",
      description:
        "Flarize finds 9 other families in your pincode area. No coordination needed from your side.",
      badge: "Groups form in 10-15 days",
    },
    {
      number: "03",
      title: "Group forms - ₹10,000 off. No group? Same price.",
      description:
        "Bulk installation reduces costs. Everyone gets the group discount. KSEB applications filed as a batch.",
      badge: "₹10,000 savings locked",
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-center mb-3 sm:mb-4">
          How Group Solar Installation Works in Kerala
        </h2>

        {/* Subtitle */}
        <p className="text-[#6B7280] text-sm sm:text-base md:text-base lg:text-lg xl:text-lg text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
          If the group doesn&apos;t form, your price stays locked.
        </p>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-6 lg:gap-8 xl:gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(1)} // Reset to 2nd card
              className={`relative p-6 sm:p-7 md:p-8 lg:p-8 xl:p-9 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer ${
                hoveredCard === index
                  ? "bg-white shadow-xl scale-100 md:scale-105"
                  : "bg-transparent"
              }`}
            >
              {/* Number */}
              <div className="text-[#123532] font-semibold text-lg sm:text-xl md:text-xl mb-4 sm:mb-5">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-[#123532] font-semibold text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl mb-3 sm:mb-4 leading-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#6B7280] text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base leading-relaxed mb-4 sm:mb-5 md:mb-6">
                {step.description}
              </p>

              {/* Badge */}
              <div className="inline-block px-4 py-2 bg-[#D1FAE5] text-[#065F46] text-xs sm:text-sm font-medium rounded-lg">
                {step.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
