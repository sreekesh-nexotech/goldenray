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
      "The best panel depends on your roof space, budget, and energy needs. For Kerala, prioritize panels with a low temperature coefficient (below -0.35%/°C), IP68-rated junction boxes for humidity resistance, and proven tropical degradation rates. N-type TOPCon panels from Adani and Saatvik currently score highest in our Kerala Climate Rating due to superior heat tolerance and lower degradation. Waaree and Vikram Solar's bifacial models are also strong contenders with proven Kerala track records.",
  },
  {
    question:
      "How important is temperature coefficient for solar panels in Kerala?",
    answer:
      "Very important. Kerala regularly sees ambient temps above 35°C, pushing panel surfaces to 55-65°C. A panel rated -0.30%/°C loses about 12% output at 65°C, while one at -0.40%/°C loses about 16%. That 4% daily difference over 25 years compounds to a significant gap in total generation and returns on your investment.",
  },
  {
    question: "Does high humidity affect solar panel performance?",
    answer:
      "Yes. Kerala's humidity (often above 80%) accelerates potential-induced degradation (PID), corrodes poorly sealed junction boxes, and causes micro-cracks in lower-quality cells. Panels with IP68-rated junction boxes, anti-PID certification, and tropical-grade encapsulants perform significantly better over their 25-year lifespan. This is why we weight humidity resistance heavily in our Kerala Climate Score.",
  },
  {
    question: "What does a 25-year solar panel warranty actually cover?",
    answer:
      "Most panels have two separate warranties. The product warranty (typically 12 years) covers manufacturing defects — cell cracking, delamination, junction box failure. The performance warranty (25-30 years) guarantees minimum output, usually 80-87% at term end. In Kerala, the product warranty matters more because humidity and heat stress-test build quality early. Always confirm the warranty is manufacturer-backed, not just installer-backed.",
  },
  {
    question: "How many solar panels do I need for my home in Kerala?",
    answer:
      "Divide your monthly KSEB bill by ₹1,000 for approximate system size in kW. A 3kW system needs 5-6 panels (550W each) for bills up to ₹3,000/month. A 5kW system needs 9-10 panels for bills up to ₹5,000/month. Your actual requirement depends on roof direction, shading, and whether you plan to add high-consumption appliances like an EV charger in the coming years. A site visit gives the most accurate number.",
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
