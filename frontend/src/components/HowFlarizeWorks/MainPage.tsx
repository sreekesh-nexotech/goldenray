import React from 'react'
import Hero from './Hero'
import FlarizeDeals from './FlarizeDeals'
import InstallationJourney from './InstallationJourney'

const MainPage = () => {
  return (
    <section className="font-switzer">
        <Hero/>
        <FlarizeDeals/>
        <InstallationJourney/>
    </section>
  )
}

export default MainPage