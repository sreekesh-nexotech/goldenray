import { Metadata } from "next";
import GroupPurchaseMain from "@/components/GroupPurchase/GroupPurchaseMain";

const ogImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";

export const metadata: Metadata = {
  title: "Group Solar Purchase in Kerala | Save ₹10,000",
  description:
    "Join a group solar purchase in Kerala to unlock bulk pricing and save ₹10,000 with your neighbours.",
  keywords: [
    "group solar purchase kerala",
    "group solar discount kerala",
    "bulk solar purchase kerala",
    "solar group buying kerala",
    "solar savings kerala",
  ],
  openGraph: {
    title: "Group Solar Purchase in Kerala | Save ₹10,000",
    description:
      "Join a group solar purchase in Kerala to unlock bulk pricing and save ₹10,000 with your neighbours.",
    url: "https://www.flarize.com/group-purchase",
    siteName: "Flarize",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Group solar purchase in Kerala",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Group Solar Purchase in Kerala | Save ₹10,000",
    description:
      "Join a group solar purchase in Kerala to unlock bulk pricing and save ₹10,000 with your neighbours.",
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/group-purchase",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GroupPurchasePage() {
  return <GroupPurchaseMain />;
}
