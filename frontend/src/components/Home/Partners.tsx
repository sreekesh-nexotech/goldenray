"use client";
import Image from "next/image";
import React from "react";

const logos = [
  "https://golden-ray.b-cdn.net/Company%20Logos/axitec-energy-seeklogo.png",
  "https://golden-ray.b-cdn.net/Company%20Logos/fronius-seeklogo.png",
  "https://golden-ray.b-cdn.net/Company%20Logos/sma-solar-technology-seeklogo.png",
  "https://golden-ray.b-cdn.net/Company%20Logos/sungrow-seeklogo.png",
  "https://golden-ray.b-cdn.net/Company%20Logos/WhatsApp%20Image%202026-02-03%20at%202.17.41%20PM.jpeg",
  "https://golden-ray.b-cdn.net/Company%20Logos/WhatsApp%20Image%202026-02-03%20at%202.19.18%20PM.jpeg",
  "https://golden-ray.b-cdn.net/Company%20Logos/WhatsApp%20Image%202026-02-03%20at%202.24.38%20PM.jpeg",
  "https://golden-ray.b-cdn.net/Company%20Logos/WhatsApp%20Image%202026-02-03%20at%202.26.08%20PM.jpeg",
  "https://golden-ray.b-cdn.net/Company%20Logos/WhatsApp%20Image%202026-02-03%20at%202.32.40%20PM.jpeg",
];

const InfiniteLogoScroll = () => {
  return (
    <section className="w-full py-8 md:py-12 xl:py-10 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-8 text-center">
          Our partners in action
        </h2>
      </div>

      <div className="relative w-full overflow-hidden scroll-container">
        {/* The inner container that holds the duplicated logos and gets animated */}
        <div className="flex animate-logo-scroll will-change-transform min-w-max">
          {/* Rendering the logos three times to create a larger seamless loop buffer */}
          {logos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="flex-shrink-0 mx-3 md:mx-8 flex items-center justify-center w-[100px] md:w-[185px] h-auto"
            >
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                width={185}
                height={46}
                className="opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain w-full h-auto"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="flex-shrink-0 mx-3 md:mx-8 flex items-center justify-center w-[100px] md:w-[185px] h-auto"
            >
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                width={185}
                height={46}
                className="opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain w-full h-auto"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div
              key={`logo-3-${index}`}
              className="flex-shrink-0 mx-3 md:mx-8 flex items-center justify-center w-[100px] md:w-[185px] h-auto"
            >
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                width={185}
                height={46}
                className="opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteLogoScroll;
