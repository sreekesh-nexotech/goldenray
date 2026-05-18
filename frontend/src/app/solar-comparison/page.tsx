import { Suspense } from "react";
import { Metadata } from "next";
import { SolarComparisonMain } from "@/components/SolarComparison";

export const metadata: Metadata = {
  title: "Compare Solar Panels for Kerala | Find the Best Solar Panel",
  description:
    "Compare solar panels side-by-side with Kerala climate ratings. Browse monocrystalline, bifacial, and polycrystalline panels from top brands like Waaree, Adani, and Vikram Solar.",
  keywords: [
    "solar panel comparison kerala",
    "best solar panels kerala",
    "compare solar panels",
    "bifacial solar panels kerala",
    "monocrystalline solar panels",
    "solar panel efficiency comparison",
    "waaree solar panels",
    "adani solar panels",
    "vikram solar panels",
    "kerala climate rated solar",
  ],
  openGraph: {
    title: "Compare Solar Panels for Kerala | Find the Best Solar Panel",
    description:
      "Compare solar panels side-by-side with Kerala climate ratings. Browse monocrystalline, bifacial, and polycrystalline panels from top brands.",
    url: "https://www.flarize.com/solar-comparison",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Solar Panel Comparison",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Solar Panels for Kerala | Find the Best Solar Panel",
    description:
      "Compare solar panels side-by-side with Kerala climate ratings. Browse monocrystalline, bifacial, and polycrystalline panels from top brands.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/solar-comparison",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SolarComparisonPage() {
  return (
    <Suspense fallback={null}>
      <SolarComparisonMain />
    </Suspense>
  );
}
