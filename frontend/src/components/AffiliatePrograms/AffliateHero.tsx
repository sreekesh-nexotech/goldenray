import React from "react";
import Image from "next/image";
import { Award } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";
import PageIllustration from "../ui/page-illustration";

const HERO_IMAGE = "https://golden-ray.b-cdn.net/images/affiliate-hero.png";

const STATS = [
  { number: "10+ Years", label: "INDUSTRY EXP" },
  { number: "300+", label: "INSTALLATIONS" },
  { number: "APPROVED", label: "MNRE & KSEB" },
  { number: "DEDICATED", label: "PARTNER SUPPORT" },
];

const AffliateHero = () => {
  return (
    <>
      <section className="relative w-full overflow-hidden flex items-center lg:py-15 lg:min-h-[450px]">
        {/* Mobile-only grid illustration */}
        <div className="lg:hidden">
          <PageIllustration />
        </div>

        {/* Desktop-only background image */}
        <div
          className="hidden lg:block absolute inset-0 z-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundPosition: "center right",
          }}
        />

        {/* Desktop-only overlay */}
        <div className="hidden lg:block absolute inset-0 lg:w-2/3 bg-gradient-to-r from-white/85 to-transparent z-0" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 md:py-16 gap-3 sm:gap-4">
          <div className="mb-2">
            <span className="flex items-center gap-1 bg-[#074A4D1A] text-[#074A4D] text-xs md:text-base font-normal leading-normal rounded px-3 py-1">
              <Award color="#0B4740" /> Solar Affiliate Program Kerala | Earn
              Rs.8,000+ Per Installation
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-semibold leading-tight text-[#171717]">
            Kerala&apos;s Most Trusted Solar Brand
            <br />
            <span className="text-[#F88A22] font-bold">Now Paying You</span> to
            Refer.
          </h1>
          <p className="text-[#444444] w-full max-w-2xl text-sm md:text-xl font-normal leading-relaxed">
            Earn a{" "}
            <span className="text-[#16A34A]">
              structured commission for every successful solar installation you
              refer
            </span>{" "}
            with zero investment, no solar expertise required, and a dedicated
            partner manager handling every lead you send.
          </p>
          <div className="flex flex-row gap-2 sm:gap-3 mt-2 w-full sm:w-auto">
            <LinkingButton
              content="Apply as Affiliate Partner "
              ButtonLink="#form"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
            />
            <LinkingButton
              content="See How It works"
              ButtonLink="#working"
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-transparent"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-[#eeeeee]"
            />
          </div>

          {/* Mobile-only hero image */}
          <div className="lg:hidden w-full rounded-xl overflow-hidden mt-4">
            <Image
              src={HERO_IMAGE}
              alt="Kerala Solar Affiliate Partners"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-[#F3F4F6] py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start text-center gap-1"
              >
                <div className="text-xl md:text-2xl font-semibold leading-snug text-[#16A34A]">
                  {stat.number}
                </div>
                <div className="text-xs md:text-base font-normal leading-normal text-[#525252]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AffliateHero;
