import React from 'react'
import Hero from './Hero'
import FlarizeDeals from './FlarizeDeals'
import InstallationJourney from './InstallationJourney'
import Difference from './Difference'
import InstallationDifference from './InstallationDifference'
import ProblemsSolve from './ProblemsSolve'

const MainPage = () => {
  return (
    <section className="font-switzer">
        <Hero/>
        <FlarizeDeals/>
        <InstallationJourney/>
        <Difference/>
        <InstallationDifference/>
        <ProblemsSolve/>
    </section>
  )
}

export default MainPage