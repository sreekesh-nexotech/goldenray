import React from 'react'
import AffliateHero from './AffliateHero'
import WhyNoRefer from './WhyNoRefer'
import PartnersChooseFlarize from './PartnersChooseFlarize'
import { WhoCanJoin } from './WhoCanJoin'
import Earnings from './Earnings'
import Working from './Working'
import Track from './Track'
import CommissionStructure from './CommissionStructure'
import Faq from './AffiliateFaq'
import WhyFlarize from './WhyFlarize'
import Testimonials from './Testimonials'
import Form from './Form'
import StartEarning from './StartEarning'
import Districts from './Districts'

const AffiliateMainPage = () => {
  return (
    <section className="relative">
      <AffliateHero/>
      <WhyNoRefer/>
      <PartnersChooseFlarize/>
      <WhoCanJoin/>
      <Earnings/>
      <Working/>
      <Track/>
      <CommissionStructure/>
      <WhyFlarize/>
      <Testimonials/>
      <Form/>
      <StartEarning/>
      <Districts/>
      <Faq/>
    </section>
  )
}

export default AffiliateMainPage