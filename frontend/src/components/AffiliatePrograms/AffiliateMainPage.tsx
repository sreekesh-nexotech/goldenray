import React from 'react'
import AffliateHero from './AffliateHero'
import { WhoCanJoin } from './WhoCanJoin'
import Earnings from './Earnings'
import Working from './Working'

const AffiliateMainPage = () => {
  return (
    <section className="relative">
      <AffliateHero/>
      <WhoCanJoin/>
      <Earnings/>
      <Working/>
    </section>
  )
}

export default AffiliateMainPage