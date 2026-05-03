"use client";
import React, { useRef } from "react";
import { Layers } from "lucide-react";

const differences = [
  {
    title: "3 Quotes, Not 1",
    desc: "Most solar companies give you a single quote and that’s the one—you have no way to know if it’s fair. Flarize gives you three options with different panel brands and budgets. You compare, you choose. We show you what the fair price looks like so you seeing multiple market-rate options at once.",
  },
  {
    title: "Fastest Solar Installation in Kerala — 3-7 Days",
    desc: "Other companies order materials per customer (1-2 weeks), ship from a central warehouse (3-5 days), and send installation teams from a central office. Total 3–4 weeks before you go solar. Flarize sources pre-specified system kits and the nearest certified local installer in your pincode — resulting in 3-7 day installation.",
  },
  {
    title: "Energy Loss Guarantee — Unique to Flarize",
    desc: "If your solar system has a reported outage lasting more than 48 hours, Flarize compensates you for lost electricity production. No other solar company in Kerala offers this structure. It means Flarize’s financial interests are directly tied to your system uptime — not just your installation day.",
  },
  {
    title: "Uber-Style Service Network",
    desc: "When your system needs attention, the nearest contracted Flarize service technician is automatically dispatched to your location — not a central-office team somewhere across the district. Local technician, fast response, full accountability.",
  },
  {
    title: "One Brand for the Full 25 Years",
    desc: "Most Kerala solar installers are small local companies. If they close in three years, who services your system? Flarize owns the complete customer relationship from installation and beyond for the system’s 25-year life. One brand. One number. One responsibility. No handoffs!",
  },
];

const Difference = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Carousel scroll for mobile
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement | null;
      const scrollAmount = card ? card.offsetWidth + 16 : 320;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-bold text-[#123532] mb-4">
          Why Flarize Is Different from Any Other Kerala Solar Company
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Five structural differences — not marketing claims — that change how you experience solar installation and ownership in Kerala
        </p>
      </div>

      {/* Grid for desktop, carousel for mobile */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Top row: 3 cards */}
        {differences.slice(0, 3).map((item, idx) => (
          <div key={idx} className="bg-[#074A4D] rounded-xl p-7 flex flex-col h-full min-h-[260px]">
            <Layers className="text-white mb-4" size={32} />
            <div className="text-white font-medium text-xl mb-2">{item.title}</div>
            <div className="text-[#B2B2B2] text-base  leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Bottom row: 2 cards */}
        {differences.slice(3).map((item, idx) => (
          <div key={idx} className="bg-[#074A4D] rounded-xl p-7 flex flex-col h-full min-h-[260px]">
            <Layers className="text-white mb-4" size={32} />
            <div className="text-white font-medium text-xl mb-2">{item.title}</div>
            <div className="text-[#B2B2B2] text-base leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Carousel for mobile */}
      <div className="w-full md:hidden relative">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory scroll-smooth" ref={scrollRef}>
          {differences.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[70vw] max-w-[70vw] bg-[#074A4D] rounded-xl p-6 flex flex-col snap-start h-auto"
            >
              <Layers className="text-white mb-4" size={32} />
              <div className="text-white text-lg mb-2">{item.title}</div>
              <div className="text-[#B2B2B2] text-sm leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
        {/* Carousel controls */}
        <div className="flex justify-end gap-2 mt-2 pr-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-[#D9D9D9] flex items-center justify-center text-[#A5A5A5] hover:border-[#0D2B23] hover:text-[#0D2B23] transition-all"
            aria-label="Previous difference"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[#0D2B23] flex items-center justify-center text-[#0D2B23] bg-white hover:bg-[#0D2B23] hover:text-white transition-all"
            aria-label="Next difference"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Difference;