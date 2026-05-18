"use client";

import Image from "next/image";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <PageIllustration gridScale={80} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-6 md:py-20 xl:py-16 flex flex-col md:flex-row items-stretch h-full xl:gap-24 gap-0">
        {/* Left Side - Text */}
        <div className="w-full md:flex-[0.45] text-left h-full flex flex-col justify-center">
          <div className="hidden sm:block text-xs md:text-base font-semibold leading-normal text-[#F7BA41] mb-2">
            Solar Installation Process in Kerala — How Flarize Works in 7 Steps
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[#111827] mb-6">
            <span className="block md:whitespace-nowrap">
              One brand. Three options.
            </span>
            <span className="block md:whitespace-nowrap text-[#F88A22] font-bold">
              You pick, we handle the rest.
            </span>
          </h1>
          <p className="text-sm md:text-xl font-light leading-relaxed text-[#444444] mb-6">
            Kerala&apos;s solar booking platform. Share your KSEB electricity
            bill, get a free roof assessment, and receive 3 fully customised
            quotes — each with a different panel brand and budget. Your system
            is installed in 3-7 days. KSEB net metering handled. Subsidy
            processed. Savings begin.
          </p>

          <div className="flex flex-row gap-23 justify-start mb-4">
            <div className="text-left">
              <div className="text-xl md:text-2xl font-semibold leading-snug text-[#074A4D]">
                3-7 Days
              </div>
              <div className="font-light text-xs md:text-base font-normal leading-normal text-[#444444]">
                Installation Timeline
              </div>
            </div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-semibold leading-snug text-[#074A4D]">
                300+
              </div>
              <div className=" font-light text-xs md:text-base font-normal leading-normal text-[#444444]">
                Kerala Homes Installed
              </div>
            </div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-semibold leading-snug text-[#074A4D]">
                4.9★
              </div>
              <div className=" font-light text-xs md:text-base font-normal leading-normal text-[#444444]">
                Customer Rating
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-start mt-6 lg:gap-8 gap-2 mb-6">
            <LinkingButton
              content="Get Free Solar Estimate"
              ButtonLink="#solar-estimate"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
              className="min-w-[260px] md:min-w-[320px] h-[56px] px-10 text-base md:text-lg rounded-2xl"
            />
            <LinkingButton
              content="Watch Installation Story"
              ButtonLink="#installation-story"
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-[#FFFFFF]"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-[#eeeeee]"
              className="min-w-[260px] md:min-w-[320px] h-[56px] px-10 text-base md:text-lg rounded-2xl"
            />
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:flex-[0.55] mx-auto mt-10 md:mt-0 flex justify-center items-stretch mb-8 h-full">
          <div className="relative w-full max-w-none aspect-[4/3]">
            <Image
              src="https://golden-ray.b-cdn.net/images/how-flarize-works-hero.svg"
              alt="Solar installation team working on rooftop in Kerala"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
