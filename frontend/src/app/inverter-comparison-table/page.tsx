"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SolarInverter } from "@/types/solarInverter";
import {
  getAllInverters,
  getInvertersByIds,
} from "@/services/solarInverterService";
import ComparisonTable from "@/components/InverterComparison/ComparisonTable";
import PageIllustration from "@/components/ui/page-illustration";
import { ChevronRight } from "lucide-react";

function InverterComparisonTableContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedInverters, setSelectedInverters] = useState<SolarInverter[]>(
    [],
  );
  const [allInverters, setAllInverters] = useState<SolarInverter[]>([]);
  const [loading, setLoading] = useState(true);

  const inverterIds = useMemo(
    () => searchParams.get("inverters")?.split(",").filter(Boolean) || [],
    [searchParams],
  );

  const fetchInverters = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllInverters();
      setAllInverters(all);

      if (inverterIds.length > 0) {
        const selected = await getInvertersByIds(inverterIds);
        setSelectedInverters(selected);
      }
    } catch (error) {
      console.error("Error fetching inverters:", error);
    } finally {
      setLoading(false);
    }
  }, [inverterIds]);

  useEffect(() => {
    fetchInverters();
  }, [fetchInverters]);

  const updateURL = useCallback(
    (newIds: string[]) => {
      const params = new URLSearchParams();
      if (newIds.length > 0) {
        params.set("inverters", newIds.join(","));
      }
      router.replace(`/inverter-comparison-table?${params.toString()}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleRemoveInverter = (inverterId: string) => {
    const newSelected = selectedInverters.filter((p) => p.id !== inverterId);
    setSelectedInverters(newSelected);
    updateURL(newSelected.map((p) => p.id));
  };

  const handleAddInverter = (inverterId: string) => {
    if (selectedInverters.length >= 3) return;
    const toAdd = allInverters.find((p) => p.id === inverterId);
    if (toAdd && !selectedInverters.find((p) => p.id === inverterId)) {
      const newSelected = [...selectedInverters, toAdd];
      setSelectedInverters(newSelected);
      updateURL(newSelected.map((p) => p.id));
    }
  };

  const handleBack = () => {
    router.push("/inverter-comparison");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#074A4D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

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

      <ComparisonTable
        selectedInverters={selectedInverters}
        allInverters={allInverters}
        onRemoveInverter={handleRemoveInverter}
        onAddInverter={handleAddInverter}
        onClose={handleBack}
      />
    </div>
  );
}

export default function InverterComparisonTablePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#074A4D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comparison...</p>
          </div>
        </div>
      }
    >
      <InverterComparisonTableContent />
    </Suspense>
  );
}
