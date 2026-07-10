"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { getServiceAreaContent } from "@/data/service-area-content";

// Leaflet touches `window`, so the map must render client-side only.
const LocationsMap = dynamic(() => import("./LocationsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-[#eef1f5]" />
  ),
});

const Locations = ({ district }: { district?: string }) => {
  const { headingDescription, places } =
    getServiceAreaContent(district).locations;
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-semibold text-[#123532] md:text-5xl">
          Serving the Heart of {district ?? "Kerala"}
        </h2>
        <p className="text-base text-[#757575] md:text-lg">
          {headingDescription}
        </p>
      </div>

      {places.length > 0 && (
        <div className="mx-auto max-w-7xl">
          {/* Location cards — click to highlight on the map */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {places.map((place, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={place.name}
                  type="button"
                  onClick={() => setActiveIndex(isActive ? -1 : i)}
                  aria-pressed={isActive}
                  className={`flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-[#F7BA41] bg-[#FEF9EE] shadow-sm"
                      : "border-[#EDEFF2] bg-[#F8F9FB] hover:border-[#F7BA41]/50 hover:bg-[#FEF9EE]/60"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-semibold text-[#123532]">
                    <MapPin
                      size={16}
                      className={isActive ? "text-[#F7BA41]" : "text-[#5A8C4E]"}
                    />
                    {place.name}
                  </span>
                  <span className="text-sm leading-snug text-[#757575]">
                    {place.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Real interactive map */}
          <div className="relative z-0 h-[420px] w-full overflow-hidden rounded-2xl border border-[#EDEFF2] shadow-sm [isolation:isolate] md:h-[520px]">
            <LocationsMap places={places} activeIndex={activeIndex} />
          </div>

          <p className="mt-4 text-center text-xs text-[#9AA1AC]">
            Tap a location card to highlight it on the map — or tap a pin to open
            it in Google Maps.
          </p>
        </div>
      )}
    </section>
  );
};

export default Locations;
