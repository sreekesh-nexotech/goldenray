import React from 'react'
import ResidentialHero from './ResidentialHero'
import FlarizeTrust from './FlarizeTrust'
import HomeReadyForSolar from './HomeReadyForSolar'
import UnderstandingSolarPanels from './UnderstandingSolarPanels'
import WhatsIncluded from './WhatsIncluded'
import SafetyAndCompliance from './SafetyAndCompliance'
import SolarPriceInKerala from './SolarPriceInKerala'
import FinancingYourFuture from './FinancingYourFuture'
import WhichSolarSystem from './WhichSolarSystem'
import QuoteAnalyserCTA from './QuoteAnalyserCTA'
import Certified from '../certified-by'
import HomeTestimonial from '../Home/Testimomial'

const ResidentialMain = () => {
  return (
    <section className="relative">
      <ResidentialHero />  
      <FlarizeTrust />
      <HomeReadyForSolar />
      <QuoteAnalyserCTA />
      <WhichSolarSystem />
      <UnderstandingSolarPanels />
      <WhatsIncluded />
      <SafetyAndCompliance />
      <SolarPriceInKerala />
      <FinancingYourFuture />
      <Certified/>
      <HomeTestimonial/>

    </section>
  )
}

export default ResidentialMain