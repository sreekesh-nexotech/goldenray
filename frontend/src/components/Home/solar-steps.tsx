"use client";
import React, { useState, useEffect, useRef } from 'react';

const steps = [
  {
    id: 1,
    title: 'Get a Free Consultation & Quote',
    description: 'Talk to our solar experts, get a customized and a transparent quote – no commitments.',
    bgColor: 'bg-[#074A4D]', // Dark teal
    textColor: 'text-white',
    zIndex: 'z-30'
  },
  {
    id: 2,
    title: 'Custom Design & Installation',
    description: 'Our team will design a solar system tailored to your energy needs and professionally install it.',
    bgColor: 'bg-[#ADD6D8]', // Light blue
    textColor: 'text-[#333333]',
    zIndex: 'z-20'
  },
  {
    id: 3,
    title: 'Activate Your Solar System',
    description: 'Once installed and approved, we\'ll help you activate your system and start saving on energy bills.',
    bgColor: 'bg-[#F7BA41]', // Yellow/orange
    textColor: 'text-[#333333]',
    zIndex: 'z-10'
  },
];

export default function SolarSteps() {
  const [activeCard, setActiveCard] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval ID

  useEffect(() => {
    const section = sectionRef.current; // Capture section
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Clear any existing interval to prevent duplicates
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          // Start a new interval
          intervalRef.current = setInterval(() => {
            setActiveCard((prev) => (prev % steps.length) + 1);
          }, 5000); // Cycle every 5 seconds
        } else {
          // Clear interval when section is out of view
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (section) {
      observer.observe(section);
    }

    // Cleanup on unmount
    return () => {
      if (section) {
        observer.unobserve(section);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  //clicking a card to show the card
  const handleCardClick = (id: number) => {
    setActiveCard(id);

  };

  return (
    <div ref={sectionRef} className="flex flex-col py-10 px-4 sm:px-6 lg:px-8 xl:px-36 relative mt-10">
      <h2 className="text-3xl xl:w-1/2 sm:text-4xl lg:text-[64px] font-bold text-[#123532] mb-10 text-center xl:text-left">
        Go solar in just 3 easy steps
      </h2>
      <div className="w-full max-w-full md:flex space-y-4 md:space-y-0">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              relative flex flex-col md:p-10 p-4 py-10 md:h-[500px] rounded-3xl cursor-pointer transition-all duration-500 ease-in-out overflow-hidden w-full ${step.zIndex}
              ${step.bgColor} ${step.textColor}
              ${activeCard === step.id ? 'md:w-full' : 'md:w-1/5 md:flex md:flex-col md:justify-end md:items-center'}
            `}
            onClick={() => handleCardClick(step.id)}
          >
            {/* Step Number */}
            <div
              className={`
                absolute bottom-[-25px] md:bottom-[-78px] right-3 text-[64px] md:text-[200px] font-extrabold z-0 text-white
              `}
            >
              {step.id}
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between transition-all duration-300 ease-in-out">
              {/* Title */}
              <h2
                className={`
                  text-3xl md:text-[40px] md:w-2/3 font-medium mb-2 text-left transition-all duration-500 ease-in-out
                  ${step.textColor}
                  ${activeCard === step.id ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:-translate-y-4 md:pointer-events-none'}
                `}
              >
                {step.title}
              </h2>
              {/* Description */}
              <p
                className={`
                  text-base md:text-xl md:mb-0 mb-4 font-normal md:w-2/3 transition-all duration-500 ease-in-out text-left
                  ${step.textColor}
                  ${activeCard === step.id ? 'md:opacity-100 md:translate-y-0 md:delay-100' : 'md:opacity-0 md:-translate-y-4 md:pointer-events-none'}
                `}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}