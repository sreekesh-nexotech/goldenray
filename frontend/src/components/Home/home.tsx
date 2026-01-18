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

// import SolarStepsGSAP from './Solar-steps-gsap';
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
      <div className="w-full py-12 px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#123532] mb-2">
          Services
        </h2>
      </div>

      {/* Solution Boxes */}
      <SolutionBox
        BoxBgColor="[#074A4D]"
        TextColor="text-[#FFFFFF]"
        showYellowBtn={true}
        BoxTitle="Residential Solar Panel Installation & Energy Solutions"
        BoxDescription="We provide end-to-end residential solar solutions designed to help homeowners reduce electricity costs and adopt clean, renewable energy. From initial site assessment and system design to professional installation and seamless grid integration, our experienced team manages every step of the process. We offer high-efficiency monocrystalline, polycrystalline, and hybrid solar systems, carefully selected based on your home's energy consumption, roof structure, and budget. Our solutions also include smart inverters, battery storage options, and net metering support to maximize long-term savings. With a strong focus on quality, safety, and reliable performance, we help families achieve energy independence while reducing their environmental impact. Choose solar with confidence and enjoy consistent power, lower monthly bills, and lasting value for your home."
        BoxImg="https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png"
      />

      <SolutionBox
        BoxBgColor="[#ADD6D8]"
        TextColor="text-[#444444]"
        showYellowBtn={false}
        BoxTitle="Commercial Solar Power Installation & Renewable Solutions"
        BoxDescription="Running a business means managing operational costs without compromising reliability. Our commercial solar installations are designed to help businesses transition to clean, renewable energy while reducing long-term expenses. From offices and retail spaces to hospitals, schools, and industrial facilities, we provide scalable solar solutions tailored to your energy needs. Every installation begins with a thorough site assessment, load analysis, and system design to ensure optimal performance. We handle all aspects of the process, including permits, approvals, installation, grid integration, and ongoing support. Our systems are built with high-quality components, advanced inverter technology, and robust monitoring tools to ensure consistent energy production and minimal downtime. Whether you're looking to lower electricity bills, achieve sustainability goals, or enhance energy independence, our team is here to deliver a reliable, long-lasting solar solution for your business."
        BoxImg="https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg"
      />

      <HomeTestimonial />
      {/* Conditionally render SolarSteps component based on screen size */}
      <SolarStepsNoGSAP />
      <Partners />
      <Booking />
      <Services serviceTitle="We help you all the way" />
      <GroupPurchaseScheme />
      <Faq />
    </section>
  );
}
