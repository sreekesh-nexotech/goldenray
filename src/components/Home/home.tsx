// src/app/page.tsx
import Certified from '@/components/Home/certified-by';
import HeroHome from '@/components/Home/HeroHome';
import SolarAdvantage from '@/components/Home/solar-advantage';
import SolarSteps from '@/components/Home/solar-steps';
import HomeTestimonial from '@/components/Home/Testimomial';
import Booking from './Booking';

export default function Main() {
  return (
    <section  className='font-switzer'>
      <HeroHome />
      <Certified/>
      <SolarAdvantage/>
      <HomeTestimonial/>
      <SolarSteps/>
      <Booking/>
    </section>
  );
}
