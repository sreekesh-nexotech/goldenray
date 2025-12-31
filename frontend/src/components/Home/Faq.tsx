"use client";
import React, { useState } from "react";

// Main App component for the FAQ section
export default function Faq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "What maintenance is required for solar panels?",
      answer:
        "Solar panels require minimal maintenance. Typically, they need to be cleaned a few times a year to remove dirt, dust, or debris that might accumulate and affect efficiency. Regular inspections can also help identify any potential issues early on.",
    },
    {
      question: "Can I run my home completely on solar power?",
      answer:
        "Yes, it is possible to run your home completely on solar power, especially with a properly sized system and battery storage. The feasibility depends on your energy consumption, the amount of sunlight your location receives, and the capacity of your solar system.",
    },
    {
      question: "What is the lifespan of solar panels?",
      answer:
        "Most solar panels come with a performance warranty of 20-25 years, guaranteeing a certain percentage of their original power output. However, solar panels can continue to produce electricity for 30 years or even more, albeit with a gradual decrease in efficiency over time.",
    },
    {
      question: "How long does it take to install a solar system?",
      answer:
        "The actual installation process for a residential solar system typically takes 1-3 days. However, the entire process, including design, permitting, and inspections, can take several weeks to a few months depending on local regulations and scheduling.",
    },
    {
      question: "What is the cost of installing solar panels at home?",
      answer:
        "The cost of installing solar panels varies widely based on system size, panel type, installation complexity, and location. It's best to get a personalized quote, but there are often government incentives and tax credits available to help offset the initial investment.",
    },
    {
      question: "How much can I save by switching to solar?",
      answer:
        "Savings from switching to solar can be substantial and depend on your current electricity rates, energy consumption, system size, and available incentives. Many homeowners see significant reductions in their monthly electricity bills, and over the lifespan of the system, the savings can amount to tens of thousands of dollars.",
    },
    {
      question: "What happens during a power outage?",
      answer:
        "Without a battery backup system, grid-tied solar systems typically shut down during a power outage for safety reasons (to prevent back-feeding the grid and endangering utility workers). If you have a battery storage system, your home can continue to be powered by the stored solar energy during an outage.",
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
          <h1 className="text-4xl md:text-5xl font-bold text-[#123532] mb-2 leading-tight">
            Have any questions?
          </h1>
          <p className="text-base md:text-xl text-[#444444]">
            Get expert advice and find your ideal solar solution—no obligations,
            just savings!
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
                <span className="text-base md:text-lg font-semibold text-[#444444] pr-4">
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
                <div className="mt-3 text-[#444444] text-sm md:text-base leading-relaxed">
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
