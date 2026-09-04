"use client";
import { useState } from "react";

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
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.2fr] gap-8 lg:gap-10 items-start">
          {/* Left: Heading and Description */}
          <div className="lg:pt-6">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
              Frequently Asked Questions About Group Solar Purchase
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
