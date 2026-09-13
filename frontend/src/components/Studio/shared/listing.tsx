"use client";

// src/components/Studio/shared/listing.tsx
//
// The one list pattern §7 asks every module to share: search box, filter
// selects, a ringed white table, empty/loading/error states, a pager, and one
// status-pill vocabulary. Screens compose these rather than restyling a table.

import type { CSSProperties, ReactNode } from "react";
import type { StatusPillStyle } from "@/types/studio";
import { Card, GhostButton, StatusPill, TextInput, tdStyle, thStyle } from "./primitives";
import { studioColors, studioFonts } from "./format";

/* -------------------------------------------------------------------------- */
/*  Status pills — one vocabulary across modules                              */
/* -------------------------------------------------------------------------- */

const PILLS: Record<string, StatusPillStyle> = {
  published: { label: "Published", bg: "#C3E0BD", ink: "#0A6B31" },
  draft: { label: "Draft", bg: "#FBF1BD", ink: "#8A6117" },
  archived: { label: "Archived", bg: "#E5E7EB", ink: "#5B5B5B" },
  closed: { label: "Closed", bg: "#ADD6D8", ink: "#074A4D" },
  active: { label: "Active", bg: "#C3E0BD", ink: "#0A6B31" },
  inactive: { label: "Inactive", bg: "#E5E7EB", ink: "#5B5B5B" },
  // SEO validity indicator (§6.7)
  ok: { label: "OK", bg: "#C3E0BD", ink: "#0A6B31" },
  warning: { label: "Warning", bg: "#FBF1BD", ink: "#8A6117" },
  error: { label: "Needs attention", bg: "#F9D3CB", ink: "#9C2B1B" },
  // Application workflow (§6.13)
  new: { label: "New", bg: "#FBF1BD", ink: "#8A6117" },
  reviewing: { label: "Reviewing", bg: "#ADD6D8", ink: "#074A4D" },
  interview: { label: "Interview", bg: "#D9D2F7", ink: "#4A3A9C" },
  selected: { label: "Selected", bg: "#C3E0BD", ink: "#0A6B31" },
  rejected: { label: "Rejected", bg: "#E5E7EB", ink: "#5B5B5B" },
};

export function pillFor(status: string): StatusPillStyle {
  return PILLS[status] ?? { label: status, bg: "#E5E7EB", ink: "#5B5B5B" };
}

export function Pill({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  return <StatusPill pill={pillFor(status)} size={size} />;
}

/** Small lock badge for protected content (§7 — "visually marked as locked"). */
export function LockedTag() {
  return (
    <span
      className="inline-flex items-center gap-1"
      title="Copy and layout are developer-owned. Only registered slots and SEO are editable here."
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        color: studioColors.mutedGray,
        background: "rgba(229,231,235,.7)",
        padding: "2px 7px",
        borderRadius: 6,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
        <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      </svg>
      Locked
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toolbar: search + filters                                                  */
/* -------------------------------------------------------------------------- */

export function Toolbar({
  search,
  onSearch,
  placeholder = "Search…",
  children,
  onClear,
  filtering,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  /** Filter selects rendered after the search box. */
  children?: ReactNode;
  onClear?: () => void;
  filtering?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 14 }}>
      <div style={{ flex: "1 1 240px", maxWidth: 360 }}>
        <TextInput value={search} onChange={onSearch} placeholder={placeholder} ariaLabel={placeholder} />
      </div>
      {children}
      {filtering && onClear && (
        <button
          type="button"
          onClick={onClear}
          style={{
            border: "none",
            background: "transparent",
            color: studioColors.teal,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 8px",
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/** A compact filter select for the toolbar. */
export function FilterSelect({
  value,
  onChange,
  ariaLabel,
  children,
  width = 170,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  children: ReactNode;
  width?: number;
}) {
  return (
    <div className="relative" style={{ width }}>
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 30px 10px 12px",
          border: "none",
          borderRadius: 12,
          background: "#ffffff",
          boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
          fontFamily: "var(--font-switzer)",
          fontSize: 13,
          color: studioColors.tealDeep,
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2" style={{ color: studioColors.mutedGray }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Table + states                                                             */
/* -------------------------------------------------------------------------- */

export function ListTable({ head, children, minWidth = 720 }: { head: ReactNode; children: ReactNode; minWidth?: number }) {
  return (
    <Card style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth, borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr>{head}</tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Card>
  );
}

export function Th({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return <th style={{ ...thStyle, ...style }}>{children}</th>;
}

export function Td({ children, style, mono }: { children?: ReactNode; style?: CSSProperties; mono?: boolean }) {
  return (
    <td style={{ ...tdStyle, ...(mono ? { fontFamily: studioFonts.mono, fontSize: 12, color: studioColors.mutedGray } : {}), ...style }}>
      {children}
    </td>
  );
}

export function StateRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: "38px 16px", textAlign: "center", color: studioColors.mutedGray, fontSize: 13.5 }}>
        {children}
      </td>
    </tr>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ fontWeight: 600, color: studioColors.tealDeep }}>{title}</div>
      {hint && <div style={{ fontSize: 12.5, maxWidth: 420 }}>{hint}</div>}
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-wrap items-center gap-3"
      style={{
        padding: "12px 15px",
        borderRadius: 12,
        background: "#FDECEA",
        boxShadow: "inset 0 0 0 1px rgba(220,38,38,.35)",
        color: "#9C2B1B",
        fontSize: 13,
        marginBottom: 14,
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <GhostButton onClick={onRetry} style={{ height: 34, padding: "0 12px", fontSize: 12.5 }}>
          Try again
        </GhostButton>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pager                                                                      */
/* -------------------------------------------------------------------------- */

export const PAGE_SIZE = 25;

export function Pager({
  page,
  count,
  onPage,
  pageSize = PAGE_SIZE,
}: {
  page: number;
  count: number;
  onPage: (p: number) => void;
  pageSize?: number;
}) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(count, page * pageSize);
  return (
    <div className="flex items-center justify-between" style={{ marginTop: 12, fontSize: 12.5, color: studioColors.mutedGray }}>
      <span>
        {from}–{to} of {count}
      </span>
      <div className="flex gap-1.5">
        <GhostButton onClick={() => onPage(page - 1)} disabled={page <= 1} style={{ height: 32, padding: "0 12px", fontSize: 12.5, opacity: page <= 1 ? 0.5 : 1 }}>
          Previous
        </GhostButton>
        <GhostButton onClick={() => onPage(page + 1)} disabled={page >= pages} style={{ height: 32, padding: "0 12px", fontSize: 12.5, opacity: page >= pages ? 0.5 : 1 }}>
          Next
        </GhostButton>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dates                                                                      */
/* -------------------------------------------------------------------------- */

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
}

/** Tiny inline "N issues" hint next to an SEO pill. */
export function IssueHint({ issues }: { issues: { level: string; message: string }[] }) {
  if (!issues.length) return null;
  return (
    <span title={issues.map((i) => i.message).join("\n")} style={{ fontSize: 11.5, color: studioColors.mutedGray, marginLeft: 6 }}>
      {issues.length} issue{issues.length === 1 ? "" : "s"}
    </span>
  );
}
