import { SolarInverter } from "@/types/solarInverter";

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
  if (normalized === "good" || normalized === "available") return "Good";
  if (normalized === "fair" || normalized === "average") return "Fair";
  return fallback;
}

/* ---------------------------------------------------------- predicates -- */

function ipNumber(inverter: SolarInverter) {
  // "IPX6 / IP67" -> 67; "IP65" -> 65
  const matches = inverter.ipRating.match(/IP(\d{2})/g) ?? [];
  return Math.max(0, ...matches.map((m) => parseInt(m.slice(2), 10)));
}

function isSealed(inverter: SolarInverter) {
  return ipNumber(inverter) >= 66;
}

function upperOperatingTemp(inverter: SolarInverter) {
  // "-25°C to 60°C" -> 60
  const nums = inverter.operatingTemperature.match(/-?\d+/g) ?? [];
  return nums.length ? Math.max(...nums.map(Number)) : 60;
}

/** Built in with no strings attached — not "optional", not "activation required". */
export function isUnconditionallyBuiltIn(value: string) {
  const v = value.toLowerCase();
  if (/optional|dependent|activation|not listed|n\/a/.test(v)) return false;
  return /built-in|integrated|yes/.test(v);
}

function spdScore(value: string) {
  const v = value.toLowerCase();
  if (/type ii\b/.test(v) && !/optional\)?$/.test(v) && !/type iii/.test(v)) {
    return 92;
  }
  if (/built-in|integrated|compatible/.test(v)) return 82;
  return 66;
}

export function hasCoastalRating(inverter: SolarInverter) {
  return /C5|corrosion-resistant/i.test(inverter.corrosionProtection);
}

export function hasArcFaultProtection(inverter: SolarInverter) {
  return isUnconditionallyBuiltIn(inverter.arcFaultDetection);
}

function hasBis(inverter: SolarInverter) {
  return inverter.certifications.some((c) => /BIS|IS 16221/i.test(c));
}

export function isMicro(inverter: SolarInverter) {
  return inverter.type === "Microinverter";
}

export function isHybrid(inverter: SolarInverter) {
  return inverter.type === "Hybrid";
}

/* -------------------------------------------------------------- grades -- */

export function manufacturerTrackRecordGrade(inverter: SolarInverter): Grade {
  return gradeFromText(inverter.brandTrust);
}

export function buildQualityGrade(inverter: SolarInverter): Grade {
  let score = isSealed(inverter) ? 80 : 74;
  if (hasCoastalRating(inverter)) score += /C5/i.test(inverter.corrosionProtection) ? 12 : 8;
  if (
    isUnconditionallyBuiltIn(inverter.dcSurgeProtection) &&
    isUnconditionallyBuiltIn(inverter.acSurgeProtection)
  ) {
    score += 5;
  }
  score += hasArcFaultProtection(inverter) ? 5 : /activation/i.test(inverter.arcFaultDetection) ? 2 : 0;
  if (inverter.ratings.reliability >= 95) score += 6;
  return gradeFromScore(score);
}

export function keralaWeatherFitGrade(inverter: SolarInverter): Grade {
  return gradeFromScore(inverter.ratings.keralaClimate);
}

export function heatToleranceGrade(inverter: SolarInverter): Grade {
  const top = upperOperatingTemp(inverter);
  let score = top >= 65 ? 92 : top >= 60 ? 82 : 65;
  if (inverter.ratings.efficiency >= 96) score += 6;
  return gradeFromScore(score);
}

export function humidityGrade(inverter: SolarInverter): Grade {
  let score = isSealed(inverter) ? 92 : 80;
  if (hasCoastalRating(inverter)) score += 6;
  return gradeFromScore(score);
}

export function heavyRainGrade(inverter: SolarInverter): Grade {
  return gradeFromScore(isSealed(inverter) ? 92 : 82);
}

export function coastalGrade(inverter: SolarInverter): Grade {
  if (/C5/i.test(inverter.corrosionProtection)) return "Excellent";
  if (hasCoastalRating(inverter)) return "Excellent";
  return gradeFromScore(isSealed(inverter) ? 78 : 66);
}

export function lightningGrade(inverter: SolarInverter): Grade {
  const score =
    (spdScore(inverter.dcSurgeProtection) + spdScore(inverter.acSurgeProtection)) / 2;
  return gradeFromScore(score);
}

export function voltageStabilityGrade(inverter: SolarInverter): Grade {
  if (isMicro(inverter)) return "Excellent"; // grid-forming, per-panel
  let score = inverter.maximumDcVoltage >= 600 ? 88 : inverter.maximumDcVoltage >= 550 ? 82 : 74;
  if (inverter.gridProtection) score += 4;
  return gradeFromScore(score);
}

export function shadePerformanceGrade(inverter: SolarInverter): Grade {
  if (isMicro(inverter)) return "Excellent";
  if (inverter.type === "Optimized String") return "Excellent";
  let score = isHybrid(inverter) ? 80 : 78;
  if (/i-?v curve|iv scan/i.test(inverter.ivCurveScanning)) score += 8;
  return gradeFromScore(score);
}

export function serviceNetworkGrade(inverter: SolarInverter): Grade {
  return gradeFromText(inverter.brandTrust);
}

/* ------------------------------------------------------------ warranty -- */

export function standardWarrantyStars(years: number) {
  if (years >= 15) return 5;
  if (years >= 10) return 4;
  if (years >= 8) return 3;
  return 2;
}

export function maximumWarrantyStars(years: number) {
  if (years >= 25) return 5;
  if (years >= 15) return 4;
  if (years >= 10) return 3;
  return 2;
}

/* ----------------------------------------------------------- technology -- */

export function architecture(inverter: SolarInverter) {
  if (isMicro(inverter)) return "Microinverter";
  if (isHybrid(inverter)) return "Hybrid";
  if (inverter.type === "Optimized String") return "Optimized string";
  return "String";
}

export function mpptLabel(inverter: SolarInverter) {
  return isMicro(inverter) ? "Panel-level" : String(inverter.mpptTrackers);
}

export function batteryReady(inverter: SolarInverter) {
  if (isHybrid(inverter)) return "Yes — built-in charger";
  if (isMicro(inverter)) return "System dependent";
  return "No (grid-tie only)";
}

export function panelLevelMonitoring(inverter: SolarInverter) {
  return isMicro(inverter) || inverter.type === "Optimized String";
}

export function certificationList(inverter: SolarInverter) {
  return inverter.certifications;
}

export function ratedOutputLabel(inverter: SolarInverter) {
  return isMicro(inverter)
    ? `${inverter.ratedOutputPower} W per unit`
    : `${(inverter.ratedOutputPower / 1000).toFixed(1)} kW`;
}

export function maxPvInputLabel(inverter: SolarInverter) {
  return isMicro(inverter)
    ? `${inverter.maximumDcInput} W per module`
    : `${(inverter.maximumDcInput / 1000).toFixed(1)} kWp`;
}

/* --------------------------------------------------------------- card -- */

/** price_range is a "₹" tier string ("₹₹₹") for inverters. */
export function priceTier(priceRange: string) {
  const rupees = (priceRange.match(/₹/g) ?? []).length;
  if (rupees >= 4) return "Premium";
  if (rupees === 3) return "Mid-range";
  if (rupees > 0) return "Value";
  return "Mid-range";
}

export function trustChips(inverter: SolarInverter): string[] {
  const chips: string[] = [];
  if (hasArcFaultProtection(inverter)) chips.push("Arc-Fault Protection");
  if (/C5/i.test(inverter.corrosionProtection)) chips.push("C5 Coastal Rated");
  if (isHybrid(inverter)) chips.push("Backup Ready");
  if (isMicro(inverter)) chips.push("Panel-Level Monitoring");
  if (hasBis(inverter)) chips.push("BIS Certified");
  if (inverter.warrantyYears >= 10) chips.push(`${inverter.warrantyYears}-Yr Warranty`);
  return chips.slice(0, 3);
}

/* ------------------------------------------------------------ best for -- */

type Superlative = {
  label: string;
  /** higher wins */
  score: (inverter: SolarInverter) => number;
};

const SUPERLATIVES: Superlative[] = [
  {
    label: "Highest efficiency",
    score: (i) => i.maximumEfficiency * 10,
  },
  {
    label: "Coastal protection",
    score: (i) =>
      (/C5/i.test(i.corrosionProtection) ? 40 : hasCoastalRating(i) ? 30 : 0) +
      SCORE_BY_GRADE[lightningGrade(i)] / 5 +
      (isSealed(i) ? 5 : 0),
  },
  {
    label: "Longest warranty",
    score: (i) => i.warrantyYears * 2 + (i.extendableWarrantyYears ?? 0) / 2,
  },
  {
    label: "Best value",
    score: (i) => 5 - (i.priceRange.match(/₹/g) ?? []).length,
  },
  {
    label: "Shaded roofs",
    score: (i) => SCORE_BY_GRADE[shadePerformanceGrade(i)] + (isMicro(i) ? 20 : 0),
  },
  {
    label: "Backup power",
    score: (i) => (isHybrid(i) ? 100 : 0),
  },
  {
    label: "Kerala climate fit",
    score: (i) => i.keralaClimateScore,
  },
];

/**
 * Give each inverter the superlative it wins most decisively against its
 * peers, so no two columns claim the same "Best For".
 */
export function computeBestFor(inverters: SolarInverter[]): string[] {
  const result: (string | null)[] = inverters.map(() => null);
  const taken = new Set<string>();

  const claims = SUPERLATIVES.map((superlative) => {
    const scores = inverters.map(superlative.score);
    const ranked = [...scores].sort((a, b) => b - a);
    return {
      winner: scores.indexOf(ranked[0]),
      label: superlative.label,
      margin: ranked[0] - (ranked[1] ?? ranked[0]),
    };
  }).sort((a, b) => b.margin - a.margin);

  for (const claim of claims) {
    if (result[claim.winner] !== null || taken.has(claim.label) || claim.margin <= 0) {
      continue;
    }
    result[claim.winner] = claim.label;
    taken.add(claim.label);
  }

  return result.map(
    (label, i) => label ?? gradeFromScore(inverters[i].keralaClimateScore),
  );
}
