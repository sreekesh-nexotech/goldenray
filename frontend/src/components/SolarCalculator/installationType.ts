/**
 * The calculator's "Property Type" choice: residential splits into on-grid
 * and hybrid, commercial stays as it was.
 *
 * The solar calculator backend only knows "residential" / "commercial", so the
 * choice is split before it is sent: the property type goes to the calculator,
 * the system type decides which quotation the customer gets (a hybrid quote
 * prices its battery options with the BOM engine, see quotationPdfService).
 */
export type InstallationType = "residential-ongrid" | "residential-hybrid" | "commercial";
export type PropertyType = "residential" | "commercial";
export type SystemType = "ongrid" | "hybrid";

export const INSTALLATION_OPTIONS: { value: InstallationType; label: string }[] = [
  { value: "residential-ongrid", label: "Residential – On-Grid" },
  { value: "residential-hybrid", label: "Residential – Hybrid" },
  { value: "commercial", label: "Commercial" },
];

/** What the solar calculator API expects. A bare "residential" still works. */
export function propertyTypeOf(value: string): PropertyType {
  return value.startsWith("residential") ? "residential" : "commercial";
}

/** Only residential customers can choose hybrid; everything else is on-grid. */
export function systemTypeOf(value: string): SystemType {
  return value === "residential-hybrid" ? "hybrid" : "ongrid";
}
