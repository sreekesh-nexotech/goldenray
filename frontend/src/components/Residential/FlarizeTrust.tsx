"use client";
import React from "react";
import {
  HardHat,
  Layers,
  FileText,
  SearchCheck,
  SunMedium,
  UserSearch,
} from "lucide-react";
import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

const differences = [
  {
    icon: HardHat,
    title: "Pre-qualified installers",
    desc: "You never meet a random installer. Each is checked for licence, past work, service history, and customer feedback before they touch your roof.",
  },
  {
    icon: Layers,
    title: "3 reviewed options, not 1 quote",
    desc: "Three checked choices — different brands and budgets, same guarantee. You pick. No guessing if the price is fair.",
  },
  {
    icon: FileText,
    title: "You pay as the work is done",
    desc: "Payment follows real progress. Nobody is paid for work they haven't finished. The risk stays off you.",
  },
  {
    icon: SearchCheck,
    title: "We inspect the finished job",
    desc: "Before you sign off, a Flarize engineer checks the install against our standard. If it's not right, we fix it.",
  },
  {
    icon: SunMedium,
    title: "One brand, one responsibility",
    desc: "You always deal with Flarize — never a chain of vendors blaming each other. One number, for 25 years.",
  },
  {
    icon: UserSearch,
    title: "Nearby support, when you need it",
    desc: "Checked technicians work in your district and answer to Flarize, so help is close and someone always owns the problem.",
  },
];


const avatars = [
  { src: "/team1.png", alt: "Flarize solar customer" },
  { src: "/team2.png", alt: "Flarize solar customer" },
  { src: "/team3.png", alt: "Flarize solar customer" },
];

const FlarizeTrust = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-10">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Why Homeowners Trust Flarize
        </h2>
      </div>

      {/* Horizontally scrollable on mobile, 3 x 2 grid from sm+ */}
      <div className="w-full flex overflow-x-auto gap-4 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible">
        {differences.map(({ icon: Icon, title, desc }, idx) => (
          <div
            key={idx}
            className="group shrink-0 min-w-[80vw] max-w-[80vw] sm:min-w-0 sm:max-w-none bg-[#074A4D] rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-white/20">
              <Icon className="text-white" size={24} strokeWidth={1.75} />
            </div>
            <h3 className="text-white text-xl font-semibold leading-snug mb-3">
              {title}
            </h3>
            <p className="text-[#A9B6B3] text-sm md:text-[15px] font-normal leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="rounded-2xl bg-[#FDF6E3] px-6 py-6 md:px-10 md:py-8">
        <p className="text-sm md:text-base leading-relaxed text-[#171717]">
          <span className="font-semibold">Who does the actual work?</span>{" "}
          Installation partners verified by Flarize and anchored by Golden Ray
          Renewable Energy — the same crew with 8+ years of solar work on Kerala
          roofs. Every partner must hold a valid electrical licence, pass a
          past-work audit, and provide customer references. Fall below the
          standard, and they&apos;re out.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <LinkingButton
          content="Switch to Solar with Flarize"
          ButtonLink="/contactus"
          ButtonBg="bg-[#F7BA41]"
          Buttontext="text-[#272218]"
          ButtonHover="hover:bg-yellow-500"
          className="px-10 py-3 md:px-14 md:py-4"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center -space-x-3">
          {avatars.map(({ src, alt }) => (
            <Image
              key={src}
              src={src}
              alt={alt}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
            />
          ))}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7E7E7] text-[10px] font-semibold text-[#5A5A5A] ring-2 ring-white">
            +296
          </span>
        </div>
        <p className="text-sm md:text-base text-[#757575]">
          Join 300+ Happy Kerala Families
        </p>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FlarizeTrust;
