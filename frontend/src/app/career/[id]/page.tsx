// src/app/career/[id]/page.tsx
//
// One job page. The posting comes from the Studio's Job Positions module
// (§6.11, §6.12) — published or closed — and falls back to the shipped
// `career-positions` data for the slugs that predate the CMS, so old links
// keep working while the team migrates postings into the Studio.

import { Metadata } from "next";
import { notFound } from "next/navigation";
import CareerHero from "@/components/Career/CareerHero";
import CareerStats from "@/components/Career/CareerStats";
import JobDetail, { type JobDetailData } from "@/components/Career/JobDetail";
import PositionClosed from "@/components/Career/PositionClosed";
import ApplicationForm from "@/components/Career/ApplicationForm";
import OpenPositions from "@/components/Career/OpenPositions";
import ResumeCTA from "@/components/Career/ResumeCTA";
import JoinCTA from "@/components/Career/JoinCTA";
import PerksBenefits from "@/components/Career/PerksBenefits";
import { careerPositions, getPositionBySlug } from "@/data/career-positions";
import { SITE_URL } from "@/config";
import { fetchPublicJobPosition, type PublicJobDetail } from "@/services/publicCmsService";

type PositionPageProps = {
  params: Promise<{ id: string }>;
};

/** Everything the page renders, whichever source the posting came from. */
interface ResolvedPosition {
  slug: string;
  title: string;
  department: string;
  location: string;
  isHiring: boolean;
  detail: JobDetailData;
  /** CMS id + department snapshot for the application form; null when shipped data. */
  positionId: number | null;
  seo: { title: string; description: string; keywords?: string[]; canonical?: string; noindex?: boolean };
  /** JobPosting JSON-LD from the CMS, when it built one. */
  schema: Record<string, unknown> | null;
}

/** Split a one-per-line list into the two-column layout the design uses. */
function twoColumns(items: string[]) {
  const half = Math.ceil(items.length / 2);
  return { left: items.slice(0, half), right: items.slice(half) };
}

function fromCms(p: PublicJobDetail, schema: Record<string, unknown> | null): ResolvedPosition {
  const overview = p.description
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    slug: p.slug,
    title: p.title,
    department: p.department ?? "General",
    location: p.location,
    isHiring: p.is_open,
    positionId: p.id,
    detail: {
      title: p.title,
      overview: overview.length ? overview : [p.description],
      responsibilities: twoColumns(p.responsibilities),
      requirements: twoColumns(p.requirements),
      niceToHave: { left: [], right: [] },
      whatYoullGet: twoColumns(p.benefits),
      locationDetail: p.location,
      employmentType: p.employment_type,
      applicationInstructions: p.application_instructions,
    },
    seo: {
      title: p.seo.title || `${p.title} | Careers at Flarize`,
      description: p.seo.description,
      canonical: p.seo.canonical_url || undefined,
      noindex: p.seo.noindex,
    },
    schema,
  };
}

async function resolvePosition(slug: string): Promise<ResolvedPosition | null> {
  const cms = await fetchPublicJobPosition(slug);
  if (cms) return fromCms(cms.data, cms.meta.schema);

  const shipped = getPositionBySlug(slug);
  if (!shipped) return null;
  return {
    slug: shipped.slug,
    title: shipped.title,
    department: shipped.department,
    location: shipped.location,
    isHiring: shipped.isHiring,
    positionId: null,
    detail: shipped,
    seo: { title: shipped.seo.title, description: shipped.seo.description, keywords: shipped.seo.keywords },
    schema: null,
  };
}

export async function generateMetadata({
  params,
}: PositionPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const position = await resolvePosition(slug);

  if (!position) {
    return {
      title: "Position Not Found | Careers at Flarize",
      description: "The requested job opening could not be found.",
    };
  }

  const { seo } = position;
  const canonical = seo.canonical ?? `${SITE_URL}/career/${position.slug}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: "Flarize",
      images: [
        { url: "/heroImg.png", width: 1200, height: 630, alt: `${position.title} at Flarize` },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: { canonical },
    robots: {
      // A closed posting stays reachable but drops out of the index (§6.11).
      index: !seo.noindex && position.isHiring,
      follow: true,
    },
  };
}

// Prerender the shipped slugs so next-sitemap discovers them; CMS slugs render
// on demand and are cached under the ISR window in publicCmsService.
export async function generateStaticParams() {
  return careerPositions.map((position) => ({ id: position.slug }));
}

// CMS postings have slugs this build cannot know about, so unknown slugs must
// be resolved at request time; `resolvePosition` 404s the genuinely unknown.
export const dynamicParams = true;

export default async function CareerPositionPage({
  params,
}: PositionPageProps) {
  const { id: slug } = await params;
  const position = await resolvePosition(slug);

  if (!position) {
    notFound();
  }

  return (
    <section className="relative">
      {position.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(position.schema) }}
        />
      )}
      <CareerHero />
      <CareerStats />
      {position.isHiring ? (
        <>
          <JobDetail position={position.detail} />
          <ApplicationForm
            position={position.title}
            positionId={position.positionId}
            departmentName={position.department}
          />
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
