// src/components/Studio/BomAdmin/tariffPreview.ts
//
// The worked example under the tariff editor: bill -> units -> system size, run on
// the draft as it is typed.
//
// This is a *mirror* of `engines/energy.py`, not a second implementation of it.
// The server stays authoritative -- it is what quotes are priced from, and its
// bisection is a bit-exact replica of the original JavaScript. This exists only so
// an obviously wrong tariff is obvious before it is saved, because the fields
// above are numbers whose correctness nobody can eyeball. "A ₹3,000 bill means a
// 2 kW system" is a claim a person can immediately agree or disagree with; "the
// third slab is 5.35" is not.
//
// Kept deliberately close to `units_to_bill` (engines/energy.py:304) so the two
// cannot drift in ways that matter:
//
//   * duty is charged on the UNROUNDED energy charge, then rounded;
//   * at or below the threshold the tariff is telescopic -- each slab charges only
//     the units inside it;
//   * above it the WHOLE consumption is charged at one flat rate chosen by band,
//     which is a cliff rather than a step, and the single most common thing to get
//     wrong in a tariff.
//
// Differences that do not matter here: the engine works in Decimal and replicates
// JavaScript's rounding exactly, while this runs in the browser's doubles. A rupee
// of drift in an illustration is irrelevant; a wrong slab is not, and that it does
// show.

import type { FixedChargeSlab, TariffRegion, TariffSlab } from "@/services/bomAdminService";

/** The engine's fallbacks, for a tariff still missing a field mid-edit. */
const DEFAULT_THRESHOLD = 500;
const DEFAULT_DUTY_PCT = 10;

function firstMatch<T extends { upToUnits: number | null }>(units: number, slabs: T[]): T | undefined {
  return slabs.find((s) => s.upToUnits === null || units <= s.upToUnits) ?? slabs.at(-1);
}

/** The bi-monthly bill for a consumption, mirroring `units_to_bill`. */
export function estimateBill(region: TariffRegion, biMonthlyUnits: number, threePhase = false): number {
  const threshold = region.nonTelescopicThreshold ?? DEFAULT_THRESHOLD;
  let energy = 0;

  if (biMonthlyUnits <= threshold) {
    // Telescopic: each slab charges only the units that fall inside it.
    let remaining = biMonthlyUnits;
    let previous = 0;
    for (const slab of region.tariffSlabs ?? []) {
      const upper = slab.upToUnits ?? 0;
      const slabUnits = Math.min(remaining, upper - previous);
      if (slabUnits <= 0) break;
      energy += slabUnits * slab.ratePerUnit;
      remaining -= slabUnits;
      previous = upper;
    }
  } else {
    // Non-telescopic: the entire consumption at one rate, chosen by band.
    const band: TariffSlab | undefined = firstMatch(biMonthlyUnits, region.nonTelescopicSlabs ?? []);
    energy = biMonthlyUnits * (band?.ratePerUnit ?? 0);
  }

  const fixedSlabs: FixedChargeSlab[] =
    (threePhase ? region.fixedChargeSlabs?.threePhase : region.fixedChargeSlabs?.singlePhase) ?? [];
  const fixed = firstMatch(biMonthlyUnits, fixedSlabs)?.chargeBiMonthly ?? 0;
  const meter = threePhase
    ? (region.meterRent?.threePhaseBiMonthly ?? 0)
    : (region.meterRent?.singlePhaseBiMonthly ?? 0);

  // Duty is computed on the unrounded energy charge, then rounded -- as the engine does.
  const duty = Math.round(energy * ((region.electricityDutyPct ?? DEFAULT_DUTY_PCT) / 100));
  return Math.round(energy) + fixed + duty + meter;
}

/**
 * A bill back to units, and the system size that covers it.
 *
 * The engine inverts `units_to_bill` by bisection, which is the right approach: the
 * tariff is monotonic but not analytically invertible, and the non-telescopic cliff
 * makes a closed form wrong. The same bisection is used here, over the same [0, 3000]
 * bracket, so the illustration and the engine agree on which side of the cliff a bill
 * falls -- the only disagreement that would actually mislead.
 *
 * Returns nulls rather than guesses when the tariff cannot answer, so a half-edited
 * table shows blanks instead of a plausible wrong number.
 */
export function sizeFromBill(
  region: TariffRegion,
  bill: number,
  threePhase = false
): { units: number | null; kw: number | null } {
  if (!(bill > 0) || !(region.tariffSlabs?.length)) return { units: null, kw: null };

  let low = 0;
  let high = 3000;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    if (estimateBill(region, mid, threePhase) < bill) low = mid;
    else high = mid;
  }
  const units = Math.round((low + high) / 2);

  const daily = region.yield?.dailyGenPerKw ?? 0;
  if (!(daily > 0)) return { units, kw: null };

  // Monthly consumption over what one kW generates in a month. Coverage is NOT applied
  // here: `bill_sizing.exact_kw` is the size that covers the bill in full, and the
  // coverage target is used afterwards, to pick the smallest catalog size that reaches
  // `exact_kw × coverage`. Multiplying it in here understated every figure by 15% --
  // caught by checking this mirror against the engine rather than by reading it.
  const monthlyUnits = units / 2;
  const kw = monthlyUnits / (daily * 30);
  return { units, kw: Math.round(kw * 10) / 10 };
}

/**
 * The catalog size the engine would recommend: the smallest one that reaches the
 * coverage target. Mirrors `bill_sizing._pick`.
 */
export function recommendedSize(region: TariffRegion, exactKw: number, sizes: number[]): number | null {
  const coverage = region.sizing?.coverageTarget ?? 0;
  if (!(coverage > 0) || !sizes.length) return null;
  const target = exactKw * coverage;
  return [...sizes].sort((a, b) => a - b).find((kw) => kw >= target) ?? sizes[sizes.length - 1];
}
