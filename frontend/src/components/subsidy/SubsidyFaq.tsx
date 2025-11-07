"use client";
import React, { useState } from "react";

// Main App component for the FAQ section
export default function SubsidyFaq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "How long does the entire process take from start to finish?",
      answer: [
        "Based on 500+ installations, the average is 65-70 days (9-10 weeks):",
        "Bank approval: 5 days (can be 2-10 days)",
        "Installation: 10 days",
        "Net meter: 5 days",
        "Subsidy: 45-60 days",
        "You start saving electricity from Week 3-4, even while subsidy is being processed!",
      ],
    },
    {
      question: "Can I apply if I'm a tenant?",
      answer: [
        "Yes, with these requirements:",
        "Landlord's written NOC (No Objection Certificate)",
        "Electricity connection in your name",
        "Lease agreement showing 10+ year tenure",
        "We can help you prepare the necessary documents!",
      ],
    },
    {
      question: "Don't worry! You have options:",
      answer: [
        "NBFCs approve with CIBIL 600+ (vs 650+ for banks)",
        "Add a co-applicant (spouse/parent with better CIBIL)",
        "We've helped 98% of applicants get loan approval",
        "Interest rate will be slightly higher (11-14% vs 6.75-7.5%), but you'll still save money!",
      ],
    },
    {
      question: "What happens if my vendor delays or defaults?",
      answer: [
        "If your vendor delays or has issues, we replace them within 7 days at no cost to you. We have 15+ backup vendors ready.",
        "Important: In 500+ installations, we've had ZERO vendor defaults. Our vetting process works!",
      ],
    },
    {
      question: "Do I need to pay Flarize anything?",
      answer: [
        "We earn a small commission from the vendor after successful installation. You pay the vendor directly (or bank pays them if you take a loan).",
        "Transparency: Vendor pays us 3-5% commission, which is already included in their standard pricing. You don't pay extra!",
      ],
    },
    {
      question: "What if the subsidy takes longer than 90 days?",
      answer: [
        "98% of our customers receive subsidy within 90 days. In rare cases of delays:",
        "We actively follow up with MNRE on your behalf",
        "You're still saving on electricity bills daily",
        "Subsidy is 100% guaranteed by government",
        "We provide real-time tracking updates",
      ],
    },
  ];

  // Function to toggle the open state of an FAQ item
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="container mx-auto flex flex-col xl:flex-row items-start xl:items-baseline justify-center gap-8 lg:gap-16 md:p-10 rounded-xl max-w-full mt-15 mb-15 px-4 sm:px-6 lg:px-8 xl:px-36">
        {/* Left Section: Heading and Description */}
        <div className="w-full xl:w-1/2 xl:text-left text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#123532] mb-2 leading-tight">
            Have any questions?
          </h1>
          <p className="text-base md:text-xl text-[#444444]">
            Get expert advice and find your ideal solar solution—no obligations,
            just savings!
          </p>
        </div>

        {/* Right Section: FAQ Accordion */}
        <div className="w-full xl:w-1/2  p-6 rounded-3xl bg-[#F6F2EF]">
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
                <span className="text-base md:text-2xl font-semibold text-[#444444] pr-4">
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
                <div className="mt-3 text-[#444444] text-sm md:text-lg leading-relaxed">
                  {Array.isArray(faq.answer) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {faq.answer.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    faq.answer
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
