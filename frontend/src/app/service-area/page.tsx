// src/app/service-area/page.tsx

import ServiceAreaMain from "@/components/ServiceArea/ServiceAreaMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Areas | Solar Installation Across Kerala",
  description:
    "Explore Flarize solar installation service areas across Kerala. Residential, commercial, group solar, subsidy assistance and SolarCare support available in your district.",
  keywords: [
    "Solar service areas Kerala",
    "Solar installation Kerala",
    "Solar near me Kerala",
    "Rooftop solar Kerala districts",
    "Solar Kochi",
    "Solar Trivandrum",
    "Solar Kozhikode",
    "PM Surya Ghar Kerala",
    "Local solar installer Kerala",
  ],
  openGraph: {
    title: "Service Areas | Solar Installation Across Kerala",
    description:
      "Explore Flarize solar installation service areas across Kerala. Residential, commercial, group solar, subsidy assistance and SolarCare support available in your district.",
    url: "https://www.flarize.com/service-area",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Flarize Solar Service Areas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Service Areas | Solar Installation Across Kerala",
    description:
      "Explore Flarize solar installation service areas across Kerala. Residential, commercial, group solar, subsidy assistance and SolarCare support available in your district.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/service-area",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServiceArea() {
  return (
    <section className="relative">
      <ServiceAreaMain />
    </section>
  );
}
