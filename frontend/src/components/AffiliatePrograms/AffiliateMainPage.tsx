import React from 'react'
import AffliateHero from './AffliateHero'
import { WhoCanJoin } from './WhoCanJoin'
import Earnings from './Earnings'
import Working from './Working'
import Track from './Track'
import CommissionStructure from './CommissionStructure'
import Faq from '../Home/Faq'

const AffiliateMainPage = () => {
  return (
    <section className="relative">
      <AffliateHero/>
      <WhoCanJoin/>
      <Earnings/>
      <Working/>
      <Track/>
      <CommissionStructure/>

      <Faq/>
    </section>
  )
}

export default AffiliateMainPage