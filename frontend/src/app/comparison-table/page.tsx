import Link from "next/link";
import type { Metadata } from "next";
import { getAllPanels, getPanelsByIds } from "@/services/solarPanelService";
import ComparisonTableClient from "@/components/SolarComparison/ComparisonTableClient";
import PageIllustration from "@/components/ui/page-illustration";
import JsonLD from "@/components/JsonLD";
import { comparisonTablePageSchema } from "@/data/jsonld";
import { SITE_URL } from "@/config";
import { ChevronRight } from "lucide-react";

// Revalidate the cached panel data hourly (ISR).
export const revalidate = 3600;

const DESCRIPTION =
  "Compare solar panels side by side on efficiency, heat performance, warranty depth, certifications and Kerala Climate Score, from official datasheet figures.";

const readPanelIds = (panels?: string) =>
  panels?.split(",").filter(Boolean) || [];

// The title names the panels actually being compared — those brand-vs-brand
// terms are the highest-intent queries this page can win — and falls back to
// the generic form for the bare URL, which is what canonicalises and indexes.
// `absolute` opts out of the root layout's "%s | Flarize" template so the
// title stays inside Google's ~60-character cut.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ panels?: string }>;
}): Promise<Metadata> {
  const panelIds = readPanelIds((await searchParams).panels);
  const selected = panelIds.length ? await getPanelsByIds(panelIds) : [];

  const title =
    selected.length >= 2
      ? `${selected.map((p) => p.brand).join(" vs ")}: Solar Panel Spec Comparison`
      : "Solar Panel Comparison Table for Kerala Homes";

  return {
    title: { absolute: title },
    description: DESCRIPTION,
    keywords: [
      "solar panel comparison table",
      "waaree vs adani solar panel",
      "vikram solar vs waaree",
      "550W solar panel specifications",
      "solar panel specifications",
      "solar panel side by side",
      "best solar panel technology 2026",
      "kerala solar panels",
    ],
    openGraph: {
      title,
      description: DESCRIPTION,
      url: `${SITE_URL}/comparison-table`,
      siteName: "Flarize",
      images: [
        {
          url: "/heroImg.png",
          width: 1200,
          height: 630,
          alt: "Side-by-side solar panel specification comparison",
        },
      ],
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Efficiency, heat loss, warranty and lab testing compared from official datasheets.",
      images: ["/heroImg.png"],
    },
    icons: {
      icon: "/favicon.ico",
    },
    // Panel selection lives in ?panels=, so every combination is a crawlable
    // near-duplicate. The canonical is deliberately parameter-free: it folds
    // all of them back into the one URL worth indexing.
    alternates: {
      canonical: `${SITE_URL}/comparison-table`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function ComparisonTablePage({
  searchParams,
}: {
  searchParams: Promise<{ panels?: string }>;
}) {
  const params = await searchParams;
  const panelIds = readPanelIds(params.panels);

  // Fetch all panels (for the dropdown) and the pre-selected panels on the server.
  const [allPanels, selectedPanels] = await Promise.all([
    getAllPanels(),
    panelIds.length > 0 ? getPanelsByIds(panelIds) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Product and FAQ markup built from the same panel records the table
          renders, so no spec in the structured data can contradict a cell. */}
      <JsonLD data={comparisonTablePageSchema(selectedPanels)} />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white">
        <PageIllustration />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-12 md:pb-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm mb-6"
          >
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#074A4D] transition-colors"
            >
              Home
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="w-4 h-4 text-[#9CA3AF]"
            />
            <Link
              href="/solar-comparison"
              className="text-[#6B7280] hover:text-[#074A4D] transition-colors"
            >
              Compare Solar Panels
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="w-4 h-4 text-[#9CA3AF]"
            />
            <span aria-current="page" className="text-[#074A4D] font-medium">
              Comparison Table
            </span>
          </nav>

          {/* Tagline */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-4">
            <span className="text-sm text-[#6B7280]">
              Specs verified from official datasheets
            </span>
            <span className="hidden sm:inline text-[#9CA3AF]">·</span>
            <span className="text-sm text-[#6B7280]">Kerala rated</span>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-[2.75rem] sm:text-6xl lg:text-5xl xl:text-6xl font-semibold text-[#123532] mb-4 leading-tight">
              Solar Panel Comparison Table
              <br className="sm:hidden" /> for Kerala Homes
            </h1>
            <p className="text-base sm:text-base md:text-xl text-[#444444] max-w-3xl mx-auto">
              Select any panels below and compare them spec-by-spec. Updated
              with real datasheet figures.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table (interactive client island) */}
      <ComparisonTableClient
        initialSelectedPanels={selectedPanels}
        allPanels={allPanels}
      />
    </div>
  );
}
