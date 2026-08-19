import FaqMain from "@/components/Faq/FaqMain";
import { Metadata } from "next";
import JsonLD from "@/components/JsonLD";
import { faqPageSchema } from "@/data/faq-data";

export const metadata: Metadata = {
  title:
    "Solar Panel FAQs Kerala 2026: Subsidy, Price, KSEB & Installation",
  description:
    "Answers to Kerala's top solar questions: How much does solar cost? What is the PM Surya Ghar subsidy? How does KSEB net metering work? How long does installation take? Updated 2026.",
  openGraph: {
    title:
      "Solar Panel FAQs Kerala 2026: Subsidy, Price, KSEB & Installation | Flarize",
    description:
      "Answers to Kerala's top solar questions: subsidy amounts, pricing, KSEB net metering, installation timeline, and which panels qualify for PM Surya Ghar. Updated 2026.",
    url: "https://flarize.com/faq",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar FAQ" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Solar Panel FAQs Kerala 2026: Subsidy, Price, KSEB & Installation | Flarize",
    description:
      "Answers to Kerala's top solar questions: subsidy amounts, pricing, KSEB net metering, installation timeline, and which panels qualify for PM Surya Ghar. Updated 2026.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/faq",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLD data={faqPageSchema} />
      <FaqMain />
    </>
  );
}
