// src/components/SolutionsPage/SolutionFaqSection.tsx
"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

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
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg">{description}</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-base md:text-lg font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                <Plus
                  size={24}
                  className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="p-5 pt-0 text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
