"use client";

import { SolarInverter } from "@/types/solarInverter";

interface RecommendationSectionProps {
  selectedInverters: SolarInverter[];
}

const cardThemes = [
  { bg: "bg-[#FBF5EB]", border: "border-l-[#D4A574]" },
  { bg: "bg-[#E8F4F8]", border: "border-l-[#6BA3B7]" },
  { bg: "bg-[#E8F5E9]", border: "border-l-[#6BAF7C]" },
];

function getDetailedRecommendation(inverter: SolarInverter): string {
  const strengths: string[] = [];
  const details: string[] = [];

  if (inverter.type === "Microinverter") {
    strengths.push("complex / shaded rooftops");
    details.push(
      "each panel runs its own microinverter, so shading on one doesn't drag the rest down",
    );
  }

  if (inverter.type === "Hybrid") {
    strengths.push("future battery storage");
    details.push(
      "a hybrid inverter port means you can add a battery later without replacing the inverter",
    );
  }

  if (inverter.maximumEfficiency >= 98) {
    strengths.push("peak efficiency");
    details.push(
      `${inverter.maximumEfficiency}% maximum efficiency means more usable AC output per kWh of DC generation`,
    );
  }

  if (
    inverter.dcSurgeProtection === "Built-in" &&
    inverter.arcFaultDetection === "Built-in"
  ) {
    strengths.push("built-in safety");
    details.push(
      "DC surge, AC surge and AFCI are all built-in — important for Kerala's lightning-prone monsoons",
    );
  }

  if (inverter.corrosionProtection.includes("C5")) {
    strengths.push("coastal-grade durability");
    details.push(
      "C5 corrosion rating handles salt-air at coastal Kerala homes where standard inverters fail in 5-7 years",
    );
  }

  if (
    inverter.warrantyYears >= 12 ||
    (inverter.extendableWarrantyYears ?? 0) >= 25
  ) {
    strengths.push("long-life warranty");
    details.push(
      `${inverter.warrantyYears} year warranty${inverter.extendableWarrantyYears ? ` (extendable to ${inverter.extendableWarrantyYears})` : ""} covers most of the panel's productive life`,
    );
  }

  if (inverter.keralaClimateScore >= 90) {
    strengths.push("Kerala-optimized");
    details.push(
      `a ${inverter.keralaClimateScore}/100 Kerala Inverter Rating reflects strong real-world performance in our heat & humidity`,
    );
  }

  if (details.length === 0) {
    return `The ${inverter.name} delivers solid all-round performance with ${inverter.maximumEfficiency}% efficiency and a ${inverter.warrantyYears}-year warranty. A dependable pick for most Kerala homes.`;
  }

  const mainStrength = strengths[0] || "balanced performance";
  const detailText = details.slice(0, 2).join(", and ");

  return `You prioritize ${mainStrength}. The ${inverter.name} stands out because ${detailText}.`;
}

function getOverallRecommendation(inverters: SolarInverter[]): {
  topInverter: SolarInverter;
} {
  const scored = inverters.map((inverter) => {
    let score = 0;
    score += inverter.ratings.efficiency * 0.25;
    score += inverter.ratings.reliability * 0.25;
    score += inverter.ratings.keralaClimate * 0.25;
    score += inverter.ratings.warranty * 0.25;
    if (inverter.corrosionProtection.includes("C5")) score += 5;
    if (inverter.dcSurgeProtection === "Built-in") score += 3;
    return { inverter, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return { topInverter: scored[0].inverter };
}

function RecommendationCard({
  inverter,
  index,
}: {
  inverter: SolarInverter;
  index: number;
}) {
  const theme = cardThemes[index] || cardThemes[0];
  const recommendation = getDetailedRecommendation(inverter);

  return (
    <div
      className={`${theme.bg} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 border-l-4 ${theme.border} h-full`}
    >
      <h4 className="text-lg sm:text-xl md:text-[22px] font-semibold text-[#1F2937] mb-3 sm:mb-4">
        Pick <span className="text-[#074A4D]">{inverter.name}</span> if...
      </h4>
      <p className="text-sm sm:text-base md:text-[15px] text-[#4B5563] leading-relaxed whitespace-normal break-words">
        {recommendation}
      </p>
    </div>
  );
}

export default function RecommendationSection({
  selectedInverters,
}: RecommendationSectionProps) {
  if (selectedInverters.length < 2) return null;

  const { topInverter } = getOverallRecommendation(selectedInverters);
  const isTwoPanelLayout = selectedInverters.length === 2;

  return (
    <section className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-20">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-semibold text-[#183C39] leading-tight mb-3 sm:mb-4">
          So Which One Should You Pick?
        </h3>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#4B5563]">
          There&apos;s no single &quot;better&quot; inverter. It depends on what
          matters for your home.
        </p>
      </div>

      <div className="overflow-x-auto pb-4 mb-8 sm:mb-10 md:mb-12 snap-x snap-mandatory scrollbar-hide">
        <div
          className={`flex gap-4 px-4 sm:px-0 sm:grid sm:gap-5 md:gap-6 lg:gap-7 ${
            isTwoPanelLayout
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {selectedInverters.map((inverter, index) => (
            <div
              key={inverter.id}
              className="w-[90vw] max-w-[320px] sm:w-auto flex-shrink-0 sm:flex-shrink snap-start"
            >
              <RecommendationCard inverter={inverter} index={index} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0A4A4D] rounded-xl sm:rounded-2xl p-8 sm:p-8 md:p-10 lg:p-12 text-white">
        <h4 className="text-xl sm:text-2xl md:text-[26px] font-semibold mb-4 sm:mb-5 md:mb-6">
          Our recommendation:
        </h4>
        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/95">
          The{" "}
          <span className="font-semibold">{topInverter.name}</span> is the
          better overall choice for Kerala — its C5 corrosion rating, built-in
          AFCI and surge protection, and {topInverter.warrantyYears}-year
          warranty justify the modest price premium. It&apos;s the inverter
          we&apos;d put on our own roof. However, if you&apos;re inland and
          budget is the deciding factor, a more value-tier option on this list
          is a solid, reliable alternative that&apos;ll serve you well for 10+
          years. Neither choice is wrong.
        </p>
      </div>
    </section>
  );
}
