import Main from "@/components/Home/home";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";

import JsonLD from "@/components/JsonLD";
import { localBusinessSchema, organizationSchema, faqSchema, breadcrumbSchema } from "@/data/jsonld";

const BASE_METADATA: Metadata = {
  title: "Solar Panel Installation Kerala | KSEB Approved | Flarize",
  description:
    "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
  keywords: [
    "solar power system for home kerala",
    "solar panel price in kerala",
    "rooftop solar kerala",
    "on grid solar system kerala",
    "off grid solar kerala",
    "best solar company in kerala",
  ],
  openGraph: {
    title: "Solar Panel Installation Kerala | KSEB Approved | Flarize",
    description:
      "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Flarize Solar Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Power Systems in Kerala for Homes & Businesses",
    description:
      "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for / (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/", BASE_METADATA);
export default function Home() {
  return (
    <>
      <JsonLD data={localBusinessSchema} />
      <JsonLD data={organizationSchema} />
      <JsonLD data={faqSchema} />
      <JsonLD data={breadcrumbSchema} />
      <section>
        <Main />
      </section>
    </>
  );
}
