import BlogMain from "@/components/Blog/BlogMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Energy Blog Kerala | Tips, Guides & Updates | Flarize",
  description:
    "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions from Flarize.",
  keywords: [
    "solar blog Kerala",
    "solar energy tips Kerala",
    "solar subsidy updates Kerala",
    "rooftop solar guides Kerala",
    "renewable energy blog India",
    "PM Surya Ghar updates",
    "KSEB solar blog",
    "solar installation Kerala guide",
  ],
  openGraph: {
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates | Flarize",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions from Flarize.",
    url: "https://www.flarize.com/blog",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Flarize Solar Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates | Flarize",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions from Flarize.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <section className="relative">
      <BlogMain />
    </section>
  );
}
