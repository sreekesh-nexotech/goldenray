import Link from "next/link";
import { getAllPanels, getPanelsByIds } from "@/services/solarPanelService";
import ComparisonTableClient from "@/components/SolarComparison/ComparisonTableClient";
import PageIllustration from "@/components/ui/page-illustration";
import { ChevronRight } from "lucide-react";

// Revalidate the cached panel data hourly (ISR).
export const revalidate = 3600;

export default async function ComparisonTablePage({
  searchParams,
}: {
  searchParams: Promise<{ panels?: string }>;
}) {
  const params = await searchParams;
  const panelIds = params.panels?.split(",").filter(Boolean) || [];

  // Fetch all panels (for the dropdown) and the pre-selected panels on the server.
  const [allPanels, selectedPanels] = await Promise.all([
    getAllPanels(),
    panelIds.length > 0 ? getPanelsByIds(panelIds) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white">
        <PageIllustration />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-12 md:pb-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-sm mb-6">
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#074A4D] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            <Link
              href="/solar-comparison"
              className="text-[#6B7280] hover:text-[#074A4D] transition-colors"
            >
              Compare Solar Panels
            </Link>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            <span className="text-[#074A4D] font-medium">Comparison Table</span>
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
              Solar Panel<br className="sm:hidden" /> Comparison Table
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
