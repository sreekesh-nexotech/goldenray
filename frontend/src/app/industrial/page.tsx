// src/app/industrial/page.tsx
import { Metadata } from "next";
import Hero from "@/components/ui/Hero";

export const metadata: Metadata = {
  title: "Industrial Solar Power Systems in Kerala | EPC Services",
  description:
    "Power your operations with industrial solar systems in Kerala. Flarize delivers EPC services, scalable capacity, and long-term ROI.",
  keywords: [
    "industrial solar installation kerala",
    "industrial rooftop solar kerala",
    "solar EPC services kerala",
    "megawatt solar plant kerala",
    "factory solar systems kerala",
  ],
  openGraph: {
    title: "Industrial Solar Power Systems in Kerala | EPC Services",
    description:
      "Power your operations with industrial solar systems in Kerala. Flarize delivers EPC services, scalable capacity, and long-term ROI.",
    url: "https://www.flarize.com/industrial",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Industrial Solar Installation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial Solar Power Systems in Kerala | EPC Services",
    description:
      "Power your operations with industrial solar systems in Kerala. Flarize delivers EPC services, scalable capacity, and long-term ROI.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/industrial",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IndustrialSolar() {
  return (
    <>
      <Hero
        title="Industrial Solar Power Systems"
        description="Power your operations with industrial solar systems in Kerala. Flarize delivers EPC services, scalable capacity, and long-term ROI."
      />
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Industrial Solar Solutions
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Our industrial solar power systems are designed to meet the high
            energy demands of factories, manufacturing units, and large-scale
            operations across Kerala. With comprehensive EPC services and
            scalable capacity options, we deliver reliable, cost-effective solar
            solutions that maximize your long-term ROI.
          </p>
        </div>
      </section>
    </>
  );
}
