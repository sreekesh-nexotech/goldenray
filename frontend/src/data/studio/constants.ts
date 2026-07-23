// src/data/studio/constants.ts

/**
 * Fixed reference "now" for the studio's static data. Relative timestamps and
 * "x hours ago" labels are computed against this so the presentation never
 * drifts with the wall clock. Matches the prototype's authoring context
 * (mid-July 2026). Replace with `Date.now()` once real API data flows in.
 */
export const STUDIO_NOW = Date.UTC(2026, 6, 20, 10, 47, 0);

/** Convert an "hours ago" offset into an absolute timestamp (ms). */
export const hoursAgo = (h: number): number => STUDIO_NOW - h * 3600e3;
