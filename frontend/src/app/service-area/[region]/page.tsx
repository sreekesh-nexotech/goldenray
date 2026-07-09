// src/app/service-area/[region]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  districtSlugs,
  getCanonicalDistrictName,
  getServiceAreaBySlug,
} from "@/data/service-area-data";
import ServiceAreaHero from "@/components/ServiceArea/ServiceAreaHero";
import ServiceAreaCTA from "@/components/ServiceArea/ServiceAreaCTA";

const SITE_ORIGIN = "https://www.flarize.com";

// The 14 districts are a fixed, complete set — reject anything else with a 404.
export const dynamicParams = false;

// ─── Static params — one page per canonical district slug ─────────────────────
export function generateStaticParams() {
  return districtSlugs.map((region) => ({ region }));
}

// ─── Metadata — unique per district for local SEO ─────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const district = getCanonicalDistrictName(region);
  if (!district) return {};

  const title = `Solar Installation in ${district} | Flarize Kerala`;
  const description = `Rooftop & commercial solar installation in ${district}, Kerala. Residential solar, group purchase, KSEB & PM Surya Ghar subsidy assistance, and SolarCare maintenance with local ${district} technicians.`;
  const canonical = `${SITE_ORIGIN}/service-area/${region}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Flarize",
      images: [
        {
          url: "/heroImg.png",
          width: 1200,
          height: 630,
          alt: `Flarize solar services in ${district}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/heroImg.png"],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ServiceAreaRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const district = getCanonicalDistrictName(region);
  const area = getServiceAreaBySlug(region);

  if (!district || !area) notFound();

  return (
    <section className="relative">
      <ServiceAreaHero district={district} />
      <ServiceAreaCTA />
    </section>
  );
}
