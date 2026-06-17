import { ChevronRight, MapPin } from "lucide-react";
import { popularServiceAreas, regionChips } from "@/data/service-area-data";
import ServiceAreaCard from "./ServiceAreaCard";

export default function PopularServiceAreas() {
  return (
    <section
      id="service-areas"
      className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#123532] tracking-wide mb-8">
          POPULAR SERVICE AREAS
        </h2>

        {/* Filter chips - desktop */}
        <div className="hidden sm:flex items-stretch gap-4 mb-10">
          {regionChips.map((chip, idx) => (
            <button
              key={idx}
              className="flex-1 flex items-center gap-2 px-5 py-4 rounded-xl border border-gray-200 text-base text-[#444444] bg-white hover:border-[#5A8C4E] hover:text-[#5A8C4E] transition-colors"
            >
              <MapPin size={18} className="text-gray-500 shrink-0" />
              {chip}
            </button>
          ))}
          <button className="flex-[1.7] flex items-center justify-between px-6 py-4 rounded-xl border-2 border-[#123532] text-base font-semibold text-[#123532] bg-white hover:bg-gray-50 transition-colors">
            View all regions
            <ChevronRight size={18} className="shrink-0" />
          </button>
        </div>

        {/* Filter chips - mobile */}
        <div className="grid grid-cols-2 gap-3 mb-10 sm:hidden">
          {regionChips.map((chip, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#444444] bg-white"
            >
              <MapPin size={16} className="text-[#123532] shrink-0" />
              {chip}
            </button>
          ))}
          <button className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium text-[#123532] bg-white">
            View all regions
            <ChevronRight size={16} className="shrink-0" />
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServiceAreas.map((area, idx) => (
            <ServiceAreaCard key={idx} {...area} />
          ))}
        </div>

        {/* View all link */}
        <div className="flex justify-center mt-10">
          <button className="text-sm font-medium text-[#666666] hover:text-[#123532] transition-colors underline-offset-4 hover:underline">
            View All 14 Districts
          </button>
        </div>
      </div>
    </section>
  );
}
