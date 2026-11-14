// src/services/bomQuotationService.ts
//
// Turning a BOM calculator configuration into a real Quotation.
//
// ── The two engines, and why this is a hand-off rather than a save ────────
//
// The BOM screen prices from the **ACTIVE MarketRateSet**, live, recomputing on
// every change. A quotation prices from the **published PackRelease**, frozen at
// publish time. Both are right: a calculator should reflect today's rates, and
// an issued quotation must not re-price itself after it has been sent.
//
// But they are different stores, so the two numbers can differ -- most visibly
// on distance and roof type, which the BOM engine charges over the rate inside
// `add_on_total` while `price_pack` reports transport separately. This client
// therefore returns both prices and lets the screen show the difference rather
// than quietly preferring one.
//
// ── Why a quotation can be refused, in the operator's words ──────────────
//
// `quotations.services.create` resolves a published PackRelease first and a
// matching ReleasePack second, and both refusals are configuration states
// rather than user mistakes:
//
//   no_pack_release     nothing has been published at all
//   no_approved_package published, but not for this system/size/tier/phase
//
// Shown raw, those read as "409 Conflict" and look like a broken button. They
// are neither the user's fault nor fixable by retrying, so each gets a sentence
// naming who can resolve it.

import { StudioApiError, studioRequest } from "./studioService";

export interface QuotationVersionRef {
  uid: string;
  number: number;
  status: string;
  system_type: string;
  tier: string;
  size_key: string;
  phase: string;
  battery_config: string;
  roof_type: string;
  distance_km: string;
}

export interface QuotationRef {
  uid: string;
  number: string;
  status: string;
  current_version?: QuotationVersionRef | null;
}

/** What `POST quotations/` accepts, as `resolve_fields` validates it. */
export interface QuotationCreateInput {
  customer_uid: string;
  system_type: "ONGRID" | "HYBRID";
  tier: "BASE" | "VALUE" | "PREMIUM";
  size_key: string;
  phase?: "1P" | "3P";
  battery_config?: string;
  future_size_key?: string;
  roof_type: "FLAT" | "SHEET" | "ELEVATED";
  distance_km: number;
  vehicle_type?: string;
  subsidy_type?: "residential" | "ghs" | "none";
  ghs_houses?: number | null;
  language?: "en" | "ml";
}

/** The BOM screen's vocabulary, in the quotation's. */
export const TO_SYSTEM_TYPE: Record<string, "ONGRID" | "HYBRID" | null> = {
  ongrid: "ONGRID",
  hybrid: "HYBRID",
  // An upgrade quote extends a system that already exists; it is not one of the
  // packs a release enumerates, so there is nothing to raise it against.
  upgrade: null,
};

export const TO_ROOF_TYPE: Record<string, "FLAT" | "SHEET" | "ELEVATED"> = {
  flatRoof: "FLAT",
  sheetRoof: "SHEET",
  elevated: "ELEVATED",
};

export const TO_TIER: Record<string, "BASE" | "VALUE" | "PREMIUM"> = {
  base: "BASE",
  value: "VALUE",
  premium: "PREMIUM",
};

export const quotations = {
  create: (body: QuotationCreateInput) =>
    studioRequest<QuotationRef>("quotations/", { method: "POST", body }),
};

/**
 * Why a quotation could not be raised, said so the person knows whose problem
 * it is. Every branch names the action that resolves it.
 */
export function quotationErrorMessage(err: unknown): string {
  if (!(err instanceof StudioApiError)) {
    return err instanceof Error ? err.message : "Could not create the quotation.";
  }
  switch (err.code) {
    case "no_pack_release":
      return "No price list has been published yet, so quotations cannot be priced. A Project Head needs to publish a pack release before this configuration can become a quotation.";
    case "no_approved_package":
      // The server's message already names the exact combination, which is more
      // useful than anything that could be written here.
      return `${err.message} Either pick a configuration the published release covers, or ask a Project Head to publish one that includes it.`;
    case "no_price_release":
      return "No prices have been published yet. A Project Head needs to publish a price release first.";
    default:
      break;
  }
  if (err.status === 403) {
    return "Your role does not include raising quotations (quotations.create).";
  }
  const fields = err.fieldErrors ? Object.entries(err.fieldErrors) : [];
  if (fields.length) {
    return fields.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : String(v)}`).join("; ");
  }
  return err.message || "Could not create the quotation.";
}

/** True when the refusal is a configuration state nobody on this screen can fix. */
export function isSetupProblem(err: unknown): boolean {
  return (
    err instanceof StudioApiError &&
    ["no_pack_release", "no_price_release", "no_approved_package"].includes(err.code)
  );
}
