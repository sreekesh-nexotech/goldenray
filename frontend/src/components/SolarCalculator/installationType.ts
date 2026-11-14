/**
 * The calculator's "Property Type" choice: residential or commercial, each as
 * on-grid or hybrid.
 *
 * The solar calculator backend only knows "residential" / "commercial", so the
 * choice is split before it is sent: the property type goes to the calculator
 * and picks the quotation document, the system type decides how it is priced
 * (a hybrid quote prices its battery options with the BOM engine, see
 * quotationPdfService).
 */
export type InstallationType =
  | "residential-ongrid"
  | "residential-hybrid"
  | "commercial-ongrid"
  | "commercial-hybrid";
export type PropertyType = "residential" | "commercial";
export type SystemType = "ongrid" | "hybrid";

export const INSTALLATION_OPTIONS: { value: InstallationType; label: string }[] = [
  { value: "residential-ongrid", label: "Residential – On-Grid" },
  { value: "residential-hybrid", label: "Residential – Hybrid" },
  { value: "commercial-ongrid", label: "Commercial – On-Grid" },
  { value: "commercial-hybrid", label: "Commercial – Hybrid" },
];

/** What the solar calculator API expects. A bare "residential" still works. */
export function propertyTypeOf(value: string): PropertyType {
  return value.startsWith("residential") ? "residential" : "commercial";
}

/** Everything is on-grid unless hybrid was chosen; a bare "commercial" is on-grid. */
export function systemTypeOf(value: string): SystemType {
  return value.endsWith("-hybrid") ? "hybrid" : "ongrid";
}

/** The largest hybrid the BOM engine holds real prices for. */
const HYBRID_MAX_KW = 10;

export const COMMERCIAL_HYBRID_LIMIT_MESSAGE = `Hybrid systems above ${HYBRID_MAX_KW} kW need a custom quote. Please contact us and our team will prepare one for you.`;

/**
 * The calculator sizes commercial systems up to 20 kW, past the hybrid price
 * list. Those customers get a custom quote rather than a document for a smaller
 * system than the one they were recommended.
 */
export function commercialHybridUnavailable(installationType: string, systemSize: string): boolean {
  return (
    propertyTypeOf(installationType) === "commercial" &&
    systemTypeOf(installationType) === "hybrid" &&
    parseFloat(systemSize) > HYBRID_MAX_KW
  );
}
