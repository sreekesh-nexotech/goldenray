import ResourceMain from "@/components/Resources/ResourceMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";

const BASE_METADATA: Metadata = {
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
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/resources",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for /resources (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/resources", BASE_METADATA);
export default function Resources() {
  return (
    <section className="relative">
      <ResourceMain />
    </section>
  );
}
