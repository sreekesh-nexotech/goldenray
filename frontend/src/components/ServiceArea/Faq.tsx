"use client";
import { useState } from "react";
import { getServiceAreaContent } from "@/data/service-area-content";

// District-specific FAQ accordion for the service-area pages.
export default function Faq({ district }: { district?: string }) {
  const faqs = getServiceAreaContent(district).faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-10 items-start">
          {/* Left: Heading and Description */}
          <div className="lg:pt-6">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
              Have any questions?
            </h2>
            <p className="text-base md:text-lg font-normal leading-relaxed text-[#444444] max-w-md">
              Everything you need to know about going solar in {district ?? "Kerala"}
              — no obligations, just savings!
            </p>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="w-full p-6 md:p-8 rounded-3xl bg-[#F6F2EF]">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-[#E2DDD8] last:border-b-0"
              >
                <button
                  className="flex justify-between items-center gap-4 w-full text-left py-5 focus:outline-none cursor-pointer"
                  onClick={() => toggleFaq(index)}
                  aria-label="toggle FAQ answer"
                >
                  <span className="text-base md:text-xl font-normal leading-snug text-[#2D3B39]">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 text-2xl font-light text-[#2D3B39] transition-transform duration-300 ${
                      openIndex === index ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100 pb-5"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base font-normal leading-relaxed text-[#555555] pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
