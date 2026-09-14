import SolarWarrantyMain from "@/components/SolarWarranty/SolarWarrantyMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import React from "react";

const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

const BASE_METADATA: Metadata = {
  title: "Solar Warranty & AMC Service in Kerala | Flarize",
  description:
    "Flarize Solar Warranty & AMC service in Kerala — 25-year protection, 48-hour technician dispatch, KSEB-certified support and an Energy Loss Guarantee that pays you if we fall short.",
  keywords: [
    "solar warranty kerala",
    "solar AMC kerala",
    "solar service kerala",
    "flarize warranty",
    "solar maintenance kerala",
  ],
  openGraph: {
    title: "Solar Warranty & AMC Service in Kerala | Flarize",
    description:
      "25-year protection, 48-hour response, KSEB-certified Kerala technicians and a performance guarantee that compensates you if we fall short.",
    url: "https://flarize.com/solar-warranty",
    siteName: "Flarize",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Solar Warranty & Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Warranty & AMC Service in Kerala | Flarize",
    description:
      "25-year protection, 48-hour response, KSEB-certified Kerala technicians and a performance guarantee.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/solar-warranty",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for /solar-warranty (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/solar-warranty", BASE_METADATA);
const Page = () => {
  return <SolarWarrantyMain />;
};

export default Page;
