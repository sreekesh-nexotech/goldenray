/**
 * PM Surya Ghar subsidy handling for the quotation PDF.
 *
 * The customer picks their eligibility on the details form: DCR modules
 * qualify for the subsidy, Non-DCR ones do not. Every price on the quotation
 * follows from that choice — an ineligible customer must never see a subsidy
 * line or a subsidised price.
 */

/** Flat residential subsidy the calculator assumes for a 3 kW+ system. */
export const PM_SURYA_GHAR_SUBSIDY = 78000;

/**
 * Subsidy actually applicable for the eligibility recorded on the form.
 *
 * The form stores the option label ("Eligible (DCR)" / "Not Eligible
 * (Non-DCR)"). Quotations generated before the field existed carry nothing,
 * and stay subsidised the way they were when they were produced.
 */
export function subsidyForEligibility(eligibility?: string): number {
  if (!eligibility) return PM_SURYA_GHAR_SUBSIDY;
  const isIneligible = /non[-\s]?dcr|not\s+eligible/i.test(eligibility);
  return isIneligible ? 0 : PM_SURYA_GHAR_SUBSIDY;
}

export interface QuotationPricing {
  /** Subsidy deducted on this quotation; 0 for a Non-DCR customer. */
  subsidy: number;
  /** Total system cost before any subsidy. */
  grossCost: number;
  /** What the customer actually pays. */
  netCost: number;
  /** EMI on the amount actually financed. */
  emiPerMonth: number;
}

/**
 * Rebuild the price breakdown from the calculator's output.
 *
 * `systemPrice` and `emiPerMonth` come from the calculator, which always
 * assumes the full subsidy. Adding it back gives the gross cost, from which
 * the applicable subsidy — possibly none — is deducted. EMI is linear in the
 * financed principal at a fixed rate and tenure, so it scales with it.
 */
export function quotationPricing(
  systemPrice: number,
  emiPerMonth: number,
  subsidy: number,
): QuotationPricing {
  const grossCost = systemPrice + PM_SURYA_GHAR_SUBSIDY;
  const netCost = grossCost - subsidy;
  const scaledEmi =
    systemPrice > 0
      ? Math.round((emiPerMonth * netCost) / systemPrice)
      : emiPerMonth;

  return { subsidy, grossCost, netCost, emiPerMonth: scaledEmi };
}

/** Monthly EMI for a 5-year loan at ~9% p.a., rounded to the nearest ₹10. */
export function fiveYearEmi(principal: number): number {
  const monthlyRate = 0.09 / 12;
  const months = 60;
  const growth = Math.pow(1 + monthlyRate, months);
  const emi = (principal * monthlyRate * growth) / (growth - 1);
  return Math.round(emi / 10) * 10;
}
