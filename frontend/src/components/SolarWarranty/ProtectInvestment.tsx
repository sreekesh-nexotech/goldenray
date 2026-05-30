import React from "react";
import LinkingButton from "../ui/LinkingButton";

const ProtectInvestment = () => {
  return (
    <section
      className="relative w-full py-16 sm:py-20 md:py-24"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 50%, #FBF3E2 0%, #FFFFFF 80%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl font-semibold leading-tight text-[#123532] mb-5 max-w-4xl">
          Protect Your Solar Investment for the Next 25 Years
        </h2>
        <p className="text-sm md:text-lg text-[#4B5563] leading-relaxed max-w-full md:max-w-4xl mb-8">
          Join 12,000+ happy homes in Kerala who trust Flarize to keep their
          lights on and bills low.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <LinkingButton
            content="Get a Free Service Call"
            ButtonLink="#contact"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="min-w-60 h-12 sm:h-14 px-6 text-sm md:text-base rounded-xl"
          />
          <LinkingButton
            content="Find Service Near You"
            ButtonLink="/contactus"
            ButtonBorder="border border-[#074A4D]"
            ButtonBg="bg-transparent"
            Buttontext="text-[#074A4D]"
            ButtonHover="hover:bg-white/60"
            className="min-w-60 h-12 sm:h-14 px-6 text-sm md:text-base rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default ProtectInvestment;
