"use client";
import React, { useState } from "react";

// FAQ section for the Warranty & Service page
export default function WarrantyFaq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "What is PM Surya Ghar subsidy? How much can I get?",
      answer:
        "PM Surya Ghar gives ₹78,000 subsidy for 3kW residential systems in Kerala (₹26,000/kW). Flarize handles full documentation & KSEB approval. Net cost: ₹78,000–₹1,27,000 (after subsidy). Eligibility: own home roof, KSEB connection.",
    },
    {
      question: 'What exactly is included in the "Full Flarize Guarantee"?',
      answer:
        "Covers: installation quality defects (5yr), panel performance (25yr on some), inverter warranty (5–10yr per brand), and Energy Loss Guarantee — if system down >3 days, Flarize pays for lost generation. Post-install: WhatsApp support + 3-layer technician backup.",
    },
    {
      question: "What does a Solar Care Plan cost? What's included?",
      answer:
        "Optional paid plans (price not listed, call for quote). Covers: bi-annual cleaning, health checkups, pest/rodent inspections, priority technician dispatch, performance reporting. Prevents 10–15% efficiency loss from dust/debris.",
    },
    {
      question: "How much will I save per year? When is payback?",
      answer:
        "Depends on system size & roof space. Example 3kW system: saves ₹12,000–₹18,000/yr (₹1,000–₹1,500/month). Payback: 6–8 years (after subsidy). Then 17+ years of near-free power. Use free estimate calculator on site.",
    },
    {
      question: "Does Flarize get KSEB approval or do I do it?",
      answer:
        "Flarize handles 100% — application, inspection coordination, net metering approval. You sign an approval letter only. Flarize tracks status & pushes KSEB (typically 15–30 days post-install).",
    },
    {
      question: "What if my electricity consumption is very low?",
      answer:
        "System undersized. Flarize analyzes your bill (Step 1) and avoids over-sizing. If consumption <100 kWh/month, 1–1.5kW system is better. Subsidy applies to 1kW too (₹26,000). Discuss in free site visit.",
    },
    {
      question: "Can I upgrade the system size after 1 year?",
      answer:
        "Yes. Add panels/inverter capacity. But KSEB needs new net metering (15–30 day wait). Cost varies. Contact Flarize service team post-install.",
    },
  ];

  // Function to toggle the open state of an FAQ item
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-10 items-start">
          {/* Left: Heading and Description */}
          <div className="lg:pt-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#123532] mb-4">
              Have any questions?
            </h2>
            <p className="text-base md:text-lg font-normal leading-relaxed text-[#444444] max-w-md">
              Everything you need to know about warranty, service, and savings
              with Flarize.
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
