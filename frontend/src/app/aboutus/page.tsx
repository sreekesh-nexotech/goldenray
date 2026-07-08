// src/app/aboutus/page.tsx

import AboutUsMain from "@/components/AboutUs/AboutUsMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Flarize Solar",
  description:
    "Flarize helps you choose solar with clear eyes, then stands behind it for 25 years. Solar today, your whole home in time.",
  keywords: [
    "About Flarize",
    "Flarize solar",
    "Solar platform India",
    "Solar installation Kerala",
    "25-year solar warranty",
    "Golden Ray Renewable energy",
  ],
  openGraph: {
    title: "About Us | Flarize Solar",
    description:
      "Flarize helps you choose solar with clear eyes, then stands behind it for 25 years. Solar today, your whole home in time.",
    url: "https://www.flarize.com/aboutus",
    siteName: "Flarize",
    images: [
      {
        url: "/images/aboutus/Hero.png",
        width: 1200,
        height: 630,
        alt: "About Flarize",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Flarize Solar",
    description:
      "Flarize helps you choose solar with clear eyes, then stands behind it for 25 years. Solar today, your whole home in time.",
    images: ["/images/aboutus/Hero.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/aboutus",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutUs() {
  return (
    <section className="relative">
      <AboutUsMain />
    </section>
  );
}
