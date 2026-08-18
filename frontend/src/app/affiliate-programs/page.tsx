import AffiliateMainPage from '@/components/AffiliatePrograms/AffiliateMainPage'
import { Metadata } from 'next';
import React from 'react'



const ogImage = "https://golden-ray.b-cdn.net/images/affiliate-hero.png";

export const metadata: Metadata = {
  title: "Flarize Affiliate Program ",
  description:
    "Earn a structured commission for every successful solar installation you refer — with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.",
  keywords: [
    "flarize affiliate program",
    "flarize referral program",
    "flarize partner program",
    "earn money flarize",
    "flarize solar affiliate",
  ],
  openGraph: {
    title: "Flarize Affiliate Program ",
    description:
      "Earn a structured commission for every successful solar installation you refer — with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.",
    url: "https://flarize.com/affiliate-programs",
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
    title: "Flarize Affiliate Program ",
    description:
      "Earn a structured commission for every successful solar installation you refer — with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/affiliate-programs",
  },
  robots: {
    index: true,
    follow: true,
  },
};


const page = () => {
  return (
    <AffiliateMainPage/>
  )
}

export default page