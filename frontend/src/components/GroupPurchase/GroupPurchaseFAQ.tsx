"use client";
import React, { useState } from "react";

// Main App component for the FAQ section
export default function Faq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "What is a group solar purchase?",
      answer:
        "A group solar purchase allows nearby homeowners to install solar together. By combining multiple installations in the same area, costs are reduced and installation becomes more efficient.",
    },
    {
      question: "How many families are required to form a group?",
      answer:
        "A group is confirmed when at least 5 families in the same area complete their booking. Once confirmed, installations are scheduled together.",
    },
    {
      question: "What happens to my ₹1,000 booking amount?",
      answer:
        "Your ₹1,000 booking amount reserves your spot in the group and is fully adjusted against your final solar system cost.",
    },
    {
      question: "What if the group does not form?",
      answer:
        "If the required number of families is not reached within the specified period, you can either receive a full refund, or continue with an individual installation while retaining your locked pricing (if applicable).",
    },
    {
      question: "Is the solar system quality different from individual bookings?",
      answer:
        "No. Group purchase customers receive the same panels, inverter brands, installation standards, warranty coverage, and service support as individual customers.",
    },
    {
      question: "How much can I save through a group purchase?",
      answer:
        "Savings vary based on system size and location, but most homeowners can save up to ₹10,000 compared to standard individual pricing.",
    },
    {
      question: "How long does installation take after a group is confirmed?",
      answer:
        "Once a group is confirmed, installations are typically completed within the scheduled group installation week, usually faster than individual installations.",
    },
    {
      question: "Can I join if I already have a solar quotation?",
      answer:
        "Yes. You can still join the group purchase program. Our team can review your existing quotation and help you compare costs, specifications, and potential savings.",
    },
    {
      question: "How do I know the status of my group?",
      answer:
        "After booking, you'll receive updates via WhatsApp, SMS, or phone regarding the number of families joined, group formation progress, installation schedule, and next steps.",
    },
    {
      question: "Why is group solar cheaper?",
      answer:
        "Group installations reduce logistics, survey, transportation, and crew mobilization costs by serving multiple nearby homes during the same installation period. These savings are passed directly to homeowners without compromising quality.",
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
