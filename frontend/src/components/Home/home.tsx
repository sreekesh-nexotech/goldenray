// src/components/Home/home.tsx
"use client"; 

import Certified from '@/components/certified-by';
import HeroHome from '@/components/Home/HeroHome';
import SolarSteps from '@/components/Home/solar-steps';
import HomeTestimonial from '@/components/Home/Testimomial';
import Booking from './Booking';
import Services from '../Services';
import GroupPurchaseScheme from './Group-purchase';
import Faq from './Faq';
import Partners from './Partners';
import SolarAdvantageMain from '../solar-calculator/SolarAdvantageMain';

export default function Main() {
 
  return (
    <section className='font-switzer'>
      <HeroHome />
      <Certified />
      <SolarAdvantageMain/>
      <HomeTestimonial />
      <SolarSteps />
      <Booking />
      <Services serviceTitle="We help you all the way" />
      <GroupPurchaseScheme />
      <Faq />
      <Partners />
    </section>
  );
}