/**
 * Which pages of the 12-page quotation a copy contains.
 *
 * The customer gets everything. The accounting copy the Studio generates for
 * the sales / accounting team is the same document cut down to the pages that
 * carry the deal: 1 cover (customer, quote number), 5 package pricing, 7
 * technical specifications and pricing table, 8 savings. Ids match the
 * `PAGES` lists in both the English and Malayalam documents.
 */
export type QuotationVariant = "customer" | "accounting";

export const FULL_PAGE_COUNT = 12;

export const ACCOUNTING_PAGE_IDS: readonly string[] = [
  "01-cover",
  "05-options",
  "07-tech-specs",
  "08-savings",
];

export function parseVariant(value: unknown): QuotationVariant {
  return value === "accounting" ? "accounting" : "customer";
}

/** Page ids to render, or undefined for the full document. */
export function pageIdsFor(variant: QuotationVariant): readonly string[] | undefined {
  return variant === "accounting" ? ACCOUNTING_PAGE_IDS : undefined;
}

export function pageCountFor(variant: QuotationVariant): number {
  return variant === "accounting" ? ACCOUNTING_PAGE_IDS.length : FULL_PAGE_COUNT;
}
