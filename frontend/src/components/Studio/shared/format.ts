// src/components/Studio/shared/format.ts
//
// Pure presentation helpers shared across the Content Studio screens.

import type { EntryStatus, StatusPillStyle } from "@/types/studio";
import { STUDIO_NOW } from "@/data/studio/constants";

/** Status pill colours + label, matching the design tokens. */
export function statusPill(status: EntryStatus): StatusPillStyle {
  if (status === "published") return { label: "Published", bg: "#C3E0BD", ink: "#0A6B31" };
  if (status === "draft") return { label: "Draft", bg: "#FBF1BD", ink: "#8A6117" };
  return { label: "Modified", bg: "#ADD6D8", ink: "#074A4D" };
}

/** Membership status pill colours + label. */
export function memberStatusPill(status: "active" | "invited"): StatusPillStyle {
  return status === "active"
    ? { label: "Active", bg: "#C3E0BD", ink: "#0A6B31" }
    : { label: "Invited", bg: "#FBF1BD", ink: "#8A6117" };
}

/** Relative "x ago" label for a timestamp, measured against the studio clock. */
export function humanTime(ts: number | null): string {
  if (!ts) return "—";
  const m = (STUDIO_NOW - ts) / 60000;
  if (m < 1) return "just now";
  if (m < 60) return `${Math.floor(m)}m ago`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Two-letter initials from a name. */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((x) => x[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** URL slug from an arbitrary string. */
export function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/** Character-count label like "128 / 60" used on SEO/excerpt fields. */
export function countLabel(value: string, limit: number): string {
  return `${(value || "").length} / ${limit}`;
}

/** Shared brand palette (kept in one place for consistency). */
export const studioColors = {
  teal: "#074A4D",
  tealDeep: "#123532",
  gold: "#F7BA41",
  goldInk: "#272218",
  cream: "#F8F2E1",
  ring: "#E5E7EB",
  inputRing: "#D5D7DA",
  bodyGray: "#5B5B5B",
  labelGray: "#414651",
  mutedGray: "#757575",
  faintGray: "#898989",
  hairline: "#B8B8B8",
  danger: "#DC2626",
  amberInk: "#8A6117",
} as const;

/** Font stacks used throughout the studio. */
export const studioFonts = {
  mono: "ui-monospace,'SF Mono',Menlo,monospace",
  num: "var(--font-inter),var(--font-switzer),sans-serif",
} as const;
