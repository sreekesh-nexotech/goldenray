"use client";
import { useState } from "react";

// Main App component for the FAQ section
export default function Faq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "Will panels work during Kerala monsoon?",
      answer:
        "Yes. Solar panels are designed to withstand heavy rain and wind. They are waterproof and have a robust build, ensuring they function efficiently even during the monsoon season.",
    },
    {
      question: "Is our roof strong enough?",
      answer:
        "Most residential roofs in Kerala are suitable for solar panel installation. Our team conducts a structural assessment to ensure your roof can support the panels and mounting equipment safely.",
    },
    {
      question: "Do group members have to be neighbours?",
      answer:
        "No. While it's ideal for group members to be in the same locality for logistical efficiency, they can be from different areas. The key is that the group reaches the minimum number of families required for a confirmed installation.",
    },
    {
      question: "Do we need ITR for the loan?",
      answer:
        "Income Tax Returns (ITR) are typically required for loan applications to verify income and financial stability. However, specific requirements may vary based on the lender's policies. Our team can guide you through the documentation needed for your loan application.",
    },
    {
      question: "What about KSEB paperwork and subsidy?",
      answer:
        "Our team handles all KSEB documentation and subsidy applications on your behalf. We ensure that all necessary forms are completed accurately and submitted in a timely manner, maximizing your chances of receiving the subsidy without any hassle.",
    },
    {
      question: "Can anyone earn referral rewards?",
      answer:
        "Yes, anyone who refers a friend or family member to the group purchase program can earn referral rewards. The specific rewards and terms will be communicated to you by our team.",
    },
    {
      question: "What happens during a power outage?",
      answer:
        "During a power outage, your solar system will automatically shut down for safety reasons. However, if you have a battery storage system installed, it can provide backup power to your home during outages, depending on the capacity of the battery.",
    },
  ];

  // Function to toggle the open state of an FAQ item
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.2fr] gap-8 lg:gap-10 items-start">
          {/* Left: Heading and Description */}
          <div className="lg:pt-6">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
              Before your family decides
            </h2>
            <p className="text-base md:text-lg font-normal leading-relaxed text-[#444444] max-w-md">
              Solar + group purchase — the full picture.
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
