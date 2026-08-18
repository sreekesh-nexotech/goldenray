import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Panel Comparison Table | Side-by-Side Analysis",
  description:
    "Compare solar panels side-by-side with detailed specifications, performance metrics, warranty information, and Kerala climate ratings. Make an informed decision for your home.",
  keywords: [
    "solar panel comparison table",
    "compare solar panels",
    "solar panel specifications",
    "solar panel side by side",
    "kerala solar panels",
    "best solar panels comparison",
  ],
  openGraph: {
    title: "Solar Panel Comparison Table | Side-by-Side Analysis",
    description:
      "Compare solar panels side-by-side with detailed specifications, performance metrics, warranty information, and Kerala climate ratings.",
    url: "https://flarize.com/comparison-table",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Solar Panel Comparison Table",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Panel Comparison Table | Side-by-Side Analysis",
    description:
      "Compare solar panels side-by-side with detailed specifications, performance metrics, and Kerala climate ratings.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/comparison-table",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComparisonTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
