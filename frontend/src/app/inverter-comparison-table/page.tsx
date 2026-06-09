import Link from "next/link";
import {
  getAllInverters,
  getInvertersByIds,
} from "@/services/solarInverterService";
import ComparisonTableClient from "@/components/InverterComparison/ComparisonTableClient";
import PageIllustration from "@/components/ui/page-illustration";
import { ChevronRight } from "lucide-react";

// Revalidate the cached inverter data hourly (ISR).
export const revalidate = 3600;

export default async function InverterComparisonTablePage({
  searchParams,
}: {
  searchParams: Promise<{ inverters?: string }>;
}) {
  const params = await searchParams;
  const inverterIds = params.inverters?.split(",").filter(Boolean) || [];

  const [allInverters, selectedInverters] = await Promise.all([
    getAllInverters(),
    inverterIds.length > 0
      ? getInvertersByIds(inverterIds)
      : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <section className="relative w-full overflow-hidden bg-white">
        <PageIllustration />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-12 md:pb-10">
          <nav className="flex items-center gap-1.5 text-sm mb-6">
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#074A4D] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            <Link
              href="/inverter-comparison"
              className="text-[#6B7280] hover:text-[#074A4D] transition-colors"
            >
              Compare Solar Inverters
            </Link>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            <span className="text-[#074A4D] font-medium">Comparison Table</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-4">
            <span className="text-sm text-[#6B7280]">
              Specs verified from official datasheets
            </span>
            <span className="hidden sm:inline text-[#9CA3AF]">·</span>
            <span className="text-sm text-[#6B7280]">Kerala rated</span>
          </div>

          <div className="text-center">
            <h1 className="text-[2.75rem] sm:text-6xl lg:text-5xl xl:text-6xl font-semibold text-[#123532] mb-4 leading-tight">
              Inverter
              <br className="sm:hidden" /> Comparison Table
            </h1>
            <p className="text-base sm:text-base md:text-xl text-[#444444] max-w-3xl mx-auto">
              Select any inverters below and compare them spec-by-spec. Updated
              with real datasheet figures.
            </p>
          </div>
        </div>
      </section>

      <ComparisonTableClient
        initialSelectedInverters={selectedInverters}
        allInverters={allInverters}
      />
    </div>
  );
}
