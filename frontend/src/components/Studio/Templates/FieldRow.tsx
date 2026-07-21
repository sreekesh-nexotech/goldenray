"use client";

// src/components/Studio/Templates/FieldRow.tsx
//
// Shared grid row for both the "Image groups" and "Attribute fields" tables of
// the template builder. Renders the drag handle, an editable label, the fixed
// mono key, a type chip, the required toggle and (for admins) a remove button.

import type { CSSProperties } from "react";
import { Switch } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";

/** Shared column template used by the header row and every field row. */
export const ROW_GRID: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "20px minmax(140px,1.2fr) minmax(110px,1fr) 150px 56px 34px",
  gap: 10,
  alignItems: "center",
};

/** Colour tokens for a type chip. */
export interface ChipStyle {
  label: string;
  bg: string;
  ink: string;
  ring?: boolean;
}

export function FieldTableHeader() {
  return (
    <div
      style={{
        ...ROW_GRID,
        padding: "9px 4px",
        fontSize: 10.5,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: studioColors.mutedGray,
        fontWeight: 600,
        borderBottom: `1px solid ${studioColors.inputRing}`,
      }}
    >
      <span />
      <span>Label (renamable)</span>
      <span>Key (fixed)</span>
      <span>Type</span>
      <span>Req.</span>
      <span />
    </div>
  );
}

export function FieldRow({
  label,
  keyName,
  chip,
  required,
  readOnly,
  canEdit,
  onLabel,
  onToggle,
  onRemove,
}: {
  label: string;
  keyName: string;
  chip: ChipStyle;
  required: boolean;
  readOnly: boolean;
  canEdit: boolean;
  onLabel: (v: string) => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        ...ROW_GRID,
        padding: "8px 4px",
        borderBottom: "1px solid rgba(229,231,235,.7)",
      }}
    >
      <span style={{ color: studioColors.hairline, cursor: "grab", textAlign: "center", fontSize: 13, lineHeight: 1 }}>
        {"⣿"}
      </span>

      <input
        value={label}
        readOnly={readOnly}
        aria-label="Field label"
        onChange={(e) => onLabel(e.target.value)}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 0 1.5px #074A4D")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${studioColors.inputRing}`)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "7px 10px",
          border: "none",
          borderRadius: 10,
          background: "#ffffff",
          boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
          fontFamily: "var(--font-switzer)",
          fontSize: 13,
          color: studioColors.tealDeep,
        }}
      />

      <span
        style={{
          fontFamily: studioFonts.mono,
          fontSize: 12,
          color: studioColors.bodyGray,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {keyName}
      </span>

      <span>
        <span
          style={{
            fontFamily: studioFonts.mono,
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 6,
            background: chip.bg,
            color: chip.ink,
            boxShadow: chip.ring ? `inset 0 0 0 1px ${studioColors.inputRing}` : undefined,
          }}
        >
          {chip.label}
        </span>
      </span>

      <Switch checked={required} onChange={onToggle} ariaLabel="Required field" />

      {canEdit && (
        <button
          type="button"
          title="Remove"
          onClick={onRemove}
          className="grid place-items-center transition-colors hover:bg-[rgba(220,38,38,0.07)] hover:text-[#DC2626]"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: studioColors.hairline,
            padding: 4,
            borderRadius: 7,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
