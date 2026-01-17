import ProjectMain from "@/components/Projects/ProjectMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Solar Projects Portfolio - Residential & Commercial Installations | Flarize",
  description:
    "Explore Flarize's portfolio of successful solar projects across Kerala. View residential, commercial, and industrial solar installations with detailed case studies.",
  openGraph: {
    title: "Solar Projects Portfolio - Flarize",
    description:
      "Browse our successful solar energy projects and installations across Kerala.",
    url: "https://flarize.com/projects",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar Projects" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Projects Portfolio - Flarize",
    description: "Browse our successful solar energy projects across Kerala.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Projects() {
  return (
    <section className="relative">
      <ProjectMain />
    </section>
  );
}
