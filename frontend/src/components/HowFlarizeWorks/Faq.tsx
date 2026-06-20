"use client";
import React, { useState } from "react";

// FAQ section for the "How Flarize Works" page
export default function Faq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "How does solar installation work in Kerala?",
      answer:
        "You send your KSEB bill, we visit your roof, and you get 3 checked options. Pick one, and we handle the install, the KSEB paperwork, and your subsidy.",
    },
    {
      question: "How long does installation take?",
      answer:
        "Once your option is approved, the install takes 7 to 12 days. We use pre-packed kits and a local team, so there's no long wait for parts.",
    },
    {
      question: "How does Flarize differ from other companies?",
      answer:
        "We check every installer before you meet them, your payment follows real progress, and our engineer inspects the finished job. You deal with one team for 25 years.",
    },
    {
      question: "Does Flarize handle KSEB net metering?",
      answer:
        "Yes. We file your application and follow it through approval. You don't deal with KSEB yourself.",
    },
    {
      question: "What happens after installation?",
      answer:
        "You stay with Flarize. App monitoring, service visits, and a written energy-loss guarantee, for 25 years. One number to call.",
    },
    {
      question: "Is solar a better choice than a fixed deposit?",
      answer:
        "For most Kerala homes with a high bill, the monthly saving beats FD interest, and it lasts for decades. We'll show you the real numbers for your home.",
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
              Get expert advice and find your ideal solar solution— no
              obligations, just savings!
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
