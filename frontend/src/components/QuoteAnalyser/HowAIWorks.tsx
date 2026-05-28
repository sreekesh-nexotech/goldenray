"use client";

import React, { useState } from "react";
import Image from "next/image";

const steps = [
  {
    icon: "/ep_upload-filled.png",
    title: "Upload Quote",
    description:
      "Simply upload a PDF or photo of your solar quote. No complex forms needed.",
  },
  {
    icon: "/div (6).png",
    title: "AI Expert Analysis",
    description:
      "Our AI cross-references your quote with live Kerala market data and brand ratings.",
  },
  {
    icon: "/div (7).png",
    title: "Get Instant Report",
    description:
      "Receive a detailed breakdown of pricing, brands, and potential red flags in seconds.",
  },
];

const HowAIWorks = () => {
  const [hoveredCard, setHoveredCard] = useState<number>(1);

  return (
    <section
      className="relative py-12 sm:py-16 md:py-20"
      style={{
        background: "linear-gradient(0deg, #FFFFFF 0%, #F8F2E1 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            How the AI Works
          </h2>
          <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563] max-w-2xl mx-auto">
            Advanced technology meets local expertise to give you the most accurate solar analysis in Kerala.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(1)}
              className={`relative flex flex-col items-center text-center px-6 py-8 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer ${
                hoveredCard === index
                  ? "bg-white shadow-xl transform -translate-y-2"
                  : "bg-transparent"
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#074A4D] flex items-center justify-center mb-5">
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={36}
                  height={36}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#074A4D] mb-3">
                {step.title}
              </h3>
              <p className="text-sm md:text-base font-normal leading-relaxed text-[#4B5563] max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowAIWorks;
