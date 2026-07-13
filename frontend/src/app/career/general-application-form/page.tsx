import GeneralApplicationForm from '@/components/Career/GeneralApplicationForm'
import React from 'react'

import { Metadata } from "next";
import PerksBenefits from '@/components/Career/PerksBenefits';

export const metadata: Metadata = {
  title: "Application Form | Careers at Flarize",
  description:
    "Apply for a position at Flarize. Join our team and help build the future of clean energy.",
  keywords: [
    "Solar careers Kerala",
    "Flarize careers",
    "Solar jobs Kerala",
    "Clean energy jobs",
    "Solar startup jobs India",
    "Engineering jobs Kochi",
    "Sales jobs Kerala",
    "Work at Flarize",
    "Renewable energy careers",
    "Golden Ray careers",
  ],
  openGraph: {
    title: "Application Form | Careers at Flarize",
    description:
      "Apply for a position at Flarize. Join our team and help build the future of clean energy.",
    url: "https://www.flarize.com/career/general-application-form",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Careers at Flarize" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Application Form | Careers at Flarize",
    description:
      "Apply for a position at Flarize. Join our team and help build the future of clean energy.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/career/general-application-form",
  },
  robots: {
    index: true,
    follow: true,
  },
};


const page = () => {
  return (
    <section className="relative">
          <GeneralApplicationForm/>
          <PerksBenefits/>
    </section>
  )
}

export default page