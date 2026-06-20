import React from 'react'
import EmiHero from './EmiHero'
import Calculator from './Calculator'
import FourSteps from './FourSteps'
import Partners from '../Home/Partners';
import BookingForm from '../Home/Booking';
import HomeTestimonial from '../Home/Testimomial';
import Faq from './EmiFaq';
import BankRates from './BankRates';


const EmiMain = () => {
  return (
    <section className="relative">
      <EmiHero />
      <Calculator />
      <FourSteps/>
      <Partners />
      <BankRates/>
      <BookingForm title='Get Your Personalised EMI & Subsidy Report' description='We’ll call you once. No spam. No obligation.'/>
      <HomeTestimonial/>
      <Faq/>
    </section>
  )
}

export default EmiMain