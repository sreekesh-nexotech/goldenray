"use client";

import { SolarPanel } from "@/types/solarPanel";

interface RecommendationSectionProps {
  selectedPanels: SolarPanel[];
}

// Card color themes for each panel
const cardThemes = [
  {
    bg: "bg-[#FBF5EB]",
    border: "border-l-[#D4A574]",
  },
  {
    bg: "bg-[#E8F4F8]",
    border: "border-l-[#6BA3B7]",
  },
  {
    bg: "bg-[#E8F5E9]",
    border: "border-l-[#6BAF7C]",
  },
];

function getDetailedRecommendation(panel: SolarPanel, index: number): string {
  // Generate detailed recommendation based on panel characteristics
  const strengths: string[] = [];
  const details: string[] = [];

  // Efficiency focused
  if (panel.efficiency >= 22) {
    strengths.push("high efficiency");
    details.push(
      `its ${panel.efficiency}% efficiency means you'll generate more power from the same roof space`
    );
  }

  // Heat performance
  if (panel.temperatureCoefficient <= -0.35) {
    strengths.push("excellent heat tolerance");
    details.push(
      `the ${panel.temperatureCoefficient}%/°C temperature coefficient ensures consistent output even on Kerala's hottest days`
    );
  }

  // Warranty focused
  if (panel.performanceWarranty >= 30) {
    strengths.push("industry-leading warranty");
    details.push(
      `the ${panel.performanceWarranty}-year performance warranty gives you decades of guaranteed output`
    );
  }

  // Bifacial technology
  if (panel.bifacialGain && panel.bifacialGain > 10) {
    strengths.push("bifacial technology");
    details.push(
      `bifacial design captures reflected light for up to ${panel.bifacialGain}% extra generation`
    );
  }

  // Durability
  if (panel.moistureProtection.includes("Glass-to-Glass")) {
    strengths.push("superior durability");
    details.push(
      "glass-to-glass construction provides exceptional moisture protection for Kerala's monsoon season"
    );
  }

  // Kerala climate
  if (panel.keralaClimateScore >= 85) {
    strengths.push("Kerala-optimized");
    details.push(
      `a ${panel.keralaClimateScore}/100 Kerala Climate Score means it's specifically designed for our humidity and heat`
    );
  }

  // Low degradation
  if (panel.annualDegradation < 0.5) {
    strengths.push("minimal degradation");
    details.push(
      `only ${panel.annualDegradation}% annual power loss means ${panel.outputAtYear25}% output even after 25 years`
    );
  }

  // Brand trust
  if (panel.bloombergTier1 && panel.pvelTopPerformer) {
    strengths.push("globally trusted brand");
    details.push(
      "Bloomberg Tier 1 status and PVEL Top Performer certification confirm world-class quality"
    );
  }

  // Value focused
  if (
    panel.priceRange.includes("25,000") ||
    panel.priceRange.includes("28,000")
  ) {
    strengths.push("excellent value");
    details.push(
      "competitive pricing makes it a smart choice for budget-conscious homeowners"
    );
  }

  // Build the recommendation text
  if (details.length === 0) {
    return `The ${panel.name} offers solid all-around performance with ${panel.efficiency}% efficiency and a ${panel.performanceWarranty}-year warranty. It's a reliable choice for most Kerala homes looking for dependable solar generation.`;
  }

  const mainStrength = strengths[0] || "balanced performance";
  const detailText = details.slice(0, 2).join(", and ");

  return `You prioritize ${mainStrength}. The ${panel.name} stands out because ${detailText}. This makes it ideal for homeowners who want ${
    index === 0
      ? "maximum long-term value"
      : index === 1
        ? "proven reliability and performance"
        : "the best technology available"
  }.`;
}

function getOverallRecommendation(panels: SolarPanel[]): {
  topPanel: SolarPanel;
} {
  // Calculate a composite score for each panel
  const scoredPanels = panels.map((panel) => {
    let score = 0;

    // Weight different factors
    score += panel.ratings.efficiency * 0.25;
    score += panel.ratings.keralaClimate * 0.25;
    score += panel.ratings.warranty * 0.2;
    score += panel.ratings.heatPerformance * 0.15;

    // Bonus for premium features
    if (panel.bloombergTier1) score += 5;
    if (panel.pvelTopPerformer) score += 5;
    if (panel.bifacialGain && panel.bifacialGain > 10) score += 5;

    return { panel, score };
  });

  // Sort by score
  scoredPanels.sort((a, b) => b.score - a.score);

  return { topPanel: scoredPanels[0].panel };
}

function RecommendationCard({
  panel,
  index,
}: {
  panel: SolarPanel;
  index: number;
}) {
  const theme = cardThemes[index] || cardThemes[0];
  const recommendation = getDetailedRecommendation(panel, index);

  return (
    <div
      className={`${theme.bg} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 border-l-4 ${theme.border} h-full`}
    >
      <h4 className="text-lg sm:text-xl md:text-[22px] font-semibold text-[#1F2937] mb-3 sm:mb-4">
        Pick{" "}
        <span className="text-[#074A4D]">{panel.name}</span> if...
      </h4>
      <p className="text-sm sm:text-base md:text-[15px] text-[#4B5563] leading-relaxed whitespace-normal break-words">
        {recommendation}
      </p>
    </div>
  );
}

export default function RecommendationSection({
  selectedPanels,
}: RecommendationSectionProps) {
  if (selectedPanels.length < 2) return null;

  const { topPanel } = getOverallRecommendation(selectedPanels);
  const isTwoPanelLayout = selectedPanels.length === 2;

  return (
    <section className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-20">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-semibold text-[#183C39] leading-tight mb-3 sm:mb-4">
          So Which One Should You Pick?
        </h3>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#4B5563]">
          There&apos;s no single &quot;better&quot; panel. It depends on what
          matters for your home.
        </p>
      </div>

      {/* Recommendation Cards - Horizontally scrollable on mobile with peek */}
      <div className="overflow-x-auto pb-4 mb-8 sm:mb-10 md:mb-12 snap-x snap-mandatory scrollbar-hide">
        <div
          className={`flex gap-4 px-4 sm:px-0 sm:grid sm:gap-5 md:gap-6 lg:gap-7 ${
            isTwoPanelLayout
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {selectedPanels.map((panel, index) => (
            <div key={panel.id} className="w-[90vw] max-w-[320px] sm:w-auto flex-shrink-0 sm:flex-shrink snap-start">
              <RecommendationCard panel={panel} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Overall Recommendation */}
      <div className="bg-[#0A4A4D] rounded-xl sm:rounded-2xl p-8 sm:p-8 md:p-10 lg:p-12 text-white">
        <h4 className="text-xl sm:text-2xl md:text-[26px] font-semibold mb-4 sm:mb-5 md:mb-6">
          Our recommendation:
        </h4>
        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/95">
          Between these {selectedPanels.length === 2 ? "two" : "three"} panels,{" "}
          <span className="font-semibold">{topPanel.name}</span> wins more
          categories overall. But the best panel for your home depends on your
          specific roof, location in Kerala, and budget. WhatsApp us your KSEB
          bill and we&apos;ll tell you exactly which one makes more sense.
        </p>
      </div>
    </section>
  );
}
