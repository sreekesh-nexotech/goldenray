import { apiCall } from './apiService';

/* -------------------------------------------------------------------------- */
/*  Calculator configuration (admin-managed)                                   */
/* -------------------------------------------------------------------------- */
//
// Every number the calculator renders comes from here rather than a hard-coded
// array, so the Content Studio can change system prices, subsidy, rate policy
// and the bank table without a frontend deploy.

export interface EMISettings {
  tenure_min_years: number;
  tenure_max_years: number;
  tenure_default_years: number;
  /** Daily amount = monthly EMI ÷ this. 30 by policy. */
  daily_saving_divisor: number;
  /** Increment for the system price +/- buttons and slider. */
  price_step: string;
  /** Floor for the down-payment slider, as % of the system price. */
  down_payment_min_percent: string;
  /** Ceiling for the down-payment slider, as % of the system price. */
  down_payment_max_percent: string;
  /** Increment for the down-payment +/- buttons and slider. */
  down_payment_step_percent: string;
  /** ₹ amounts offered as one-tap "Quick add" chips under the down-payment slider. */
  down_payment_quick_adds: number[];
  rate_max: string;
  default_interest_rate: string;
  panel_life_years: number;
  updated_at?: string;
}

export interface EMISystemSize {
  id: number;
  label: string;
  capacity_kw: string;
  price_per_kw: string;
  /** Derived server-side as price_per_kw × capacity_kw — the default price. */
  system_cost: number;
  /** ₹ floor for the price slider. Null = pinned to the default price. */
  price_min: string | null;
  /** ₹ ceiling for the price slider. Null = pinned to the default price. */
  price_max: string | null;
  monthly_bill_reference: string;
  sort_order: number;
  is_active: boolean;
}

export interface EMIBank {
  id: number;
  name: string;
  abbr: string;
  slug: string;
  logo_bg: string;
  interest_rate: string;
  min_loan: string;
  max_loan: string;
  upfront_requirement: string;
  eligibility: string;
  cibil_required: number;
  processing_fee_percent: string;
  processing_fee_note: string;
  approval_min_days: number;
  approval_max_days: number;
  max_tenure_years: number;
  features: string[];
  best_for: string;
  is_recommended: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface EMIConfigResponse {
  settings: EMISettings;
  system_sizes: EMISystemSize[];
  banks: EMIBank[];
}

// The public v1 API identifies rows by `uid` (a string); `id` carries it so the
// components can key on one field. The Studio admin keeps the numeric types above.
export type PublicEMISystemSize = Omit<EMISystemSize, 'id'> & { id: string };
export type PublicEMIBank = Omit<EMIBank, 'id'> & { id: string };
export interface PublicEMIConfigResponse {
  settings: EMISettings;
  system_sizes: PublicEMISystemSize[];
  banks: PublicEMIBank[];
}

/* -------------------------------------------------------------------------- */
/*  Calculation                                                                */
/* -------------------------------------------------------------------------- */

export interface EMICalculatorPayload {
  /** Preferred selector — the id of a configured system size (sent as size_uid on v1). */
  size_id?: number | string;
  capacity_kw?: number;
  tenure_years?: number;
  /** Customer adjustment; clamped to the band floor, ignored on locked bands. */
  interest_rate?: number;
  /** Overrides the size's default price; clamped to its price slider band. */
  system_cost?: number;
  /** Overrides the default (minimum) down payment %; clamped to the configured band. */
  down_payment_percent?: number;
  /** Default true. Off means no down payment is deducted, regardless of the slider. */
  apply_down_payment?: boolean;
  /** Default true. Off means the loan is sized without deducting the subsidy. */
  apply_subsidy?: boolean;
}

export interface EMICalculatorResponse {
  system: {
    size_id?: number | null;
    size_uid?: string | null;
    label: string | null;
    capacity_kw: number;
    price_per_kw: number;
    system_cost: number;
    price_min: number;
    price_max: number;
    price_source: 'computed' | 'customer';
    monthly_bill_reference: number;
  };
  down_payment: {
    applied: boolean;
    percent: number;
    amount: number;
    min_percent: number;
    max_percent: number;
    step_percent: number;
    /** min/max % expressed in ₹ against the current system price. */
    min_amount: number;
    max_amount: number;
    quick_add_amounts: number[];
  };
  subsidy: {
    applied: boolean;
    amount: number;
    net_cost_after_subsidy: number;
  };
  /** The final loan amount: system cost minus the down payment and (if applied) the subsidy. */
  loan: {
    amount: number;
  };
  interest: {
    rate: number;
    /** Price minus down payment — the figure the rate band is decided on (subsidy not deducted). */
    basis_amount: number;
    base_rate: number;
    min_rate: number;
    is_locked: boolean;
    requested_rate: number | null;
    rule_id?: number | null;
    rule_uid?: string | null;
    rule_label: string | null;
    /** Cheaper band reachable by paying more upfront; null when already on the lowest. */
    unlock: {
      rate: number;
      extra_down_payment: number;
      down_payment_amount: number;
      down_payment_percent: number;
      rule_label: string;
    } | null;
  };
  tenure: { years: number; months: number };
  result: {
    emi_per_month: number;
    total_payment: number;
    total_interest: number;
    /** EMI ÷ daily_saving_divisor. */
    daily_amount: number;
    daily_saving_divisor: number;
    monthly_savings: number;
  };

  // Flat aliases kept for older callers.
  emi_per_month: number;
  total_payment: number;
  total_interest: number;
  principal: number;
  interest_rate: number;
}

const EMI_CALCULATOR_ENDPOINT = 'calculators/emi/';
const EMI_CONFIG_ENDPOINT = 'calculators/emi/config/';
// Studio admin still runs against the old backend (numeric ids).
const LEGACY_EMI_CALCULATOR_ENDPOINT = 'emi-calculator/';

/** GET the admin-managed configuration that drives the calculator UI. */
export async function getEMIConfig(): Promise<PublicEMIConfigResponse> {
  const response = await apiCall<{
    settings: EMISettings;
    system_sizes: (Omit<EMISystemSize, 'id'> & { uid: string })[];
    banks: (Omit<EMIBank, 'id'> & { uid: string })[];
  }>(EMI_CONFIG_ENDPOINT, 'GET', null, { publicApi: true });
  if (!response || !Array.isArray(response.system_sizes)) {
    throw new Error('Invalid EMI calculator configuration received');
  }
  return {
    settings: response.settings,
    system_sizes: response.system_sizes.map((r) => ({ ...r, id: r.uid })),
    banks: response.banks.map((r) => ({ ...r, id: r.uid })),
  };
}

function assertEmiResponse(response: EMICalculatorResponse | undefined): EMICalculatorResponse {
  if (!response) {
    throw new Error('No response received from the EMI calculator API');
  }
  if (typeof response.result?.emi_per_month !== 'number') {
    console.error('Invalid EMI response:', response);
    throw new Error('Invalid or missing financial data in EMI calculator response');
  }
  return response;
}

export async function calculateEMI(
  payload: EMICalculatorPayload
): Promise<EMICalculatorResponse> {
  const { size_id, ...rest } = payload;
  const body = size_id === undefined ? rest : { ...rest, size_uid: String(size_id) };
  return assertEmiResponse(
    await apiCall<EMICalculatorResponse>(EMI_CALCULATOR_ENDPOINT, 'POST', body, {
      publicApi: true,
    })
  );
}

/** Studio preview: the same calculation against the old backend's numeric size ids. */
export async function calculateEMILegacy(
  payload: EMICalculatorPayload
): Promise<EMICalculatorResponse> {
  return assertEmiResponse(
    await apiCall<EMICalculatorResponse>(LEGACY_EMI_CALCULATOR_ENDPOINT, 'POST', payload)
  );
}
