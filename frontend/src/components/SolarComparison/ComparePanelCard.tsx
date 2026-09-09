"use client";

import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";
import { SolarPanel } from "@/types/solarPanel";
import { STARS_BY_GRADE, priceTier, trustChips } from "./panelInsights";

const FALLBACK_IMAGE = "https://golden-ray.b-cdn.net/images/frame%20(5).png";

export default function ComparePanelCard({ panel }: { panel: SolarPanel }) {
  const stars = STARS_BY_GRADE[panel.overallRating] ?? 3;
  const chips = trustChips(panel);
  const isTopPick = panel.overallRating === "Excellent";

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#E5E5EA] bg-white">
      {/* Product shot */}
      <div className="relative h-[150px] sm:h-[180px]">
        <Image
          src={panel.imageUrl || FALLBACK_IMAGE}
          alt={`${panel.brand} ${panel.name} ${panel.wattage}W ${panel.type.toLowerCase()} solar panel`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 80vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#D5A11E]">
          {panel.brand}
        </p>

        <div className="mt-2 flex items-start justify-between gap-2">
          <h3 className="text-[17px] font-normal leading-snug text-[#1A1A1A] sm:text-[19px]">
            {panel.name || `${panel.brand} ${panel.type} ${panel.wattage}W`}
          </h3>
          {isTopPick && (
            <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#FDF0D5] px-2.5 py-1 text-[11px] font-medium text-[#C98A18]">
              <Star className="h-3 w-3 fill-current" />
              Expert&apos;s Choice
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-0.5"
              aria-label={`${stars} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < stars
                      ? "fill-[#FFCE31] text-[#FFCE31]"
                      : "fill-[#E5E5EA] text-[#E5E5EA]"
                  }`}
                />
              ))}
            </span>
            <span className="text-[13px] text-[#444444]">
              {priceTier(panel.priceRange)}
            </span>
          </div>
          <p className="text-[13px] text-[#444444]">
            {panel.productWarranty}yr defects + {panel.performanceWarranty}yr
            output
          </p>
        </div>

        {chips.length > 0 && (
          <>
            <div className="my-3.5 border-t border-[#E5E5EA]" />
            <div className="mt-auto flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F6ED] px-2.5 py-1.5 text-[11px] font-medium text-[#1D8F47]"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {chip}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
