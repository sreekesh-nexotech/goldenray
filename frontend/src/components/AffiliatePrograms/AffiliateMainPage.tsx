import React from 'react'
import AffliateHero from './AffliateHero'
import { WhoCanJoin } from './WhoCanJoin'
import Earnings from './Earnings'

const AffiliateMainPage = () => {
  return (
    <section className="relative">
      <AffliateHero/>
      <WhoCanJoin/>
      <Earnings/>
    </section>
  )
}

export default AffiliateMainPage