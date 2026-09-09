// src/app/residential/page.tsx
import { Metadata } from "next";
import { residentialPageData } from "@/data/solutions-page-data";

import JsonLD from "@/components/JsonLD";
import { residentialPageSchema } from "@/data/jsonld";
import ResidentialMain from "@/components/Residential/ResidentialMain";
import { SITE_URL } from "@/config";

// The page owns one head term — "solar panel price in Kerala" — and leads with
// it. `absolute` opts out of the root layout's "%s | Flarize" template: the
// brand has no search volume yet, so appending it would push the title past
// Google's ~60-character cut for no gain.
const TITLE = "Solar Panel Price in Kerala 2026 | ₹78,000 Subsidy & EMI";
const DESCRIPTION =
  "Real solar prices for Kerala homes: 3kW from ₹2 lakh before the ₹78,000 subsidy. Get 3 reviewed quotes, KSEB paperwork done, and a free site survey.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "solar panel price in Kerala",
    "3kW solar system price Kerala",
    "5kW solar panel cost Kerala",
    "10kW solar price Kerala",
    "solar subsidy Kerala 2026",
    "PM Surya Ghar Muft Bijli Yojana Kerala",
    "home solar Kerala",
    "residential solar installation Kerala",
    "KSEB net metering",
    "solar EMI Kerala",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/residential`,
    siteName: "Flarize",
    images: [
      {
        url: residentialPageData.hero.image,
        width: 1200,
        height: 630,
        alt: "Rooftop solar panels on a Kerala home",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "3kW from ₹2 lakh before subsidy. Three reviewed quotes, fixed price, KSEB paperwork handled.",
    images: [residentialPageData.hero.image],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: `${SITE_URL}/residential`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function ResidentialPage() {
  return (
    <>
      <JsonLD data={residentialPageSchema} />
      <ResidentialMain />
    </>
  );
}
