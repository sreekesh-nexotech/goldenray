// Panel finder — the three questions behind "Find My Perfect Panel".
//
// Each answer becomes a set of weights over six 0–100 dimensions. Four come
// straight off the panel's sub-ratings; "value" and "size" are derived from the
// candidate set (cheapest panel scores 100 on value, highest wattage scores 100
// on size), so the recommendation always reflects the panels actually on offer.

import { SolarPanel } from "@/types/solarPanel";

export type PriorityValue =
  | "performance"
  | "value"
  | "reliability"
  | "kerala"
  | "warranty";

export type BillValue =
  | "under_2000"
  | "2000_4000"
  | "4000_7000"
  | "7000_10000"
  | "10000_plus";

export type RoofValue = "large" | "medium" | "limited" | "not_sure";

export interface PanelFinderAnswers {
  priority?: PriorityValue;
  bill?: BillValue;
  roof?: RoofValue;
}

export type AnswerKey = keyof PanelFinderAnswers;

export interface FinderStep {
  key: AnswerKey;
  question: string;
  subtitle: string;
  options: { value: string; label: string }[];
}

export const FINDER_STEPS: FinderStep[] = [
  {
    key: "priority",
    question: "What matters most to you?",
    subtitle: "We weight the comparison around this.",
    options: [
      { value: "performance", label: "Maximum performance" },
      { value: "value", label: "Best value for money" },
      { value: "reliability", label: "Long-term reliability" },
      { value: "kerala", label: "Best for Kerala climate" },
      { value: "warranty", label: "Maximum warranty" },
    ],
  },
  {
    key: "bill",
    question: "What's your approximate monthly electricity bill?",
    subtitle: "This sets the likely system size.",
    options: [
      { value: "under_2000", label: "Under ₹2,000" },
      { value: "2000_4000", label: "₹2,000–₹4,000" },
      { value: "4000_7000", label: "₹4,000–₹7,000" },
      { value: "7000_10000", label: "₹7,000–₹10,000" },
      { value: "10000_plus", label: "₹10,000+" },
    ],
  },
  {
    key: "roof",
    question: "What best describes your roof?",
    subtitle: "Roof area decides how much efficiency is worth paying for.",
    options: [
      { value: "large", label: "Large roof / plenty of space" },
      { value: "medium", label: "Medium roof" },
      { value: "limited", label: "Limited roof space" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
];

type Dimension =
  | "efficiency"
  | "heatPerformance"
  | "warranty"
  | "keralaClimate"
  | "value"
  | "size";

type Weights = Record<Dimension, number>;

const BALANCED_WEIGHTS: Weights = {
  efficiency: 0.22,
  heatPerformance: 0.2,
  warranty: 0.2,
  keralaClimate: 0.23,
  value: 0.1,
  size: 0.05,
};

const PRIORITY_WEIGHTS: Record<PriorityValue, Weights> = {
  performance: {
    efficiency: 0.4,
    heatPerformance: 0.25,
    warranty: 0.08,
    keralaClimate: 0.12,
    value: 0.05,
    size: 0.1,
  },
  value: {
    efficiency: 0.15,
    heatPerformance: 0.12,
    warranty: 0.15,
    keralaClimate: 0.18,
    value: 0.35,
    size: 0.05,
  },
  reliability: {
    efficiency: 0.12,
    heatPerformance: 0.23,
    warranty: 0.32,
    keralaClimate: 0.25,
    value: 0.05,
    size: 0.03,
  },
  kerala: {
    efficiency: 0.13,
    heatPerformance: 0.24,
    warranty: 0.1,
    keralaClimate: 0.45,
    value: 0.05,
    size: 0.03,
  },
  warranty: {
    efficiency: 0.1,
    heatPerformance: 0.14,
    warranty: 0.55,
    keralaClimate: 0.13,
    value: 0.05,
    size: 0.03,
  },
};

// A bigger bill means a bigger array, where wattage per panel starts to matter
// and price sensitivity drops. A small bill flips both.
const BILL_ADJUSTMENTS: Record<BillValue, Partial<Weights>> = {
  under_2000: { value: 0.15, size: -0.03 },
  "2000_4000": { value: 0.07 },
  "4000_7000": {},
  "7000_10000": { size: 0.1, value: -0.03 },
  "10000_plus": { size: 0.16, value: -0.05 },
};

// Less roof means every square metre has to earn more, so efficiency and
// wattage both gain weight. Plenty of roof means the opposite.
const ROOF_ADJUSTMENTS: Record<RoofValue, Partial<Weights>> = {
  large: { efficiency: -0.1, value: 0.1 },
  medium: {},
  limited: { efficiency: 0.2, size: 0.06, value: -0.06 },
  not_sure: {},
};

/** Lowest rupee figure in a range like "₹28,000 - ₹32,000". */
export function parseMinPrice(priceRange: string): number | null {
  const match = priceRange?.match(/[\d,]+/);
  if (!match) return null;
  const value = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

/** Position of `value` within the set, as 0–100. Ties across the set score 50. */
function normalize(values: number[], value: number, invert = false): number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 50;
  const ratio = (value - min) / (max - min);
  return (invert ? 1 - ratio : ratio) * 100;
}

function applyAdjustments(base: Weights, ...patches: Partial<Weights>[]): Weights {
  const merged = { ...base };
  for (const patch of patches) {
    for (const [key, delta] of Object.entries(patch)) {
      merged[key as Dimension] = Math.max(
        0,
        merged[key as Dimension] + (delta as number),
      );
    }
  }

  const total = Object.values(merged).reduce((sum, w) => sum + w, 0);
  if (total === 0) return BALANCED_WEIGHTS;

  return Object.fromEntries(
    Object.entries(merged).map(([key, w]) => [key, w / total]),
  ) as Weights;
}

/**
 * Best panel for the given answers, or null when there is nothing to pick from.
 * Unanswered questions simply contribute no adjustment, so a skipped quiz still
 * returns the strongest all-round panel.
 */
export function recommendPanel(
  panels: SolarPanel[],
  answers: PanelFinderAnswers,
): SolarPanel | null {
  if (panels.length === 0) return null;

  const weights = applyAdjustments(
    answers.priority ? PRIORITY_WEIGHTS[answers.priority] : BALANCED_WEIGHTS,
    answers.bill ? BILL_ADJUSTMENTS[answers.bill] : {},
    answers.roof ? ROOF_ADJUSTMENTS[answers.roof] : {},
  );

  const wattages = panels.map((p) => p.wattage);
  // Panels with an unreadable price range sit mid-pack rather than winning on
  // value by accident.
  const prices = panels.map((p) => parseMinPrice(p.priceRange));
  const knownPrices = prices.filter((p): p is number => p !== null);

  let best: SolarPanel | null = null;
  let bestScore = -Infinity;

  panels.forEach((panel, index) => {
    const price = prices[index];
    const scores: Weights = {
      efficiency: panel.ratings.efficiency,
      heatPerformance: panel.ratings.heatPerformance,
      warranty: panel.ratings.warranty,
      keralaClimate: panel.ratings.keralaClimate,
      value:
        price !== null && knownPrices.length > 0
          ? normalize(knownPrices, price, true)
          : 50,
      size: normalize(wattages, panel.wattage),
    };

    const score = (Object.keys(weights) as Dimension[]).reduce(
      (sum, dimension) => sum + weights[dimension] * scores[dimension],
      0,
    );

    if (score > bestScore) {
      bestScore = score;
      best = panel;
    }
  });

  return best;
}
