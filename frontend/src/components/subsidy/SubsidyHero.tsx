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
      <div className="relative z-10 container mx-auto px-4 py-15 max-w-7xl flex items-center justify-center h-full">
        {/* Centered Text */}
        <div className="w-full text-center mt-16">
          <h1 className="text-[2.5rem]/10 sm:text-5xl lg:text-6xl font-bold text-[#123532] mb-4">
            Get up to <span className="text-[#ED8723]">₹78,000</span> Back on
            Solar
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-[#444444] mb-6">
            Join 1,200+ Kerala families saving ₹25,000/year on electricity bills
          </p>

          <div className="flex flex-row justify-center text-xs lg:text-lg lg:gap-4 gap-2">
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
