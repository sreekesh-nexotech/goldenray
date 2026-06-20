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
      "It depends on your priorities. For shaded roofs or complex layouts, Enphase microinverters give you the best per-panel optimization. For maximum efficiency, SolarEdge's 99% HD-Wave is unmatched. For the best value-to-quality ratio, Sungrow SG5.0RS offers world-class reliability at mid-range pricing. For budget installs, Growatt delivers strong efficiency at the lowest cost.",
  },
  {
    question: "String inverter vs microinverter — which is better for Kerala?",
    answer:
      "String inverters are more affordable and work well on unshaded, uniform roofs — which covers most Kerala homes. Microinverters are better for partially shaded roofs, multi-directional layouts, or when you want panel-level monitoring. If your roof has no shading issues and faces a consistent direction, a quality string inverter gives you the best ROI.",
  },
  {
    question: "Do I need a hybrid inverter for my Kerala home?",
    answer:
      "Only if you plan to add battery storage within the next 2-3 years. A hybrid inverter like Fronius GEN24 lets you connect a battery later without replacing the inverter. But if you're doing standard grid-tie solar with KSEB net metering — which is what most Kerala homes opt for — a regular string inverter is more cost-effective. Don't pay for hybrid capability you may never use.",
  },
  {
    question: "How does Kerala's climate affect inverter performance?",
    answer:
      "Kerala's high humidity (often above 80%) and ambient temperatures exceeding 35°C stress inverters significantly. Humidity can cause internal corrosion if the IP rating isn't adequate. Heat causes derating — the inverter reduces output to protect itself. Look for IP65+ protection, C5 corrosion rating for coastal areas, and derating curves that maintain full output up to at least 45°C.",
  },
  {
    question: "What inverter size do I need for my home?",
    answer:
      "Your inverter size should match your panel system size. A 3kW panel system needs a 3kW inverter. A 5kW system needs a 5kW inverter. For microinverters, you need one per panel — so a 5kW system with 9 panels needs 9 microinverters. All the 5kW inverters on this page work with systems between 3kW and 7kW depending on DC oversizing capabilities. Your installer will help size it correctly based on your roof and KSEB connection.",
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
