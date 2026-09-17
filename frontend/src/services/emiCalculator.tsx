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

/* -------------------------------------------------------------------------- */
/*  Calculation                                                                */
/* -------------------------------------------------------------------------- */

export interface EMICalculatorPayload {
  /** Preferred selector — the id of a configured system size. */
  size_id?: number;
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
    size_id: number | null;
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
    base_rate: number;
    min_rate: number;
    is_locked: boolean;
    requested_rate: number | null;
    rule_id: number | null;
    rule_label: string | null;
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

const EMI_CALCULATOR_ENDPOINT = 'emi-calculator/';
const EMI_CONFIG_ENDPOINT = 'emi-calculator/config/';

/** GET the admin-managed configuration that drives the calculator UI. */
export async function getEMIConfig(): Promise<EMIConfigResponse> {
  const response = await apiCall<EMIConfigResponse>(EMI_CONFIG_ENDPOINT);
  if (!response || !Array.isArray(response.system_sizes)) {
    throw new Error('Invalid EMI calculator configuration received');
  }
  return response;
}

export async function calculateEMI(
  payload: EMICalculatorPayload
): Promise<EMICalculatorResponse> {
  const response = await apiCall<EMICalculatorResponse>(
    EMI_CALCULATOR_ENDPOINT,
    'POST',
    payload
  );

  if (!response) {
    throw new Error('No response received from the EMI calculator API');
  }
  if (typeof response.result?.emi_per_month !== 'number') {
    console.error('Invalid EMI response:', response);
    throw new Error('Invalid or missing financial data in EMI calculator response');
  }
  return response;
}
