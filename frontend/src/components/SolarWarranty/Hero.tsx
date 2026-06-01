"use client";

import React from "react";
import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

const heroBadges = [
  {
    icon: "https://golden-ray.b-cdn.net/icons/mingcute_safe-shield-2-fill.png",
    line1: "25-Year",
    line2: "Performance",
  },
  {
    icon: "https://golden-ray.b-cdn.net/icons/Vector%20(20).png",
    line1: "48-Hour",
    line2: "Response",
  },
  {
    icon: "https://golden-ray.b-cdn.net/icons/material-symbols_map-outline.png",
    line1: "Local Network",
  },
  {
    icon: "https://golden-ray.b-cdn.net/icons/Vector%20(21).png",
    line1: "Digital Records",
  },
];

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBF7EE] sm:bg-transparent">
      <div className="absolute inset-0 -z-10 hidden sm:block">
        <Image
          src="https://golden-ray.b-cdn.net/icons/58bdb8de6ff0b38946e019f3b12008951f19ec4f.png"
          alt="Solar technician servicing rooftop panels in Kerala"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:hidden">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[2.15rem] leading-[1.04] font-bold text-[#111111] max-w-md tracking-tight">
            Solar Warranty &amp; AMC Service in Kerala That Actually Protects
            Your Investment
          </h1>

          <div className="mt-6 flex w-full max-w-[20.5rem] flex-col gap-3">
            <LinkingButton
              content="Get a Free Service Call"
              ButtonLink="/solar-warranty#contact"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
              className="h-12 w-full rounded-xl px-6 text-sm font-semibold"
            />
            <LinkingButton
              content="Find Service Near You"
              ButtonLink="/contactus"
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-[#FFFFFF]"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-white/10"
              className="h-12 w-full rounded-xl px-6 text-sm font-semibold"
            />
          </div>

          <div className="mt-6 w-full max-w-[20.5rem] overflow-hidden rounded-[1.85rem]">
            <div className="relative aspect-[0.82] w-full">
              <Image
                src="https://golden-ray.b-cdn.net/icons/58bdb8de6ff0b38946e019f3b12008951f19ec4f.png"
                alt="Solar technician servicing rooftop panels in Kerala"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 0px"
                className="object-cover object-center"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent px-3 pb-3 pt-10">
                <div className="grid grid-cols-2 gap-2">
                  {heroBadges.map((b) => (
                    <div
                      key={b.line1}
                      className="flex items-center gap-2 rounded-xl bg-[#5F6B86]/90 px-3 py-2.5 backdrop-blur-[18px]"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <Image
                          src={b.icon}
                          alt={b.line2 ? `${b.line1} ${b.line2}` : b.line1}
                          width={20}
                          height={20}
                          className="h-5 w-5 object-contain"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="text-[0.68rem] font-semibold leading-tight text-white">
                          {b.line1}
                        </div>
                        {b.line2 && (
                          <div className="text-[0.68rem] font-semibold leading-tight text-white/95">
                            {b.line2}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 flex-col items-center text-center gap-5 sm:gap-6">
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
            ButtonLink="/solar-warranty#contact"
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
