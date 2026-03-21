import FaqMain from "@/components/Faq/FaqMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Subsidy & Rooftop Solar FAQs in Kerala",
  description:
    "Find answers on solar subsidies, pricing, net metering, and rooftop solar systems in Kerala before going solar.",
  keywords: [
    "solar subsidy kerala",
    "rooftop solar FAQ kerala",
    "net metering kerala solar",
    "solar panel price kerala FAQ",
    "on grid solar subsidy kerala",
  ],
  openGraph: {
    title: "Solar Subsidy & Rooftop Solar FAQs in Kerala",
    description:
      "Find answers on solar subsidies, pricing, net metering, and rooftop solar systems in Kerala before going solar.",
    url: "https://www.flarize.com/faq",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar FAQ" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Subsidy & Rooftop Solar FAQs in Kerala",
    description:
      "Find answers on solar subsidies, pricing, net metering, and rooftop solar systems in Kerala before going solar.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/faq",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  return <FaqMain />;
}
