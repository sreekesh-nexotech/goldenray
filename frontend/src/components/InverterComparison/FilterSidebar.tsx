"use client";

import {
  InverterFilterState,
  InverterType,
  RatingTier,
} from "@/types/solarInverter";
import { ChevronDown, ChevronUp, X, CloudRain } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterSidebarProps {
  filters: InverterFilterState;
  onFilterChange: (filters: InverterFilterState) => void;
  availableBrands: string[];
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const INVERTER_TYPES: { value: InverterType | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "String", label: "String" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Microinverter", label: "Microinverter" },
];

const RATING_TIERS: { value: RatingTier; label: string }[] = [
  { value: "Premium", label: "Premium" },
  { value: "Mid-Range", label: "Mid-Range" },
  { value: "Value", label: "Value" },
];

type ExpandedSections = {
  inverterType: boolean;
  rating: boolean;
  warranty: boolean;
  brand: boolean;
};

const createDefaultFilters = (): InverterFilterState => ({
  inverterTypes: [],
  ratingTiers: [],
  warranties: {
    tenYearsPlus: false,
    fifteenYearsPlus: false,
    extendableTo25: false,
  },
  brands: [],
  keralaClimateRated: false,
});

const hasActiveFilters = (c: InverterFilterState) =>
  c.inverterTypes.length > 0 ||
  c.ratingTiers.length > 0 ||
  c.warranties.tenYearsPlus ||
  c.warranties.fifteenYearsPlus ||
  c.warranties.extendableTo25 ||
  c.brands.length > 0 ||
  c.keralaClimateRated;

interface FilterContentProps {
  activeFilters: InverterFilterState;
  onActiveFiltersChange: (filters: InverterFilterState) => void;
  expandedSections: ExpandedSections;
  toggleSection: (section: keyof ExpandedSections) => void;
  availableBrands: string[];
}

function FilterContent({
  activeFilters,
  onActiveFiltersChange,
  expandedSections,
  toggleSection,
  availableBrands,
}: FilterContentProps) {
  const handleTypeChange = (type: InverterType | "All") => {
    if (type === "All") {
      onActiveFiltersChange({ ...activeFilters, inverterTypes: [] });
      return;
    }
    const newTypes = activeFilters.inverterTypes.includes(type)
      ? activeFilters.inverterTypes.filter((t) => t !== type)
      : [...activeFilters.inverterTypes, type];
    onActiveFiltersChange({ ...activeFilters, inverterTypes: newTypes });
  };

  const handleTierChange = (tier: RatingTier) => {
    const newTiers = activeFilters.ratingTiers.includes(tier)
      ? activeFilters.ratingTiers.filter((t) => t !== tier)
      : [...activeFilters.ratingTiers, tier];
    onActiveFiltersChange({ ...activeFilters, ratingTiers: newTiers });
  };

  const handleWarrantyChange = (
    key: keyof InverterFilterState["warranties"],
  ) => {
    onActiveFiltersChange({
      ...activeFilters,
      warranties: {
        ...activeFilters.warranties,
        [key]: !activeFilters.warranties[key],
      },
    });
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter((b) => b !== brand)
      : [...activeFilters.brands, brand];
    onActiveFiltersChange({ ...activeFilters, brands: newBrands });
  };

  const handleKeralaClimateToggle = () => {
    onActiveFiltersChange({
      ...activeFilters,
      keralaClimateRated: !activeFilters.keralaClimateRated,
    });
  };

  return (
    <div className="space-y-4 text-[13px]">
      {/* Inverter Type */}
      <div className="border-b border-gray-200 pb-3">
        <button
          onClick={() => toggleSection("inverterType")}
          className="flex items-center justify-between w-full py-1.5 mb-2"
        >
          <span className="font-semibold text-sm text-gray-900">
            Inverter Type
          </span>
          {expandedSections.inverterType ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.inverterType && (
          <div className="grid grid-cols-2 gap-2">
            {INVERTER_TYPES.map((type) => {
              const isSelected =
                type.value === "All"
                  ? activeFilters.inverterTypes.length === 0
                  : activeFilters.inverterTypes.includes(
                      type.value as InverterType,
                    );
              return (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`px-4 py-2 rounded-full text-xs font-normal transition-all duration-200 ${
                    isSelected
                      ? "bg-[#F7BA4133] text-[#F7BA41] border border-[#F7BA41]"
                      : "bg-[#F5F5F5] text-gray-700 hover:bg-gray-200 border border-transparent"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-gray-200 pb-3">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full py-1.5 mb-2"
        >
          <span className="font-semibold text-sm text-gray-900">Rating</span>
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2.5">
            {RATING_TIERS.map((tier) => (
              <label
                key={tier.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.ratingTiers.includes(tier.value)}
                  onChange={() => handleTierChange(tier.value)}
                  className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {tier.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Warranty */}
      <div className="border-b border-gray-200 pb-3">
        <button
          onClick={() => toggleSection("warranty")}
          className="flex items-center justify-between w-full py-1.5 mb-2"
        >
          <span className="font-semibold text-sm text-gray-900">
            Warranty
          </span>
          {expandedSections.warranty ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.warranty && (
          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeFilters.warranties.tenYearsPlus}
                onChange={() => handleWarrantyChange("tenYearsPlus")}
                className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                10+ Years
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeFilters.warranties.fifteenYearsPlus}
                onChange={() => handleWarrantyChange("fifteenYearsPlus")}
                className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                15+ Years
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeFilters.warranties.extendableTo25}
                onChange={() => handleWarrantyChange("extendableTo25")}
                className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Extendable to 25
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="border-b border-gray-200 pb-3">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full py-1.5 mb-2"
        >
          <span className="font-semibold text-sm text-gray-900">Brand</span>
          {expandedSections.brand ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2.5">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleKeralaClimateToggle}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 border"
        style={{
          background: activeFilters.keralaClimateRated
            ? "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)"
            : "linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
          borderColor: "#3B82F633",
        }}
      >
        <CloudRain className="w-5 h-5 text-[#3B82F6]" />
        <span className="font-medium text-sm text-gray-800">
          Kerala Climate Rated
        </span>
      </button>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableBrands,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    inverterType: true,
    rating: true,
    warranty: true,
    brand: true,
  });
  const [mobileDraftFilters, setMobileDraftFilters] =
    useState<InverterFilterState>(createDefaultFilters());

  useEffect(() => {
    if (isMobileOpen) {
      setMobileDraftFilters(filters);
    }
  }, [filters, isMobileOpen]);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMobileCancel = () => {
    setMobileDraftFilters(filters);
    onMobileClose();
  };

  const handleMobileApply = () => {
    onFilterChange(mobileDraftFilters);
    onMobileClose();
  };

  const handleDesktopReset = () => {
    onFilterChange(createDefaultFilters());
  };

  const mobileHasActiveFilters = hasActiveFilters(mobileDraftFilters);

  return (
    <>
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Filters</h2>
            {hasActiveFilters(filters) && (
              <button
                onClick={handleDesktopReset}
                className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
              >
                Reset all
              </button>
            )}
          </div>
          <FilterContent
            activeFilters={filters}
            onActiveFiltersChange={onFilterChange}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            availableBrands={availableBrands}
          />
        </div>
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleMobileCancel}
        />

        <div
          className={`absolute left-0 top-4 bottom-4 w-[85%] max-w-sm bg-white rounded-r-2xl shadow-2xl transform transition-transform duration-300 flex flex-col ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="font-bold text-lg text-gray-900">Filters</h2>
            <div className="flex items-center gap-3">
              {mobileHasActiveFilters && (
                <button
                  onClick={() => setMobileDraftFilters(createDefaultFilters())}
                  className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
                >
                  Reset all
                </button>
              )}
              <button
                onClick={handleMobileCancel}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <FilterContent
              activeFilters={mobileDraftFilters}
              onActiveFiltersChange={setMobileDraftFilters}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              availableBrands={availableBrands}
            />
          </div>

          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleMobileCancel}
                className="h-12 rounded-xl border border-[#0F3D3F] bg-white text-[#0F3D3F] font-medium text-base hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMobileApply}
                className="h-12 rounded-xl bg-[#FDBA2D] text-[#1F2937] font-medium text-base hover:bg-[#E5A822] transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
