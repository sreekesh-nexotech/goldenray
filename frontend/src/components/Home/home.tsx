"use client";

// import React, { useState, useEffect } from 'react';

import Certified from "@/components/certified-by";
import HeroHome from "@/components/Home/HeroHome";
import HomeTestimonial from "@/components/Home/Testimomial";
import Booking from "./Booking";
import Services from "../Services";
import GroupPurchaseScheme from "./Group-purchase";
import Faq from "./Faq";
import Partners from "./Partners";
import SolarAdvantageMain from "../SolarCalculator/SolarAdvantageMain";
import SolutionBox from "../Solutions/Solution-box";

import SolarStepsNoGSAP from "./Solar-steps-nogsap";

export default function Main() {
  // State to track if the screen width is large enough for GSAP animations
  // const [isLargeScreen, setIsLargeScreen] = useState(false);

  // useEffect(() => {
  //   // Function to update the screen size state
  //   const handleResize = () => {
  //     // Set isLargeScreen to true if window width is 1024px or greater
  //     setIsLargeScreen(window.innerWidth > 1024 && window.innerWidth < 2000);
  //   };

  //   // Set initial state on component mount
  //   handleResize();

  //   // Add event listener for window resize
  //   window.addEventListener('resize', handleResize);

  //   // Cleanup function: remove event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []); // Empty dependency array ensures this effect runs only once on mount and unmount

  return (
    <section className="font-switzer">
      <HeroHome />
      <Certified />
      <SolarAdvantageMain />

      {/* Services Section Title */}
      <div className="w-full py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className=" text-4xl md:text-5xl font-semibold leading-tight text-[#123532] ">
          Services
        </h2>
      </div>

      {/* Solution Boxes */}
      <SolutionBox
        BoxBgColor="[#074A4D]"
        TextColor="text-[#FFFFFF]"
        showYellowBtn={true}
        BoxTitle="Residential Solar Panel Installation & Energy Solutions"
        BoxDescription="Stop paying ₹4,000–₹8,000 every month to KSEB. Our end-to-end residential solar panel installation — from site assessment to net metering activation — is backed by Flarize Renewable Energy (8+ years, 300+ installations). We handle KSEB approvals, PM Surya Ghar subsidy applications, and post-installation support. Your bill drops. Your AC guilt disappears. Explore residential solar →"
        BoxImg="https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png"
        flexReverse={true}
      />

      <SolutionBox
        BoxBgColor="[#ADD6D8]"
        TextColor="text-[#444444]"
        showYellowBtn={false}
        BoxTitle="Commercial Solar Power Installation & Renewable Solutions"
        BoxDescription="Every rupee your business loses to electricity is margin gone forever. Our commercial solar systems are designed around your load profile — offices, hospitals, schools, retail, industrial. Site assessment, permits, KSEB approvals, grid integration, net metering, and ongoing support — all handled. Note: PM Surya Ghar subsidy is residential only. Commercial projects benefit from accelerated depreciation and tax advantages. Explore commercial solar →"
        BoxImg="https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg"
        flexReverse={false}
      />

      <HomeTestimonial />
      {/* Conditionally render SolarSteps component based on screen size */}
      <SolarStepsNoGSAP />
      <Partners />
      <Booking />
      <Services serviceTitle="We Help You All the Way" />
      <GroupPurchaseScheme />
      <Faq />
    </section>
  );
}
