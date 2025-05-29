// components/WhatWeBelieve.jsx
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component for optimization

export default function WhatWeBelieve(){
  return (
    // Main section container with responsive padding.
    <section className="py-16 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-36">
      
      {/* Section Heading Container */}
      <div className="max-w-6xl mx-auto text-center mb-16"> 
        <h1 className="text-3xl md:text-4xl lg:text-[64px] font-semibold text-[#123532]">
          What We Believe
        </h1>
      </div>

      {/* Main Content Container (Dark Green Box) */}
      <div className="max-w-6xl mx-auto bg-[#123532] rounded-2xl shadow-xl overflow-hidden p-5 lg:p-12  gap-8 flex flex-col xl:flex-row items-start ">
        <Image
          src="/abt-believe.png"
          alt="People enjoying a sustainable event"
          width={900}
          height={400} 
          className="rounded-xl max-w-full h-auto"
        />

        {/* Text Content */}
        <div className="text-[#DBD8D8] font-normal text-left max-w-3xl">
          <p className="mb-4 text-base lg:text-xl">
            At Flarize, we believe solar should be simple. No confusing jargon. No hidden fees. Just clean, affordable energy made easy.
          </p>
          <p className="mb-4 text-base lg:text-xl">
            We’re a team of innovators, problem-solvers, and solar enthusiasts on a mission to help homes and businesses power their future with the sun. From seamless installation to ongoing support, we make the switch effortless—so you can save money and shrink your carbon footprint without the headache.
          </p>
          <p className="text-base lg:text-xl    ">
            Solar energy isn’t just an option. It’s the future. And we’re here to make it happen.
          </p>
        </div>
      </div>
    </section>
  );
};
