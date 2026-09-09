"use client";

import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";
import { SolarPanel } from "@/types/solarPanel";
import { parseMinPrice } from "./panelFinder";

interface RecommendedPanelCardProps {
  panel: SolarPanel;
  onGetQuote: () => void;
  onCompare: () => void;
  onRetake: () => void;
}

const STARS_BY_RATING: Record<SolarPanel["overallRating"], number> = {
  Excellent: 5,
  "Very Good": 4,
  Good: 3,
};

function priceTier(priceRange: string): string {
  const min = parseMinPrice(priceRange);
  if (min === null) return "Mid-range";
  if (min >= 28000) return "Premium";
  if (min >= 25000) return "Mid-range";
  return "Value";
}

function trustChips(panel: SolarPanel): string[] {
  const chips: string[] = [];
  if (panel.pvelTopPerformer) chips.push("Lab Tested");
  if (panel.bloombergTier1) chips.push("Tier 1 Brand");
  if (panel.bisCertified) chips.push("BIS Certified");
  if (panel.subsidyEligible) chips.push("Subsidy Eligible");
  return chips.slice(0, 3);
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-base font-semibold text-[#1F2937] sm:text-lg">
        {value}
      </p>
      <p className="text-xs text-[#5B6360] sm:text-sm">{label}</p>
    </div>
  );
}

export default function RecommendedPanelCard({
  panel,
  onGetQuote,
  onCompare,
  onRetake,
}: RecommendedPanelCardProps) {
  const stars = STARS_BY_RATING[panel.overallRating] ?? 3;
  const chips = trustChips(panel);

  return (
    <div className="rounded-2xl bg-[#F7F4E6] px-5 py-6 sm:px-8 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#123532] sm:text-2xl">
          Our pick for you
        </h2>
        <button
          type="button"
          onClick={onRetake}
          className="text-sm font-medium text-[#8A7A4A] underline-offset-4 transition-colors hover:text-[#123532] hover:underline"
        >
          Retake the quiz
        </button>
      </div>

      <div className="grid gap-6 rounded-2xl border border-[#E8E2CC] bg-white p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
        {/* Details */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#D5A11E]">
            {panel.brand}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-[#202020] sm:text-2xl">
              {panel.name || `${panel.brand} ${panel.type} ${panel.wattage}W`}
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF0D5] px-3 py-1 text-xs font-semibold text-[#C98A18]">
              <Star className="h-3.5 w-3.5 fill-current" />
              Expert&apos;s Choice
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-0.5"
                aria-label={`${stars} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < stars
                        ? "fill-[#F7BA41] text-[#F7BA41]"
                        : "fill-[#E5E5E5] text-[#E5E5E5]"
                    }`}
                  />
                ))}
              </span>
              <span className="text-sm text-[#3D3D3D]">
                {priceTier(panel.priceRange)}
              </span>
            </div>
            <p className="text-sm text-[#3D3D3D]">
              {panel.productWarranty}yr defects + {panel.performanceWarranty}yr
              output
            </p>
          </div>

          <div className="my-4 border-t border-[#E5E5E5]" />

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F3EC] px-3 py-1.5 text-xs font-medium text-[#1F5B41]"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {chip}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-[#FAF6E8] p-4 sm:p-5">
            <Stat value={`${panel.efficiency}%`} label="Efficiency" />
            <Stat
              value={`${panel.performanceWarranty} yrs`}
              label="Performance warranty"
            />
            <Stat
              value={`${panel.temperatureCoefficient}%/°C`}
              label="Heat performance"
            />
            <Stat
              value={panel.bifacialGain ? "Glass-Glass" : "Glass-Backsheet"}
              label="Construction"
            />
          </div>

          <div className="my-4 border-t border-[#E5E5E5]" />

          <div className="flex items-center gap-2 text-sm text-[#2F2F2F]">
            <Image
              src="https://golden-ray.b-cdn.net/icons/Frame%20(6).png"
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 object-contain"
            />
            <span className="font-semibold">
              Kerala Climate Score: {panel.keralaClimateScore}/100
            </span>
          </div>
        </div>

        {/* Image */}
        <div className="relative order-first h-48 w-full sm:h-64 lg:order-last lg:h-80">
          <Image
            src={
              panel.imageUrl ||
              "https://golden-ray.b-cdn.net/images/frame%20(5).png"
            }
            alt={`${panel.brand} ${panel.name} ${panel.wattage}W ${panel.type.toLowerCase()} solar panel`}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onGetQuote}
          className="rounded-xl bg-[#F7BA41] px-8 py-3.5 text-sm font-semibold text-[#272218] transition-colors hover:bg-[#E5A930] sm:min-w-[240px]"
        >
          Get a Free Quote
        </button>
        <button
          type="button"
          onClick={onCompare}
          className="rounded-xl border border-[#123532] px-8 py-3.5 text-sm font-semibold text-[#123532] transition-colors hover:bg-[#123532] hover:text-white sm:min-w-[240px]"
        >
          Compare With Other Panels
        </button>
      </div>
    </div>
  );
}
