// components/WhatWeBelieve.jsx
import React from "react";
import Image from "next/image"; // Import Next.js Image component for optimization

export default function WhatWeBelieve() {
  return (
    // Main section container with responsive padding.
    <section className="py-16 px-4 sm:px-6 lg:px-4 xl:px-16  sm:pt-20 lg:pt-4">
      {/* Section Heading Container */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-[64px] font-semibold text-[#123532]">
          The 3 Lakh Question Nobody Asks
        </h1>
      </div>

      {/* Main Content Container (Dark Green Box) */}
      <div className="max-w-7xl mx-auto bg-[#123532] rounded-2xl shadow-xl overflow-hidden p-5 lg:p-12  gap-8 flex flex-col xl:flex-row items-start ">
        <Image
          src="https://golden-ray.b-cdn.net/images/0a0a625a-2531-4253-bf38-27f3839b5b34%20(1).png"
          alt="People enjoying a sustainable event"
          width={450}
          height={400}
          className="rounded-xl max-w-full h-auto mt-5"
        />

        {/* Text Content */}
        <div className="text-[#DBD8D8] font-normal text-left max-w-3xl">
          <p className="mb-4 text-base lg:text-xl">
            Look, everyone wants solar for the same reason—free electricity
            means living better. Run the AC. Work from home. Stop planning your
            life around power bills.
          </p>
          <p className="mb-4 text-base lg:text-xl">
            Here&apos;s what they don&apos;t mention during the sales pitch:
            Most solar companies fold within 3-5 years. They close. Get
            acquired. Exit markets. Just... disappear.
          </p>
          <p className="mb-4 text-base lg:text-xl font-semibold">
            Your system? Built to run for 25 years.
          </p>
          <p className="mb-4 text-base lg:text-xl">
            When your installer vanishes in Year 3:
          </p>
          <ul className="list-disc list-inside mb-4 text-base lg:text-xl space-y-2 ml-4">
            <li>Your warranty becomes worthless paper</li>
            <li>Faults pile up with nobody to call</li>
            <li>Your mom&apos;s calling because the AC stopped working</li>
            <li>
              You&apos;re Googling &quot;solar repair near me&quot; and paying
              out of pocket
            </li>
          </ul>
          <p className="mb-4 text-base lg:text-xl font-semibold text-[#F7BA41]">
            You just made a ₹3 lakh, 25-year bet on a company that might not
            exist in 3 years.
          </p>
          <p className="mb-4 text-base lg:text-xl">
            Flarize isn&apos;t another solar company that might fold. We&apos;re
            building something different—a platform that survives when
            individual companies don&apos;t. We keep records. Coordinate
            professionals. Ensure somebody answers the phone in Year 10.
          </p>
          <p className="mb-6 text-base lg:text-xl font-semibold text-[#F7BA41]">
            Because your ₹3 lakh deserves better than crossed fingers.
          </p>
          <p className="text-base  lg:text-xl ">
            Operations conducted in compliance with MNRE guidelines, PM Surya
            Ghar Yojana standards, and state DISCOM processes.
          </p>
        </div>
      </div>
    </section>
  );
}
