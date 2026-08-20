import SubsidyMain from "@/components/subsidy/SubsidyMain";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "PM Surya Ghar Subsidy Kerala 2025 | Get ₹78,000 Back ",
  description:
    "Claim up to ₹78,000 PM Surya Ghar solar subsidy in Kerala. Flarize handles KSEB paperwork, portal filing & 2–3 day installation. 300+ families served, 8+ years in Kerala. Check your eligibility now.",
  keywords: [
    "PM Surya Ghar subsidy Kerala",
    "solar subsidy Kerala 2025",
    "KSEB solar subsidy",
    "PM Surya Ghar scheme Kerala",
    "solar panel subsidy India",
    "₹78000 solar subsidy",
    "rooftop solar subsidy Kerala",
    "solar subsidy eligibility Kerala",
    "MNRE solar subsidy",
    "government solar subsidy 2025",
    "solar installation subsidy Kerala",
    "free solar panel scheme Kerala",
    "PM Surya Ghar portal Kerala",
    "net metering Kerala KSEB",
    "solar subsidy calculator",
    "Flarize solar Kerala",
  ],
  openGraph: {
    title:
      "PM Surya Ghar Subsidy Kerala 2025 | Get ₹78,000 Back ",
    description:
      "Claim up to ₹78,000 PM Surya Ghar solar subsidy in Kerala. Flarize handles KSEB paperwork, portal filing & 2–3 day installation. 300+ families served, 8+ years in Kerala.",
    url: "https://flarize.com/subsidy",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "PM Surya Ghar Solar Subsidy Kerala – Flarize",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "PM Surya Ghar Subsidy Kerala 2025 | Get ₹78,000 Back ",
    description:
      "Claim up to ₹78,000 PM Surya Ghar solar subsidy in Kerala. Flarize handles KSEB paperwork, portal filing & 2–3 day installation. 300+ families served, 8+ years in Kerala.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/subsidy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SubsidyPage() {
  return <SubsidyMain />;
}
