import MainPage from '@/components/HowFlarizeWorks/MainPage'
import { Metadata } from 'next';
import React from 'react'


const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

export const metadata: Metadata = {
  title: "How Flarize Works",
  description:
    "Discover how Flarize simplifies solar installation in Kerala with our streamlined 7-step process. From free roof assessments to quick installations, see how we make going solar easy and efficient.",
  keywords: [
    "how flarize works kerala",
    "flarize process kerala",
    "flarize solar installation kerala",
    "flarize 7 steps kerala",
    "flarize solar journey kerala",
  ],
  openGraph: {
    title: "How Flarize Works",
    description:
      "Discover how Flarize simplifies solar installation in Kerala with our streamlined 7-step process. From free roof assessments to quick installations, see how we make going solar easy and efficient.",
    url: "https://www.flarize.com/how-flarize-works",
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
    title: "How Flarize Works",
    description:
      "Discover how Flarize simplifies solar installation in Kerala with our streamlined 7-step process. From free roof assessments to quick installations, see how we make going solar easy and efficient.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/how-flarize-works",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const howFlarizeWorks = () => {
  return <MainPage/>
}

export default howFlarizeWorks