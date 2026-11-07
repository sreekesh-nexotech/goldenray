/**
 * Which pages of the quotation a copy contains.
 *
 * The customer gets everything: 12 pages residential, 9 commercial. The short
 * copy the Studio generates is five pages for the one system chosen there:
 * cover, its specifications, its investment summary with Book Now, and the
 * terms. The ids exist in both documents, so one list serves both.
 */
import type { PropertyType } from "@/components/SolarCalculator/installationType";

export type QuotationVariant = "customer" | "accounting";

export const FULL_PAGE_COUNT = 12;
export const COMMERCIAL_PAGE_COUNT = 9;

export const SHORT_PAGE_IDS: readonly string[] = [
  "01-cover",
  "07-tech-specs",
  "08-savings",
  "10-terms",
  "11-terms-2",
];

export function parseVariant(value: unknown): QuotationVariant {
  return value === "accounting" ? "accounting" : "customer";
}

/** Page ids to render, or undefined for the full document. */
export function pageIdsFor(variant: QuotationVariant): readonly string[] | undefined {
  return variant === "accounting" ? SHORT_PAGE_IDS : undefined;
}

export function pageCountFor(variant: QuotationVariant, sector?: PropertyType): number {
  if (variant === "accounting") return SHORT_PAGE_IDS.length;
  return sector === "commercial" ? COMMERCIAL_PAGE_COUNT : FULL_PAGE_COUNT;
}
