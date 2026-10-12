// src/services/emiConfigService.ts
//
// Authoring client for the EMI calculator's configuration.
//
// These rows live on the platform staff API under `emi/` (banks, interest
// rules, subsidy rules, system sizes and the settings singleton) and are
// reached through the Studio's BFF, sharing its session.

import { StudioApiError, studioRequest, type Paginated } from "./studioService";
import type { EMIBank, EMISettings, EMISystemSize } from "./emiCalculator";

/* -------------------------------------------------------------------------- */
/*  Shapes                                                                     */
/* -------------------------------------------------------------------------- */

export interface EMISubsidyRule {
  uid: string;
  label: string;
  /** Null means the band is open-ended on that side. */
  min_kw: string | null;
  max_kw: string | null;
  amount: string;
  priority: number;
  is_active: boolean;
}

export interface EMIInterestRateRule {
  uid: string;
  label: string;
  min_kw: string | null;
  max_kw: string | null;
  /** Optional system-cost band; unused by today's rules, kept for cost slabs. */
  min_cost: string | null;
  max_cost: string | null;
  min_loan: string | null;
  max_loan: string | null;
  /** Starting rate offered for the band. */
  rate: string;
  /** Floor — a customer adjustment is clamped up to this. */
  min_rate: string;
  /** Locked bands ignore customer adjustment entirely (3kW). */
  is_locked: boolean;
  priority: number;
  is_active: boolean;
}

/** Payloads are partial: the API accepts PATCH-style updates on every model. */
export type EMISystemSizeInput = Partial<Omit<EMISystemSize, "id" | "uid" | "system_cost">>;
export type EMISubsidyRuleInput = Partial<Omit<EMISubsidyRule, "uid">>;
export type EMIInterestRateRuleInput = Partial<Omit<EMIInterestRateRule, "uid">>;
export type EMIBankInput = Partial<Omit<EMIBank, "id" | "uid">>;
export type EMISettingsInput = Partial<Omit<EMISettings, "updated_at">>;

/* -------------------------------------------------------------------------- */
/*  Request plumbing                                                           */
/* -------------------------------------------------------------------------- */
//
// These rows live on the platform staff API (`/api/v1/emi/*`) and are reached
// through the Studio's BFF like every other Studio call, so the session and its
// refresh are shared with studioService rather than duplicated here.

/* -------------------------------------------------------------------------- */
/*  Generic CRUD over the emi router                                           */
/* -------------------------------------------------------------------------- */

function crud<TRow, TInput extends object>(resource: string) {
  const base = `emi/${resource}/`;
  return {
    list: async () => (await studioRequest<Paginated<TRow>>(base)).results,
    create: (body: TInput) => studioRequest<TRow>(base, { method: "POST", body }),
    update: (uid: string, body: TInput) =>
      studioRequest<TRow>(`${base}${uid}/`, { method: "PATCH", body }),
    remove: (uid: string) =>
      studioRequest<void>(`${base}${uid}/`, { method: "DELETE" }),
  };
}

// Platform paths: `subsidy-rules` and `interest-rules` (the old backend called
// them `subsidies` and `interest-rates`).
export const systemSizes = crud<EMISystemSize, EMISystemSizeInput>("system-sizes");
export const subsidyRules = crud<EMISubsidyRule, EMISubsidyRuleInput>("subsidy-rules");
export const interestRules = crud<EMIInterestRateRule, EMIInterestRateRuleInput>("interest-rules");
export const banks = crud<EMIBank, EMIBankInput>("banks");

/* -------------------------------------------------------------------------- */
/*  Settings singleton                                                         */
/* -------------------------------------------------------------------------- */

export function getSettings(): Promise<EMISettings> {
  return studioRequest<EMISettings>("emi/settings/");
}

export function updateSettings(body: EMISettingsInput): Promise<EMISettings> {
  return studioRequest<EMISettings>("emi/settings/", { method: "PATCH", body });
}

/** Everything the Studio screen needs, in one round trip. */
export async function loadEmiAdminData() {
  const [settings, sizes, subsidies, rates, bankRows] = await Promise.all([
    getSettings(),
    systemSizes.list(),
    subsidyRules.list(),
    interestRules.list(),
    banks.list(),
  ]);
  return { settings, sizes, subsidies, rates, banks: bankRows };
}

export { StudioApiError };
