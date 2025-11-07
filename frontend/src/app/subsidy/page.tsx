import SubsidyMain from "@/components/subsidy/SubsidyMain";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Solar Subsidy",
    template: "%s | Flarize",
  },
  description:
    "Learn about solar subsidies and how to maximize your savings with government incentives.",
  openGraph: {
    title: "Flarize - Solar Subsidy",
    description:
      "Learn about solar subsidies and how to maximize your savings with government incentives.",
    url: "https://flarize.com/subsidy",
    siteName: "Flarize",
    images: [{ url: "/heroImg.png", width: 1200, height: 630, alt: "Flarize" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flarize - Solar Subsidy",
    description:
      "Learn about solar subsidies and how to maximize your savings with government incentives.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/subsidy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SubsidyPage() {
  return <SubsidyMain />;
}
