import React from 'react'
import EmiHero from './EmiHero'
import Calculator from './Calculator'
import FourSteps from './FourSteps'

const EmiMain = () => {
  return (
    <section className="relative">
      <EmiHero />
      <Calculator />
      <FourSteps/>
    </section>
  )
}

export default EmiMain