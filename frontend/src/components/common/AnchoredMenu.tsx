"use client";

import { useLayoutEffect, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

const GAP = 8;
const EDGE = 8; // keep this far from the viewport edges
const MAX_HEIGHT = 256;

type Position = { top: number; left: number; width: number; maxHeight: number };

/**
 * A dropdown panel pinned under its trigger, rendered into <body>.
 *
 * The comparison-page selectors sit inside a horizontal scroller on mobile.
 * `overflow-x: auto` forces `overflow-y` to clip as well, so an absolutely
 * positioned menu was cut down to a blank sliver behind the table. Portalling
 * it out with fixed positioning takes it out of every clipping ancestor.
 */
export default function AnchoredMenu({
  anchorRef,
  open,
  onClose,
  children,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [pos, setPos] = useState<Position | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(Math.max(r.width, 240), vw - EDGE * 2);
      const left = Math.min(Math.max(r.left, EDGE), vw - width - EDGE);
      const below = vh - r.bottom - GAP - EDGE;
      const above = r.top - GAP - EDGE;
      // Open upwards only when there's clearly more room there.
      if (below < 160 && above > below) {
        const maxHeight = Math.min(MAX_HEIGHT, above);
        setPos({ top: r.top - GAP - maxHeight, left, width, maxHeight });
      } else {
        setPos({ top: r.bottom + GAP, left, width, maxHeight: Math.min(MAX_HEIGHT, Math.max(below, 120)) });
      }
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true); // capture: nested scrollers too
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !pos || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} aria-hidden />
      <div
        role="listbox"
        className="fixed z-[61] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white shadow-lg"
        style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
