// src/app/service-area/[region]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCanonicalDistrictName } from "@/data/service-area-data";
import {
  isServedDistrict,
  servedDistrictSlugs,
} from "@/data/service-area-content";
import ServiceAreaHero from "@/components/ServiceArea/ServiceAreaHero";
import WhySolar from "@/components/ServiceArea/WhySolar";
import ServiceAreaCTA from "@/components/ServiceArea/ServiceAreaCTA";
import SolarAdvantageMain from "@/components/SolarCalculator/SolarAdvantageMain";
import Locations from "@/components/ServiceArea/Locations";
import RecentInstalls from "@/components/ServiceArea/RecentInstalls";
import LocalStory from "@/components/ServiceArea/LocalStory";
import Faq from "@/components/ServiceArea/Faq";
import InstallationProcess from "@/components/ServiceArea/InstallationProcess";
import { SITE_URL } from "@/config";

const SITE_ORIGIN = SITE_URL;

// Only the districts we actively serve get a page — anything else 404s.
export const dynamicParams = false;

// ─── Static params — one page per served district slug ────────────────────────
export function generateStaticParams() {
  return servedDistrictSlugs.map((region) => ({ region }));
}

// ─── Metadata — unique per district for local SEO ─────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const district = getCanonicalDistrictName(region);
  if (!district || !isServedDistrict(district)) return {};

  const title = `Solar Installation in ${district}`;
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

  if (!district || !isServedDistrict(district)) notFound();

  return (
    <section className="relative">
      <ServiceAreaHero district={district} />
      <WhySolar district={district} />
      <SolarAdvantageMain />
      <Locations district={district} />
      <InstallationProcess district={district} />
      <RecentInstalls district={district} />
      <LocalStory district={district} />
      <ServiceAreaCTA district={district} />
      <Faq district={district} />
    </section>
  );
}
