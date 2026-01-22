// src/components/SolutionsPage/SolutionFaqSection.tsx
"use client";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface SolutionFaqSectionProps {
  title: string;
  description: string;
  faqs?: FaqItem[];
}

const defaultFaqs: FaqItem[] = [
  {
    question: "What maintenance is required for solar panels?",
    answer:
      "Solar panels require minimal maintenance. Regular cleaning to remove dust and debris, typically every 6-12 months, is recommended. Our systems come with monitoring to alert you of any performance issues.",
  },
  {
    question: "Can I run my home completely on solar power?",
    answer:
      "Yes, with proper system sizing and battery storage, you can run your home entirely on solar power. We design systems based on your energy consumption to maximize self-sufficiency.",
  },
  {
    question: "What is the lifespan of solar panels?",
    answer:
      "Quality solar panels typically last 25-30 years with minimal degradation. Most manufacturers provide 25-year performance warranties guaranteeing at least 80% output.",
  },
  {
    question: "How long does it take to install a solar system?",
    answer:
      "Residential installations typically take 1-3 days, while commercial installations may take 1-2 weeks depending on system size and complexity.",
  },
  {
    question: "What is the cost of installing solar panels at home?",
    answer:
      "The cost varies based on system size, panel quality, and installation complexity. We provide free consultations and customized quotes based on your specific requirements.",
  },
  {
    question: "How much can I save by switching to solar?",
    answer:
      "Most homeowners save 70-90% on their electricity bills. The exact savings depend on your current consumption, system size, and local electricity rates.",
  },
  {
    question: "What happens during a power outage?",
    answer:
      "With a grid-tied system, solar panels shut off during outages for safety. However, with battery backup systems, you can continue to power essential appliances during outages.",
  },
];

export default function SolutionFaqSection({
  title,
  description,
  faqs = defaultFaqs,
}: SolutionFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 lg:gap-12 md:p-10 rounded-xl max-w-full py-10 xl:py-8 px-4 sm:px-6 lg:px-8 xl:px-36">
        {/* Heading and Description */}
        <div className="w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#123532] mb-2 leading-tight">
            {title}
          </h1>
          <p className="text-base md:text-xl text-[#444444]">{description}</p>
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
    </section>
  );
}
