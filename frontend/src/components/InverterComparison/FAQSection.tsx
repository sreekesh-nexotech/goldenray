"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the best solar inverter for Kerala?",
    answer:
      "There's no single best inverter — it depends on your roof complexity, budget, and grid reliability. Microinverters (Enphase) win for shaded or complex rooftops; optimized strings (SolarEdge) give panel-level monitoring at lower cost; quality string inverters (Sungrow, Fronius) deliver the best efficiency-per-rupee for clean, unshaded roofs.",
  },
  {
    question: "String Inverter vs microinverter — which is better for Kerala?",
    answer:
      "If your roof has any shading from coconut trees, water tanks, or chimneys, microinverters easily win — each panel works independently so shading on one doesn't drag down the rest. For a clean unshaded roof on a budget, a quality string inverter from Sungrow or Fronius is the smarter pick.",
  },
  {
    question: "Do I need a hybrid inverter for my Kerala home?",
    answer:
      "Only if you plan to add battery storage now or in the next 2-3 years. Hybrid inverters cost ~30-50% more than string inverters. If you don't need backup power and Kerala's net-metering works for you, a plain on-grid string inverter is the more cost-effective choice.",
  },
  {
    question: "How does Kerala's climate affect inverter performance?",
    answer:
      "High humidity and salt air (coastal areas) can corrode internal components, so an IP65+ rating with C5 corrosion protection matters. High ambient temperatures can derate inverter output — look for inverters specced for 60°C operation with active or natural cooling that won't throttle on hot afternoons.",
  },
  {
    question: "What inverter size do I need for my home?",
    answer:
      "Inverter capacity should typically be 80-100% of your panel DC capacity. A 5 kWp panel array pairs well with a 4-5 kW inverter. Going smaller (DC oversizing 110-130%) is common in Kerala because panel output rarely hits nameplate — but check your inverter's max DC input rating before oversizing.",
  },
];

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
