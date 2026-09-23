import QuoteAnalyserMain from "@/components/QuoteAnalyser/QuoteAnalyserMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";
import React from "react";
import { notFound } from "next/navigation";

// The analyser form doesn't submit anywhere yet, so the page is hidden (404)
// and unlinked from the nav/Residential page. Flip this to re-launch it.
const QUOTE_ANALYSER_LIVE = false;

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
  if (!QUOTE_ANALYSER_LIVE) notFound();
  return (
    <>
      <CmsPageSchema route="/quote-analyser" />
      <QuoteAnalyserMain />
    </>
  );
};

export default Page;
