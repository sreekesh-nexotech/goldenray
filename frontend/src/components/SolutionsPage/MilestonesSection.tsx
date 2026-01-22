// src/components/SolutionsPage/MilestonesSection.tsx
"use client";
import { Milestone } from "@/data/solutions-page-data";
import Image from "next/image";
import { useState } from "react";
import vector1 from "../../../public/Vector-1.png";

interface MilestonesSectionProps {
  title?: string;
  milestones: Milestone[];
}

export default function MilestonesSection({
  title = "Our Milestones",
  milestones,
}: MilestonesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % milestones.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + milestones.length) % milestones.length
    );
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12 md:mb-16">
          {title}
        </h2>

        {/* Mobile Slider View */}
        <div className="md:hidden">
          <div className="relative flex flex-col items-center text-center max-w-sm mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`w-full transition-opacity duration-300 ${
                  index === currentSlide ? "block" : "hidden"
                }`}
              >
                {/* Milestone Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {milestone.title}
                </h3>

                {/* Milestone Description */}
                <p className="text-gray-600 text-sm mb-8 px-4">
                  {milestone.description}
                </p>

                {/* Timeline with Icon and Yellow Line */}
                <div className="relative flex items-center justify-center mb-8">
                  {/* Yellow Dashed Line - Full width behind dot */}
                  <div className="absolute left-0 right-0 top-[calc(100%-0.6rem)] h-0">
                    <div
                      className="w-full border-t-2 border-[#FDB913]"
                      style={{
                        borderStyle: "dashed",
                        borderTopWidth: "2px",
                        borderImageSlice: 1,
                        borderImageSource: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='0' y1='0' x2='100%25' y2='0' stroke='%23FDB913' stroke-width='2' stroke-dasharray='20,10' /%3e%3c/svg%3e")`,
                      }}
                    />
                  </div>

                  {/* Icon Circle with Yellow Dot */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-[#2C5F5D] rounded-full flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <Image
                          src={vector1}
                          fill
                          alt="Solar panel icon"
                          className="object-contain brightness-0 invert"
                          sizes="40px"
                        />
                      </div>
                    </div>
                    {/* Yellow Dot with green border */}
                    <div className="w-5 h-5 bg-[#FDB913] rounded-full border-2 border-[#2C5F5D]" />
                  </div>
                </div>

                {/* Date with Navigation Arrows */}
                <div className="flex items-center justify-between w-full px-4 gap-4">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-[#2C5F5D] flex items-center justify-center text-white hover:bg-[#234948] transition-colors flex-shrink-0"
                    aria-label="Previous milestone"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <p className="text-lg font-bold text-gray-900 text-center flex-1">
                    {milestone.date}
                  </p>

                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-[#2C5F5D] flex items-center justify-center text-white hover:bg-[#234948] transition-colors flex-shrink-0"
                    aria-label="Next milestone"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet Grid View */}
        <div className="hidden md:block">
          <div className="relative grid grid-cols-3 gap-6 lg:gap-8">
            {/* Continuous Dashed Line - Passes through center of yellow dots */}
            <div className="absolute left-0 right-0 top-[calc(50%+6.3rem)]">
              <div
                className="w-full border-t-2 border-[#FDB913]"
                style={{
                  borderStyle: "dashed",
                  borderTopWidth: "2px",
                  borderImageSlice: 1,
                  borderImageSource: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='0' y1='0' x2='100%25' y2='0' stroke='%23FDB913' stroke-width='2' stroke-dasharray='20,10' /%3e%3c/svg%3e")`,
                }}
              />
            </div>

            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                {/* Milestone Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3 min-h-[3rem] flex items-center">
                  {milestone.title}
                </h3>

                {/* Milestone Description */}
                <p className="text-gray-600 text-lg lg:text-xl mb-10 max-w-xs">
                  {milestone.description}
                </p>

                {/* Timeline with Icon */}
                <div className="relative w-full flex items-center justify-center mb-10">
                  {/* Icon Circle with Yellow Dot */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-[#2C5F5D] rounded-full flex items-center justify-center">
                      <div className="relative w-10 h-10">
                        <Image
                          src={vector1}
                          fill
                          alt="Solar panel icon"
                          className="object-contain brightness-0 invert"
                          sizes="40px"
                        />
                      </div>
                    </div>
                    {/* Yellow Dot - positioned so line passes through center */}
                    <div className="w-5 h-5 bg-[#FDB913] rounded-full relative z-20 border-2 border-[#2C5F5D]" />
                  </div>
                </div>

                {/* Date */}
                <p className="text-lg lg:text-xl font-bold text-gray-900">
                  {milestone.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
