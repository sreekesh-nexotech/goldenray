"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  SolarInverter,
  InverterType,
  RatingTier,
  InverterFilterState,
  DEFAULT_INVERTER_FILTER_STATE,
} from "@/types/solarInverter";
import {
  getFilteredInverters,
  getAvailableInverterBrands,
} from "@/services/solarInverterService";
import FilterSidebar from "./FilterSidebar";
import InverterCard from "./InverterCard";
import InverterTypesSection from "./InverterTypesSection";
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

const VALID_TYPES = new Set<InverterType>([
  "String",
  "Hybrid",
  "Microinverter",
  "Optimized String",
]);

const VALID_TIERS = new Set<RatingTier>(["Premium", "Mid-Range", "Value"]);

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

const parseFiltersFromParams = (
  params: URLSearchParams,
): InverterFilterState => ({
  inverterTypes: parseCsv(params.get("types"), VALID_TYPES),
  ratingTiers: parseCsv(params.get("tiers"), VALID_TIERS),
  warranties: {
    tenYearsPlus: params.get("w10") === "1",
    fifteenYearsPlus: params.get("w15") === "1",
    extendableTo25: params.get("ext25") === "1",
  },
  brands: params.get("brands")
    ? params
        .get("brands")!
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : [],
  keralaClimateRated: params.get("kerala") === "1",
});

const filtersToParams = (
  filters: InverterFilterState,
  sort: SortOption,
  selectedIds: string[],
): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.inverterTypes.length)
    params.set("types", filters.inverterTypes.join(","));
  if (filters.ratingTiers.length)
    params.set("tiers", filters.ratingTiers.join(","));
  if (filters.warranties.tenYearsPlus) params.set("w10", "1");
  if (filters.warranties.fifteenYearsPlus) params.set("w15", "1");
  if (filters.warranties.extendableTo25) params.set("ext25", "1");
  if (filters.brands.length) params.set("brands", filters.brands.join(","));
  if (filters.keralaClimateRated) params.set("kerala", "1");
  if (sort !== "topRated") params.set("sort", sort);
  if (selectedIds.length) params.set("selected", selectedIds.join(","));
  return params;
};

export default function InverterComparisonMain() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<InverterFilterState>(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );

  const sortBy = useMemo<SortOption>(() => {
    const raw = searchParams.get("sort");
    return raw && VALID_SORTS.has(raw as SortOption)
      ? (raw as SortOption)
      : "topRated";
  }, [searchParams]);

  const selectedIds = useMemo<string[]>(() => {
    const raw = searchParams.get("selected");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [searchParams]);

  const [inverters, setInverters] = useState<SolarInverter[]>([]);
  const [allInverters, setAllInverters] = useState<SolarInverter[]>([]);
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
    (
      updater:
        | InverterFilterState
        | ((prev: InverterFilterState) => InverterFilterState),
    ) => {
      const nextFilters =
        typeof updater === "function" ? updater(filters) : updater;
      replaceUrl(filtersToParams(nextFilters, sortBy, selectedIds));
    },
    [filters, sortBy, selectedIds, replaceUrl],
  );

  const setSortBy = useCallback(
    (next: SortOption) => {
      replaceUrl(filtersToParams(filters, next, selectedIds));
    },
    [filters, selectedIds, replaceUrl],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFilteredInverters(filters, sortBy)
      .then((filtered) => {
        if (!cancelled) setInverters(filtered);
      })
      .catch((error) => {
        if (!cancelled) console.error("Error fetching inverters:", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, sortBy]);

  useEffect(() => {
    let cancelled = false;
    setAvailableBrands(getAvailableInverterBrands());
    getFilteredInverters(DEFAULT_INVERTER_FILTER_STATE, "topRated").then(
      (all) => {
        if (!cancelled) setAllInverters(all);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleCompare = useCallback(
    (inverterId: string) => {
      let next: string[];
      if (selectedIds.includes(inverterId)) {
        next = selectedIds.filter((id) => id !== inverterId);
      } else if (selectedIds.length >= 3) {
        return;
      } else {
        next = [...selectedIds, inverterId];
      }
      replaceUrl(filtersToParams(filters, sortBy, next));
    },
    [filters, sortBy, selectedIds, replaceUrl],
  );

  const selectedInverters = allInverters.filter((p) =>
    selectedIds.includes(p.id),
  );

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      router.push(
        `/inverter-comparison-table?inverters=${selectedIds.join(",")}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <PageIllustration />
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-8 max-w-7xl">
          <div className="w-full text-center">
            <h1 className="text-3xl sm:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-[#123532] mb-3">
              Compare Solar Inverters for Your Home in Kerala
            </h1>
            <p className="text-base w-full md:w-2/3 mx-auto sm:text-lg md:text-xl text-[#444444] mb-4">
              Browse, filter, and compare inverters rated for Kerala&apos;s
              climate — humidity, monsoon season, and high ambient temperatures
              all considered in every rating.
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
            All inverters rated for Kerala condition
          </h2>
          <p className="text-sm sm:text-md 2xl:text-lg leading-6 text-[#4C4C4C]">
            Efficiency at high ambient temperatures, humidity resistance (IP
            rating), KSEB grid compatibility, warranty depth, and after-sales
            service in India are all weighted in our Kerala Inverter Rating.
            Every score is based on manufacturer datasheets and real
            installations across Alappuzha, Kottayam, and Ernakulam.
          </p>
        </div>
      </section>

      {/* Inverter Types overview */}
      <InverterTypesSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <div className="hidden lg:block text-gray-600">
              <span className="font-semibold text-gray-900">
                {inverters.length}
              </span>{" "}
              Panels Found
            </div>

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

          <div className="lg:hidden">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {inverters.length}
              </span>{" "}
              Panels Found
            </p>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            availableBrands={availableBrands}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

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
            ) : inverters.length === 0 ? (
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
                  No inverters match your filters
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your filter criteria to see more results
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_INVERTER_FILTER_STATE)}
                  className="text-[#074A4D] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {inverters.map((inverter) => (
                  <InverterCard
                    key={inverter.id}
                    inverter={inverter}
                    isSelected={selectedIds.includes(inverter.id)}
                    onToggleCompare={handleToggleCompare}
                    canSelect={selectedIds.length < 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <HowToChoose />

      <CTASection
        hasSelectedInverters={selectedIds.length >= 2}
        onGetQuote={() => {
          window.location.href = "/contact";
        }}
        onCompareSelected={handleCompare}
      />

      <FAQSection />

      {/* Floating Compare Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#F3F3F3] border-t border-[#D9D9D9] shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-[1fr_auto_minmax(140px,220px)] items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3 overflow-x-auto pr-1">
                {selectedInverters.slice(0, 3).map((inverter) => (
                  <button
                    key={inverter.id}
                    onClick={() => handleToggleCompare(inverter.id)}
                    className="relative shrink-0 min-w-[124px] max-w-[150px] rounded-xl bg-[#0D5A62] text-white px-3 py-2.5 text-center"
                  >
                    <span className="block text-[12px] leading-[1.15] truncate">
                      {inverter.brand} {inverter.type}
                    </span>
                    <span className="block text-[12px] leading-[1.2]">
                      {(inverter.ratedOutputPower / 1000).toFixed(1)} kW
                    </span>
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full border border-white/70 flex items-center justify-center">
                      <X className="h-2.5 w-2.5" />
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[16px] sm:text-[18px] leading-none text-[#3F3F46] font-normal justify-self-center">
                {selectedIds.length}/3
              </p>

              <button
                onClick={handleCompare}
                disabled={selectedIds.length < 2}
                className={`h-10 sm:h-11 rounded-xl font-semibold text-[15px] sm:text-[16px] transition-colors ${
                  selectedIds.length >= 2
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
