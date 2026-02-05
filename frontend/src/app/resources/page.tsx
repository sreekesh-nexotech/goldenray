import ResourceMain from "@/components/Resources/ResourceMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
  description:
    "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions.",
  keywords: [
    "solar blog kerala",
    "solar energy tips kerala",
    "solar subsidy updates kerala",
    "rooftop solar guides kerala",
    "renewable energy blog india",
  ],
  openGraph: {
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions.",
    url: "https://flarize.com/solar-blog",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar Resources" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/solar-blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Resources() {
  return (
    <section className="relative">
      <ResourceMain />
    </section>
  );
}
