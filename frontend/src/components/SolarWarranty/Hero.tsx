"use client";

import React from "react";
import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

const heroBadges = [
  {
    icon: "/images/sollarWarranty/HeroIcon1.png",
    line1: "25-Year",
    line2: "Performance",
  },
  {
    icon: "/images/sollarWarranty/HeroIcon2.png",
    line1: "48-Hour",
    line2: "Response",
  },
  {
    icon: "/images/sollarWarranty/HeroIcon3.png",
    line1: "Local Network",
  },
  {
    icon: "/images/sollarWarranty/HeroIcon4.png",
    line1: "Digital Records",
  },
];

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/sollarWarranty/heroBackground.png"
          alt="Solar technician servicing rooftop panels in Kerala"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 flex flex-col items-center text-center gap-5 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl font-bold text-white leading-tight max-w-5xl">
          Solar Warranty &amp; AMC Service in Kerala
          <br />
          <span className="block">That Actually Protects Your Investment</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-5xl xl:max-w-6xl leading-relaxed">
          Most solar warranties in Kerala are pages of fine print that protect
          the installer, not you. Ours is a 25-year service commitment — backed
          by certified local technicians, live remote diagnostics, and a
          performance guarantee that compensates you in cash if we fall short.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
          <LinkingButton
            content="Get a Free Service Call"
            ButtonLink="#contact"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="min-w-56 md:min-w-60 h-12 sm:h-14 px-6 text-sm md:text-base rounded-xl"
          />
          <LinkingButton
            content="Find Service Near You"
            ButtonLink="/contactus"
            ButtonBorder="border border-white"
            ButtonBg="bg-[#FFFFFF]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-white/10"
            className="min-w-56 md:min-w-60 h-12 sm:h-14 px-6 text-sm md:text-base rounded-xl"
          />
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full max-w-6xl">
          {heroBadges.map((b) => (
            <div
              key={b.line1}
              className="flex items-center justify-center gap-3 sm:gap-4 rounded-2xl backdrop-blur-[22.8px] bg-[#FFFFFF1A] border border-[#006B5F0D] px-4 sm:px-6 py-3 sm:py-4"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0">
                <Image
                  src={b.icon}
                  alt={b.line2 ? `${b.line1} ${b.line2}` : b.line1}
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-semibold text-white leading-tight">
                  {b.line1}
                </div>
                {b.line2 && (
                  <div className="text-sm sm:text-base font-semibold text-white leading-tight">
                    {b.line2}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
