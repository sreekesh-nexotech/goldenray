"use client";

// src/components/Studio/shared/primitives.tsx
//
// Reusable presentation primitives shared across all Content Studio screens.
// Every visual token (ring borders, radii, colours, type sizes) is transcribed
// 1:1 from the design so screens compose pixel-perfectly.

import type { CSSProperties, ReactNode } from "react";
import type { StatusPillStyle } from "@/types/studio";
import { studioColors, studioFonts } from "./format";

/* -------------------------------------------------------------------------- */
/*  Section header (screen title + subtitle + optional actions)               */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  title,
  subtitle,
  actions,
  titleSuffix,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  titleSuffix?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start gap-4">
      <div className="min-w-0">
        <h2
          className="font-switzer"
          style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.13, color: studioColors.tealDeep }}
        >
          {title}
          {titleSuffix}
        </h2>
        {subtitle && (
          <p style={{ margin: "5px 0 0", fontSize: 13.5, color: studioColors.bodyGray }}>{subtitle}</p>
        )}
      </div>
      {actions && <div className="ml-auto flex flex-none gap-2">{actions}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  White ring card                                                            */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
  style,
  hoverRing = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hoverRing?: boolean;
}) {
  return (
    <div
      className={`${hoverRing ? "transition-shadow hover:shadow-[inset_0_0_0_1px_#074A4D]" : ""} ${className}`}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Card with a hairline-bottom header row. */
export function CardHeader({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="flex items-center gap-[9px]"
      style={{ padding: "12px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}`, ...style }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 13.5, fontWeight: 600, color: studioColors.tealDeep }}>{children}</span>;
}

export function CardMeta({ children }: { children: ReactNode }) {
  return (
    <span style={{ marginLeft: "auto", fontFamily: studioFonts.mono, fontSize: 10.5, color: studioColors.faintGray }}>
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status pill                                                                 */
/* -------------------------------------------------------------------------- */

export function StatusPill({ pill, size = "md" }: { pill: StatusPillStyle; size?: "sm" | "md" }) {
  const fs = size === "sm" ? 11 : 11.5;
  const dot = size === "sm" ? 5 : 6;
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{ padding: "3px 10px", borderRadius: 999, fontSize: fs, fontWeight: 600, background: pill.bg, color: pill.ink }}
    >
      <span style={{ width: dot, height: dot, borderRadius: "50%", background: "currentColor" }} />
      {pill.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Amber tip banner (shown when tips are enabled)                             */
/* -------------------------------------------------------------------------- */

export function TipBanner({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-4 flex items-start gap-2.5"
      style={{
        padding: "12px 15px",
        background: "rgba(253,246,210,.75)",
        borderRadius: 12,
        boxShadow: "inset 0 0 0 1px rgba(247,186,65,.55)",
        fontSize: 12.5,
        lineHeight: 1.5,
        color: studioColors.bodyGray,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A6117" strokeWidth="1.8" strokeLinecap="round" style={{ flex: "none", marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </svg>
      <div>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Buttons                                                                     */
/* -------------------------------------------------------------------------- */

type BtnProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
  "aria-haspopup"?: boolean | "menu";
};

/** Gold primary action. */
export function GoldButton({ children, onClick, style, className = "", ...rest }: BtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-[filter] hover:brightness-[.96] ${className}`}
      style={{
        height: 42,
        padding: "0 16px",
        borderRadius: 12,
        border: "none",
        background: studioColors.gold,
        color: studioColors.goldInk,
        fontFamily: "var(--font-switzer)",
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/** White button with a teal ring (secondary). */
export function GhostButton({ children, onClick, style, className = "", ...rest }: BtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-colors hover:bg-[rgba(7,74,77,0.05)] ${className}`}
      style={{
        height: 42,
        padding: "0 16px",
        borderRadius: 12,
        border: "none",
        background: "#ffffff",
        boxShadow: `inset 0 0 0 1px ${studioColors.teal}`,
        color: studioColors.teal,
        fontFamily: "var(--font-switzer)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form fields                                                                 */
/* -------------------------------------------------------------------------- */

const fieldRing = `inset 0 0 0 1px ${studioColors.inputRing},0 1px 2px rgba(10,13,18,.05)`;
const fieldRingFocus = "inset 0 0 0 1.5px #074A4D,0 1px 2px rgba(10,13,18,.05)";

export function FieldLabel({ children, suffix }: { children: ReactNode; suffix?: ReactNode }) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 500, color: studioColors.labelGray }}>
      {children}
      {suffix}
    </label>
  );
}

/** Small mono key tag shown on field labels (e.g. `metaTitle · 12 / 60`). */
export function KeyTag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        marginLeft: "auto",
        fontFamily: studioFonts.mono,
        fontSize: 10,
        color: studioColors.mutedGray,
        background: "rgba(248,242,225,.9)",
        padding: "2px 7px",
        borderRadius: 6,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

const baseInputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "none",
  borderRadius: 12,
  background: "#ffffff",
  boxShadow: fieldRing,
  fontFamily: "var(--font-switzer)",
  fontSize: 14,
  lineHeight: "20px",
  color: studioColors.tealDeep,
};

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  mono = false,
  style,
  ariaLabel,
  onKeyDown,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
  style?: CSSProperties;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      value={value}
      aria-label={ariaLabel}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={(e) => (e.currentTarget.style.boxShadow = fieldRingFocus)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = fieldRing)}
      style={{ ...baseInputStyle, ...(mono ? { fontFamily: studioFonts.mono, fontSize: 13 } : {}), ...style }}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  minHeight = 64,
  style,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  style?: CSSProperties;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={(e) => (e.currentTarget.style.boxShadow = fieldRingFocus)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = fieldRing)}
      style={{
        ...baseInputStyle,
        fontSize: 13.5,
        lineHeight: 1.55,
        minHeight,
        resize: "vertical",
        ...style,
      }}
    />
  );
}

/** Styled native select with the down-chevron affordance. */
export function SelectField({
  value,
  onChange,
  children,
  ariaLabel,
  mono = false,
  style,
}: {
  value: string;
  onChange?: (v: string) => void;
  children: ReactNode;
  ariaLabel?: string;
  mono?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={(e) => (e.currentTarget.style.boxShadow = fieldRingFocus)}
        onBlur={(e) => (e.currentTarget.style.boxShadow = fieldRing)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 32px 10px 12px",
          border: "none",
          borderRadius: 12,
          background: "#ffffff",
          boxShadow: fieldRing,
          fontFamily: mono ? studioFonts.mono : "var(--font-switzer)",
          fontSize: 13.5,
          lineHeight: "20px",
          color: studioColors.tealDeep,
          appearance: "none",
          cursor: "pointer",
          ...style,
        }}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-[11px] top-1/2 flex -translate-y-1/2" style={{ color: studioColors.mutedGray }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}

/** Pill toggle switch (used for required fields in the template builder). */
export function Switch({ checked, onChange, ariaLabel }: { checked: boolean; onChange?: () => void; ariaLabel?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: 0,
        transition: "background .15s",
        background: checked ? studioColors.teal : "#D5D7DA",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#ffffff",
          transition: "left .15s",
          boxShadow: "0 1px 2px rgba(10,13,18,.2)",
          left: checked ? 18 : 2,
        }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section-card SVG icon wrapper (teal 1.8 stroke, 15px)                       */
/* -------------------------------------------------------------------------- */

export function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={studioColors.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Table header cell (shared list style)                                      */
/* -------------------------------------------------------------------------- */

export const thStyle: CSSProperties = {
  textAlign: "left",
  fontSize: 11,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: studioColors.mutedGray,
  fontWeight: 600,
  padding: "9px 16px",
  background: "rgba(248,242,225,.55)",
  borderBottom: `1px solid ${studioColors.ring}`,
  fontFamily: "var(--font-switzer)",
};

export const tdStyle: CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid rgba(229,231,235,.7)",
};
