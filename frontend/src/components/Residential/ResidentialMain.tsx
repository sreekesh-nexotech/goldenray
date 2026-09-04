import React from 'react'
import ResidentialHero from './ResidentialHero'
import FlarizeTrust from './FlarizeTrust'
import HomeReadyForSolar from './HomeReadyForSolar'
import UnderstandingSolarPanels from './UnderstandingSolarPanels'
import WhatsIncluded from './WhatsIncluded'
import SafetyAndCompliance from './SafetyAndCompliance'
import WhichSolarSystem from './WhichSolarSystem'
import QuoteAnalyserCTA from './QuoteAnalyserCTA'

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

    </section>
  )
}

export default ResidentialMain