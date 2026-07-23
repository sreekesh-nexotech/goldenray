"use client";

// src/components/Studio/shared/overlays.tsx
//
// Modal dialog, toast host and dropdown menu — shared overlay chrome for the
// Content Studio. All use a fixed teal scrim and the flzPop/flzToast keyframes
// defined in globals.css.

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useStudio } from "./StudioContext";
import { GhostButton, DangerButton, GoldButton } from "./primitives";
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
/*  Confirm dialog                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Reusable confirmation dialog for destructive or consequential actions.
 *
 *   <ConfirmDialog
 *     open={pending !== null}
 *     title="Delete entry?"
 *     confirmLabel="Delete"
 *     onCancel={() => setPending(null)}
 *     onConfirm={doDelete}
 *   >
 *     <b>{entry.title}</b> will be removed permanently.
 *   </ConfirmDialog>
 *
 * `danger` (default true) renders the confirm action in red; set false for
 * non-destructive confirmations (gold primary instead). `busy` disables the
 * confirm button and swaps in `busyLabel` while an async action runs.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busyLabel = "Working…",
  danger = true,
  busy = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  busyLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ConfirmBtn = danger ? DangerButton : GoldButton;
  return (
    <Modal open={open} onClose={onCancel} ariaLabel={typeof title === "string" ? title : "Confirm"} width={400}>
      <ModalTitle>{title}</ModalTitle>
      {children && (
        <div style={{ fontSize: 13, color: studioColors.bodyGray, margin: "6px 0 16px", lineHeight: 1.55 }}>
          {children}
        </div>
      )}
      <ModalActions>
        <GhostButton onClick={onCancel}>{cancelLabel}</GhostButton>
        <ConfirmBtn onClick={onConfirm} disabled={busy}>
          {busy ? busyLabel : confirmLabel}
        </ConfirmBtn>
      </ModalActions>
    </Modal>
  );
}

/** Mono key chip for referencing an API key inside dialog copy. */
export function KeyChip({ children }: { children: ReactNode }) {
  return (
    <code
      style={{ fontFamily: studioFonts.mono, fontSize: 11.5, background: "rgba(248,242,225,.9)", padding: "1px 6px", borderRadius: 6 }}
    >
      {children}
    </code>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toast host                                                                  */
/* -------------------------------------------------------------------------- */

export function ToastHost() {
  const { toasts } = useStudio();
  // Render nothing on the server AND on the first client render so the
  // hydrated HTML matches; the portal mounts right after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      style={{ position: "fixed", right: 22, bottom: 20, zIndex: 120, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}
    >
      {toasts.map((t) => {
        const isError = t.kind === "error";
        return (
          <div
            key={t.id}
            role={isError ? "alert" : undefined}
            className="flex items-center gap-[9px]"
            style={{
              background: isError ? "#B42318" : studioColors.tealDeep,
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
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: isError ? "#FEE4E2" : studioColors.gold,
                color: isError ? "#B42318" : studioColors.goldInk,
                flex: "none",
              }}
            >
              {isError ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
                  <path d="M12 6v7" />
                  <path d="M12 17.5v.5" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              )}
            </span>
            {t.msg}
          </div>
        );
      })}
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

  // Clamp to the viewport so a right-rail anchor or a long list never runs off
  // screen. Width stays inside the right edge; height is capped to the room
  // below the anchor — and when that room is too small (anchor near the bottom)
  // the menu shifts UP so its bottom stays on screen.
  const WIDTH = 216;
  const GAP = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampedLeft = Math.max(GAP, Math.min(left, vw - WIDTH - GAP));

  const contentHeight = items.length * 37 + 10; // ~37px/item + padding
  const cap = Math.min(contentHeight, Math.floor(vh * 0.7)); // never taller than 70vh
  const roomBelow = vh - top - GAP;
  let menuTop = top;
  let maxHeight = cap;
  if (cap > roomBelow) {
    // Not enough space below — pin the bottom to the viewport, growing upward.
    maxHeight = Math.min(cap, vh - GAP * 2);
    menuTop = Math.max(GAP, vh - GAP - maxHeight);
  }

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80 }} />
      <div
        role="menu"
        aria-label="Actions"
        style={{
          position: "fixed",
          width: WIDTH,
          maxHeight,
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 12px 16px -4px rgba(10,13,18,.14),0 4px 6px -2px rgba(10,13,18,.06),inset 0 0 0 1px #E5E7EB",
          padding: 5,
          zIndex: 81,
          animation: "flzPop .12s ease",
          top: menuTop,
          left: clampedLeft,
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
            <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{mi.label}</span>
            {mi.note && (
              <span style={{ flex: "none", fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.num }}>{mi.note}</span>
            )}
          </button>
        ))}
      </div>
    </>,
    document.body
  );
}
