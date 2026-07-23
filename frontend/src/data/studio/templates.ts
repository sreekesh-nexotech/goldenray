// src/data/studio/templates.ts
import type { Template } from "@/types/studio";

/**
 * Templates define the image groups + attribute fields every entry inherits.
 * Labels are renamable; keys are the fixed API contract.
 */
export const templates: Template[] = [
  {
    id: "solar-guide",
    groups: [
      { key: "coverImg", label: "Cover image", kind: "single", req: true },
      { key: "socialSharing", label: "Social share card", kind: "single", req: false },
      { key: "bodyImages", label: "Body gallery", kind: "repeat", max: 8, req: false },
    ],
    attrs: [
      { key: "readTime", label: "Read time (min)", type: "number" },
      { key: "badge", label: "Reviewed by", type: "enum" },
      { key: "insights", label: "Key insight", type: "text" },
      { key: "warning", label: "Important warning", type: "text" },
    ],
  },
  {
    id: "comparison",
    groups: [
      { key: "coverImg", label: "Cover image", kind: "single", req: true },
      { key: "compareShots", label: "Comparison shots", kind: "repeat", max: 6, req: false },
    ],
    attrs: [
      { key: "readTime", label: "Read time (min)", type: "number" },
      { key: "winner", label: "Verdict badge", type: "enum", options: ["Solar + battery", "Grid-tied solar", "Depends on usage"] },
      { key: "verdict", label: "Verdict summary", type: "text" },
    ],
  },
  {
    id: "case-study",
    groups: [
      { key: "coverImg", label: "Cover image", kind: "single", req: true },
      { key: "siteGallery", label: "Site gallery", kind: "repeat", max: 12, req: false },
    ],
    attrs: [
      { key: "location", label: "Location", type: "string" },
      { key: "systemKw", label: "System size (kW)", type: "number" },
      { key: "monthlySavings", label: "Monthly savings (INR)", type: "number" },
      { key: "quote", label: "Customer quote", type: "text" },
    ],
  },
  {
    id: "standard-page",
    groups: [{ key: "heroImage", label: "Hero image", kind: "single", req: false }],
    attrs: [],
  },
];
