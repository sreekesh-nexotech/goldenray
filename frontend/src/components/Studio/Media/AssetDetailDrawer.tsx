"use client";

// src/components/Studio/Media/AssetDetailDrawer.tsx
//
// Right-side asset detail drawer for the Media library. Rendered via a portal
// with a teal scrim; closes on Escape or scrim click. Presentation only — the
// alt-text field is local state and the footer actions are toast stubs.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Asset } from "@/types/studio";
import { studioColors, studioFonts } from "../shared/format";
import { TextArea } from "../shared/primitives";
import { useStudio } from "../shared/StudioContext";

const detailRow = { display: "flex", justifyContent: "space-between" } as const;
const valueInk = { color: studioColors.tealDeep, fontFamily: "'Inter',var(--font-switzer)" } as const;

export default function AssetDetailDrawer({
  asset,
  usedIn,
  onClose,
}: {
  asset: Asset;
  usedIn: number;
  onClose: () => void;
}) {
  const { toast } = useStudio();
  const [alt, setAlt] = useState(asset.alt);

  // Re-seed the alt field whenever a different asset is opened.
  useEffect(() => {
    setAlt(asset.alt);
  }, [asset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const usedLabel = usedIn > 0 ? `${usedIn} ${usedIn === 1 ? "entry" : "entries"}` : "—";

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(18,53,50,.35)", zIndex: 70 }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Asset details"
        tabIndex={-1}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          bottom: 10,
          width: "min(340px,calc(100vw - 20px))",
          background: "#ffffff",
          borderRadius: 20,
          zIndex: 71,
          boxShadow: "0 12px 32px rgba(7,74,77,.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "flzFade .18s ease",
        }}
      >
        <div
          style={{
            height: 190,
            flex: "none",
            position: "relative",
            background: `#F8F2E1 url('${asset.src}') center/cover no-repeat`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid place-items-center hover:bg-[#123532]"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "rgba(18,53,50,.6)",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 18px" }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: studioColors.tealDeep, wordBreak: "break-all" }}>
            {asset.name}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5, color: studioColors.bodyGray, margin: "12px 0 16px" }}>
            <div style={detailRow}>
              <span>Dimensions</span>
              <span style={valueInk}>{asset.w}×{asset.h}</span>
            </div>
            <div style={detailRow}>
              <span>File size</span>
              <span style={valueInk}>{asset.kb} KB</span>
            </div>
            <div style={detailRow}>
              <span>Folder</span>
              <span style={{ color: studioColors.tealDeep }}>{asset.folder}</span>
            </div>
            <div style={detailRow}>
              <span>Used in</span>
              <span style={{ color: studioColors.tealDeep }}>{usedLabel}</span>
            </div>
          </div>

          <label
            className="flex items-center gap-1.5"
            style={{ fontSize: 13, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}
          >
            Alt text
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
              alternativeText
            </span>
          </label>
          <TextArea
            value={alt}
            onChange={setAlt}
            placeholder="Describe the image for screen readers…"
            minHeight={64}
            style={{ fontSize: 13 }}
          />
          <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 6 }}>
            Served with the image on every page that uses it.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, padding: "14px 18px", boxShadow: "inset 0 1px 0 #E5E7EB", flex: "none" }}>
          <button
            type="button"
            onClick={() => toast("URL copied")}
            className="inline-flex items-center justify-center hover:bg-[rgba(7,74,77,0.05)]"
            style={{
              flex: 1,
              gap: 7,
              height: 34,
              borderRadius: 12,
              border: "none",
              background: "#ffffff",
              boxShadow: "inset 0 0 0 1px #074A4D",
              color: "#074A4D",
              fontFamily: "var(--font-switzer)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Copy URL
          </button>
          <button
            type="button"
            onClick={() => toast("Delete removes the asset (stub)")}
            className="inline-flex items-center hover:bg-[rgba(220,38,38,0.08)]"
            style={{
              height: 34,
              padding: "0 13px",
              borderRadius: 12,
              border: "none",
              background: "transparent",
              color: studioColors.danger,
              fontFamily: "var(--font-switzer)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
