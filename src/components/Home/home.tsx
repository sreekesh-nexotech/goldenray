// src/app/page.tsx
import Certified from '@/components/Home/certified-by';
import HeroHome from '@/components/Home/HeroHome';
import SolarAdvantage from '@/components/solar-advantage';
import SolarSteps from '@/components/Home/solar-steps';
import HomeTestimonial from '@/components/Home/Testimomial';
import Booking from './Booking';
import Services from '../Services';
import GroupPurchaseScheme from './Group-purchase';
import Faq from './faq';
import Partners from './Partners';

export default function Main() {
  return (
    <section  className='font-switzer'>
      <HeroHome />
      <Certified/>
      <SolarAdvantage/>
      <HomeTestimonial/>
      <SolarSteps/>
      <Booking/>
      <Services serviceTitle="We help you all the way"/>
      <GroupPurchaseScheme/>
      <Faq/>
      <Partners/>
    </section>
  );
}
