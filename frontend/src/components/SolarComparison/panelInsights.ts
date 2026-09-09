import { SolarPanel } from "@/types/solarPanel";
import { parseMinPrice } from "./panelFinder";

export type Grade = "Excellent" | "Very Good" | "Good" | "Fair";

export const STARS_BY_GRADE: Record<Grade, number> = {
  Excellent: 5,
  "Very Good": 4,
  Good: 3,
  Fair: 2,
};

export function gradeFromScore(score: number): Grade {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 60) return "Good";
  return "Fair";
}

const SCORE_BY_GRADE: Record<Grade, number> = {
  Excellent: 95,
  "Very Good": 80,
  Good: 65,
  Fair: 45,
};

/** The API sends qualitative fields as grade words ("Excellent", "Very Good"). */
function gradeFromText(text: string, fallback: Grade = "Good"): Grade {
  const normalized = text.trim().toLowerCase();
  if (normalized === "excellent") return "Excellent";
  if (normalized === "very good") return "Very Good";
  if (normalized === "good") return "Good";
  if (normalized === "fair" || normalized === "average") return "Fair";
  return fallback;
}

function moistureScore(panel: SolarPanel) {
  return SCORE_BY_GRADE[gradeFromText(panel.moistureProtection)];
}

/** Bifacial modules in this catalogue are glass-glass laminates. */
export function isGlassGlass(panel: SolarPanel) {
  return panel.type === "Bifacial" || Boolean(panel.bifacialGain);
}

function hasIp68(panel: SolarPanel) {
  return panel.ipRating.includes("68");
}

function hasSaltMistCert(panel: SolarPanel) {
  return panel.certifications.some((c) => /61701|salt/i.test(c));
}

function capacityInGw(panel: SolarPanel) {
  const match = panel.manufacturingCapacity.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export function buildQualityGrade(panel: SolarPanel): Grade {
  let score = moistureScore(panel);
  if (!hasIp68(panel)) score -= 10;
  if (panel.windLoad < 5400) score -= 12;
  if (panel.pvelTopPerformer) score += 5;
  return gradeFromScore(score);
}

export function companyStrengthGrade(panel: SolarPanel): Grade {
  const gw = capacityInGw(panel);
  let score = gw >= 10 ? 90 : gw >= 6 ? 78 : gw >= 3 ? 66 : 50;
  score += panel.bloombergTier1 ? 8 : 0;
  score += panel.independentAudit ? 5 : 0;
  return gradeFromScore(score);
}

export function humidityGrade(panel: SolarPanel): Grade {
  let score = moistureScore(panel);
  score += hasIp68(panel) ? 5 : -12;
  score += isGlassGlass(panel) ? 3 : 0;
  return gradeFromScore(score);
}

export function monsoonGrade(panel: SolarPanel): Grade {
  let score = hasIp68(panel) ? 80 : 60;
  score += panel.windLoad >= 5400 ? 12 : -8;
  score += isGlassGlass(panel) ? 5 : 0;
  return gradeFromScore(score);
}

export function lowLightGrade(panel: SolarPanel): Grade {
  const advancedCell = /TOPCon|HJT|IBC/i.test(panel.technology);
  let score = advancedCell ? 80 : 62;
  score += panel.bifacialGain ? 8 : 0;
  score += panel.efficiency >= 22 ? 6 : 0;
  return gradeFromScore(score);
}

export function coastalGrade(panel: SolarPanel): Grade {
  let score = moistureScore(panel);
  score += hasSaltMistCert(panel) ? 8 : -12;
  score += hasIp68(panel) ? 3 : -8;
  return gradeFromScore(score);
}

export function claimExperienceGrade(panel: SolarPanel): Grade {
  let score = panel.bloombergTier1 ? 82 : 66;
  score += panel.independentAudit ? 8 : -10;
  score += capacityInGw(panel) >= 10 ? 8 : 0;
  return gradeFromScore(score);
}

export function warrantyStars(years: number) {
  if (years >= 30) return 5;
  if (years >= 25) return 4;
  if (years >= 20) return 3;
  return 2;
}

export function productWarrantyStars(years: number) {
  if (years >= 12) return 5;
  if (years >= 10) return 4;
  return 3;
}

/** "N-Type TOPCon" -> "TOPCon" */
export function shortTechnology(panel: SolarPanel) {
  return panel.technology.replace(/^[NP]-Type\s+/i, "");
}

export function isBestAvailableTech(panel: SolarPanel) {
  return /TOPCon|HJT|IBC/i.test(panel.technology);
}

export function certificationList(panel: SolarPanel) {
  const alreadyListsBis = panel.certifications.some((c) => /^BIS/i.test(c));
  const list = panel.bisCertified && !alreadyListsBis ? ["BIS"] : [];
  return [...list, ...panel.certifications];
}

export function panelConstruction(panel: SolarPanel) {
  return isGlassGlass(panel) ? "Glass-Glass" : "Glass-Backsheet";
}

export function dualSidedGeneration(panel: SolarPanel) {
  return panel.bifacialGain
    ? `Yes (up to ${panel.bifacialGain}% extra)`
    : "No (front only)";
}

/** Every panel in this catalogue is a 1500 V system-voltage module. */
export const MAX_SYSTEM_VOLTAGE = "1500V DC";

export function priceTier(priceRange: string) {
  const min = parseMinPrice(priceRange);
  if (min === null) return "Mid-range";
  if (min >= 28000) return "Premium";
  if (min >= 25000) return "Mid-range";
  return "Value";
}

export function trustChips(panel: SolarPanel): string[] {
  const chips: string[] = [];
  if (panel.pvelTopPerformer) chips.push("Lab Tested");
  if (panel.bloombergTier1) chips.push("Tier 1 Brand");
  if (panel.bisCertified) chips.push("BIS Certified");
  if (panel.subsidyEligible) chips.push("Subsidy Eligible");
  return chips.slice(0, 3);
}

type Superlative = {
  label: string;
  /** higher wins */
  score: (panel: SolarPanel) => number;
};

const SUPERLATIVES: Superlative[] = [
  {
    label: "Build quality",
    score: (p) =>
      SCORE_BY_GRADE[buildQualityGrade(p)] +
      (p.pvelTopPerformer ? 20 : 0) +
      p.windLoad / 1000,
  },
  {
    label: "Best value",
    score: (p) => {
      const min = parseMinPrice(p.priceRange);
      return min === null ? 0 : 100000 / min;
    },
  },
  {
    label: "Strong dealer network",
    score: (p) => capacityInGw(p) + (p.bloombergTier1 ? 5 : 0),
  },
  {
    label: "Heat performance",
    score: (p) => -p.temperatureCoefficient * 100,
  },
  {
    label: "Longest warranty",
    score: (p) => p.productWarranty + p.performanceWarranty,
  },
  {
    label: "Kerala climate fit",
    score: (p) => p.keralaClimateScore,
  },
];

/**
 * Give each panel the superlative it wins most decisively against its peers,
 * so no two columns claim the same "Best For".
 */
export function computeBestFor(panels: SolarPanel[]): string[] {
  const result: (string | null)[] = panels.map(() => null);
  const taken = new Set<string>();

  // Rank every superlative by how decisively its winner beats the runner-up.
  const claims = SUPERLATIVES.map((superlative) => {
    const scores = panels.map(superlative.score);
    const ranked = [...scores].sort((a, b) => b - a);
    return {
      winner: scores.indexOf(ranked[0]),
      label: superlative.label,
      margin: ranked[0] - (ranked[1] ?? ranked[0]),
    };
  }).sort((a, b) => b.margin - a.margin);

  for (const claim of claims) {
    if (result[claim.winner] !== null || taken.has(claim.label)) continue;
    result[claim.winner] = claim.label;
    taken.add(claim.label);
  }

  return result.map((label, i) => label ?? gradeFromScore(panels[i].keralaClimateScore));
}
