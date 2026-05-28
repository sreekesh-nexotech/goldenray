import QuoteAnalyserMain from "@/components/QuoteAnalyser/QuoteAnalyserMain";
import { Metadata } from "next";
import React from "react";

const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

export const metadata: Metadata = {
  title: "Solar Quote Analyser | AI-Powered Quote Review | Flarize",
  description:
    "Upload any solar quote from any company. Our AI checks pricing, brands, hidden costs and missing items in 30 seconds — built for Kerala homeowners.",
  keywords: [
    "solar quote analyser kerala",
    "solar quote review",
    "ai solar quote check",
    "flarize quote analyser",
    "solar pricing kerala",
  ],
  openGraph: {
    title: "Solar Quote Analyser | AI-Powered Quote Review | Flarize",
    description:
      "Upload any solar quote from any company. Our AI checks pricing, brands, hidden costs and missing items in 30 seconds.",
    url: "https://www.flarize.com/quote-analyser",
    siteName: "Flarize",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Solar Quote Analyser",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Quote Analyser | AI-Powered Quote Review | Flarize",
    description:
      "Upload any solar quote from any company. Our AI checks pricing, brands, hidden costs and missing items in 30 seconds.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/quote-analyser",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Page = () => {
  return <QuoteAnalyserMain />;
};

export default Page;
