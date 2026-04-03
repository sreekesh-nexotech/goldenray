"use client";

import { FilterState, PanelType, RatingType } from "@/types/solarPanel";
import { ChevronDown, ChevronUp, X, CloudRain } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBrands: string[];
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const PANEL_TYPES: { value: PanelType | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Monocrystalline", label: "Monocrystalline" },
  { value: "Bifacial", label: "Bifacial" },
  { value: "Polycrystalline", label: "Polycrystalline" },
];

const RATING_OPTIONS: { value: RatingType; label: string }[] = [
  { value: "Excellent", label: "Excellent" },
  { value: "Very Good", label: "Very Good" },
  { value: "Good", label: "Good" },
];

const createDefaultFilters = (): FilterState => ({
  panelTypes: [],
  ratings: [],
  efficiencyRange: [15, 23],
  warranties: {
    productWarranty12Plus: false,
    performanceWarranty30: false,
  },
  brands: [],
  keralaClimateRated: false,
});

const hasActiveFilters = (candidate: FilterState) =>
  candidate.panelTypes.length > 0 ||
  candidate.ratings.length > 0 ||
  candidate.efficiencyRange[0] !== 15 ||
  candidate.efficiencyRange[1] !== 23 ||
  candidate.warranties.productWarranty12Plus ||
  candidate.warranties.performanceWarranty30 ||
  candidate.brands.length > 0 ||
  candidate.keralaClimateRated;

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableBrands,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    panelType: true,
    rating: true,
    efficiency: true,
    warranty: true,
    brand: true,
  });
  const [mobileDraftFilters, setMobileDraftFilters] = useState<FilterState>(
    createDefaultFilters(),
  );

  useEffect(() => {
    if (isMobileOpen) {
      setMobileDraftFilters(filters);
    }
  }, [filters, isMobileOpen]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterContent = ({
    activeFilters,
    onActiveFiltersChange,
  }: {
    activeFilters: FilterState;
    onActiveFiltersChange: (filters: FilterState) => void;
  }) => {
    const handlePanelTypeChange = (type: PanelType | "All") => {
      if (type === "All") {
        onActiveFiltersChange({ ...activeFilters, panelTypes: [] });
        return;
      }

      const newTypes = activeFilters.panelTypes.includes(type)
        ? activeFilters.panelTypes.filter((t) => t !== type)
        : [...activeFilters.panelTypes, type];
      onActiveFiltersChange({ ...activeFilters, panelTypes: newTypes });
    };

    const handleRatingChange = (rating: RatingType) => {
      const newRatings = activeFilters.ratings.includes(rating)
        ? activeFilters.ratings.filter((r) => r !== rating)
        : [...activeFilters.ratings, rating];
      onActiveFiltersChange({ ...activeFilters, ratings: newRatings });
    };

    const handleEfficiencyChange = (value: number, isMin: boolean) => {
      const newRange: [number, number] = isMin
        ? [value, activeFilters.efficiencyRange[1]]
        : [activeFilters.efficiencyRange[0], value];
      onActiveFiltersChange({ ...activeFilters, efficiencyRange: newRange });
    };

    const handleWarrantyChange = (key: keyof FilterState["warranties"]) => {
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
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleSection("panelType")}
            className="flex items-center justify-between w-full py-1.5 mb-2"
          >
            <span className="font-semibold text-sm text-gray-900">
              Panel Type
            </span>
            {expandedSections.panelType ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.panelType && (
            <div className="grid grid-cols-2 gap-2">
              {PANEL_TYPES.map((type) => {
                const isSelected =
                  type.value === "All"
                    ? activeFilters.panelTypes.length === 0
                    : activeFilters.panelTypes.includes(
                        type.value as PanelType,
                      );
                return (
                  <button
                    key={type.value}
                    onClick={() => handlePanelTypeChange(type.value)}
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
              {RATING_OPTIONS.map((rating) => (
                <label
                  key={rating.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.ratings.includes(rating.value)}
                    onChange={() => handleRatingChange(rating.value)}
                    className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {rating.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleSection("efficiency")}
            className="flex items-center justify-between w-full py-1.5 mb-2"
          >
            <span className="font-semibold text-sm text-gray-900">
              Efficiency
            </span>
            {expandedSections.efficiency ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.efficiency && (
            <div className="space-y-3">
              <div className="text-base font-semibold text-[#F7BA41]">
                ≥ {activeFilters.efficiencyRange[0]}%
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="15"
                  max="23"
                  step="0.5"
                  value={activeFilters.efficiencyRange[0]}
                  onChange={(e) =>
                    handleEfficiencyChange(parseFloat(e.target.value), true)
                  }
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#074A4D]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-[#074A4D]
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:shadow-md
                    [&::-webkit-slider-runnable-track]:rounded-lg
                    [&::-moz-range-track]:rounded-lg"
                  style={{
                    background: `linear-gradient(to right, #074A4D ${
                      ((activeFilters.efficiencyRange[0] - 15) / (23 - 15)) *
                      100
                    }%, #E5E7EB ${
                      ((activeFilters.efficiencyRange[0] - 15) / (23 - 15)) *
                      100
                    }%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>15%</span>
                <span>23%</span>
              </div>
            </div>
          )}
        </div>

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
                  checked={activeFilters.warranties.productWarranty12Plus}
                  onChange={() => handleWarrantyChange("productWarranty12Plus")}
                  className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  12+ Year Product
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeFilters.warranties.performanceWarranty30}
                  onChange={() => handleWarrantyChange("performanceWarranty30")}
                  className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  30 Year Performance
                </span>
              </label>
            </div>
          )}
        </div>

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
