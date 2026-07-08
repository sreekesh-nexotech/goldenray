"use client";
import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Share Your KSEB Electricity Bill",
    description:
      "Send it on WhatsApp or our site. Flarize sizes your system from your real usage, so it's never too big or too small.",
    image: "https://golden-ray.b-cdn.net/images/1.png",
  },
  {
    title: "Get your 3 reviewed options",
    description:
      "Within 24 hours. Three brands and budgets we've already checked. Same size, same guarantee. You choose.",
    image: "https://golden-ray.b-cdn.net/images/2.png",
  },
  {
    title: "Free Roof Site Assessment",
    description:
      "A Flarize engineer checks your roof space, sunlight, structure, and wiring before suggesting anything.",
    image: "https://golden-ray.b-cdn.net/images/3.png",
  },
  {
    title: "We do your paperwork",
    description:
      "Flarize files your KSEB net-metering and your ₹78,000 subsidy. You don't stand in any government queue.",
    image: "https://golden-ray.b-cdn.net/images/4.png",
  },
  {
    title: "Your installation in 3–7 days",
    description:
      "A checked local team does the work. You pay in stages as it's done — never up front for work that hasn't happened.",
    image: "https://golden-ray.b-cdn.net/images/5.png",
  },
  {
    title: "Inspection & switch-on",
    description:
      "A Flarize engineer checks the finished job before you sign off. Then KSEB approves and your meter runs backward.",
    image: "https://golden-ray.b-cdn.net/images/6.png",
  },
  {
    title: "Support for 25 years",
    description:
      "App monitoring, service visits, and a written energy-loss guarantee. One number, for the life of your system.",
    image: "https://golden-ray.b-cdn.net/images/7.png",
  },
];

const InstallationJourney = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current
        .firstElementChild as HTMLElement | null;
      const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
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
        <div className="w-full max-w-7xl mx-auto text-left md:text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Your solar journey in Kerala — 7 steps explained
          </h2>
          <p className="text-center text-sm md:text-lg font-normal leading-relaxed text-[#4B5563]">
            From your first message to a smaller bill — here&apos;s exactly what
            happens, and Flarize owns every step.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar mt-12 flex items-stretch gap-5 overflow-x-auto scroll-smooth"
        style={{
          paddingLeft: "max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))",
          paddingRight: "1.5rem",
        }}
      >
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <article
              data-card
              className="group shrink-0 w-[280px] md:w-[300px] flex flex-col rounded-2xl border border-[#ECE7DA] bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-[#F7BA41]"
            >
              <h3 className="min-h-[3.5rem] text-lg md:text-xl font-semibold leading-snug text-[#123532]">
                {step.title}
              </h3>

              <div className="mt-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#FAFAF6]">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="h-full w-full object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>

              <hr className="my-4 border-[#EFEFEF]" />

              <p className="text-sm md:text-[15px] font-normal leading-relaxed text-[#555555]">
                {step.description}
              </p>
            </article>

            {idx < steps.length - 1 && (
              <div className="flex shrink-0 items-center self-center text-[#C4C0B5]">
                <ArrowRight size={22} strokeWidth={2} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Controls — also inside the centered container so they line up right */}
      <div className="max-w-[1280px] mx-auto px-6 mt-10 flex justify-end gap-3">
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
