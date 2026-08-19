import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Inverter Comparison Table | Side-by-Side Analysis",
  description:
    "Compare solar inverters side-by-side with detailed specifications, efficiency, warranty, monitoring features, and Kerala climate ratings. Make an informed decision for your home.",
  keywords: [
    "solar inverter comparison table",
    "compare solar inverters",
    "solar inverter specifications",
    "solar inverter side by side",
    "kerala solar inverters",
    "best solar inverter comparison",
  ],
  openGraph: {
    title: "Solar Inverter Comparison Table | Side-by-Side Analysis",
    description:
      "Compare solar inverters side-by-side with detailed specifications, efficiency, warranty, and Kerala climate ratings.",
    url: "https://flarize.com/inverter-comparison-table",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Solar Inverter Comparison Table",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Inverter Comparison Table | Side-by-Side Analysis",
    description:
      "Compare solar inverters side-by-side with detailed specifications, efficiency, and Kerala climate ratings.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/inverter-comparison-table",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InverterComparisonTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
