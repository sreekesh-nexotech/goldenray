// src/components/Studio/Bom/inputs.ts
//
// The BOM screen's form state and the rules that keep it coherent.
//
// Separated from the components because these rules are the quietly important part: an
// impossible configuration (a 3 kW system on a three-phase connection, a 1Φ inverter on a
// 10 kW system) must not reach the API as a plausible-looking quote. Golden-Ray-BOM
// enforces them in setPhaseAwareSize/handlePhaseChange (App.jsx:2496-2520) and by
// disabling size pills (App.jsx:3003-3017).

import type {
  BomAmountType,
  BomModuleDcr,
  BomQuoteRequest,
  BomStructureType,
  BomSubsidyType,
  BomSystemType,
  BomTier,
} from "@/services/bomStaffService";

export type HousePhase = "1P" | "3P";

export interface BomInputs {
  sysType: BomSystemType;
  size: string;
  tier: BomTier;
  batConfig: string;
  housePhase: HousePhase;
  moduleDcr: BomModuleDcr;
  distKm: string;
  structure: BomStructureType;
  subsidy: BomSubsidyType;
  ghsHouses: string;
  offerId: string;
  marginType: BomAmountType;
  marginVal: string;
  upgradeFrom: string;
  upgradeTo: string;
}

export const DEFAULT_INPUTS: BomInputs = {
  sysType: "ongrid",
  size: "3",
  // The source defaults to the middle tier, which is what most customers buy.
  tier: "value",
  batConfig: "0",
  housePhase: "1P",
  moduleDcr: "dcr",
  distKm: "100",
  structure: "flatRoof",
  subsidy: "residential",
  ghsHouses: "1",
  offerId: "",
  marginType: "percent",
  marginVal: "20",
  upgradeFrom: "3",
  upgradeTo: "5",
};

/** kW of a size key: `5sp` and `5tp` are both 5 kW, one single- and one three-phase. */
export function sizeKw(key: string): number {
  return Number.parseFloat(key) || 0;
}

/**
 * Whether a size can be installed on this connection.
 *
 * Three-phase sizes (`5tp` and anything from 6 kW up) need a 3Φ supply; `5sp` is the
 * single-phase 5 kW and is not offered on 3Φ. Mirrors the pill disable rules at
 * App.jsx:3003-3017, including their reasons.
 */
export function sizeIsSelectable(key: string, phase: HousePhase): boolean {
  const kw = sizeKw(key);
  if (phase === "1P") return !(kw >= 6 || key === "5tp");
  // On three phase the source also hides the 3 kW size entirely (App.jsx:3005).
  return key !== "5sp" && key !== "3";
}

/**
 * The size to hold after a phase change: the current one when it still works, else its
 * counterpart across the phase split, else the first size the connection allows.
 *
 * Correcting rather than clearing matters — a sales person who switches the connection
 * should not have to re-pick the system size, and must never be left with a size the
 * supply cannot carry.
 */
export function phaseAwareSize(current: string, phase: HousePhase, available: string[]): string {
  if (sizeIsSelectable(current, phase) && available.includes(current)) return current;
  const swap: Record<string, string> = phase === "3P" ? { "5sp": "5tp", "3": "5tp" } : { "5tp": "5sp" };
  const counterpart = swap[current];
  if (counterpart && available.includes(counterpart) && sizeIsSelectable(counterpart, phase)) return counterpart;
  return available.find((key) => sizeIsSelectable(key, phase)) ?? current;
}

/**
 * Hybrid lists different sizes from on-grid (`5` rather than `5sp`/`5tp`, and no `6`), so
 * switching system type can leave a size that does not exist in the new template. The
 * source remaps rather than resetting (App.jsx:2482-2493).
 */
export function sizeForSystemType(current: string, next: BomSystemType, phase: HousePhase): string {
  if (next === "hybrid") {
    if (current === "5sp" || current === "5tp") return "5";
    if (current === "6") return "3";
    return current;
  }
  if (current === "5") return phase === "3P" ? "5tp" : "5sp";
  return current;
}

/** The request body for the current form state. */
export function toRequest(i: BomInputs): BomQuoteRequest {
  const request: BomQuoteRequest = {
    sys_type: i.sysType,
    size: i.size,
    tier: i.tier,
    bat_config: i.batConfig,
    module_dcr: i.moduleDcr,
    dist_km: Number(i.distKm) || 0,
    structure_type: i.structure,
    // Non-DCR modules forfeit PM Surya Ghar, so the scheme is not sent at all rather
    // than sent and zeroed -- the quote should not carry a scheme it cannot honour.
    subsidy_type: i.moduleDcr === "dcr" ? i.subsidy : "none",
    ghs_houses: Math.max(1, Math.floor(Number(i.ghsHouses) || 1)),
    selected_offer_id: i.offerId || null,
    margin_type: i.marginType,
    margin_val: Number(i.marginVal) || 0,
  };
  if (i.sysType === "upgrade") {
    request.upgrade_from_kw = Number(i.upgradeFrom) || 3;
    request.upgrade_to_kw = Number(i.upgradeTo) || 5;
    request.size = String(request.upgrade_to_kw);
  }
  return request;
}
