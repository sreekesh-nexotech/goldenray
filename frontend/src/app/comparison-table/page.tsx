"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SolarPanel } from "@/types/solarPanel";
import { getAllPanels, getPanelsByIds } from "@/services/solarPanelService";
import ComparisonTable from "@/components/SolarComparison/ComparisonTable";
import PageIllustration from "@/components/ui/page-illustration";
import { ChevronRight } from "lucide-react";

function ComparisonTableContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPanels, setSelectedPanels] = useState<SolarPanel[]>([]);
  const [allPanels, setAllPanels] = useState<SolarPanel[]>([]);
  const [loading, setLoading] = useState(true);

  // Get panel IDs from URL
  const panelIds = searchParams.get("panels")?.split(",").filter(Boolean) || [];

  // Fetch panels data
  const fetchPanels = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all panels for the dropdown
      const all = await getAllPanels();
      setAllPanels(all);

      // Fetch selected panels
      if (panelIds.length > 0) {
        const selected = await getPanelsByIds(panelIds);
        setSelectedPanels(selected);
      }
    } catch (error) {
      console.error("Error fetching panels:", error);
    } finally {
      setLoading(false);
    }
  }, [panelIds.join(",")]);

  useEffect(() => {
    fetchPanels();
  }, [fetchPanels]);

  // Update URL when panels change
  const updateURL = useCallback(
    (newPanelIds: string[]) => {
      const params = new URLSearchParams();
      if (newPanelIds.length > 0) {
        params.set("panels", newPanelIds.join(","));
      }
      router.replace(`/comparison-table?${params.toString()}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleRemovePanel = (panelId: string) => {
    const newSelected = selectedPanels.filter((p) => p.id !== panelId);
    setSelectedPanels(newSelected);
    updateURL(newSelected.map((p) => p.id));
  };

  const handleAddPanel = (panelId: string) => {
    if (selectedPanels.length >= 3) return;
    const panelToAdd = allPanels.find((p) => p.id === panelId);
    if (panelToAdd && !selectedPanels.find((p) => p.id === panelId)) {
      const newSelected = [...selectedPanels, panelToAdd];
      setSelectedPanels(newSelected);
      updateURL(newSelected.map((p) => p.id));
    }
  };

  const handleBackToComparison = () => {
    router.push("/solar-comparison");
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
            <h1 className="text-3xl sm:text-6xl lg:text-5xl xl:text-6xl font-semibold text-[#123532] mb-4">
              Solar Panel<br className="sm:hidden" /> Comparison Table
            </h1>
            <p className="text-base sm:text-base md:text-xl text-[#444444] max-w-3xl mx-auto">
              Select any panels below and compare them spec-by-spec. Updated
              with real datasheet figures.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable
        selectedPanels={selectedPanels}
        allPanels={allPanels}
        onRemovePanel={handleRemovePanel}
        onAddPanel={handleAddPanel}
        onClose={handleBackToComparison}
      />
    </div>
  );
}

export default function ComparisonTablePage() {
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
      <ComparisonTableContent />
    </Suspense>
  );
}
