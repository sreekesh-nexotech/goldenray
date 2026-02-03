// src/app/about/page.tsx

import AboutMain from "@/components/About/AboutMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Flarize | India's Trusted Solar Platform",
  description:
    "Flarize delivers PM Surya Ghar-compliant solar installations with 25-year platform accountability. Backed by 8+ years, 400+ projects, 4.9★ rating. Energy freedom for Kerala homes.",
  keywords: [
    "Solar installation Kerala",
    "Solar platform India",
    "PM Surya Ghar partner",
    "Solar installer Kerala",
    "Rooftop solar Kerala",
    "KSEB solar",
    "Solar subsidy Kerala",
    "25-year solar warranty",
    "Reliable solar installer",
    "Golden Ray Renewable energy",
  ],
  openGraph: {
    title: "About Us - Flarize | India's Trusted Solar Platform",
    description:
      "Flarize delivers PM Surya Ghar-compliant solar installations with 25-year platform accountability. Backed by 8+ years, 400+ projects, 4.9★ rating. Energy freedom for Kerala homes.",
    url: "https://flarize.com/about",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "About Flarize" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Flarize | India's Trusted Solar Platform",
    description:
      "Flarize delivers PM Surya Ghar-compliant solar installations with 25-year platform accountability. Energy freedom for Kerala homes.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
  return (
    <section className="relative">
      <AboutMain />
    </section>
  );
}
