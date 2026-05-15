"use client";
import React, { useState, useEffect, useRef } from "react";

const steps = [
  {
    id: 1,
    title: "Get a Free Consultation & Quote",
    description:
      "No generic sales pitch. Our experts analyze your actual KSEB bills, assess your rooftop, and design a system for YOUR consumption. You get a transparent quote — system capacity, solar panel price breakdown, projected savings, and MNRE subsidy eligibility. If solar doesn't make sense for you, we'll say that.",
    bgColor: "bg-[#074A4D]", // Dark teal
    textColor: "text-white",
    zIndex: "z-30",
  },
  {
    id: 2,
    title: "Custom Design & Professional Installation",
    description:
      "System designed for your energy needs, roof type, and future plans — EV charger, new rooms, growing family. Golden Ray's certified technicians handle mounting, wiring, and safety checks. Most residential systems installed in 2–6 days. Zero disruption.",
    bgColor: "bg-[#ADD6D8]", // Light blue
    textColor: "text-[#333333]",
    zIndex: "z-20",
  },
  {
    id: 3,
    title: "KSEB Approval, Net Metering & You're Live",
    description:
      "We manage KSEB approvals, net metering setup in Kerala, grid connection, performance testing, and your PM Surya Ghar Yojana subsidy application. Your panels start generating. Your meter runs backward. Your next KSEB bill makes you smile.",
    bgColor: "bg-[#F7BA41]", // Yellow/orange
    textColor: "text-[#333333]",
    zIndex: "z-10",
  },
];

export default function SolarStepsNoGSAP() {
  // Renamed component to SolarStepsNoGSAP
  const [activeCard, setActiveCard] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval ID
  const isVisibleRef = useRef(false); // Track if section is visible

  // Function to start the cycling interval
  const startCycling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveCard((prev) => (prev % steps.length) + 1); // Cycle to the next card
    }, 3000); // Cycle every 3 seconds
  };

  useEffect(() => {
    const section = sectionRef.current; // Capture section element
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isVisibleRef.current = true;
          startCycling(); // Start cycling when visible
        } else {
          isVisibleRef.current = false;
          // Clear interval when section is out of view to stop auto-cycling
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      { threshold: 0.5 }, // Trigger when 50% of the section is visible
    );

    // Observe the section if it exists
    if (section) {
      observer.observe(section);
    }

    // Cleanup function:
    // Disconnect observer and clear interval when component unmounts
    return () => {
      if (section) {
        observer.unobserve(section);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and unmount

  // Handle click on a card to set it as the active card
  const handleCardClick = (id: number) => {
    setActiveCard(id);
    // Reset the cycling timer - continue from the clicked card
    if (isVisibleRef.current) {
      startCycling();
    }
  };

  return (
    <div
      ref={sectionRef}
      className="flex flex-col py-10 xl:py-8 px-4 sm:px-6 lg:px-8 xl:px-36 relative"
    >
      <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-10 text-center xl:text-left xl:whitespace-nowrap">
        Go solar in just 3 easy steps
      </h2>
      <div className="w-full max-w-full md:flex space-y-4 md:space-y-0">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              relative flex flex-col md:p-10 p-4 py-10 md:h-[500px] rounded-3xl cursor-pointer transition-all duration-500 ease-in-out overflow-hidden w-full ${
                step.zIndex
              }
              ${step.bgColor} ${step.textColor}
              ${
                activeCard === step.id
                  ? "md:w-full"
                  : "md:w-1/5 md:flex md:flex-col md:justify-end md:items-center"
              }
            `}
            onClick={() => handleCardClick(step.id)}
          >
            {/* Step Number */}
            <div
              className={`
                absolute bottom-[-10px] md:bottom-[-40px] right-3 text-6xl md:text-9xl font-extrabold z-0 text-white
              `}
            >
              {step.id}
            </div>
            {/* Card Content - conditionally shown/hidden based on activeCard */}
            <div className="relative z-10 flex flex-col h-full justify-between transition-all duration-300 ease-in-out">
              {/* Title */}
              <h2
                className={`
                  text-4xl md:text-5xl md:w-2/3 font-semibold leading-tight mb-2 text-left transition-all duration-500 ease-in-out
                  ${step.textColor}
                  ${
                    activeCard === step.id
                      ? "md:opacity-100 md:translate-y-0"
                      : "md:opacity-0 md:-translate-y-4 md:pointer-events-none"
                  }
                `}
              >
                {step.title}
              </h2>
              {/* Description */}
              <p
                className={`
                  text-sm md:text-xl font-normal leading-relaxed md:mb-0 mb-4 md:w-2/3 transition-all duration-500 ease-in-out text-left
                  ${step.textColor}
                  ${
                    activeCard === step.id
                      ? "md:opacity-100 md:translate-y-0 md:delay-100"
                      : "md:opacity-0 md:-translate-y-4 md:pointer-events-none"
                  }
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
