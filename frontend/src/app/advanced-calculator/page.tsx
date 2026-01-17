import AdvanceCalculatorMain from "@/components/AdvanceCalculator/AdvanceCalculatorMain";
import Hero from "@/components/ui/Hero";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title:
    "Advanced Solar Calculator - Calculate Savings, System Size & ROI | Flarize",
  description:
    "Use Flarize's advanced solar calculator to get detailed estimates of your solar savings, system size, payback period, and ROI. Customize your solar solution for Kerala.",
  openGraph: {
    title: "Advanced Solar Calculator - Flarize",
    description:
      "Calculate your solar savings, system size, and ROI with our advanced solar calculator tailored for Kerala.",
    url: "https://flarize.com/advanced-calculator",
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
    title: "Advanced Solar Calculator - Flarize",
    description:
      "Get detailed estimates of your solar savings and system size.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/advanced-calculator",
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
