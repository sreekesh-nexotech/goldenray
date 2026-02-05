import Main from "@/components/Home/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Power Systems in Kerala for Homes & Businesses | Flarize",
  description:
    "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
  keywords: [
    "solar power system for home kerala",
    "solar panel price in kerala",
    "rooftop solar kerala",
    "on grid solar system kerala",
    "off grid solar kerala",
    "best solar company in kerala",
  ],
  openGraph: {
    title: "Solar Power Systems in Kerala for Homes & Businesses | Flarize",
    description:
      "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Flarize Solar Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Power Systems in Kerala for Homes & Businesses | Flarize",
    description:
      "Switch to clean solar energy in Kerala. Flarize installs reliable solar power systems for homes and businesses with long-term savings.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <section>
      <Main />
    </section>
  );
}
