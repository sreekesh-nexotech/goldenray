// components/WhatWeBelieve.jsx
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component for optimization

export default function WhatWeBelieve(){
  return (
    // Main section container with responsive padding.
    <section className="py-16 px-4 sm:px-6 lg:px-4 xl:px-16  sm:pt-20 lg:pt-4">
      
      {/* Section Heading Container */}
      <div className="max-w-7xl mx-auto text-center mb-16"> 
        <h1 className="text-3xl md:text-4xl lg:text-[64px] font-semibold text-[#123532]">
          What We Believe
        </h1>
      </div>

      {/* Main Content Container (Dark Green Box) */}
      <div className="max-w-7xl mx-auto bg-[#123532] rounded-2xl shadow-xl overflow-hidden p-5 lg:p-12  gap-8 flex flex-col xl:flex-row items-center ">
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
            At Flarize, we believe solar should feel simple, honest, and dependable—just the way people in Kerala expect things to be. No confusing technical terms. No hidden charges. Just clean, affordable solar energy that fits naturally into your home or business.
          </p>
          <p className="mb-4 text-base lg:text-xl">
            We’re a team of innovators, problem-solvers, and solar enthusiasts who understand Kerala’s
rooftops, climate, and power needs. Our mission is to help families and businesses use the sun
wisely—through clear guidance, seamless installation, and reliable long-term support. We handle
the complexity, so you don’t have to.
          </p>
          <p className="text-base lg:text-xl    ">
            For us, solar energy isn’t just another option. It’s a practical step toward lower electricity bills,
energy independence, and a cleaner Kerala. And we’re here to make that transition smooth,
transparent, and stress-free.
          </p>
        </div>
      </div>
    </section>
  );
};
