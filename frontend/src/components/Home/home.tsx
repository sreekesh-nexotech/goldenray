"use client";

// import React, { useState, useEffect } from 'react';

import Certified from '@/components/certified-by';
import HeroHome from '@/components/Home/HeroHome';
import HomeTestimonial from '@/components/Home/Testimomial';
import Booking from './Booking';
import Services from '../Services';
import GroupPurchaseScheme from './Group-purchase';
import Faq from './Faq';
import Partners from './Partners';
import SolarAdvantageMain from '../SolarCalculator/SolarAdvantageMain';

// import SolarStepsGSAP from './Solar-steps-gsap';
import SolarStepsNoGSAP from './Solar-steps-nogsap';

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
    <section className='font-switzer'>
      <HeroHome />
      <Certified />
      <SolarAdvantageMain/>
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
