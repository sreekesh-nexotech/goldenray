"use client";
import React, { useState } from "react";

// FAQ section for the EMI Calculator page
export default function EmiFaq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "How does the PM Surya Ghar subsidy reduce my solar loan EMI?",
      answer:
        "The ₹78,000 subsidy is applied directly to your loan principal before your EMI is calculated. For a 3kW system costing ₹2L, the subsidy reduces your loan to ₹1,22,000. Every EMI is calculated on the lower amount — you save on both principal and total interest.",
    },
    {
      question: "What is the minimum CIBIL score for a solar loan in Kerala?",
      answer: "Minimum CIBIL score of 650 is required.",
    },
    {
      question: "What is the EMI for a 3kW solar system in Kerala?",
      answer:
        "For a 3kW system in Kerala, EMI starts at ₹2,500/month through Flarize's SBI partnership at 5.75% over 5 years.",
    },
    {
      question:
        "What is Flarize's 5.75% rate and how is it different from SBI's standard rate?",
      answer:
        "Flarize is an MNRE-empanelled vendor on India's national PM Surya Ghar portal. This enables a direct SBI channel partnership that gives Flarize customers 5.75% — lower than SBI's published rate of 7%.",
    },
    {
      question: "How long does solar loan approval take through Flarize?",
      answer:
        "Our documentation process takes up to one week, while bank procedures vary depending on the partner bank.",
    },
    {
      question:
        "How much will I save over 25 years with a solar loan in Kerala?",
      answer:
        "For a 3kW system at 5.75% over 5 years, your total investment is approximately ₹1,22,000 after subsidy. Over 25 years at a conservative 5% annual KSEB tariff increase, cumulative savings exceed ₹11 lakh. After year 5, invest ₹2,500/month at 12% SIP returns — that's ₹30 lakh in wealth.",
    },
    {
      question: "What documents do I need for a solar loan in Kerala?",
      answer:
        "Aadhaar card, PAN card, passbook/ bank statements, latest KSEB electricity bill, property ownership proof. For loans above ₹2L: income proof. For 3kW systems: no income proof required. Flarize collects and submits all documents on your behalf.",
    },
    {
      question: "What happens to my solar system if I sell my house?",
      answer:
        "Your solar system transfers with the house. KSEB net metering agreements and remaining warranty transfer to the new owner. A solar-equipped Kerala home commands a premium — buyers factor in zero electricity bills as a financial asset.",
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
              Everything you need to know about solar loans, EMIs, and savings
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
