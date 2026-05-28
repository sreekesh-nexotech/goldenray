import React from "react";
import PageIllustration from "../ui/page-illustration";

const QuoteHero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% -10%, #F8F2E1 0%, #FFFFFF 70%)",
      }}
    >
      <PageIllustration />

      <div className="relative z-10 container mx-auto px-4 py-15 max-w-6xl flex flex-col items-center text-center gap-5 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-semibold text-[#111827] leading-tight">
          Is your solar quote <br/>actually a good deal?
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#4B5563] max-w-2xl leading-relaxed">
          Upload any solar quote from any company. Our AI checks pricing, brands, hidden costs and missing items in 30 seconds.
        </p>
      </div>
    </section>
  );
};

export default QuoteHero;
