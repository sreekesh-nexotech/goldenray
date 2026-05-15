"use client";
import { UserGroupIcon } from "@heroicons/react/16/solid";
import { Building2, ChartLine, Hammer, Laptop, Star } from "lucide-react";
import React from "react";

interface Professional {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const professionals: Professional[] = [
  {
    title: "Real Estate Agents",
    desc: "Every property transaction is a natural solar conversation. Homebuyers in Kerala actively ask about solar readiness, KSEB net metering, and long-term electricity cost reduction. As an agent, you already have the trust and the timing. Add Rs.8,000+ to every completed transaction without changing your existing workflow. Agents in our program average 4-6 referrals per month",
    icon: <Building2 color="#074A4D" width={20} height={20} />,
  },
  {
    title: "Builders & Developers",
    desc: "Residential projects, apartment complexes, and villa developments are increasingly expected to come solar ready. By joining our affiliate program, you earn commission on every unit that installs — and offer buyers a genuine value-add that many competitors cannot match. Bulk referrals for society-wide installations are eligible.",
    icon: <Hammer color="#074A4D" width={20} height={20} />,
  },
  {
    title: "Influencers & Content Creators",
    desc: "A single post, reel, or story reaching a Kerala audience can generate multiple installation referrals. Your commission is tracked per verified installation, not per click or lead — so you earn only when the homeowner actually goes solar. We provide ready-to-use digital content, captions, and talking points",
    icon: <Star color="#074A4D" width={20} height={20} />,
  },
  {
    title: "Financial Advisors and Wealth Planners",
    desc: "Solar payback periods in Kerala currently run 4-6 years, depending on system size and KSEB tariff bracket. Clients looking to reduce fixed household expenses are already pre-sold on ROI. The solar conversation fits naturally into discussions about long-term financial planning and expense optimisation.",
    icon: <ChartLine color="#074A4D" width={20} height={20} />,
  },
  {
    title: "Freelancers and Gig Workers",
    desc: "Build a referral income stream that runs in parallel with your existing work. No inventory, no capitaloutlay, no operational responsibility. Your role ends when you make the introduction; your income begins when installation completes. Most freelance partners earn Rs.16,000 Rs.32,000 per month from 2-4 referrals",
    icon: <Laptop color="#074A4D" width={20} height={20} />,
  },
  {
    title: "Society Leaders and RWA Representatives",
    desc: "Society-level referrals convert at the highest rate of any partner type — because residents already trust your recommendation. Coordinate multiple installations within your housing society or ward and earn commission on each. Flarize supports group installation planning at no additional cost to you",
    icon: <UserGroupIcon className="text-[#074A4D] w-5 h-5" />,
  },
];

export const WhoCanJoin = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Who Can Join the Kerala Solar Affiliate Program?
        </h2>
        <p className="hidden sm:block text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          The program is open to any Kerala professional with an existing
          network of trust. You do not need solar industry knowledge. You do not
          need to close the sale. Flarize&apos;s sales team handles every
          technical discussion, site visit, KSEB documentation, and follow-up —
          from your first referral to the final installation confirmation.
        </p>
      </div>

      {/* Professional categories */}
      <div className="w-full max-w-7xl flex overflow-x-auto gap-4 lg:grid  lg:grid-cols-3 md:gap-6 no-scrollbar">
        {professionals.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-[#F7F4E6] border border-[#E5E5E5] rounded-xl px-6 py-4 gap-2 min-w-[75vw] max-w-[75vw] lg:min-w-0 lg:max-w-none items-center text-center "
          >
            <div className="w-fit bg-white p-2 rounded-lg shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
              {item.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#171717]">
              {item.title}
            </h3>
            <p className="text-xs md:text-base font-normal leading-normal text-[#525252]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
