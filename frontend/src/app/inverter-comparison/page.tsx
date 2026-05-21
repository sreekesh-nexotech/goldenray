import { Suspense } from "react";
import { Metadata } from "next";
import { InverterComparisonMain } from "@/components/InverterComparison";

export const metadata: Metadata = {
  title: "Compare Solar Inverters for Kerala | Find the Best Solar Inverter",
  description:
    "Compare solar inverters side-by-side with Kerala climate ratings. Browse string, hybrid, and microinverters from top brands like Enphase, Fronius, SolarEdge, Sungrow, and GoodWe.",
  keywords: [
    "solar inverter comparison kerala",
    "best solar inverter kerala",
    "compare solar inverters",
    "microinverter kerala",
    "hybrid inverter kerala",
    "string inverter kerala",
    "enphase inverter",
    "fronius inverter",
    "solaredge inverter",
    "sungrow inverter",
  ],
  openGraph: {
    title: "Compare Solar Inverters for Kerala | Find the Best Solar Inverter",
    description:
      "Compare solar inverters side-by-side with Kerala climate ratings. Browse string, hybrid, and microinverters from top brands.",
    url: "https://www.flarize.com/inverter-comparison",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Solar Inverter Comparison",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Solar Inverters for Kerala | Find the Best Solar Inverter",
    description:
      "Compare solar inverters side-by-side with Kerala climate ratings. Browse string, hybrid, and microinverters from top brands.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/inverter-comparison",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InverterComparisonPage() {
  return (
    <Suspense fallback={null}>
      <InverterComparisonMain />
    </Suspense>
  );
}
