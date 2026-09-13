"use client";

// src/components/Studio/shared/ImagePickerModal.tsx
//
// Pick an image from the shared media library, or upload one into it. §7 asks
// for one media mechanism across modules, so page slots, career images and
// SEO share images all go through this rather than each growing an uploader.

import { useEffect, useRef, useState } from "react";
import { Modal, ModalTitle } from "./overlays";
import { GhostButton, GoldButton, TextInput } from "./primitives";
import { studioColors, studioFonts } from "./format";
import { getMediaAssets, uploadMediaAsset, type StudioMediaAsset } from "@/services/studioService";

export default function ImagePickerModal({
  open,
  onClose,
  onPick,
  guidance,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (asset: StudioMediaAsset) => void;
  /** Slot guidance, e.g. "landscape, at least 1600×900". */
  guidance?: string;
}) {
  const [assets, setAssets] = useState<StudioMediaAsset[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    const t = setTimeout(() => {
      getMediaAssets({ search: search || undefined })
        .then((p) => !cancelled && setAssets(p.results))
        .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load media"));
    }, search ? 250 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, search]);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const asset = await uploadMediaAsset(file);
      onPick(asset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Choose an image" width={720}>
      <div className="flex items-start gap-3">
        <div>
          <ModalTitle>Choose an image</ModalTitle>
          {guidance && <div style={{ fontSize: 12.5, color: studioColors.mutedGray, marginTop: 3 }}>{guidance}</div>}
        </div>
        <div className="ml-auto flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
          <GoldButton onClick={() => fileRef.current?.click()} disabled={uploading} style={{ height: 36, padding: "0 14px", fontSize: 13 }}>
            {uploading ? "Uploading…" : "Upload new"}
          </GoldButton>
        </div>
      </div>

      <div style={{ margin: "14px 0 10px" }}>
        <TextInput value={search} onChange={setSearch} placeholder="Search the media library…" ariaLabel="Search media" />
      </div>

      {error && <div style={{ fontSize: 12.5, color: studioColors.danger, marginBottom: 8 }}>{error}</div>}

      <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 2 }}>
        {assets === null && !error && <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: 20, textAlign: "center" }}>Loading…</div>}
        {assets && assets.length === 0 && (
          <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: 20, textAlign: "center" }}>
            {search ? "Nothing matches." : "The media library is empty — upload the first image."}
          </div>
        )}
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {assets?.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onPick(a)}
              className="transition-shadow hover:shadow-[inset_0_0_0_2px_#074A4D]"
              style={{ border: "none", padding: 0, borderRadius: 12, overflow: "hidden", background: "#F3F4F6", boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ aspectRatio: "4 / 3", background: "#E5E7EB" }}>
                {a.url && <img src={a.url} alt={a.alternative_text} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
              </div>
              <div style={{ padding: "6px 8px" }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: studioColors.tealDeep, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.file.split("/").pop()}
                </div>
                <div style={{ fontSize: 10.5, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>
                  {a.width && a.height ? `${a.width}×${a.height}` : a.mime}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end" style={{ marginTop: 14 }}>
        <GhostButton onClick={onClose}>Cancel</GhostButton>
      </div>
    </Modal>
  );
}
