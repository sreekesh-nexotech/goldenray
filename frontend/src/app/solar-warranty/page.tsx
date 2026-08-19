import SolarWarrantyMain from "@/components/SolarWarranty/SolarWarrantyMain";
import { Metadata } from "next";
import React from "react";

const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

export const metadata: Metadata = {
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

const Page = () => {
  return <SolarWarrantyMain />;
};

export default Page;
