import BlogMain from "@/components/Blog/BlogMain";
import { Metadata } from "next";
import { fetchAllArticles } from "@/services/blogApiService";

// Revalidate the entire page every 2 minutes (ISR). The CMS publish webhook
// clears this instantly; this window is the fallback for when that ping fails.
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
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
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions from Flarize.",
    url: "https://flarize.com/blog",
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
    title: "Solar Energy Blog Kerala | Tips, Guides & Updates",
    description:
      "Read expert insights on solar power in Kerala. Get updates on panels, subsidies, savings, and smart energy solutions from Flarize.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function BlogPage() {
  const { articles, categories } = await fetchAllArticles();
  return (
    <section className="relative">
      <BlogMain articles={articles} categories={categories} />
    </section>
  );
}
