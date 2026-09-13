// src/app/career/page.tsx

import CareerMain from "@/components/Career/CareerMain";
import { Metadata } from "next";
import { fetchPageContent } from "@/services/publicCmsService";

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

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPageContent("/career");
  const seo = content?.seo;
  if (!seo) return BASE_METADATA;

  const title = seo.title || BASE_METADATA.title;
  const description = seo.description || BASE_METADATA.description;
  return {
    ...BASE_METADATA,
    title,
    description,
    openGraph: { ...BASE_METADATA.openGraph, title: title as string, description: description as string },
    twitter: { ...BASE_METADATA.twitter, title: title as string, description: description as string },
    alternates: { canonical: seo.canonical_url || BASE_METADATA.alternates?.canonical },
    robots: seo.noindex ? { index: false, follow: true } : BASE_METADATA.robots,
  };
}

export default function Career() {
  return (
    <section className="relative">
      <CareerMain />
    </section>
  );
}
