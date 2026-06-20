"use client";

import { ChevronRight, MapPin, SearchX } from "lucide-react";
import {
  regionChips,
  normalizeDistrict,
  ALL_REGIONS,
  type ServiceAreaCard as ServiceAreaCardType,
} from "@/data/service-area-data";
import ServiceAreaCard from "./ServiceAreaCard";

type PopularServiceAreasProps = {
  areas: ServiceAreaCardType[];
  region: string;
  onSelectRegion: (region: string) => void;
  isFiltered: boolean;
};

export default function PopularServiceAreas({
  areas,
  region,
  onSelectRegion,
  isFiltered,
}: PopularServiceAreasProps) {
  const isChipActive = (chip: string) =>
    normalizeDistrict(region) === normalizeDistrict(chip);

  return (
    <section
      id="service-areas"
      className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#123532] tracking-wide mb-8">
          {isFiltered ? "MATCHING SERVICE AREAS" : "POPULAR SERVICE AREAS"}
        </h2>

        {/* Filter chips - desktop */}
        <div className="hidden sm:flex items-stretch gap-4 mb-10">
          {regionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSelectRegion(chip)}
              className={`flex-1 flex items-center gap-2 px-5 py-4 rounded-xl border text-base transition-colors ${
                isChipActive(chip)
                  ? "border-[#5A8C4E] text-[#5A8C4E] bg-[#F2F8F0]"
                  : "border-gray-200 text-[#444444] bg-white hover:border-[#5A8C4E] hover:text-[#5A8C4E]"
              }`}
            >
              <MapPin size={18} className="shrink-0" />
              {chip}
            </button>
          ))}
          <button
            onClick={() => onSelectRegion(ALL_REGIONS)}
            className={`flex-[1.7] flex items-center justify-between px-6 py-4 rounded-xl border-2 text-base font-semibold transition-colors ${
              region === ALL_REGIONS
                ? "border-[#123532] bg-[#123532] text-white"
                : "border-[#123532] text-[#123532] bg-white hover:bg-gray-50"
            }`}
          >
            View all regions
            <ChevronRight size={18} className="shrink-0" />
          </button>
        </div>

        {/* Filter chips - mobile */}
        <div className="grid grid-cols-2 gap-3 mb-10 sm:hidden">
          {regionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSelectRegion(chip)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-colors ${
                isChipActive(chip)
                  ? "border-[#5A8C4E] text-[#5A8C4E] bg-[#F2F8F0]"
                  : "border-gray-200 text-[#444444] bg-white"
              }`}
            >
              <MapPin size={16} className="text-[#123532] shrink-0" />
              {chip}
            </button>
          ))}
          <button
            onClick={() => onSelectRegion(ALL_REGIONS)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              region === ALL_REGIONS
                ? "border-[#123532] bg-[#123532] text-white"
                : "border-gray-300 text-[#123532] bg-white"
            }`}
          >
            View all regions
            <ChevronRight size={16} className="shrink-0" />
          </button>
        </div>

        {/* Cards grid */}
        {areas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area, idx) => (
              <ServiceAreaCard key={area.district + idx} {...area} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[#F8F9F9] rounded-2xl border border-gray-100">
            <SearchX size={40} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-[#123532] mb-1">
              No service areas match your filters
            </h3>
            <p className="text-sm text-[#666666] mb-6 max-w-md">
              Try a different district or service, or view all the regions we
              cover across Kerala.
            </p>
            <button
              onClick={() => onSelectRegion(ALL_REGIONS)}
              className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218]"
            >
              View all regions
            </button>
          </div>
        )}

        {/* View all link */}
        {region !== ALL_REGIONS && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => onSelectRegion(ALL_REGIONS)}
              className="text-sm font-medium text-[#666666] hover:text-[#123532] transition-colors underline-offset-4 hover:underline"
            >
              View All 14 Districts
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
