"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  SolarPanel,
  PanelType,
  RatingType,
  FilterState,
  DEFAULT_FILTER_STATE,
} from "@/types/solarPanel";
import {
  getFilteredPanels,
  getAvailableBrands,
} from "@/services/solarPanelService";
import FilterSidebar from "@/components/SolarComparison/FilterSidebar";
import PanelCard from "./PanelCard";
import HowToChoose from "./HowToChoose";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";
import PageIllustration from "@/components/ui/page-illustration";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

type SortOption = "topRated" | "efficiency" | "price" | "warranty";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "topRated", label: "Top Rated" },
  { value: "efficiency", label: "Highest Efficiency" },
  { value: "price", label: "Price: Low to High" },
  { value: "warranty", label: "Longest Warranty" },
];

const VALID_SORTS = new Set<SortOption>([
  "topRated",
  "efficiency",
  "price",
  "warranty",
]);

const VALID_PANEL_TYPES = new Set<PanelType>([
  "Monocrystalline",
  "Polycrystalline",
  "Bifacial",
]);

const VALID_RATINGS = new Set<RatingType>(["Excellent", "Very Good", "Good"]);

const parseCsv = <T extends string>(
  value: string | null,
  allowed: Set<T>,
): T[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v): v is T => allowed.has(v as T));
};

const parseFiltersFromParams = (params: URLSearchParams): FilterState => {
  const effMin = Number(params.get("effMin"));
  const effMax = Number(params.get("effMax"));
  const [defaultMin, defaultMax] = DEFAULT_FILTER_STATE.efficiencyRange;

  return {
    panelTypes: parseCsv(params.get("panelTypes"), VALID_PANEL_TYPES),
    ratings: parseCsv(params.get("ratings"), VALID_RATINGS),
    efficiencyRange: [
      Number.isFinite(effMin) && effMin > 0 ? effMin : defaultMin,
      Number.isFinite(effMax) && effMax > 0 ? effMax : defaultMax,
    ],
    warranties: {
      productWarranty12Plus: params.get("pw12") === "1",
      performanceWarranty30: params.get("pw30") === "1",
    },
    brands: params.get("brands")
      ? params
          .get("brands")!
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean)
      : [],
    keralaClimateRated: params.get("kerala") === "1",
  };
};

const filtersToParams = (
  filters: FilterState,
  sort: SortOption,
  selectedPanelIds: string[],
): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.panelTypes.length)
    params.set("panelTypes", filters.panelTypes.join(","));
  if (filters.ratings.length) params.set("ratings", filters.ratings.join(","));
  const [defaultMin, defaultMax] = DEFAULT_FILTER_STATE.efficiencyRange;
  if (filters.efficiencyRange[0] !== defaultMin)
    params.set("effMin", String(filters.efficiencyRange[0]));
  if (filters.efficiencyRange[1] !== defaultMax)
    params.set("effMax", String(filters.efficiencyRange[1]));
  if (filters.warranties.productWarranty12Plus) params.set("pw12", "1");
  if (filters.warranties.performanceWarranty30) params.set("pw30", "1");
  if (filters.brands.length) params.set("brands", filters.brands.join(","));
  if (filters.keralaClimateRated) params.set("kerala", "1");
  if (sort !== "topRated") params.set("sort", sort);
  if (selectedPanelIds.length)
    params.set("selected", selectedPanelIds.join(","));
  return params;
};

export default function SolarComparisonMain() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<FilterState>(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );

  const sortBy = useMemo<SortOption>(() => {
    const raw = searchParams.get("sort");
    return raw && VALID_SORTS.has(raw as SortOption)
      ? (raw as SortOption)
      : "topRated";
  }, [searchParams]);

  const selectedPanelIds = useMemo<string[]>(() => {
    const raw = searchParams.get("selected");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [searchParams]);

  const [panels, setPanels] = useState<SolarPanel[]>([]);
  const [allPanels, setAllPanels] = useState<SolarPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const replaceUrl = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setFilters = useCallback(
    (updater: FilterState | ((prev: FilterState) => FilterState)) => {
      const nextFilters =
        typeof updater === "function" ? updater(filters) : updater;
      replaceUrl(filtersToParams(nextFilters, sortBy, selectedPanelIds));
    },
    [filters, sortBy, selectedPanelIds, replaceUrl],
  );

  const setSortBy = useCallback(
    (next: SortOption) => {
      replaceUrl(filtersToParams(filters, next, selectedPanelIds));
    },
    [filters, selectedPanelIds, replaceUrl],
  );

  // Fetch filtered panels whenever filters or sort change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFilteredPanels(filters, sortBy)
      .then((filtered) => {
        if (!cancelled) setPanels(filtered);
      })
      .catch((error) => {
        if (!cancelled) console.error("Error fetching panels:", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, sortBy]);

  // Initial load: brands + all panels for the compare dropdown
  useEffect(() => {
    let cancelled = false;
    const brands = getAvailableBrands();
    setAvailableBrands(brands);
    getFilteredPanels(DEFAULT_FILTER_STATE, "topRated").then((all) => {
      if (!cancelled) setAllPanels(all);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleCompare = useCallback(
    (panelId: string) => {
      let next: string[];
      if (selectedPanelIds.includes(panelId)) {
        next = selectedPanelIds.filter((id) => id !== panelId);
      } else if (selectedPanelIds.length >= 3) {
        return;
      } else {
        next = [...selectedPanelIds, panelId];
      }
      replaceUrl(filtersToParams(filters, sortBy, next));
    },
    [filters, sortBy, selectedPanelIds, replaceUrl],
  );

  const selectedPanels = allPanels.filter((p) =>
    selectedPanelIds.includes(p.id),
  );

  // Navigate to comparison table page
  const handleCompare = () => {
    if (selectedPanelIds.length >= 2) {
      router.push(`/comparison-table?panels=${selectedPanelIds.join(",")}`);
    }
  };

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
        <div className="mb-6">
          {/* Top Row: Filter Button and Sort Dropdown */}
          <div className="flex items-center justify-between gap-4 mb-2">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Sort Dropdown */}
            <div className="relative ml-auto">
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

          {/* Results Count - Below Filter Button */}
          <div className="lg:hidden">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {panels.length}
              </span>{" "}
              Panels Found
            </p>
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
        onCompareSelected={handleCompare}
      />

      {/* FAQ Section */}
      <FAQSection />

      {/* Floating Compare Bar */}
      {selectedPanelIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#F3F3F3] border-t border-[#D9D9D9] shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-[1fr_auto_minmax(140px,220px)] items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3 overflow-x-auto pr-1">
                {selectedPanels.slice(0, 3).map((panel) => (
                  <button
                    key={panel.id}
                    onClick={() => handleToggleCompare(panel.id)}
                    className="relative shrink-0 min-w-[124px] max-w-[132px] rounded-xl bg-[#0D5A62] text-white px-3 py-2.5 text-center"
                  >
                    <span className="block text-[12px] leading-[1.15]">
                      {panel.brand} {panel.type}
                    </span>
                    <span className="block text-[12px] leading-[1.2]">
                      {panel.wattage}W
                    </span>
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full border border-white/70 flex items-center justify-center">
                      <X className="h-2.5 w-2.5" />
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[16px] sm:text-[18px] leading-none text-[#3F3F46] font-normal justify-self-center">
                {selectedPanelIds.length}/3
              </p>

              <button
                onClick={handleCompare}
                disabled={selectedPanelIds.length < 2}
                className={`h-10 sm:h-11 rounded-xl font-semibold text-[15px] sm:text-[16px] transition-colors ${
                  selectedPanelIds.length >= 2
                    ? "bg-[#EDB83F] text-[#0F172A] hover:bg-[#DEAB38]"
                    : "bg-[#E7D5A9] text-[#6B7280] cursor-not-allowed"
                }`}
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
