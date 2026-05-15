"use client";

import Image from "next/image";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";
import { useState, useEffect } from "react";

export default function HeroHome() {
  const heroImages = [
    "https://golden-ray.b-cdn.net/Home%20Page/enhanced.jpeg",
    "https://golden-ray.b-cdn.net/Home%20Page/enhanced1.jpg",
  ];
  const heroImageAlts = [
    "Residential solar panel installation on a Kerala home rooftop — Flarize",
    "Commercial solar power system installed on a business rooftop in Kerala",
  ];
  const [imageIndex, setImageIndex] = useState(0);

  // Image slideshow effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(imageInterval);
  }, [heroImages.length]);

  return (
    <section className="relative w-full overflow-hidden">
      <PageIllustration />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col md:flex-row items-center h-full xl:gap-40 gap-0">
        {/* Left Side - Text */}
        <div className="w-full text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-semibold leading-tight text-[#123532] mb-4">
            Solar Energy Solutions in Kerala
          </h1>
          <p className="text-sm md:text-xl font-normal leading-relaxed text-[#444444] mb-6">
            India&apos;s first solar booking platform. Your KSEB bill isn&apos;t
            going down — we stop it from going up. Backed by Golden Ray (300+
            installations, 4.9★). KSEB approved solar EPC company for homes and
            businesses.
          </p>

          <div className="flex flex-row justify-center text-xs lg:text-lg md:justify-start lg:gap-4 gap-2 ">
            <LinkingButton
              content="Calculate Solar Advantage"
              ButtonLink="#solar-advantage"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
            />
            <LinkingButton
              content="Book Consultation"
              ButtonLink="#booking"
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-[#FFFFFF]"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-[#eeeeee]"
            />
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full mx-auto mt-10 md:mt-0 flex justify-center items-center mb-8">
          <div className="relative w-full max-w-[42rem] h-[360px]">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === imageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt={heroImageAlts[index]}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-xl object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
