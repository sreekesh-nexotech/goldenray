import { Suspense } from "react";
import ProjectMain from "@/components/Projects/ProjectMain";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";

const BASE_METADATA: Metadata = {
  title: "Solar Installation Projects in Kerala",
  description:
    "Explore completed solar projects across Kerala. Trusted residential and commercial installations delivered by Flarize experts.",
  keywords: [
    "solar installation projects kerala",
    "residential solar projects kerala",
    "commercial solar projects kerala",
    "rooftop solar installations kerala",
  ],
  openGraph: {
    title: "Solar Installation Projects in Kerala",
    description:
      "Explore completed solar projects across Kerala. Trusted residential and commercial installations delivered by Flarize experts.",
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
    title: "Solar Installation Projects in Kerala",
    description:
      "Explore completed solar projects across Kerala. Trusted residential and commercial installations delivered by Flarize experts.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for /projects (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/projects", BASE_METADATA);
export default function Projects() {
  return (
    <>
      <CmsPageSchema route="/projects" />
      <section className="relative">
        <Suspense fallback={null}>
          <ProjectMain />
        </Suspense>
      </section>
    </>
  );
}
