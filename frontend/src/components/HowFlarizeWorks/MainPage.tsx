import React from 'react'
import Hero from './Hero'
import FlarizeDeals from './FlarizeDeals'
import InstallationJourney from './InstallationJourney'
import Difference from './Difference'

const MainPage = () => {
  return (
    <section className="font-switzer">
        <Hero/>
        <FlarizeDeals/>
        <InstallationJourney/>
        <Difference/>
    </section>
  )
}

export default MainPage