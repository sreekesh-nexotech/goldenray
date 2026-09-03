// src/app/residential/page.tsx
import { Metadata } from "next";
import { residentialPageData } from "@/data/solutions-page-data";


import JsonLD from "@/components/JsonLD";
import { residentialServiceSchema } from "@/data/jsonld";
import ResidentialMain from "@/components/Residential/ResidentialMain";

export const metadata: Metadata = {
  title:
    "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering",
  description:
    "Install solar panels for your Kerala home from ₹1.1 lakh after ₹78,000 PM Surya Ghar subsidy. MNRE-approved, KSEB net metering, 25-year warranty. Free quote from Flarize — Kerala's solar EPC.",
  openGraph: {
    title:
      "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering | Flarize",
    description:
      "Solar panels for Kerala homes from ₹1.1 lakh after subsidy. MNRE-approved installer. KSEB net metering. 25-year warranty. Free quote from Flarize.",
    url: "https://flarize.com/residential",
    siteName: "Flarize",
    images: [
      {
        url: residentialPageData.hero.image,
        width: 1200,
        height: 630,
        alt: "Residential Solar Installation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering | Flarize",
    description:
      "Solar panels for Kerala homes from ₹1.1 lakh after subsidy. MNRE-approved installer. KSEB net metering. 25-year warranty. Free quote from Flarize.",
    images: [residentialPageData.hero.image],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/residential",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResidentialPage() {

  return (
    <>
      <JsonLD data={residentialServiceSchema} />
      <ResidentialMain/>
    </>
  );
}
