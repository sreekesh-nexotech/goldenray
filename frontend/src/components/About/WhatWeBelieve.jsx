// components/WhatWeBelieve.jsx
import React from "react";
import Image from "next/image"; // Import Next.js Image component for optimization

export default function WhatWeBelieve() {
  return (
    // Main section container with responsive padding.
    <section className="py-16 px-4 sm:px-6 lg:px-4 xl:px-16  sm:pt-20 lg:pt-4">
      {/* Section Heading Container */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          The 3 Lakh Question Nobody Asks
        </h2>
      </div>

      {/* Main Content Container (Dark Green Box) */}
      <div className="max-w-7xl mx-auto bg-[#123532] rounded-2xl shadow-xl overflow-hidden p-5 lg:p-12 gap-8 flex flex-col xl:flex-row">
        <div className="w-full xl:w-[450px] h-[300px] xl:h-auto rounded-xl overflow-hidden flex-shrink-0 xl:flex-1">
          <Image
            src="https://golden-ray.b-cdn.net/images/img52.jpeg"
            alt="People enjoying a sustainable event"
            width={450}
            height={400}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Content */}
        <div className="text-[#DBD8D8] font-normal text-left max-w-3xl">
          <p className="mb-4 text-sm md:text-xl font-normal leading-relaxed">
            Look, everyone wants solar for the same reason—free electricity
            means living better. Run the AC. Work from home. Stop planning your
            life around power bills.
          </p>
          <p className="mb-4 text-sm md:text-xl font-normal leading-relaxed">
            Here&apos;s what they don&apos;t mention during the sales pitch:
            Most solar companies fold within 3-5 years. They close. Get
            acquired. Exit markets. Just... disappear.
          </p>
          <p className="mb-4 text-sm md:text-xl font-semibold leading-relaxed">
            Your system? Built to run for 25 years.
          </p>
          <p className="mb-4 text-sm md:text-xl font-normal leading-relaxed">
            When your installer vanishes in Year 3:
          </p>
          <ul className="list-disc list-inside mb-4 text-sm md:text-xl font-normal leading-relaxed space-y-2 ml-4">
            <li>Your warranty becomes worthless paper</li>
            <li>Faults pile up with nobody to call</li>
            <li>Your mom&apos;s calling because the AC stopped working</li>
            <li>
              You&apos;re Googling &quot;solar repair near me&quot; and paying
              out of pocket
            </li>
          </ul>
          <p className="mb-4 text-sm md:text-xl font-semibold leading-relaxed text-[#F7BA41]">
            You just made a ₹3 lakh, 25-year bet on a company that might not
            exist in 3 years.
          </p>
          <p className="mb-4 text-sm md:text-xl font-normal leading-relaxed">
            Flarize isn&apos;t another solar company that might fold. We&apos;re
            building something different—a platform that survives when
            individual companies don&apos;t. We keep records. Coordinate
            professionals. Ensure somebody answers the phone in Year 10.
          </p>
          <p className="mb-6 text-sm md:text-xl font-semibold leading-relaxed text-[#F7BA41]">
            Because your ₹3 lakh deserves better than crossed fingers.
          </p>
          <p className="text-sm md:text-xl font-normal leading-relaxed">
            Operations conducted in compliance with MNRE guidelines, PM Surya
            Ghar Yojana standards, and state DISCOM processes.
          </p>
        </div>
      </div>
    </section>
  );
}
