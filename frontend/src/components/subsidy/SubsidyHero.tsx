"use client";

import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

export default function SubsidyHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(217.09% 47.87% at 103.46% 47.87%, #F8F2E1 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <PageIllustration isGradient={false} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-15 sm:py-18 md:py-20 lg:py-24 xl:py-28 2xl:py-32 max-w-7xl flex items-center justify-center h-full">
        {/* Centered Text */}
        <div className="w-full text-center mt-16 sm:mt-18 md:mt-20 lg:mt-12 xl:mt-14 2xl:mt-16">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold text-[#ED8723] mb-2 sm:mb-3 lg:mb-3 xl:mb-4 2xl:mb-4">
            🎉 Congratulations!
          </p>
          <h1 className="text-[2.5rem]/10 sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-bold text-[#123532] mb-4 sm:mb-5 lg:mb-6 xl:mb-6 2xl:mb-8">
            Get up to <span className="text-[#ED8723]">₹78,000</span> Back on
            Solar
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl text-[#444444] mb-4 sm:mb-5 lg:mb-5 xl:mb-6 2xl:mb-6 max-w-3xl xl:max-w-4xl 2xl:max-w-4xl mx-auto leading-relaxed">
            Join 300+ Kerala families who&apos;ve gone solar with Flarize — 8+
            years operating in Kerala, saving ₹5,000+ every month on electricity
            bills. We handle all KSEB paperwork &amp; PM Surya Ghar portal
            filing.
          </p>
          <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg text-[#666666] mb-6 sm:mb-7 lg:mb-8 xl:mb-8 2xl:mb-10">
            Government Registered · MNRE Approved · KSEB Compliant
          </p>

          <div className="flex flex-row justify-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl gap-2 sm:gap-3 lg:gap-4 xl:gap-4 2xl:gap-5">
            <LinkingButton
              content="Calculate My Subsidy"
              ButtonLink="#solar-advantage"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
            />
            <LinkingButton
              content="Talk to Solar Expert"
              ButtonLink="#footer"
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-[#FFFFFF]"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-[#eeeeee]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
