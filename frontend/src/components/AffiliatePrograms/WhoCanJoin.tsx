"use client";
import React from "react";

interface Partner {
  title: string;
  desc: string;
  icon: string;
}

const partners: Partner[] = [
  {
    title: "Advisor Partners",
    desc: "Already went solar with Flarize? Help neighbours do the same and earn rewards as a Flarize Advisor. You lived the whole journey — your word converts faster than any ad we could run.",
    icon: "/images/whoCanJoin/healthicons_construction-worker.png",
  },
  {
    title: "Electrician Partners",
    desc: "You're already on the roof and inside the home. Refer the solar job to Flarize, stay on as the trusted local hand, and earn on every install — no sourcing panels, chasing subsidy, or carrying risk.",
    icon: "/images/whoCanJoin/healthicons_construction-worker (5).png",
  },
  {
    title: "Real Estate Partners",
    desc: "Every property and design conversation can include solar. You make the introduction; Flarize closes, installs and supports it — your client only ever sees a job done right.",
    icon: "/images/whoCanJoin/healthicons_construction-worker (1).png",
  },
  {
    title: "Community Partners",
    desc: "Help your community adopt solar together. Group installs across apartments and colonies mean more neighbours powered — and one accountable team standing behind every home.",
    icon: "/images/whoCanJoin/healthicons_construction-worker (2).png",
  },
  {
    title: "Creator Partners",
    desc: "Turn your audience into verified solar installs. You earn on completed installations, not on clicks or impressions — and Flarize protects the trust you built with your followers.",
    icon: "/images/whoCanJoin/healthicons_construction-worker (3).png",
  },
  {
    title: "Builders & Developers",
    desc: "Offer solar as a premium add-on for new constructions. Earn on every unit that installs.",
    icon: "/images/whoCanJoin/healthicons_construction-worker (4).png",
  },
];

export const WhoCanJoin = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#0A453D]">
          Who Can Join the Flarize Partner Program?
        </h2>
      </div>

      {/* Partner categories */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {partners.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center bg-[#F7F2E0] rounded-2xl px-6 py-8 gap-4"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FBF6E3] border border-[#EFE4BE]">
              <img
                src={encodeURI(item.icon)}
                alt={item.title}
                className="w-8 h-8 object-contain"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-[#171717]">
              {item.title}
            </h3>
            <p className="text-sm md:text-base font-normal leading-relaxed text-[#4B5563]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
