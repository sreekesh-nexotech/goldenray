import Main from "@/components/Home/home";
import { Metadata } from "next";

import JsonLD from "@/components/JsonLD";
import { localBusinessSchema, organizationSchema, faqSchema, breadcrumbSchema } from "@/data/jsonld";

export const metadata: Metadata = {
  title: "Solar Power Systems in Kerala for Homes & Businesses",
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
    title: "Solar Power Systems in Kerala for Homes & Businesses",
    description:
      "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
    url: "https://www.flarize.com",
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
    canonical: "https://www.flarize.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
