"use client";

import Image from "next/image";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";
import { useState, useEffect } from "react";

export default function HeroHome() {
  const heroImages = [
    "https://golden-ray.b-cdn.net/images/slide1.jpg",
    "https://golden-ray.b-cdn.net/images/slide2.jpeg",
  ];
  const [imageIndex, setImageIndex] = useState(0);

  // Simplified and robust state management for the animation is retained
  const words = ["months", "weeks", "days!"];
  const [wordIndex, setWordIndex] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  // Image slideshow effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(imageInterval);
  }, [heroImages.length]);

  useEffect(() => {
    const cycleAnimation = () => {
      setIsFadingIn(false); // Start fade-out

      setTimeout(() => {
        setWordIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % words.length;
          setIsStriking(false);

          if (nextIndex < words.length - 1) {
            setTimeout(() => setIsStriking(true), 100);
          }

          setIsFadingIn(true); // Start fade-in
          return nextIndex;
        });
      }, 500);
    };

    const interval = setInterval(cycleAnimation, 3000);
    setTimeout(() => setIsStriking(true), 1000);

    return () => clearInterval(interval);
  }, []);

  const currentWord = words[wordIndex];
  const showStrike = isStriking && wordIndex < words.length - 1;

  // NOTE: Guideline [5]: Ensure your main layout file has the viewport meta tag:
  // <meta name="viewport" content="width=device-width, initial-scale=1">

  return (
    <section className="relative w-full overflow-hidden md:mt-8 xl:mt-12 2xl:mt-16">
      <PageIllustration />

      {/* Content */}
      {/* Design restored to original breakpoint-based layout as requested */}
      <div className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col md:flex-row items-center h-full xl:gap-40 gap-0">
        {/* Left Side - Text */}
        <div className="w-full text-center md:text-left">
          {/* Guideline [4]: Original responsive classes restored to preserve design */}
          {/* Guideline [1]: Font sizes converted to rem where possible without layout changes */}
          <h1 className="text-[2.5rem]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
            We help you go solar in{" "}
            <span className="text-[#ED8723] inline-block relative">
              <span
                className={`transition-opacity duration-500 ${
                  isFadingIn ? "opacity-100" : "opacity-0"
                }`}
              >
                <span
                  className={`strike-through-animation ${
                    showStrike ? "active" : ""
                  }`}
                >
                  {currentWord}
                </span>
              </span>
            </span>
          </h1>
          {/* Guideline [4]: Original responsive classes restored */}
          <p className="text-base sm:text-lg md:text-2xl text-[#444444] mb-6">
            Save more, live sustainably, and enjoy a brighter future with
            effortless solar solutions.
          </p>

          {/* Guideline [8]: Buttons have sufficient size and spacing for touch targets */}
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
                  alt={`Solar House ${index + 1}`}
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
