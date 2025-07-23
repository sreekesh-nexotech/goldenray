import AdvanceCalculatorMain from "@/components/AdvanceCalculator/AdvanceCalculatorMain";
import Hero from "@/components/ui/Hero";
import { Metadata } from "next";




// Metadata
export const metadata: Metadata = {
  title: {
    default: "Advanced Calculator",
    template: "%s | Flarize",
  },
  description: "Empowering sustainable energy with innovative solar solutions.",
  keywords: ["solar energy", "renewable energy", "Flarize"],
  openGraph: {
    title: "Flarize - Solar Solutions",
    description: "Empowering sustainable energy with innovative solar solutions.",
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [{ url: "/heroImg.png", width: 1200, height: 630, alt: "Flarize" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flarize - Solar Solutions",
    description: "Empowering sustainable energy with innovative solar solutions.",
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





export default function AdvancedCalculator(){
    return(
        <>
            <Hero title="Advanced Calculator" description="Get a quick estimate of your savings, system size, and ROI with our advanced solar calculator."/>

            {/* Content */}
            <AdvanceCalculatorMain/>
        </>
    )
}