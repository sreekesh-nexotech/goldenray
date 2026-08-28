import AffiliateMainPage from '@/components/AffiliatePrograms/AffiliateMainPage'
import { Metadata } from 'next';
import React from 'react'
import JsonLD from '@/components/JsonLD';
import { solarReferralServiceSchema,  solarReferralBreadcrumbSchema, solarReferralFaqSchema,} from '@/data/jsonld';


const ogImage = "https://golden-ray.b-cdn.net/images/affiliate-hero.png";

export const metadata: Metadata = {
  title: "Flarize Solae Referral Program",
  description:
    "Earn a structured commission for every successful solar installation you refer — with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.",
  keywords: [
    "Flarize Solar Referral Program",
    "Flarize Solar Affiliate Program",
    "Flarize Solar Commission Structure",
    "Flarize Solar Earnings Potential",
    "Flarize Solar Testimonials",
  ],
  openGraph: {
    title: "Flarize Solar Referral Program",
    description:
      "Earn a structured commission for every successful solar installation you refer — with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.",
    url: "https://flarize.com/solar-referral-program",
    siteName: "Flarize",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Group solar purchase in Kerala",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flarize Solar Referral Program",
    description:
      "Earn a structured commission for every successful solar installation you refer — with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/solar-referral-program",
  },
  robots: {
    index: true,
    follow: true,
  },
};


const page = () => {
  return (
    <>
      <JsonLD data={solarReferralServiceSchema} />
      <JsonLD data={solarReferralBreadcrumbSchema} />
      <JsonLD data={solarReferralFaqSchema} />
      <AffiliateMainPage/>
    </>
  )
}

export default page