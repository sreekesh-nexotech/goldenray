// src/app/career/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import CareerHero from "@/components/Career/CareerHero";
import CareerStats from "@/components/Career/CareerStats";
import JobDetail from "@/components/Career/JobDetail";
import PositionClosed from "@/components/Career/PositionClosed";
import ApplicationForm from "@/components/Career/ApplicationForm";
import OpenPositions from "@/components/Career/OpenPositions";
import ResumeCTA from "@/components/Career/ResumeCTA";
import JoinCTA from "@/components/Career/JoinCTA";
import PerksBenefits from "@/components/Career/PerksBenefits";
import { careerPositions, getPositionBySlug } from "@/data/career-positions";
import { SITE_URL } from "@/config";

type PositionPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PositionPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const position = getPositionBySlug(slug);

  if (!position) {
    return {
      title: "Position Not Found | Careers at Flarize",
      description: "The requested job opening could not be found.",
    };
  }

  const { seo } = position;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${SITE_URL}/career/${position.slug}`,
      siteName: "Flarize",
      images: [
        { url: "/heroImg.png", width: 1200, height: 630, alt: seo.ogImageAlt },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/career/${position.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Prerender every known position so next-sitemap can discover the pages.
export async function generateStaticParams() {
  return careerPositions.map((position) => ({ id: position.slug }));
}

// Only real position slugs render; anything else is a genuine 404.
export const dynamicParams = false;

export default async function CareerPositionPage({
  params,
}: PositionPageProps) {
  const { id: slug } = await params;
  const position = getPositionBySlug(slug);

  if (!position) {
    notFound();
  }

  return (
    <section className="relative">
      <CareerHero />
      <CareerStats />
      {position.isHiring ? (
        <>
          <JobDetail position={position} />
          <ApplicationForm position={position.title} />
        </>
      ) : (
        <PositionClosed position={position} />
      )}
      <PerksBenefits />
      <OpenPositions />
      <ResumeCTA />
      <JoinCTA />
    </section>
  );
}
