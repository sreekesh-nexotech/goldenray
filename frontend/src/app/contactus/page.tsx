// src/app/contactus/page.tsx

import ContactMain from "@/components/ContactUs/ContactMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";

const BASE_METADATA: Metadata = {
  title: "Contact Solar Experts in Kerala",
  description:
    "Speak with Kerala's solar installation experts. Contact Flarize for site visits, system design, pricing, and support.",
  keywords: [
    "solar installation kerala contact",
    "solar company kerala contact",
    "solar experts kerala",
    "rooftop solar consultation kerala",
  ],
  openGraph: {
    title: "Contact Solar Experts in Kerala",
    description:
      "Speak with Kerala's solar installation experts. Contact Flarize for site visits, system design, pricing, and support.",
    url: "https://flarize.com/contactus",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Contact Flarize",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Solar Experts in Kerala",
    description:
      "Speak with Kerala's solar installation experts. Contact Flarize for site visits, system design, pricing, and support.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/contactus",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for /contactus (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/contactus", BASE_METADATA);
export default function ContactUsPage() {
  return <ContactMain />;
}
