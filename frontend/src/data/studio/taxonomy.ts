// src/data/studio/taxonomy.ts

/** Category lookups attached to entries from the editor's Organize panel. */
export const categories: string[] = [
  "Subsidy",
  "Government",
  "Basics",
  "Savings",
  "Comparisons",
  "Maintenance",
];

/** Tag lookups (machine-style, lower-case). */
export const tags: string[] = [
  "rooftop",
  "subsidy-2026",
  "kseb",
  "net-metering",
  "emi",
  "monsoon",
];

/** Badge lookups, attached via the "Reviewed by" attribute. */
export const badges: string[] = [
  "Certified installer",
  "Editor's pick",
  "Sponsored",
];

/**
 * Colour pairs used to render a badge chip. Falls back to the teal chip when a
 * badge has no explicit mapping.
 */
export const badgeColors: Record<string, { bg: string; ink: string }> = {
  "Certified installer": { bg: "rgba(195,223,189,.6)", ink: "#0A6B31" },
  "Editor's pick": { bg: "rgba(173,214,216,.55)", ink: "#074A4D" },
  Sponsored: { bg: "rgba(251,232,218,.85)", ink: "#9C4B21" },
};
