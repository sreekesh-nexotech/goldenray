"use client";

import { useState } from "react";

// Questions live in @/data/solar-comparison-faq so this accordion and the
// FAQPage structured data on /solar-comparison and /comparison-table stay
// word-for-word identical.
import { solarComparisonFaqs as faqs } from "@/data/solar-comparison-faq";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-4xl sm:text-3xl xl:text-5xl 2xl:text-6xl font-semibold text-[#123532] leading-tight mb-4 sm:mb-5 md:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#444444] leading-relaxed">
              Straight answers to the questions Kerala homeowners ask most.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl p-5 sm:p-7 md:p-7 bg-[#F6F2EF]">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-[#C8C3BE] last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-5 sm:py-5 text-left"
                    aria-label="toggle FAQ answer"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font text-[#3D3D3D] pr-4 leading-snug">
                      {faq.question}
                    </h3>
                    <span
                      className={`text-3xl sm:text-4xl font-light text-black leading-none transition-transform duration-300 ${
                        openIndex === index ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="pb-5 sm:pb-6">
                      <p className="text-sm sm:text-base md:text-lg text-[#444444] leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
