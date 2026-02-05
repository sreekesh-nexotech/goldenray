import AdvanceCalculatorMain from "@/components/AdvanceCalculator/AdvanceCalculatorMain";
import Hero from "@/components/ui/Hero";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Solar Savings Calculator for Kerala Homes | Flarize",
  description:
    "Estimate your solar power cost and savings in Kerala. Use our solar calculator to plan the right system for your home or business.",
  keywords: [
    "solar calculator kerala",
    "solar cost estimate kerala",
    "rooftop solar price kerala",
    "solar savings calculator india",
    "solar ROI calculator kerala",
  ],
  openGraph: {
    title: "Solar Savings Calculator for Kerala Homes | Flarize",
    description:
      "Estimate your solar power cost and savings in Kerala. Use our solar calculator to plan the right system for your home or business.",
    url: "https://flarize.com/solar-calculator",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Solar Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Savings Calculator for Kerala Homes | Flarize",
    description:
      "Estimate your solar power cost and savings in Kerala. Use our solar calculator to plan the right system for your home or business.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/solar-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AdvancedCalculator() {
  return (
    <>
      <Hero
        title="Advanced Calculator"
        description="Get a quick estimate of your savings, system size, and ROI with our advanced solar calculator."
      />

      {/* Content */}
      <AdvanceCalculatorMain />
    </>
  );
}
