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
        "Based on 300+ installations, the typical timeline is 60–75 days:",
        "Site survey & quote: 1–2 days",
        "PM Surya Ghar portal registration: 3–5 days",
        "Bank loan approval (if applicable): 5–10 days",
        "Installation: 2–3 days",
        "KSEB net meter installation: 5–7 days",
        "Subsidy credit to your bank: 45–60 days",
        "You start saving on electricity from the day your system goes live — even while the subsidy is being processed.",
      ],
    },
    {
      question: "How much subsidy will I get for a 2 kW or 3 kW system?",
      answer: [
        "Under the PM Surya Ghar scheme, residential households in Kerala can claim:",
        "2 kW system: ₹60,000 (₹30,000 per kW)",
        "3 kW system: ₹78,000 (₹30,000/kW for the first 2 kW + ₹18,000/kW for the 3rd kW)",
        "This subsidy is credited directly to your bank account after KSEB inspection and net meter installation. Flarize ensures 100% of eligible customers receive the full amount.",
      ],
    },
    {
      question: "Can I apply if I'm a tenant?",
      answer: [
        "Yes, tenants can apply with these requirements:",
        "Landlord's written NOC (No Objection Certificate)",
        "Electricity connection in your name or landlord's consent letter",
        "Lease agreement showing 10+ year tenure",
        "We help you prepare all the necessary documents — no extra charges.",
      ],
    },
    {
      question: "What happens if my vendor delays or defaults?",
      answer: [
        "Flarize works only with pre-vetted, MNRE-registered vendors. If any vendor delays beyond the agreed timeline, we replace them within 7 days at zero additional cost.",
        "In 300+ installations, we have had zero vendor defaults — our vetting process ensures reliability.",
      ],
    },
    {
      question:
        "Do I pay extra for KSEB paperwork or PM Surya Ghar portal filing?",
      answer: [
        "No. All paperwork, documentation, and government portal filings are included in the standard installation package.",
        "This includes: PM Surya Ghar portal registration, KSEB net meter application, subsidy claim filing, and all follow-ups with government departments.",
        "You don't visit any government office — Flarize handles everything end to end.",
      ],
    },
    {
      question: "What if the subsidy takes longer than 90 days?",
      answer: [
        "Over 98% of our customers receive their subsidy within 90 days. In rare cases of delays:",
        "We actively follow up with MNRE and the disbursement agency on your behalf",
        "You continue saving on electricity bills every day",
        "The subsidy is 100% guaranteed by the Government of India",
        "We provide real-time tracking updates so you always know the status",
      ],
    },
    {
      question: "Is Flarize available in my district?",
      answer: [
        "Yes — Flarize serves all 14 districts of Kerala, including Ernakulam, Thrissur, Kozhikode, Thiruvananthapuram, Kottayam, Palakkad, Malappuram, Kannur, Kollam, Alappuzha, Idukki, Wayanad, Pathanamthitta, and Kasaragod.",
        "Book a free site visit and our local team will reach you within 48 hours.",
      ],
    },
  ];

  // Function to toggle the open state of an FAQ item
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 lg:gap-6 md:p-4 rounded-xl max-w-full py-4 xl:py-2 px-4 sm:px-6 lg:px-8 xl:px-36">
        {/* Heading and Description */}
        <div className="w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#123532] mb-2 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base md:text-xl text-[#444444]">
            Everything you need to know about PM Surya Ghar subsidy in Kerala
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="w-full max-w-8xl p-3 sm:p-4 rounded-3xl bg-[#F6F2EF]">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0 py-2"
            >
              <button
                className="flex justify-between items-center w-full text-left focus:outline-none cursor-pointer"
                onClick={() => toggleFaq(index)}
                aria-label="toggle FAQ answer"
              >
                <span className="text-sm md:text-base font-semibold text-[#444444] pr-4">
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
