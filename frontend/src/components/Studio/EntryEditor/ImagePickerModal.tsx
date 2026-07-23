"use client";

// src/components/Studio/EntryEditor/ImagePickerModal.tsx
//
// Media picker used when filling an image slot in the editor. Choose from the
// shared library, or upload a new image (POST media-assets/) and pick it.

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { studioColors, studioFonts } from "../shared/format";

/** Slim asset shape the picker renders (mapped from StudioMediaAsset). */
export interface PickerAsset {
  id: number;
  url: string | null;
  name: string;
  width: number | null;
  height: number | null;
  kb: number;
}

export default function ImagePickerModal({
  open,
  onClose,
  onPick,
  onUploadFiles,
  groupLabel,
  assets,
  loading = false,
  uploading = false,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (assetId: number) => void;
  /** Upload the picked file(s) to media-assets/; the caller auto-selects the
   *  first new asset on success. */
  onUploadFiles: (files: FileList | File[]) => void;
  groupLabel?: string;
  assets: PickerAsset[];
  loading?: boolean;
  uploading?: boolean;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

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
        aria-label="Choose an image"
        className="flex flex-col overflow-hidden"
        style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(740px,92vw)", maxHeight: "82vh", background: "#ffffff", borderRadius: 24, zIndex: 101, animation: "flzPop .16s ease", boxShadow: "0 24px 48px rgba(7,74,77,.28)" }}
      >
        <div className="flex items-start gap-3" style={{ padding: "18px 22px 14px" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: studioColors.tealDeep }}>Choose an image</div>
            <div style={{ fontSize: 12.5, color: studioColors.faintGray, marginTop: 2 }}>{groupLabel ? `For ${groupLabel}` : "From the media library"}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="ml-auto grid place-items-center hover:bg-[rgba(248,242,225,0.95)]" style={{ border: "none", background: "none", cursor: "pointer", color: studioColors.faintGray, padding: 6, borderRadius: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto" style={{ padding: "2px 22px 20px" }}>
          {loading ? (
            <div style={{ padding: "24px 4px", fontSize: 13, color: studioColors.mutedGray }}>Loading…</div>
          ) : assets.length === 0 ? (
            <div style={{ padding: "24px 4px", fontSize: 13, color: studioColors.mutedGray }}>
              No images in the library yet — upload one to get started.
            </div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))" }}>
              {assets.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onPick(a.id)}
                  className="text-left hover:shadow-[inset_0_0_0_2px_#F7BA41]"
                  style={{ padding: 0, border: "none", cursor: "pointer", background: "#ffffff", borderRadius: 14, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, fontFamily: "var(--font-switzer)" }}
                >
                  <div style={{ height: 92, background: `#F8F2E1 ${a.url ? `url('${a.url}')` : ""} center/cover no-repeat` }} />
                  <div style={{ padding: "8px 11px 10px" }}>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 12, fontWeight: 600, color: studioColors.tealDeep }}>{a.name}</div>
                    <div style={{ fontSize: 10.5, color: studioColors.faintGray, fontFamily: studioFonts.mono, marginTop: 1 }}>
                      {a.width && a.height ? `${a.width}×${a.height} · ` : ""}{a.kb} KB
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5" style={{ padding: "13px 22px", boxShadow: `inset 0 1px 0 ${studioColors.ring}` }}>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.length) onUploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => !uploading && fileInput.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 hover:bg-[rgba(7,74,77,0.05)]"
            style={{ height: 34, padding: "0 13px", borderRadius: 12, border: "none", background: "#ffffff", boxShadow: `inset 0 0 0 1px ${studioColors.teal}`, color: studioColors.teal, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.7 : 1 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M4 16.5V20h16v-3.5" /></svg>
            {uploading ? "Uploading…" : "Upload new"}
          </button>
          <span style={{ marginLeft: "auto", fontSize: 11.5, color: studioColors.faintGray }}>Compressed to WebP and added to the media library</span>
        </div>
      </div>
    </>,
    document.body
  );
}
