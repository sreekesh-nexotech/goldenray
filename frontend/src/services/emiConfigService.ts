// src/services/emiConfigService.ts
//
// Authoring client for the EMI calculator's configuration.
//
// Unlike the rest of the Studio, these endpoints live on the *main* goldenray
// backend (API_BASE_URL) rather than the CMS — that is where the calculator and
// its models are. Authorisation still uses the Studio's JWT: the goldenray
// service verifies it with a signing key shared with the CMS, so the same
// sign-in covers both. Tokens are read from studioService rather than
// duplicated here.

import { API_BASE_URL } from "@/config";
import {
  StudioApiError,
  getStudioAccessToken,
  refreshStudioAccessToken,
} from "./studioService";
import type { EMIBank, EMISettings, EMISystemSize } from "./emiCalculator";

/* -------------------------------------------------------------------------- */
/*  Shapes                                                                     */
/* -------------------------------------------------------------------------- */

export interface EMISubsidyRule {
  id: number;
  label: string;
  /** Null means the band is open-ended on that side. */
  min_kw: string | null;
  max_kw: string | null;
  amount: string;
  priority: number;
  is_active: boolean;
}

export interface EMIInterestRateRule {
  id: number;
  label: string;
  min_kw: string | null;
  max_kw: string | null;
  /** System-cost band — how the 3kW ₹2L/₹3L policy is expressed. */
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
export type EMISystemSizeInput = Partial<Omit<EMISystemSize, "id" | "system_cost">>;
export type EMISubsidyRuleInput = Partial<Omit<EMISubsidyRule, "id">>;
export type EMIInterestRateRuleInput = Partial<Omit<EMIInterestRateRule, "id">>;
export type EMIBankInput = Partial<Omit<EMIBank, "id">>;
export type EMISettingsInput = Partial<Omit<EMISettings, "updated_at">>;

/* -------------------------------------------------------------------------- */
/*  Request plumbing                                                           */
/* -------------------------------------------------------------------------- */

async function request<T>(
  path: string,
  init: { method?: string; body?: object; token?: string | null } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      // DRF sends {"detail": "..."} or a field map like {"rate": ["..."]}.
      if (typeof data?.detail === "string") detail = data.detail;
      else if (typeof data?.error === "string") detail = data.error;
      else if (data && typeof data === "object") {
        const [field, messages] = Object.entries(data)[0] ?? [];
        if (Array.isArray(messages) && typeof messages[0] === "string") {
          detail = field ? `${field}: ${messages[0]}` : messages[0];
        }
      }
    } catch {
      /* non-JSON body — keep the generic message */
    }
    throw new StudioApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Attach the Studio token; on a 401 refresh once and retry. */
async function authRequest<T>(
  path: string,
  init: { method?: string; body?: object } = {}
): Promise<T> {
  const token = getStudioAccessToken();
  try {
    return await request<T>(path, { ...init, token });
  } catch (err) {
    if (!(err instanceof StudioApiError) || err.status !== 401) throw err;
    const fresh = await refreshStudioAccessToken();
    return request<T>(path, { ...init, token: fresh });
  }
}

/* -------------------------------------------------------------------------- */
/*  Generic CRUD over the emi-admin router                                     */
/* -------------------------------------------------------------------------- */

function crud<TRow, TInput extends object>(resource: string) {
  const base = `emi-admin/${resource}/`;
  return {
    list: () => authRequest<TRow[]>(base),
    create: (body: TInput) => authRequest<TRow>(base, { method: "POST", body }),
    update: (id: number, body: TInput) =>
      authRequest<TRow>(`${base}${id}/`, { method: "PATCH", body }),
    remove: (id: number) =>
      authRequest<void>(`${base}${id}/`, { method: "DELETE" }),
  };
}

export const systemSizes = crud<EMISystemSize, EMISystemSizeInput>("system-sizes");
export const subsidyRules = crud<EMISubsidyRule, EMISubsidyRuleInput>("subsidies");
export const interestRules = crud<EMIInterestRateRule, EMIInterestRateRuleInput>("interest-rates");
export const banks = crud<EMIBank, EMIBankInput>("banks");

/* -------------------------------------------------------------------------- */
/*  Settings singleton                                                         */
/* -------------------------------------------------------------------------- */

export function getSettings(): Promise<EMISettings> {
  return authRequest<EMISettings>("emi-admin/settings/");
}

export function updateSettings(body: EMISettingsInput): Promise<EMISettings> {
  return authRequest<EMISettings>("emi-admin/settings/", { method: "PATCH", body });
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
