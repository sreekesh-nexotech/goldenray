// src/app/career/page.tsx

import CareerMain from "@/components/Career/CareerMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";

// The shipped metadata. The Studio's Career Page screen (§6.16) can override
// the SEO title, description and canonical; `generateMetadata` below merges
// those in and leaves everything else as written here.
const BASE_METADATA: Metadata = {
  title: "Careers | Join Kerala's Fastest Growing Solar Platform",
  description:
    "Build the future of clean energy with Flarize. Explore open positions across engineering, design, sales, and operations. Join a lean, high-impact team powering solar across Kerala.",
  keywords: [
    "Solar careers Kerala",
    "Flarize careers",
    "Solar jobs Kerala",
    "Clean energy jobs",
    "Solar startup jobs India",
    "Engineering jobs Kochi",
    "Sales jobs Kerala",
    "Work at Flarize",
    "Renewable energy careers",
  ],
  openGraph: {
    title: "Careers | Join Kerala's Fastest Growing Solar Platform",
    description:
      "Build the future of clean energy with Flarize. Explore open positions across engineering, design, sales, and operations.",
    url: "https://flarize.com/career",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Careers at Flarize" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Join Kerala's Fastest Growing Solar Platform",
    description:
      "Build the future of clean energy with Flarize. Explore open positions and join our mission.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/career",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const generateMetadata = () => withCmsSeo("/career", BASE_METADATA);

export default function Career() {
  return (
    <section className="relative">
      <CareerMain />
    </section>
  );
}
