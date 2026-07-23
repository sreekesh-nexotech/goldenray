"use client";

// src/components/Studio/Media/AssetDetailDrawer.tsx
//
// Right-side asset detail drawer for the Media library. Rendered via a portal
// with a teal scrim; closes on Escape or scrim click. Alt text and caption
// save via PATCH media-assets/{id}/ (metadata only — the file itself is
// immutable); Delete confirms first, since entries using the image lose it.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { studioColors, studioFonts } from "../shared/format";
import { TextArea, GoldButton } from "../shared/primitives";
import { ConfirmDialog } from "../shared/overlays";
import { useStudio } from "../shared/StudioContext";
import {
  patchMediaAsset,
  deleteMediaAsset,
  StudioApiError,
  type StudioMediaAsset,
} from "@/services/studioService";
import { assetName, assetKb } from "./MediaScreen";

const detailRow = { display: "flex", justifyContent: "space-between" } as const;
const valueInk = { color: studioColors.tealDeep, fontFamily: "'Inter',var(--font-switzer)" } as const;

export default function AssetDetailDrawer({
  asset,
  onClose,
  onUpdated,
  onDeleted,
}: {
  asset: StudioMediaAsset;
  onClose: () => void;
  onUpdated: (asset: StudioMediaAsset) => void;
  onDeleted: (id: number) => void;
}) {
  const { toast } = useStudio();
  const [alt, setAlt] = useState(asset.alternative_text);
  const [caption, setCaption] = useState(asset.caption);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Re-seed the fields whenever a different asset is opened.
  useEffect(() => {
    setAlt(asset.alternative_text);
    setCaption(asset.caption);
  }, [asset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const dirty = alt !== asset.alternative_text || caption !== asset.caption;

  const save = async () => {
    setSaving(true);
    try {
      const updated = await patchMediaAsset(asset.id, { alternative_text: alt, caption });
      onUpdated(updated);
      toast("Asset updated");
    } catch (err) {
      toast(err instanceof StudioApiError ? `Save failed: ${err.message}` : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async () => {
    if (!asset.url) {
      toast("No URL available for this asset", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(asset.url);
      toast("URL copied");
    } catch {
      toast("Couldn’t access the clipboard", "error");
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await deleteMediaAsset(asset.id);
      toast("Asset deleted");
      setConfirmOpen(false);
      onDeleted(asset.id);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Delete failed: ${err.message}` : "Delete failed", "error");
      setDeleting(false);
    }
  };

  const uploadedOn = new Date(asset.created_at).toLocaleDateString();

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
            background: `#F8F2E1 ${asset.url ? `url('${asset.url}')` : ""} center/cover no-repeat`,
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
            {assetName(asset)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5, color: studioColors.bodyGray, margin: "12px 0 16px" }}>
            {asset.width && asset.height && (
              <div style={detailRow}>
                <span>Dimensions</span>
                <span style={valueInk}>{asset.width}×{asset.height}</span>
              </div>
            )}
            <div style={detailRow}>
              <span>File size</span>
              <span style={valueInk}>{assetKb(asset)} KB</span>
            </div>
            {asset.mime && (
              <div style={detailRow}>
                <span>Type</span>
                <span style={{ color: studioColors.tealDeep, fontFamily: studioFonts.mono, fontSize: 11.5 }}>{asset.mime}</span>
              </div>
            )}
            <div style={detailRow}>
              <span>Uploaded</span>
              <span style={{ color: studioColors.tealDeep }}>{uploadedOn}</span>
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

          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: studioColors.labelGray, margin: "12px 0 6px" }}>
            Caption
          </label>
          <TextArea
            value={caption}
            onChange={setCaption}
            placeholder="Optional caption shown under the image…"
            minHeight={48}
            style={{ fontSize: 13 }}
          />

          <div style={{ marginTop: 12 }}>
            <GoldButton onClick={save} disabled={saving || !dirty} style={{ width: "100%", height: 38 }}>
              {saving ? "Saving…" : "Save metadata"}
            </GoldButton>
          </div>
          <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 8 }}>
            Metadata only — to replace the image itself, upload a new asset.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, padding: "14px 18px", boxShadow: "inset 0 1px 0 #E5E7EB", flex: "none" }}>
          <button
            type="button"
            onClick={copyUrl}
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
            onClick={() => setConfirmOpen(true)}
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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete asset?"
        busy={deleting}
        busyLabel="Deleting…"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doDelete}
      >
        <b style={{ color: studioColors.tealDeep }}>{assetName(asset)}</b> will be deleted from the library{" "}
        <b>and the CDN</b>. Any entry using this image simply loses it — pages on the live site may show an
        empty slot. This can&#8217;t be undone.
      </ConfirmDialog>
    </>,
    document.body
  );
}
