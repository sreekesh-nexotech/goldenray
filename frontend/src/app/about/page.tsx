// src/app/about/page.tsx

import AboutMain from "@/components/About/AboutMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Flarize - Leading Solar Energy Provider in Kerala",
  description:
    "Learn about Flarize's mission to provide clean, reliable solar energy solutions in Kerala. Discover our team, values, and commitment to sustainability.",
  openGraph: {
    title: "About Flarize - Leading Solar Energy Provider in Kerala",
    description:
      "Discover how Flarize is transforming Kerala with practical, transparent solar energy solutions for homes and businesses.",
    url: "https://flarize.com/about",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "About Flarize" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Flarize - Leading Solar Energy Provider",
    description:
      "Learn about our mission to provide clean, reliable solar energy solutions.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
  return (
    <section className="relative">
      <AboutMain />
    </section>
  );
}
