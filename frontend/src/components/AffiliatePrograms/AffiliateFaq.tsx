"use client";
import React, { useState } from "react";

// FAQ section for the Affiliate / Partner program page
export default function AffiliateFaq() {
  // State to manage the currently open FAQ item.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "I already installed solar with Flarize — can I earn?",
      answer:
        "Yes — you're our most valued partner. Existing Flarize owners join as Advisor Partners, refer neighbours and friends, and earn rewards for every home that goes solar on your word.",
    },
    {
      question: "How do I earn?",
      answer:
        "You introduce a homeowner or business to Flarize. We handle consultation, design, paperwork, KSEB and installation. When the system is installed successfully, a fixed commission is credited to your partner account.",
    },
    {
      question: "When do I get paid?",
      answer:
        "Commission is credited after the installation is completed and verified. Your dashboard shows the exact status and next payout date for every referral.",
    },
    {
      question: "How are referrals tracked?",
      answer:
        "You get a unique tracking link, and referrals shared directly with your partner manager are also logged. Every lead is timestamped through submission, site visit, installation and payout — visible to you in real time.",
    },
    {
      question: "What happens if a customer cancels?",
      answer:
        "You only earn on completed installations, so a cancellation simply means no commission for that lead — no penalty, no clawback. Your other referrals are unaffected.",
    },
    {
      question: "Do I need any solar knowledge?",
      answer:
        "None. Our team handles every technical conversation, quote and approval. Your only job is the introduction and the trust you already have with your network.",
    },
    {
      question: "Can influencers and creators join?",
      answer:
        "Yes. Creator partners get a tracking link and ready-to-use content. You earn on completed installations from your audience — not on clicks, views or impressions.",
    },
    {
      question: "Can electricians, builders and agents join?",
      answer:
        "Absolutely — they're core partners. Solar fits naturally into electrical work, property handovers and design conversations, and you earn without changing your workflow.",
    },
    {
      question: "Is there a minimum target?",
      answer:
        "No. There's no quota and no pressure. Refer one home a year or ten a month — you earn the same fixed rate on each successful installation.",
    },
    {
      question: "Can I refer customers outside my district?",
      answer:
        "Yes. Flarize installs across all 14 Kerala districts, so any qualified referral within Kerala can convert regardless of where you or the homeowner are based.",
    },
    {
      question: "How does Flarize support partners?",
      answer:
        "Every partner gets a dedicated relationship manager, a live tracking dashboard, ready-made referral content, and full handling of consultation, paperwork, KSEB, warranty and after-sales — so the customer experience reflects well on you.",
    },
  ];

  // Function to toggle the open state of an FAQ item
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-10 items-start">
          {/* Left: Heading and Description */}
          <div className="lg:pt-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#123532] mb-4">
              Have any questions?
            </h2>
            <p className="text-base md:text-lg font-normal leading-relaxed text-[#444444] max-w-md">
              Everything you need to know about earning with the Flarize partner
              program.
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
