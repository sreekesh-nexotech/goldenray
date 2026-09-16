import QuoteAnalyserMain from "@/components/QuoteAnalyser/QuoteAnalyserMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";
import React from "react";

const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

const BASE_METADATA: Metadata = {
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
    url: "https://flarize.com/quote-analyser",
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
    canonical: "https://flarize.com/quote-analyser",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for /quote-analyser (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/quote-analyser", BASE_METADATA);
const Page = () => {
  return (
    <>
      <CmsPageSchema route="/quote-analyser" />
      <QuoteAnalyserMain />
    </>
  );
};

export default Page;
