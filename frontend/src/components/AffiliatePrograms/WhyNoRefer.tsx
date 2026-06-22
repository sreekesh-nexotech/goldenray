"use client";
import { AlertTriangle, CheckCircle2, Headphones, Phone, Shield } from "lucide-react";
import React from "react";

interface Risk {
  title: string;
  desc: string;
}

interface Benefit {
  title: string;
  icon: React.ReactNode;
}

const risks: Risk[] = [
  {
    title: "Installation Delayed",
    desc: "Customer doesn't blame the installer. They call you.",
  },
  {
    title: "Service Request Ignored",
    desc: "The referral remembers who introduced them.",
  },
  {
    title: "Warranty Issue Later",
    desc: "Your reputation stays attached long after the sale.",
  },
];

const benefits: Benefit[] = [
  {
    title: "One Accountable Team",
    icon: <Shield className="w-5 h-5 text-[#074A4D]" />,
  },
  {
    title: "One Support Number",
    icon: <Phone className="w-5 h-5 text-[#074A4D]" />,
  },
  {
    title: "Dedicated Partner Manager",
    icon: <Headphones className="w-5 h-5 text-[#074A4D]" />,
  },
  {
    title: "Long-Term Customer Support",
    icon: <CheckCircle2 className="w-5 h-5 text-[#074A4D]" />,
  },
];

const WhyNoRefer = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Why Most People Never Refer Solar
        </h2>
      </div>

      {/* Two-column layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-1 items-start">
        {/* Left: risks */}
        <div className="flex flex-col gap-5">
          <p className="text-base md:text-2xl font-medium text-[#171717]">
            The commission is not the risk. Your name is.
          </p>

          <div className="flex flex-col gap-4">
            {risks.map((risk, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-[#FDEEEE] rounded-xl px-5 py-4"
              >
                <AlertTriangle className="w-5 h-5 text-[#E5484D] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-base md:text-lg font-semibold text-[#171717]">
                    {risk.title}
                  </h3>
                  <p className="text-sm md:text-base font-normal text-[#525252]">
                    {risk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Flarize journey card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 md:p-8 flex flex-col gap-5 max-w-[600px] justify-self-center">
          <div className="flex items-center gap-4">
            <img
              src="https://golden-ray.b-cdn.net/icons/fevi.png"
              alt="Flarize"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-xl md:text-xl font-semibold text-[#123532] leading-snug">
                That&apos;s Why Flarize Owns The Entire Journey
              </h3>
              <p className="text-sm md:text-base font-normal text-[#9CA3AF]">
                From consultation to installation to after-sales support.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#EAF3EE] rounded-xl px-5 py-4"
              >
                {benefit.icon}
                <span className="text-base md:text-lg font-semibold text-[#074A4D]">
                  {benefit.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyNoRefer;
