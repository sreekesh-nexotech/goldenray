"use client";
import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Share Your KSEB Electricity Bill",
    description:
      "WhatsApp or upload your latest KSEB electricity bill. This tells Flarize your monthly unit consumption, existing load, and tariff slab — everything needed to size your solar system accurately. Most solar companies guess system size based on house size. Flarize uses actual consumption data from your bill to recommend the exact capacity — no oversizing, no undersizing.",
  },
  {
    title: "Free Roof Site Assessment",
    description:
      "A trained Flarize engineer visits your roof at no charge. We check 12 parameters: roof orientation, tilt angle, shadow analysis from morning to evening, structural condition, electrical panel capacity, earthing condition, and distance from the meter. A roof that looks ideal from the ground may have shading issues that reduce solar generation by 15-20%. This data feeds directly into your three custom quotes.",
  },
  {
    title: "Receive 3 Custom Solar Quotes Within 24 Hours",
    description:
      "Based on your consumption data and roof assessment, Flarize generates three solar system quotes — same installation quality, different panel and inverter brands at different price points. Best Price, Most Popular, and Best Performance options. You compare them side by side and choose what fits your budget and long-term goals",
  },
  {
    title: "KSEB Net Metering Application",
    description:
      "Once you confirm your quote, Flarize submits your KSEB net metering application on your behalf. We prepare all documentation — technical specifications, load sanction letter, site plan, and consumer details. KSEB approval typically takes 20-35 working days; Flarize tracks the application and follows up throughout. You do not need to visit a KSEB office",
  },
  {
    title: "Installation in 3-7 Days",
    description:
      "Your solar system arrives as a pre-packed kit — panels, inverter, mounting structure, cables, and all accessories. The nearest certified Flarize installer in your pincode is automatically assigned. Your rooftop solar system is installed in 3-7 working days — significantly faster than the 3-6 week industry average in Kerala",
  },
  {
    title: "System Commissioning and Monitoring Activation",
    description:
      "After installation, a Flarize engineer conducts full system commissioning — inverter configuration, initial generation check, electrical safety inspection, and monitoring dashboard activation. Your real-time solar generation data is available from the Flarize app from day one. Any performance issues are flagged automatically",
  },
  {
    title: "Net Metering Activation — Savings Begin",
    description:
      "KSEB conducts the final inspection, installs the bi-directional net meter, and activates your net metering connection. From this point, the solar units you generate reduce your electricity bill directly — and surplus units exported to the KSEB grid are credited to your account. Your solar investment is now working for you",
  },
];

const InstallationJourney = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current
        .firstElementChild as HTMLElement | null;
      const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 380;
      const scrollTo =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-linear-to-b from-[#F8F2E1] to-[#FFFFFF] py-20 font-sans overflow-hidden">
      {/* Header Container*/}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-14">
        <div className="w-full max-w-7xl mx-auto text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4 whitespace-nowrap">
            Your Solar Installation Journey in Kerala — 7 Steps Explained
          </h2>
          <p className="hidden sm:block text-center text-sm md:text-lg font-normal leading-relaxed text-[#4B5563]">
            From your first enquiry to your electricity bill dropping — here is
            exactly what happens at every step of
            <br />
            your solar installation with Flarize.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar mt-12 flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
        style={{
          paddingLeft: "max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))",
          paddingRight: "1.5rem",
        }}
      >
        {steps.map((step, idx) => (
          <article
            key={idx}
            data-card
            className="shrink-0 w-full max-w-[560px] rounded-xl border border-[#E8E4DA] bg-white p-6"
          >
            <span className="text-xs md:text-base font-normal leading-normal text-[#123532]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <hr className="my-4 border-[#EAEAEA]" />
            <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#123532]">
              {step.title}
            </h3>
            <p className="mt-3 text-xs md:text-base font-normal leading-normal text-[#444444]">
              {step.description}
            </p>
          </article>
        ))}
      </div>

      {/* Controls — also inside the centered container so they line up right */}
      <div className="max-w-[1280px] mx-auto px-6 mt-8 flex justify-end gap-3">
        <button
          onClick={() => scroll("left")}
          className="w-9 h-9 rounded-full border border-[#D9D9D9] flex items-center justify-center text-[#A5A5A5] hover:border-[#0D2B23] hover:text-[#0D2B23] transition"
          aria-label="Previous step"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-9 h-9 rounded-full border border-[#0D2B23] flex items-center justify-center text-[#0D2B23] hover:bg-[#0D2B23] hover:text-white transition"
          aria-label="Next step"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Responsiveness for the alignment calc */
        @media (max-width: 1280px) {
          .no-scrollbar {
            padding-left: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default InstallationJourney;
