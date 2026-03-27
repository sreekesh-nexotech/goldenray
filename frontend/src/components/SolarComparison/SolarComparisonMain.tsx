"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SolarPanel,
  FilterState,
  DEFAULT_FILTER_STATE,
} from "@/types/solarPanel";
import {
  getFilteredPanels,
  getAvailableBrands,
} from "@/services/solarPanelService";
import FilterSidebar from "./FilterSidebar";
import PanelCard from "./PanelCard";
import ComparisonTable from "./ComparisonTable";
import HowToChoose from "./HowToChoose";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";
import PageIllustration from "@/components/ui/page-illustration";
import { ChevronDown, SlidersHorizontal, ArrowRight } from "lucide-react";

type SortOption = "topRated" | "efficiency" | "price" | "warranty";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "topRated", label: "Top Rated" },
  { value: "efficiency", label: "Highest Efficiency" },
  { value: "price", label: "Price: Low to High" },
  { value: "warranty", label: "Longest Warranty" },
];

export default function SolarComparisonMain() {
  const [panels, setPanels] = useState<SolarPanel[]>([]);
  const [allPanels, setAllPanels] = useState<SolarPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [sortBy, setSortBy] = useState<SortOption>("topRated");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPanelIds, setSelectedPanelIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Fetch panels on mount and when filters/sort change
  const fetchPanels = useCallback(async () => {
    setLoading(true);
    try {
      const filtered = await getFilteredPanels(filters, sortBy);
      setPanels(filtered);
    } catch (error) {
      console.error("Error fetching panels:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      const brands = getAvailableBrands();
      setAvailableBrands(brands);
      // Get all panels for comparison dropdown
      const all = await getFilteredPanels(DEFAULT_FILTER_STATE, "topRated");
      setAllPanels(all);
    };
    init();
  }, []);

  useEffect(() => {
    fetchPanels();
  }, [fetchPanels]);

  const handleToggleCompare = (panelId: string) => {
    setSelectedPanelIds((prev) => {
      if (prev.includes(panelId)) {
        return prev.filter((id) => id !== panelId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, panelId];
    });
  };

  const handleRemoveFromComparison = (panelId: string) => {
    setSelectedPanelIds((prev) => prev.filter((id) => id !== panelId));
  };

  const handleAddToComparison = (panelId: string) => {
    if (selectedPanelIds.length < 3 && !selectedPanelIds.includes(panelId)) {
      setSelectedPanelIds((prev) => [...prev, panelId]);
    }
  };

  const selectedPanels = allPanels.filter((p) =>
    selectedPanelIds.includes(p.id),
  );

  // Show comparison view
  if (showComparison) {
    return (
      <ComparisonTable
        selectedPanels={selectedPanels}
        allPanels={allPanels}
        onRemovePanel={handleRemoveFromComparison}
        onAddPanel={handleAddToComparison}
        onClose={() => setShowComparison(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Compact Version */}
      <section className="relative w-full overflow-hidden">
        <PageIllustration />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-8 max-w-7xl">
          {/* Title and description */}
          <div className="w-full text-center">
            <h1 className="text-3xl sm:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-[#123532] mb-3">
              Compare Solar Panels for Your Home in Kerala
            </h1>
            <p className="text-base w-full md:w-2/3 mx-auto sm:text-lg md:text-xl text-[#444444] mb-4">
              Browse, filter, and compare panels rated for Kerala&apos;s climate
              — humidity, monsoon season, and high ambient temperatures all
              considered in every rating.
            </p>
          </div>
        </div>
      </section>

      {/* Kerala conditions note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
        <div
          className="bg-[#FBF2EA] border border-[#F1E3D8] rounded-2xl shadow-sm px-5 py-4 sm:px-6 sm:py-5"
          style={{ borderLeft: "3px solid var(--text, #444444)" }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#3D3D3D] mb-2">
            All panels rated for Kerala conditions
          </h2>
          <p className="text-sm sm:text-md 2xl:text-lg leading-6 text-[#4C4C4C]">
            Humidity resistance, monsoon performance, and temperature
            coefficient are weighted heavily in our Kerala Climate Score. Panels
            that degrade badly above 35°C are flagged accordingly. Every score
            is based on manufacturer datasheets, third-party test data, and real
            installations across Alappuzha, Kottayam, and Ernakulam.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Results Count */}
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {panels.length}
              </span>{" "}
              Panels Found
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 transition-colors"
              >
                <span className="hidden sm:inline">Sort by:</span>
                <span className="text-gray-900">
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    sortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          sortBy === option.value
                            ? "bg-[#074A4D]/10 text-[#074A4D] font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-6 lg:gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            availableBrands={availableBrands}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Panel Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[500px] animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : panels.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No panels match your filters
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your filter criteria to see more results
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTER_STATE)}
                  className="text-[#074A4D] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {panels.map((panel) => (
                  <PanelCard
                    key={panel.id}
                    panel={panel}
                    isSelected={selectedPanelIds.includes(panel.id)}
                    onToggleCompare={handleToggleCompare}
                    canSelect={selectedPanelIds.length < 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How to Choose Section */}
      <HowToChoose />

      {/* CTA Section */}
      <CTASection
        hasSelectedPanels={selectedPanelIds.length >= 2}
        onGetQuote={() => {
          // Will implement quote functionality
          window.location.href = "/contact";
        }}
        onCompareSelected={() => setShowComparison(true)}
      />

      {/* FAQ Section */}
      <FAQSection />

      {/* Floating Compare Bar */}
      {selectedPanelIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {selectedPanels.slice(0, 3).map((panel, index) => (
                    <div
                      key={panel.id}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-[#074A4D]"
                      style={{ zIndex: 3 - index }}
                    >
                      {panel.brand.charAt(0)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedPanelIds.length} panel
                    {selectedPanelIds.length > 1 ? "s" : ""} selected
                  </p>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {selectedPanelIds.length < 2
                      ? "Select at least 2 to compare"
                      : "Ready to compare"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPanelIds([])}
                  className="px-4 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowComparison(true)}
                  disabled={selectedPanelIds.length < 2}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    selectedPanelIds.length >= 2
                      ? "bg-[#074A4D] text-white hover:bg-[#063D3F]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Compare
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
