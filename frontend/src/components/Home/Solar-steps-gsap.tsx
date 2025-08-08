"use client";
import React, { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

export default function SolarStepsGSAP() {
  const [activeCard, setActiveCard] = useState(1); // State to manage which card is active on click
  const sectionRef = useRef<HTMLDivElement>(null); // Ref for the main section container
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]); // Ref for individual card elements

// Use useLayoutEffect for DOM manipulations to avoid flicker
  useLayoutEffect(() => {
    const cards = cardsRef.current.filter(el => el !== null); // Filter out null refs

    // Use gsap.context() for proper cleanup in React
    const ctx = gsap.context(() => {
      if (cards.length !== steps.length) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'center center',
        end: '+=300%',
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const segment = 1 / (steps.length - 1);

          steps.forEach((step, index) => {
            const card = cards[index];
            if (!card) return;

            const center = segment * index;
            const distance = Math.abs(progress - center);
            const scale = Math.max(0, 1 - distance * 3);
            const width = 20 + scale * 80;

            gsap.to(card, { width: `${width}%`, duration: 0.2, ease: "power2.out" });

            const content = card.querySelector('.card-content') as HTMLElement;
            if (content) {
              const isVisible = distance < segment / 2;
              gsap.to(content, {
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20,
                duration: 0.3,
                ease: "power2.out",
                pointerEvents: isVisible ? 'auto' : 'none'
              });
            }
          });
        }
      });
    }, sectionRef); // Scope the context to the main section

    // Return the cleanup function from the context
    return () => ctx.revert();

  }, []); // Empty dependency array is correct


  // Handle click on a card to set it as active (though GSAP handles the primary animation)
  // This can be used for fallback or additional styling if needed
  const handleCardClick = (id: number) => {
    setActiveCard(id);
  };

  return (
    <div ref={sectionRef} className="flex flex-col py-10 px-4 sm:px-6 lg:px-8 xl:px-36 relative mt-10 ">
      <h2 className="text-3xl xl:w-1/2 sm:text-4xl lg:text-[64px] font-bold text-[#123532] mb-10 text-center xl:text-left">
        Go solar in just 3 easy steps
      </h2>
      <div className="w-full max-w-full md:flex space-y-4 md:space-y-0">
        {steps.map((step, index) => (
          <div
            key={step.id}
            ref={(el) => {
              cardsRef.current[index] = el; // Assign ref to each card
            }}
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
            {/* Card Content */}
            <div className="relative z-10 flex flex-col h-full card-content justify-between opacity-0 translate-y-4 pointer-events-none transition-all duration-300 ease-in-out">
              <h2 className="text-3xl md:text-[40px] md:w-2/3 font-medium mb-2 text-left">
                {step.title}
              </h2>
              <p className="text-base md:text-xl md:mb-0 mb-4 font-normal md:w-2/3 text-left">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
