// src/services/emiConfigService.ts
//
// Authoring client for the EMI calculator's configuration.
//
// These rows live on the platform staff API under `emi/` (banks, interest
// rules, subsidy rules, system sizes and the settings singleton) and are
// reached through the Studio's BFF, sharing its session.
//
// ── Why this file translates ──────────────────────────────────────────────
// The staff API and the *public* calculator API describe the same rows with
// different vocabularies, and the panels were written against the public one:
//
//   public (read)              staff (read + write)
//   interest_rate "8.00"   →   annual_rate         "0.0800"
//   processing_fee_percent →   processing_fee_pct  (fraction)
//   min_cost / max_cost    →   min_system_cost / max_system_cost
//   min_loan / max_loan    →   min_amount / max_amount      (interest rules)
//   rate / min_rate        →   annual_rate / min_annual_rate
//   min_kw / max_kw        →   kw_from / kw_to              (subsidy rules)
//   *_percent              →   *_pct                        (settings)
//
// The staff API stores every percentage as a **fraction** (0.0800 = 8 %), which
// `emi_bank_rates_fraction` and friends enforce in the database. Sending "8.00"
// is both the wrong field name and 800 %.
//
// Rather than rewrite six panels, both directions are translated here, at the
// one boundary every EMI write already crosses: panels keep speaking percent
// and the legacy names, and the wire always carries the staff contract.

import { StudioApiError, studioRequest, type Paginated } from "./studioService";
import type { EMIBank, EMISettings, EMISystemSize } from "./emiCalculator";

/* -------------------------------------------------------------------------- */
/*  Percent ⇄ fraction                                                         */
/* -------------------------------------------------------------------------- */

/** "8.00" (percent, from a form field) → "0.08" (fraction, what the API stores). */
function toFraction(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return value as null | undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value); // let the API reject it with a field error
  // 4 decimal places is the column's precision (DecimalField(max_digits=6, decimal_places=4)).
  return (n / 100).toFixed(4);
}

/** "0.0800" (fraction, from the API) → "8.00" (percent, what the panels show). */
function toPercent(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return (n * 100).toFixed(2);
}

/** Rename keys per `map`, leaving everything else untouched. Dropped keys are omitted. */
function rename(source: Record<string, unknown>, map: Record<string, string>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    out[map[key] ?? key] = value;
  }
  return out;
}

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

/** How one resource converts between the panel's shape and the staff API's. */
interface Adapter<TRow, TInput> {
  /** staff row → the shape the panels already render. */
  fromApi: (row: Record<string, unknown>) => TRow;
  /** panel input → the staff contract. */
  toApi: (body: TInput) => Record<string, unknown>;
}

/** Identity adapter: the panel shape already matches the staff contract. */
function passthrough<TRow, TInput extends object>(): Adapter<TRow, TInput> {
  return {
    fromApi: (row) => row as TRow,
    toApi: (body) => body as Record<string, unknown>,
  };
}

const BANK_TO_API = { interest_rate: "annual_rate", processing_fee_percent: "processing_fee_pct" };
const BANK_FROM_API = { annual_rate: "interest_rate", processing_fee_pct: "processing_fee_percent" };

const bankAdapter: Adapter<EMIBank, EMIBankInput> = {
  fromApi: (row) => {
    const out = rename(row, BANK_FROM_API);
    out.interest_rate = toPercent(out.interest_rate);
    out.processing_fee_percent = toPercent(out.processing_fee_percent);
    return out as unknown as EMIBank;
  },
  toApi: (body) => {
    const out = rename(body as Record<string, unknown>, BANK_TO_API);
    if ("annual_rate" in out) out.annual_rate = toFraction(out.annual_rate);
    if ("processing_fee_pct" in out) out.processing_fee_pct = toFraction(out.processing_fee_pct);
    return out;
  },
};

const RULE_TO_API = {
  min_cost: "min_system_cost",
  max_cost: "max_system_cost",
  min_loan: "min_amount",
  max_loan: "max_amount",
  rate: "annual_rate",
  min_rate: "min_annual_rate",
};
const RULE_FROM_API = {
  min_system_cost: "min_cost",
  max_system_cost: "max_cost",
  min_amount: "min_loan",
  max_amount: "max_loan",
  annual_rate: "rate",
  min_annual_rate: "min_rate",
};

const interestRuleAdapter: Adapter<EMIInterestRateRule, EMIInterestRateRuleInput> = {
  fromApi: (row) => {
    const out = rename(row, RULE_FROM_API);
    out.rate = toPercent(out.rate);
    out.min_rate = toPercent(out.min_rate);
    return out as unknown as EMIInterestRateRule;
  },
  toApi: (body) => {
    const out = rename(body as Record<string, unknown>, RULE_TO_API);
    if ("annual_rate" in out) out.annual_rate = toFraction(out.annual_rate);
    if ("min_annual_rate" in out) out.min_annual_rate = toFraction(out.min_annual_rate);
    return out;
  },
};

const SUBSIDY_TO_API = { min_kw: "kw_from", max_kw: "kw_to" };
const SUBSIDY_FROM_API = { kw_from: "min_kw", kw_to: "max_kw" };

const subsidyAdapter: Adapter<EMISubsidyRule, EMISubsidyRuleInput> = {
  fromApi: (row) => rename(row, SUBSIDY_FROM_API) as unknown as EMISubsidyRule,
  toApi: (body) => {
    const out = rename(body as Record<string, unknown>, SUBSIDY_TO_API);
    // `scheme` is required by the model and has no field in the panel yet; the
    // only scheme configured today is the national one.
    if (!out.scheme) out.scheme = "PM_SURYA_GHAR";
    return out;
  },
};

function crud<TRow, TInput extends object>(resource: string, adapter: Adapter<TRow, TInput>) {
  const base = `emi/${resource}/`;
  return {
    list: async () =>
      (await studioRequest<Paginated<Record<string, unknown>>>(base)).results.map(adapter.fromApi),
    create: async (body: TInput) =>
      adapter.fromApi(
        await studioRequest<Record<string, unknown>>(base, { method: "POST", body: adapter.toApi(body) }),
      ),
    update: async (uid: string, body: TInput) =>
      adapter.fromApi(
        await studioRequest<Record<string, unknown>>(`${base}${uid}/`, { method: "PATCH", body: adapter.toApi(body) }),
      ),
    remove: (uid: string) =>
      studioRequest<void>(`${base}${uid}/`, { method: "DELETE" }),
  };
}

// Platform paths: `subsidy-rules` and `interest-rules` (the old backend called
// them `subsidies` and `interest-rates`).
export const systemSizes = crud<EMISystemSize, EMISystemSizeInput>("system-sizes", passthrough());
export const subsidyRules = crud<EMISubsidyRule, EMISubsidyRuleInput>("subsidy-rules", subsidyAdapter);
export const interestRules = crud<EMIInterestRateRule, EMIInterestRateRuleInput>("interest-rules", interestRuleAdapter);
export const banks = crud<EMIBank, EMIBankInput>("banks", bankAdapter);

/* -------------------------------------------------------------------------- */
/*  Settings singleton                                                         */
/* -------------------------------------------------------------------------- */

const SETTINGS_TO_API = {
  down_payment_min_percent: "down_payment_min_pct",
  down_payment_max_percent: "down_payment_max_pct",
  down_payment_step_percent: "down_payment_step_pct",
  default_interest_rate: "default_annual_rate",
};
const SETTINGS_FROM_API = {
  down_payment_min_pct: "down_payment_min_percent",
  down_payment_max_pct: "down_payment_max_percent",
  down_payment_step_pct: "down_payment_step_percent",
  default_annual_rate: "default_interest_rate",
};
/** Percent-valued settings, in the panel's vocabulary. `rate_max` keeps its name on both sides. */
const SETTINGS_PERCENTS = [
  "down_payment_min_percent",
  "down_payment_max_percent",
  "down_payment_step_percent",
  "rate_max",
  "default_interest_rate",
] as const;

function settingsFromApi(row: Record<string, unknown>): EMISettings {
  const out = rename(row, SETTINGS_FROM_API);
  for (const key of SETTINGS_PERCENTS) {
    if (key in out) out[key] = toPercent(out[key]);
  }
  return out as unknown as EMISettings;
}

function settingsToApi(body: EMISettingsInput): Record<string, unknown> {
  const source = body as Record<string, unknown>;
  const converted: Record<string, unknown> = { ...source };
  for (const key of SETTINGS_PERCENTS) {
    if (key in converted) converted[key] = toFraction(converted[key]);
  }
  return rename(converted, SETTINGS_TO_API);
}

export async function getSettings(): Promise<EMISettings> {
  return settingsFromApi(await studioRequest<Record<string, unknown>>("emi/settings/"));
}

export async function updateSettings(body: EMISettingsInput): Promise<EMISettings> {
  return settingsFromApi(
    await studioRequest<Record<string, unknown>>("emi/settings/", { method: "PATCH", body: settingsToApi(body) }),
  );
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
