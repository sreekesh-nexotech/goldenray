"use client";
import React, { useState } from 'react';

const steps = [
  {
    id: 1,
    title: 'Get a Free Consultation & Quote',
    description: 'Talk to our solar experts, get a customized and a transparent quote – no commitments.',
    bgColor: 'bg-[#00474F]', // Dark teal
    textColor: 'text-white',
    zIndex:'z-30'
  },
  {
    id: 2,
    title: 'Custom Design & Installation',
    description: 'Our team will design a solar system tailored to your energy needs and professionally install it.',
    bgColor: 'bg-[#98D8E0]', // Light blue
    textColor: 'text-[#00474F]',
    zIndex:'z-20'
  },
  {
    id: 3,
    title: 'Activate Your Solar System',
    description: 'Once installed and approved, we\'ll help you activate your system and start saving on energy bills.',
    bgColor: 'bg-[#F2B705]', // Yellow/orange
    textColor: 'text-[#00474F]',
    zIndex:'z-10'
  },
];

export default function SolarSteps(){
  const [activeCard, setActiveCard] = useState(1); // Default to the first card

  const handleCardClick = (id:number) => {
    setActiveCard(id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        Go Solar in just <span className="text-[#00474F]">3</span> easy steps
      </h1>

      <div className="w-full max-w-5xl md:flex space-y-4 md:space-y-0">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              relative flex flex-col p-10 md:h-[551px] rounded-2xl shadow-lg cursor-pointer transition-all duration-500 ease-in-out overflow-hidden  w-full ${step.zIndex} 
              ${step.bgColor} ${step.textColor}
              ${activeCard === step.id ? 'md:w-5/5' : ' md:w-1/5 md:flex md:flex-col md:justify-end md:items-center'}
            `}
            onClick={() => handleCardClick(step.id)}
          >
            {/* Step Number (always visible on mobile, conditional visibility on desktop) */}
            <div
              className={`
                absolute bottom-[-14px] right-3 text-9xl font-extrabold z-0 text-white              `}
            // Keep consistent
            >
              {step.id}
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between transition-all duration-300 ease-in-out">
              {/* Title (always visible on mobile, conditional visibility on desktop) */}
              <h2
                className={`
                  text-2xl font-semibold mb-2 text-left transition-all  duration-500 ease-in-out
                  ${step.textColor}
                  ${activeCard === step.id ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:-translate-y-4 md:pointer-events-none'}
                `}
              >
                {step.title}
              </h2>

              <p
                className={`
                  text-sm w-2/3 transition-all duration-500 ease-in-out text-left
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
};

