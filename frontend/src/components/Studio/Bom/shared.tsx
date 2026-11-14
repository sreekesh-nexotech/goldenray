"use client";

// src/components/Studio/Bom/shared.tsx
//
// Small pieces the BOM screen's panels share. Everything visual comes from
// Studio/shared/primitives and the studioColors/studioFonts tokens, so these add
// composition rather than new styling.

import type { ReactNode } from "react";
import { FieldLabel } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";

/** ₹ with Indian digit grouping, rounded to the rupee. Quotes never show paise. */
export const inr = (n: number | null | undefined) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

/**
 * The source numbers its sales flow — "Step 1 Select installation type", "Step 1b Select
 * module type (decides subsidy eligibility)", "Step 2 Configure the system", "Step 3
 * Review & finalize" (App.jsx:2729, 2759, 2978, 4797). Keeping the numbering means a
 * sales person moving between the two tools is looking at the same sequence.
 */
export function Step({ n, title, hint, children }: { n: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: studioColors.gold,
            background: studioColors.tealDeep,
            borderRadius: 6,
            padding: "3px 7px",
          }}
        >
          Step {n}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep }}>{title}</span>
        {hint && <span style={{ fontSize: 12, color: studioColors.mutedGray }}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/** A labelled field; `hint` carries the consequence of the choice, not a restatement. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      {children}
      {hint && (
        <p style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 4 }}>{hint}</p>
      )}
    </div>
  );
}

/**
 * A large choice rendered as a card rather than a dropdown, for the two decisions the
 * source also makes visually prominent: installation type and module content. Both change
 * what the rest of the form means, so they should not look like one option among twenty.
 */
export function ChoiceCard({
  active,
  title,
  detail,
  warning,
  disabled,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
  warning?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-pressed={active}
      disabled={disabled}
      className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left transition"
      style={{
        padding: "11px 13px",
        borderRadius: 12,
        background: active ? studioColors.cream : "#fff",
        boxShadow: `inset 0 0 0 ${active ? 1.5 : 1}px ${active ? studioColors.teal : studioColors.ring}`,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span style={{ fontSize: 13.5, fontWeight: 600, color: studioColors.tealDeep }}>{title}</span>
      <span style={{ fontSize: 11.5, color: studioColors.bodyGray }}>{detail}</span>
      {warning && <span style={{ fontSize: 11.5, fontWeight: 600, color: studioColors.danger }}>{warning}</span>}
    </button>
  );
}

/** One figure in a summary row. Numeric text uses the Inter numerals the Studio reads in. */
export function Stat({
  label,
  value,
  strong = false,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "muted" | "danger" | "positive";
}) {
  const color =
    tone === "danger" ? studioColors.danger : tone === "muted" ? studioColors.mutedGray : studioColors.tealDeep;
  return (
    <div className="min-w-0">
      <dt style={{ fontSize: 11.5, color: studioColors.mutedGray }}>{label}</dt>
      <dd
        style={{
          fontSize: strong ? 19 : 15,
          fontWeight: strong ? 700 : 600,
          fontFamily: studioFonts.num,
          color,
          marginTop: 2,
        }}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The source's most important empty state: with no market rate configured a sales person
 * must not be shown a cost-derived number as if it were a price (App.jsx:4917). The API
 * says so with `price_configured`.
 */
export function PriceNotConfigured() {
  return (
    <div
      role="status"
      className="flex items-start gap-2.5"
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(247,186,65,.12)",
        boxShadow: `inset 0 0 0 1px rgba(247,186,65,.5)`,
      }}
    >
      <span aria-hidden style={{ fontSize: 14 }}>⚠</span>
      <p style={{ fontSize: 12.5, color: studioColors.amberInk, margin: 0 }}>
        <strong>No price is configured for this configuration.</strong> The market rate for this
        system type, tier and size has not been set, so there is no price to quote. Ask an admin to
        set it before sending anything to the customer.
      </p>
    </div>
  );
}
