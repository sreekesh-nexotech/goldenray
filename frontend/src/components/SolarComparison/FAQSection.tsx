"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the best solar panel for Kerala's climate?",
    answer:
      "Monocrystalline panels with strong humidity resistance, low temperature coefficient (around -0.30%/°C or better), and long product warranty usually perform best in Kerala. Focus on certified panels from brands with solid local service support.",
  },
  {
    question:
      "How important is temperature coefficient for solar panels in Kerala?",
    answer:
      "It is very important. Kerala's warm climate can reduce panel output at higher temperatures, so panels with lower temperature coefficient lose less efficiency during peak heat and deliver more stable yearly generation.",
  },
  {
    question: "Does high humidity affect solar panel performance?",
    answer:
      "Yes, high humidity can affect long-term durability if panel build quality is poor. That is why corrosion resistance, quality encapsulation, and proper installation standards are critical for reliable performance in Kerala.",
  },
  {
    question: "What does a 25-year solar panel warranty actually cover?",
    answer:
      "Most 25-year warranties are performance warranties, which guarantee minimum power output over time. Product warranty is separate and usually covers manufacturing defects for 10-15 years depending on the panel brand.",
  },
  {
    question: "How many solar panels do I need for my home in Kerala?",
    answer:
      "It depends on your monthly usage, roof area, and sunlight exposure. As a quick estimate, most homes need around 6-12 panels for a 3-5 kW system, but a proper site assessment gives the most accurate number.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-white">
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
