import EmiMain from '@/components/EmiCalculator/EmiMain'
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";
import { Metadata } from 'next';
import React from 'react'



const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

const BASE_METADATA: Metadata = {
  title: "EMI Calculator for Solar Installations in Kerala | Flarize",
  description:
    "Calculate your monthly EMI for solar installations in Kerala with our easy-to-use calculator. See how Flarize makes going solar affordable and efficient.",
  keywords: [
    "emi calculator kerala",
    "solar emi calculator kerala",
    "flarize emi calculator",
    "solar installation emi kerala",
    "flarize solar emi",
  ],
  openGraph: {
    title: "EMI Calculator for Solar Installations in Kerala | Flarize",
    description:
      "Calculate your monthly EMI for solar installations in Kerala with our easy-to-use calculator. See how Flarize makes going solar affordable and efficient.",
    url: "https://flarize.com/emi-calculator",
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
    title: "EMI Calculator for Solar Installations in Kerala | Flarize",
    description:
      "Calculate your monthly EMI for solar installations in Kerala with our easy-to-use calculator. See how Flarize makes going solar affordable and efficient.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/emi-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};




// The Studio's SEO block for /emi-calculator (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/emi-calculator", BASE_METADATA);
const page = () => {
  return (
    <>
      <CmsPageSchema route="/emi-calculator" />
      <EmiMain/>
    </>
  )
}

export default page