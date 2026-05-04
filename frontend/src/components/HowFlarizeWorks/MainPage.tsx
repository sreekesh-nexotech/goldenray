import React from 'react'
import Hero from './Hero'
import FlarizeDeals from './FlarizeDeals'
import InstallationJourney from './InstallationJourney'
import Difference from './Difference'
import InstallationDifference from './InstallationDifference'
import ProblemsSolve from './ProblemsSolve'
import Quotes from './Quotes'
import Faq from '../Home/Faq'
import Support from './Support'

const MainPage = () => {
  return (
    <section className="font-switzer">
        <Hero/>
        <FlarizeDeals/>
        <InstallationJourney/>
        <Difference/>
        <InstallationDifference/>
        <ProblemsSolve/>
        <Quotes/>
        <Support/>
        <Faq/>
    </section>
  )
}

export default MainPage