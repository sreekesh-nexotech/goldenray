"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";

const reviews = [
  {
    stats: [
      { value: "45", label: "Days to Subsidy" },
      { value: "3 Days", label: "Installation Time" },
    ],
    quote:
      '"Switching to solar with Flarize was seamless. They handled everything from paperwork to installation. Got my ₹60,000 subsidy in just 28 days!"',
    rating: 5,
    author: "Rajesh Sharma & Family, Cochin",
    details: "3 kW System | Installed June 2025",
  },
  {
    stats: [
      { value: "30", label: "Days to Subsidy" },
      { value: "2 Days", label: "Installation Time" },
    ],
    quote:
      '"No government office visits, no confusion. Flarize\'s team did everything. Our electricity bill dropped from ₹4,500 to ₹1,200. Best decision ever!"',
    rating: 5,
    author: "Priya Menon",
    details: "Thrissur | 3kW System | ₹78,000 Subsidy Received",
  },
  {
    stats: [
      { value: "52", label: "Days to Subsidy" },
      { value: "2 Days", label: "Installation Time" },
    ],
    quote:
      '"The 24/7 support team is amazing. I had a question on Day 3, they solved it in 10 minutes. Subsidy came exactly on day 30 as promised!"',
    rating: 5,
    author: "Anand Krishnan",
    details: "Ernakulam | 2kW System | Free Site Assessment",
  },
];

export default function FlarizeReview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Swipe Handlers
  const handleSwipedLeft = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    currentIndexRef.current = (currentIndexRef.current + 1) % reviews.length;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSwipedRight = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length,
    );
    currentIndexRef.current =
      (currentIndexRef.current - 1 + reviews.length) % reviews.length;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipedLeft,
    onSwipedRight: handleSwipedRight,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 10,
  });

  // Autoplay Effect - Only on mobile
  useEffect(() => {
    if (isMobile) {
      intervalRef.current = window.setInterval(() => {
        const nextIndex = (currentIndexRef.current + 1) % reviews.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isMobile]);

  // Dot Navigation Handler
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    currentIndexRef.current = index;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="overflow-hidden py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-28 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-bold text-[#123532] mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18 text-center">
          Real Kerala Families, Real Results
        </h2>

        {/* Carousel Container */}
        <div
          {...swipeHandlers}
          className="relative overflow-hidden md:overflow-visible"
        >
          <div
            ref={sliderRef}
            className="flex md:grid md:grid-cols-3 transition-transform duration-700 ease-in-out gap-0 md:gap-6 md:transition-none"
            style={{
              transform: isMobile
                ? `translateX(-${currentIndex * 100}%)`
                : "translateX(0)",
            }}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-auto px-4 md:px-0"
              >
                <div className="bg-[#F7F7F2] rounded-2xl sm:rounded-2xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8 2xl:p-10 h-full flex flex-col mx-auto max-w-lg md:max-w-none">
                  {/* Stats */}
                  <div className="flex justify-between items-start mb-4 sm:mb-5 lg:mb-6 xl:mb-6 2xl:mb-8">
                    <div className="text-left">
                      <p className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold text-[#123532]">
                        {review.stats[0].value}
                      </p>
                      <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg text-[#444444]">
                        {review.stats[0].label}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold text-[#123532]">
                        {review.stats[1].value}
                      </p>
                      <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg text-[#444444]">
                        {review.stats[1].label}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-300 mb-4" />

                  {/* Quote */}
                  <p className="text-[#444444] mb-4 sm:mb-5 lg:mb-6 xl:mb-6 2xl:mb-8 text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg leading-relaxed flex-grow">
                    {review.quote}
                  </p>

                  {/* Author */}
                  <p className="text-[#123532] font-semibold text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg mb-1 sm:mb-2">
                    {review.author}
                  </p>

                  {/* Details */}
                  <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-base text-[#6B7280]">
                    {review.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots - Only on Mobile */}
        <div className="flex md:hidden justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full ${
                currentIndex === index ? "bg-[#123532]" : "bg-gray-300"
              } transition-colors duration-300`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
