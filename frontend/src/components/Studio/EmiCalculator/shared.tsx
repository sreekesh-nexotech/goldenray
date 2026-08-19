"use client";

// src/components/Studio/EmiCalculator/shared.tsx
//
// Small form pieces shared by the EMI calculator panels. They wrap the studio
// primitives so every panel gets the same label/hint/spacing treatment and the
// same "edited → Save / Discard" affordance on a row.

import type { CSSProperties, ReactNode } from "react";
import { FieldLabel, GhostButton, GoldButton, Switch, TextInput } from "../shared/primitives";
import { studioColors } from "../shared/format";

/* -------------------------------------------------------------------------- */
/*  Fields                                                                     */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  hint,
  children,
  style,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={style}>
      <FieldLabel>{label}</FieldLabel>
      {children}
      {hint && (
        <p style={{ margin: "5px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.45 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChange={disabled ? undefined : onChange}
        ariaLabel={label}
        style={disabled ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
      />
    </Field>
  );
}

/** Numeric field. Kept as a string so a half-typed "8." doesn't get mangled. */
export function NumberField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  prefix,
  suffix,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13.5,
              color: studioColors.mutedGray,
              pointerEvents: "none",
            }}
          >
            {prefix}
          </span>
        )}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChange={disabled ? undefined : onChange}
          ariaLabel={label}
          style={{
            paddingLeft: prefix ? 26 : undefined,
            paddingRight: suffix ? 34 : undefined,
            ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}),
          }}
        />
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13.5,
              color: studioColors.mutedGray,
              pointerEvents: "none",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </Field>
  );
}

export function ToggleField({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-3" style={{ paddingTop: 2 }}>
      <Switch checked={checked} onChange={onChange} ariaLabel={label} disabled={disabled} />
      <div className="min-w-0">
        <span style={{ fontSize: 13, fontWeight: 500, color: studioColors.labelGray }}>{label}</span>
        {hint && (
          <p style={{ margin: "3px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.45 }}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row shell                                                                  */
/* -------------------------------------------------------------------------- */

/** A white ring card holding one editable record, with its own save controls. */
export function RowCard({
  title,
  meta,
  dirty,
  busy,
  readOnly,
  onSave,
  onDiscard,
  onDelete,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  dirty: boolean;
  busy?: boolean;
  readOnly?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onDelete?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: dirty
          ? `inset 0 0 0 1.5px ${studioColors.gold}`
          : `inset 0 0 0 1px ${studioColors.ring}`,
        overflow: "hidden",
        transition: "box-shadow .15s",
      }}
    >
      <div
        className="flex flex-wrap items-center gap-3"
        style={{ padding: "12px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}
      >
        <span style={{ fontSize: 13.5, fontWeight: 600, color: studioColors.tealDeep }}>{title}</span>
        {meta && <span style={{ fontSize: 12, color: studioColors.mutedGray }}>{meta}</span>}
        <div className="ml-auto flex items-center gap-2">
          {dirty && !readOnly && (
            <>
              <GhostButton onClick={onDiscard} style={{ height: 32, fontSize: 12 }} disabled={busy}>
                Discard
              </GhostButton>
              <GoldButton onClick={onSave} style={{ height: 32, fontSize: 12 }} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </GoldButton>
            </>
          )}
          {onDelete && !readOnly && !dirty && (
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              style={{
                height: 32,
                padding: "0 11px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: studioColors.danger,
                fontFamily: "var(--font-switzer)",
                fontSize: 12,
                fontWeight: 600,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

/** Responsive field grid used inside every RowCard. */
export function FieldGrid({ children, min = 190 }: { children: ReactNode; min?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 14,
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

/** Section heading + explanation above a list of rows. */
export function PanelIntro({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-3" style={{ marginBottom: 14 }}>
      <div className="min-w-0">
        <h3 style={{ fontSize: 16, fontWeight: 600, color: studioColors.tealDeep, letterSpacing: "-.01em" }}>
          {title}
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: studioColors.bodyGray, lineHeight: 1.5, maxWidth: 720 }}>
          {children}
        </p>
      </div>
      {action && <div className="ml-auto flex-none">{action}</div>}
    </div>
  );
}

/** Empty-state row for a list with nothing configured yet. */
export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: "28px 16px",
        textAlign: "center",
        fontSize: 13,
        color: studioColors.mutedGray,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Value helpers                                                              */
/* -------------------------------------------------------------------------- */

/** API decimals arrive as strings; nulls mean "no bound". */
export function str(value: string | number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}

/** Blank → null, so an empty bound clears rather than failing validation. */
export function nullableNum(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function inr(value: string | number): string {
  const n = Number(value);
  return Number.isFinite(n) ? `₹${Math.round(n).toLocaleString("en-IN")}` : "—";
}
