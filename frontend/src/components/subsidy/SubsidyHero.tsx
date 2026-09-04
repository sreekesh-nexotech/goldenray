"use client";

import Image from "next/image";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

const heroImage =
  "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/e4f23c9bff9a796d256d7beb9e60ddd7b5a416e7.png";
const heroImageAlt =
  "Rooftop solar panel array under a clear blue sky in Kerala";

export default function SubsidyHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 0% 30%, #F8F2E1 0%, rgba(255, 255, 255, 0) 70%)",
      }}
    >
      <PageIllustration isGradient={false} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-8 pb-14  md:pb-20 lg:pt-18 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 xl:gap-16">
          {/* Copy */}
          <div className="w-full lg:w-[52%] text-center lg:text-left">
            <span className="inline-flex items-center rounded-full bg-[#DDEFE3] px-3.5 py-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] text-[#0E7A55]">
              Government Subsidy Update 2026
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl xl:text-[3.25rem] font-semibold leading-[1.15] tracking-tight text-[#123532]">
              Solar Subsidy Kerala 2026: See Your Government Support in Under a
              Minute
            </h1>

            <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#444444]">
              Rooftop solar subsidy under the PM Surya Ghar scheme now covers up
              to ₹78,000 for a typical Kerala home. Check your eligibility and
              exact subsidy amount — no site visit needed.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <LinkingButton
                content="Check Your Solar Subsidy Eligibility →"
                ButtonLink="#subsidy-calculator"
                ButtonBg="bg-[#F7BA41]"
                Buttontext="text-[#272218]"
                ButtonHover="hover:bg-yellow-500"
                className="w-full sm:w-auto text-sm md:text-base"
              />
              <span className="text-xs md:text-sm font-normal text-[#8A8A8A]">
                Takes less than 30 seconds.
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-[48%]">
            <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] xl:h-[440px]">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-3xl shadow-[0_20px_60px_rgba(18,53,50,0.15)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
