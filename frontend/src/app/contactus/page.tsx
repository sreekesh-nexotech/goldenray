// src/app/contactus/page.tsx

import ContactMain from "@/components/ContactUs/ContactMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Solar Experts in Kerala | Flarize",
  description:
    "Speak with Kerala's solar installation experts. Contact Flarize for site visits, system design, pricing, and support.",
  keywords: [
    "solar installation kerala contact",
    "solar company kerala contact",
    "solar experts kerala",
    "rooftop solar consultation kerala",
  ],
  openGraph: {
    title: "Contact Solar Experts in Kerala | Flarize",
    description:
      "Speak with Kerala's solar installation experts. Contact Flarize for site visits, system design, pricing, and support.",
    url: "https://flarize.com/contact-flarize-solar",
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
    title: "Contact Solar Experts in Kerala | Flarize",
    description:
      "Speak with Kerala's solar installation experts. Contact Flarize for site visits, system design, pricing, and support.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/contact-flarize-solar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactUsPage() {
  return <ContactMain />;
}
