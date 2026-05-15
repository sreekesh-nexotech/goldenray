"use client";
import React, { useState } from "react";

// Main App component for the FAQ section
export default function Faq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "Will panels work during Kerala monsoon?",
      answer:
        "Yes. Solar panels generate electricity from sunlight, not rain. While output drops on cloudy days, Kerala's abundant sunshine during the rest of the year more than makes up for it. Flarize's high-efficiency panels perform well even in low-light conditions, and our performance monitoring ensures you get the most out of your system year-round.",
    },
    {
      question: "Is our roof strong enough?",
      answer:
        "Most roofs are suitable for solar panels. We conduct a free roof assessment to check structural integrity, shading, and orientation. If your roof isn't ideal, we can explore ground-mounted or carport solar options to ensure you can still benefit from solar energy.",
    },
    {
      question: "Do group members have to be neighbours?",
      answer:
        "No, group members don't have to be neighbours. You can form a group with anyone interested in purchasing solar panels together, regardless of their location.",
    },
    {
      question: "Do we need ITR for the loan?",
      answer:
        "Most financing options for solar panels do not require Income Tax Returns (ITR) for loan approval. However, requirements can vary based on the lender and the specific loan product. We recommend checking with your chosen financing provider for their documentation requirements.",
    },
    {
      question: "What about KSEB paperwork and subsidy?",
      answer:
        "Flarize handles all KSEB paperwork and subsidy applications on your behalf. We ensure that your net metering application is submitted correctly and that you receive any eligible subsidies without you having to navigate the complex process yourself.",
    },
    {
      question: "Can anyone earn referral rewards?",
      answer:
        "Yes, anyone can earn referral rewards by referring friends and family to join the group purchase. We offer incentives for successful referrals that lead to reservations, making it a win-win for everyone involved.",
    },
    {
      question: "What happens during a power outage?",
      answer:
        "Standard on-grid solar systems shut down during power outages for safety reasons. However, if you opt for a hybrid system with battery storage, you can continue to have power during outages. We can help you choose the right setup based on your needs.",
    },
  ];

  // Function to toggle the open state of an FAQ item
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 lg:gap-12 md:p-10 rounded-xl max-w-full py-10 xl:py-8 px-4 sm:px-6 lg:px-8 xl:px-36">
        {/* Heading and Description */}
        <div className="w-full text-center">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-2">
            Frequently Asked Questions About Group Solar Purchase
          </h2>
          <p className="text-base md:text-xl font-normal md:font-semibold leading-snug text-[#444444]">
            Solar + group purchase — the full picture.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="w-full max-w-8xl p-6 rounded-3xl bg-[#F6F2EF]">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0 py-4"
            >
              <button
                className="flex justify-between items-center w-full text-left focus:outline-none cursor-pointer"
                onClick={() => toggleFaq(index)}
                aria-label="toggle FAQ answer"
              >
                <span className="text-xl md:text-2xl font-semibold leading-snug text-[#444444] pr-4">
                  {faq.question}
                </span>
                <span
                  className={`text-2xl font-light text-[#000000] transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-3 text-[#444444] text-xs md:text-base font-normal leading-normal">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
