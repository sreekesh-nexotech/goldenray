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
        "Minimal. Cleaning every 3–6 months and one annual check-up. Kerala's humidity and monsoon dust can reduce output, so regular cleaning matters — but it's not a big job. Flarize provides scheduled solar panel maintenance in Kerala, performance monitoring, and fast repairs.",
    },
    {
      question: "Can I run my home completely on solar power?",
      answer:
        "With the right system size and a hybrid or battery-backed setup, yes. Standard on-grid systems generate during daylight and offset nighttime usage via net metering. For full independence including power outages, you'd need battery storage. We assess your needs during the free consultation.",
    },
    {
      question: "What is the lifespan of solar panels?",
      answer:
        "25+ years. Most quality panels retain 80–85% efficiency at year 25. Inverters typically last 10–15 years. Flarize installations use ALMM-approved panels and come with a 10-year comprehensive warranty covering panels, inverters, and workmanship.",
    },
    {
      question: "How long does it take to install a solar system?",
      answer:
        "2–6 days for most residential systems. Golden Ray's team has done 300+ installations — the process is streamlined. Design, mounting, wiring, safety checks, and handover. We handle KSEB approval and net metering setup after installation.",
    },
    {
      question: "What is the cost of installing solar panels at home?",
      answer:
        "A 3kW system: ₹1.85–₹2.15 lakh before subsidy. After the ₹78,000 MNRE subsidy under PM Surya Ghar Yojana, net cost is approximately ₹1.1–₹1.4 lakh. Price varies by panel brand, inverter type, and roof type. Solar EMI options from ₹2,000/month.",
    },
    {
      question: "How much can I save by switching to solar?",
      answer:
        "60–85% reduction on your KSEB bill. For a 3kW system, expect bimonthly savings of ₹2,200–₹2,700. Kerala's telescopic tariff means cutting units with solar drops you into a lower rate slab — so you save twice.",
    },
    {
      question: "What happens during a power outage?",
      answer:
        "Standard on-grid systems shut down during outages — that's a safety requirement so linesmen aren't endangered. For uninterrupted power, a hybrid system with battery storage keeps essential loads running. We recommend the right setup during your free consultation.",
    },
    {
      question: "Is the ₹78,000 subsidy available for commercial solar?",
      answer:
        "No. The PM Surya Ghar Yojana subsidy applies to on-grid residential systems only. Commercial and industrial installations don't qualify. However, businesses benefit from accelerated depreciation (40% in year one) and tax deductions that often deliver faster ROI than the residential subsidy.",
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
            Have Any Questions?
          </h2>
          <p className="text-base md:text-xl font-normal md:font-medium leading-snug text-[#444444]">
            Get expert advice and find your ideal solar solution — no
            obligations, just answers.
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
                <span className="text-xl md:text-2xl font-medium leading-snug text-[#444444] pr-4">
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
