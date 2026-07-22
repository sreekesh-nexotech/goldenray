"use client";

import Image from "next/image";

export default function Page6Content() {
  const stats = [
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#F88A22]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      main: "300+",
      sub: "Successful Installations",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#F88A22]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      main: "8+ Years",
      sub: "Industry Experience",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#F88A22]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z"
          />
        </svg>
      ),
      main: "CERTIFIED",
      sub: "INSTALLATION TEAM",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#F88A22]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      main: "KERALA",
      sub: "Wide Service",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#F88A22]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      main: "MNRE",
      sub: "Government Certified",
    },
  ];

  const solarImages = [
    "https://golden-ray.b-cdn.net/quotation-document/0fa2940cc26cbd37d892e79c7a1230134665335c.jpg",
    "https://golden-ray.b-cdn.net/quotation-document/16e4761db567b5c1a1d3dc13b51be605823825a4%20(1).jpg",
    "https://golden-ray.b-cdn.net/quotation-document/16e4761db567b5c1a1d3dc13b51be605823825a4.jpg",
    "https://golden-ray.b-cdn.net/quotation-document/1bdf2d751001a1caaa19f18e93f36fd74f196110.jpg",
    "https://golden-ray.b-cdn.net/quotation-document/3fbe4a9660430870305dc8b961d296205b591098.jpg",
    "https://golden-ray.b-cdn.net/quotation-document/4e88f9f7a610e4c5234ba6b391d39dfc29eceed0.jpg",
    "https://golden-ray.b-cdn.net/quotation-document/95b00dab742281953b57e0ce1f42066920afd12f.jpg",
    "https://golden-ray.b-cdn.net/quotation-document/dbb05df00ee3d6d3bebb84aae866fd165de2bfc4.jpg",
  ];

  const handPicked = [
    {
      icon: "https://golden-ray.b-cdn.net/quotation-document/Frame%202147225137.png",
      title: "Tier 1 Brand",
      sub: "Bloomberg-listed manufacture",
    },
    {
      icon: "https://golden-ray.b-cdn.net/quotation-document/Frame%202147225137%20(2).png",
      title: "PVEL Top Performer",
      sub: "Independently lab tested",
    },
    {
      icon: "https://golden-ray.b-cdn.net/quotation-document/Frame%202147225137%20(1).png",
      title: "ALMM2 Listed",
      sub: "Domestic cell manufacturing",
    },
    {
      icon: "https://golden-ray.b-cdn.net/quotation-document/Frame%202147225139.png",
      title: "Easy Warranty Claims",
      sub: "Direct manufacturer support",
    },
    {
      icon: "https://golden-ray.b-cdn.net/quotation-document/Frame%202147225140.png",
      title: "Local stock available",
      sub: "Fast replacement parts",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Why Choose Flarize */}
      <div className="px-2 mt-2">
        <h1 className="text-[22px] font-bold mb-2">
          <span className="text-[#1a1a1a]">Why Choose </span>
          <span className="text-[#F88A22]">Flarize?</span>
        </h1>
        <p className="text-[11px] text-[#1a1a1a] leading-relaxed mb-3">
          A solar system is one of the smartest investments you&apos;ll make
          for your home—but its long-term performance depends on choosing the
          right installer. At Flarize, we combine quality workmanship, premium
          components, transparent pricing, and dependable after-sales support
          to help you enjoy worry-free solar for years to come.
        </p>

        {/* Our Promise */}
        <p className="text-[11px] text-[#1a1a1a] leading-relaxed mb-4 pl-3">
          &ldquo;<span className="font-bold">Our Promise:</span> Your solar
          journey doesn&apos;t end on installation day. We&apos;re committed to
          helping you enjoy reliable performance, lower electricity bills, and
          dependable support for years to come.&rdquo;
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-2 px-2 mb-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="border border-[#F8B878] rounded-lg py-2.5 px-1 flex flex-col items-center text-center bg-white"
          >
            <span className="mb-1.5">{stat.icon}</span>
            <p className="text-[11px] font-bold text-[#F88A22] leading-tight">
              {stat.main}
            </p>
            <p className="text-[8px] text-[#1a1a1a] leading-tight mt-0.5">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Homes We've Powered - dark band (full bleed) */}
      <div
        className="bg-[#F3F4F6]"
        style={{ margin: "0 -10mm", padding: "14px 10mm 16px" }}
      >
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-[19px] font-bold text-black leading-tight">
            Homes We&apos;ve Powered Across Kerala
          </h2>
          <p className="text-[10px] text-black">
            300+ Projects Across Kerala
          </p>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-4 gap-2">
          {solarImages.map((src, idx) => (
            <div
              key={idx}
              className="relative w-full h-[150px] rounded-sm overflow-hidden"
            >
              <Image
                src={src}
                alt={`Solar installation ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      {/* We Hand Picked For Your Home */}
      <div className="mt-5 px-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 border-t border-gray-300" />
          <h3 className="text-[12px] font-semibold text-[#1a1a1a] tracking-[0.15em] uppercase whitespace-nowrap">
            We Hand Picked For Your Home
          </h3>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {handPicked.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="relative w-[42px] h-[42px] mb-1.5">
                <Image
                  src={item.icon}
                  alt={item.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-[10px] font-bold text-[#1a1a1a] leading-tight">
                {item.title}
              </p>
              <p className="text-[8.5px] text-gray-600 leading-tight mt-0.5">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
