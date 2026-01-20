// src/app/contactus/page.tsx

import ContactMain from "@/components/ContactUs/ContactMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Flarize - Get in Touch for Solar Solutions in Kerala",
  description:
    "Contact Flarize for expert solar energy solutions. Reach out via phone, email, or visit our office in Alappuzha, Kerala. Book your free consultation today!",
  openGraph: {
    title: "Contact Flarize - Solar Energy Experts in Kerala",
    description:
      "Get in touch with Flarize for residential and commercial solar solutions. Free consultations available.",
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
    title: "Contact Flarize - Solar Energy Experts",
    description:
      "Reach out to us for solar energy solutions in Kerala. Free consultations available.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/contactus",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactUsPage() {
  return <ContactMain />;
}
