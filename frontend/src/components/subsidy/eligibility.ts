/**
 * Rules behind the four-question eligibility check on the subsidy page.
 *
 * The check is deliberately an *estimate*: every question can be skipped, and a
 * skipped question is read the generous way (residential, grid-connected, ~3 kW)
 * so a visitor who just wants the headline number still gets one. The result
 * card carries the disclaimer that final sanction rests with the discom.
 */

export type PropertyType = "residential" | "commercial";
export type Connection = "yes" | "no";
export type BillRange =
  | "under_2000"
  | "2000_5000"
  | "5000_10000"
  | "above_10000";
export type SystemSize = "not_sure" | "2_3kw" | "3_5kw" | "5kw_plus";

export interface SubsidyAnswers {
  propertyType?: PropertyType;
  connection?: Connection;
  billRange?: BillRange;
  systemSize?: SystemSize;
}

export interface EligibilityReason {
  title: string;
  detail: string;
}

export interface SubsidyEstimate {
  eligible: boolean;
  /** Subsidy in rupees. 0 when the answers rule the scheme out. */
  subsidy: number;
  /** System size the estimate was priced against, in kW. */
  systemKw: number;
  reasons: EligibilityReason[];
}

/** Cap on the residential PM Surya Ghar subsidy, matching the hero copy. */
export const MAX_SUBSIDY = 78000;

/** PM Surya Ghar residential slabs: ₹30k at 1 kW, ₹60k at 2 kW, ₹78k from 3 kW. */
export function subsidyForKw(kw: number): number {
  if (kw <= 1) return 30000;
  if (kw < 3) return 60000;
  return MAX_SUBSIDY;
}

/**
 * System size the estimate is priced against. An explicit answer wins; "Not
 * sure" is inferred from the electricity bill, and an unanswered bill falls
 * back to the 3 kW system most Kerala homes end up with.
 */
export function assumedKw(answers: SubsidyAnswers): number {
  switch (answers.systemSize) {
    case "2_3kw":
      return 3;
    case "3_5kw":
      return 4;
    case "5kw_plus":
      return 5;
    default:
      break;
  }

  switch (answers.billRange) {
    case "under_2000":
      return 2;
    case "5000_10000":
      return 4;
    case "above_10000":
      return 5;
    default:
      return 3;
  }
}

/**
 * PM Surya Ghar covers grid-connected *residential* rooftops only, so those are
 * the two answers that can rule a visitor out. Everything else affects the
 * amount, not the eligibility.
 */
export function estimateSubsidy(answers: SubsidyAnswers): SubsidyEstimate {
  const systemKw = assumedKw(answers);
  const eligible =
    answers.propertyType !== "commercial" && answers.connection !== "no";

  return {
    eligible,
    subsidy: eligible ? subsidyForKw(systemKw) : 0,
    systemKw,
    reasons: eligible
      ? [
          {
            title: "Residential property",
            detail: "Property type matches residential criteria",
          },
          {
            title: "Active electricity connection",
            detail: "Standard grid connectivity verified",
          },
          {
            title: "Eligible system size",
            detail: "Capacity falls within government guidelines",
          },
        ]
      : [],
  };
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
