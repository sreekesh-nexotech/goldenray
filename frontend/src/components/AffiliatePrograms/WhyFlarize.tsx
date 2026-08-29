"use client";
import { BadgeCheck, Clock, ShieldCheck, Users } from "lucide-react";
import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: <BadgeCheck className="w-6 h-6 text-white" />,
    title: "Trusted Brand",
    desc: "Established solar provider with strong presence across Kerala. Your referrals convert faster when backed by credibility and proven installations.",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Dedicated Partner Support",
    desc: "Get a relationship manager to assist with lead handling, updates, and coordination. You focus on referrals — we handle the rest.",
  },
  {
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "Secure Referral Tracking",
    desc: "Access a private dashboard to monitor referral status, installation progress, and payout updates in real time.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: "Transparent & Structured Process",
    desc: "Clear onboarding, defined payout terms, and organized payout system. No confusion. No hidden terms.",
  },
];

const WhyFlarize = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Why Solar Referral partners Choose Flarize Over Other Programs
        </h2>
      </div>

      {/* Banner image + cards */}
      <div className="relative">
        {/* Banner image — full bleed, edge to edge */}
        <div className="hidden md:block relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          <img
            src="https://golden-ray.b-cdn.net/images/Rectangle%20172.png"
            alt="Flarize affiliate partners in front of a solar-powered home"
            className="w-full h-[660px] object-cover"
          />
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 lg:-mt-20 px-0 lg:px-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#0A453D] rounded-2xl p-6 flex flex-col gap-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold leading-snug text-white">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base font-normal leading-relaxed text-[#C9D6D3]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFlarize;
