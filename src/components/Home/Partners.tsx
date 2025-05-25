"use client";
import Image from 'next/image';
import React from 'react';


const logos = [
  '/p (6).png', 
  '/p (1).png',
  '/p (2).png',
  '/p (3).png',
  '/p (4).png',
  '/p (5).png',
];

const InfiniteLogoScroll = () => {
 return (
    <section className="w-full py-12 md:py-20 overflow-hidden mb-8">
     

      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15 text-center">
          Our partners in action
        </h1>
      </div>

      <div className="relative w-full overflow-hidden scroll-container">
        {/* The inner container that holds the duplicated logos and gets animated */}
        <div className="flex animate-logo-scroll will-change-transform min-w-max ">
          {/* Rendering the logos three times to create a larger seamless loop buffer */}
          {logos.map((logo, index) => (
            <div key={`logo-1-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center " style={{ width: '185px', height: 'auto ' }}>
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                width={185}
                height={46}
                objectFit="contain"
                className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div key={`logo-2-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center" style={{ width: '185px', height: 'auto' }}>
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                width={185}
                height={46}
                objectFit="contain"
                className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div key={`logo-3-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center" style={{ width: '185px', height: 'auto' }}>
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                width={185}
                height={46}
                objectFit="contain"
                className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteLogoScroll;
