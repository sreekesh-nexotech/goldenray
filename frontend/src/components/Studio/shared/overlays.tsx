"use client";

// src/components/Studio/shared/overlays.tsx
//
// Modal dialog, toast host and dropdown menu — shared overlay chrome for the
// Content Studio. All use a fixed teal scrim and the flzPop/flzToast keyframes
// defined in globals.css.

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useStudio } from "./StudioContext";
import { studioColors, studioFonts } from "./format";

/* -------------------------------------------------------------------------- */
/*  Modal                                                                       */
/* -------------------------------------------------------------------------- */

export function Modal({
  open,
  onClose,
  ariaLabel,
  width = 440,
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  width?: number;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(18,53,50,.45)", zIndex: 100 }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: `min(${width}px, 92vw)`,
          background: "#ffffff",
          borderRadius: 20,
          zIndex: 101,
          padding: 22,
          animation: "flzPop .16s ease",
          boxShadow: "0 24px 48px rgba(7,74,77,.28)",
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

export function ModalTitle({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 16, fontWeight: 600, color: studioColors.tealDeep }}>{children}</div>;
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 13.5, color: studioColors.bodyGray, margin: "8px 0 18px", lineHeight: 1.55 }}>{children}</p>;
}

export function ModalActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-end gap-2">{children}</div>;
}

/* -------------------------------------------------------------------------- */
/*  Toast host                                                                  */
/* -------------------------------------------------------------------------- */

export function ToastHost() {
  const { toasts } = useStudio();
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      style={{ position: "fixed", right: 22, bottom: 20, zIndex: 120, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-[9px]"
          style={{
            background: studioColors.tealDeep,
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 500,
            padding: "10px 14px",
            borderRadius: 12,
            boxShadow: "0 12px 16px -4px rgba(10,13,18,.3)",
            animation: "flzToast .22s ease",
            fontFamily: "var(--font-switzer)",
            maxWidth: 380,
          }}
        >
          <span
            className="grid place-items-center"
            style={{ width: 18, height: 18, borderRadius: "50%", background: studioColors.gold, color: studioColors.goldInk, flex: "none" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          {t.msg}
        </div>
      ))}
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/*  Dropdown menu                                                               */
/* -------------------------------------------------------------------------- */

export interface MenuItem {
  label: string;
  color?: string;
  note?: string;
  onClick?: () => void;
}

export function DropdownMenu({
  open,
  onClose,
  top,
  left,
  items,
}: {
  open: boolean;
  onClose: () => void;
  top: number;
  left: number;
  items: MenuItem[];
}) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80 }} />
      <div
        role="menu"
        aria-label="Actions"
        style={{
          position: "fixed",
          width: 216,
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 12px 16px -4px rgba(10,13,18,.14),0 4px 6px -2px rgba(10,13,18,.06),inset 0 0 0 1px #E5E7EB",
          padding: 5,
          zIndex: 81,
          animation: "flzPop .12s ease",
          top,
          left,
        }}
      >
        {items.map((mi, i) => (
          <button
            key={i}
            role="menuitem"
            onClick={() => {
              mi.onClick?.();
              onClose();
            }}
            className="flex w-full items-center gap-2 text-left hover:bg-[rgba(248,242,225,0.95)]"
            style={{
              padding: "8px 11px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-switzer)",
              fontSize: 13,
              fontWeight: 500,
              color: mi.color || studioColors.labelGray,
            }}
          >
            {mi.label}
            {mi.note && (
              <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.num }}>{mi.note}</span>
            )}
          </button>
        ))}
      </div>
    </>,
    document.body
  );
}
