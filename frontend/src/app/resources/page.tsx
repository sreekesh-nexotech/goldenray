import ResourceMain from "@/components/Resources/ResourceMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Energy Blog & Resources - Guides, Tips & Insights | Flarize",
  description:
    "Explore Flarize's blog for expert guides, tips, and insights on solar energy, installation, maintenance, and sustainability in Kerala.",
  openGraph: {
    title: "Solar Energy Blog & Resources - Flarize",
    description:
      "Discover helpful guides, tips, and tools to make your solar journey easy and efficient.",
    url: "https://flarize.com/resources",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar Resources" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Energy Blog & Resources - Flarize",
    description: "Expert guides and tips for your solar energy journey.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/resources",
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
