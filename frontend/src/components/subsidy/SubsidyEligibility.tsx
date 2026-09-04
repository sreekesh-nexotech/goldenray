import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const ELIGIBILITY_CRITERIA = [
  {
    title: "You own your home",
    detail:
      "Individual homeowners and residential welfare associations both qualify.",
  },
  {
    title: "You're grid-connected",
    detail: "Your home must be connected to KSEB for net metering benefits.",
  },
  {
    title: "You'll register on the national portal",
    detail: "Registration on PM Surya Ghar is mandatory before installation.",
  },
  {
    title: "You use an empanelled installer",
    detail:
      "Installation must go through an approved vendor — Flarize is empanelled in Kerala.",
  },
];

const SubsidyEligibility = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pb-12 sm:pb-14 lg:pb-16 pt-10">

      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl lg:rounded-3xl 2xl:rounded-4xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12 2xl:gap-16"
          style={{ backgroundColor: "#f7ba41" }}
        >
          {/* Left Content */}
          <div className="flex-1 text-left w-full lg:w-auto lg:max-w-[58%]">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold leading-tight max-w-md"
              style={{ color: "#1F2937" }}
            >
              Are you eligible for the rooftop solar subsidy?
            </h2>

            <ul className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 sm:pl-2">
              {ELIGIBILITY_CRITERIA.map(({ title, detail }) => (
                <li key={title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#22C55E]"
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-sm md:text-base font-semibold leading-snug text-[#1F2937]">
                      {title}
                    </p>
                    <p className="mt-1 text-xs md:text-sm leading-relaxed text-[#4B5563]">
                      {detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-[35%] xl:w-[38%] 2xl:w-[38%]">
            <Image
              src="https://golden-ray.b-cdn.net/icons/image%2068.png"
              alt="Illustration of a home with rooftop solar panels"
              width={508}
              height={370}
              className="w-full h-auto max-w-[240px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidyEligibility;
