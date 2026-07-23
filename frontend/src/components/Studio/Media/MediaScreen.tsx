"use client";

// src/components/Studio/Media/MediaScreen.tsx
//
// Media library — the shared asset store, driven by GET media-assets/ on the
// admin API. The search box and collection chips are server-side filters
// (`search`, `collection`); uploads POST multipart (file picker or drag &
// drop) and the backend compresses to WebP + pushes to the CDN. Tiles open a
// detail drawer for metadata edits and deletion.

import { useEffect, useRef, useState } from "react";
import { studioColors, studioFonts } from "../shared/format";
import { PageHeader, TipBanner, GoldButton } from "../shared/primitives";
import { useStudio } from "../shared/StudioContext";
import AssetDetailDrawer from "./AssetDetailDrawer";
import {
  getMediaAssets,
  getCollections,
  uploadMediaAsset,
  StudioApiError,
  type StudioMediaAsset,
  type StudioCollection,
} from "@/services/studioService";

/** Display name for an asset: the file's basename. */
export function assetName(a: StudioMediaAsset): string {
  return a.file?.split("/").pop() || `asset-${a.id}`;
}

/** Human file size in KB. */
export function assetKb(a: StudioMediaAsset): number {
  return Math.max(1, Math.round((a.size || 0) / 1024));
}

export default function MediaScreen() {
  const { tips, toast } = useStudio();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState(""); // debounced copy of q
  const [collFilter, setCollFilter] = useState<number | "">(""); // "" = All media
  const [colls, setColls] = useState<StudioCollection[]>([]);
  const [items, setItems] = useState<StudioMediaAsset[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Collection chips (best-effort — the grid works without them).
  useEffect(() => {
    let cancelled = false;
    getCollections()
      .then((page) => !cancelled && setColls(page.results))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce the search box into the server-side `search` filter.
  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  // Load the grid whenever a filter changes.
  const load = async () => {
    try {
      const page = await getMediaAssets({ collection: collFilter, search });
      setItems(page.results);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load media");
    }
  };
  useEffect(() => {
    let cancelled = false;
    getMediaAssets({ collection: collFilter, search })
      .then((page) => {
        if (cancelled) return;
        setItems(page.results);
        setLoadError(null);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load media"));
    return () => {
      cancelled = true;
    };
  }, [collFilter, search]);

  /** Upload picked/dropped files, then refresh the grid. */
  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      toast("Only image files can be uploaded", "error");
      return;
    }
    setUploading(true);
    let ok = 0;
    for (const file of list) {
      try {
        await uploadMediaAsset(file, collFilter !== "" ? { collection: collFilter } : undefined);
        ok += 1;
      } catch (err) {
        toast(
          err instanceof StudioApiError
            ? `${file.name}: ${err.message}`
            : `${file.name}: upload failed`,
          "error"
        );
      }
    }
    if (ok > 0) toast(ok === 1 ? "Image uploaded" : `${ok} images uploaded`);
    await load();
    setUploading(false);
  };

  const selected = items?.find((a) => a.id === selectedId) ?? null;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Media library"
        subtitle="Every uploaded image — reused across entries and served by the delivery API."
        actions={
          <GoldButton onClick={() => fileInput.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload images"}
          </GoldButton>
        }
      />

      {/* Hidden file picker backing both the button and the dropzone */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
          e.target.value = ""; // allow re-picking the same file
        }}
      />

      {tips && (
        <TipBanner mb={14}>
          Shared asset store — authors pick from here when filling an image slot, or upload on the spot.
          Each asset keeps <b style={{ color: studioColors.tealDeep }}>alt text</b>, served by the API as{" "}
          <b style={{ color: studioColors.tealDeep }}>alternativeText</b>. Uploads are compressed to WebP and
          pushed to the CDN automatically.
        </TipBanner>
      )}

      {/* Toolbar: search + collection chips */}
      <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 16 }}>
        <div
          className="flex w-[260px] max-w-full items-center gap-2 max-md:w-full"
          style={{
            background: "rgba(255,255,255,.8)",
            borderRadius: 12,
            boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
            padding: "0 12px",
            height: 36,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" style={{ flex: "none" }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assets…"
            aria-label="Search assets"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              background: "none",
              outline: "none",
              fontFamily: "var(--font-switzer)",
              fontSize: 13,
              color: studioColors.tealDeep,
              height: "100%",
            }}
          />
        </div>

        {[{ id: "" as const, label: "All media" }, ...colls.map((c) => ({ id: c.id, label: c.plural_name }))].map((f) => {
          const active = collFilter === f.id;
          return (
            <button
              key={f.id === "" ? "all" : f.id}
              type="button"
              onClick={() => setCollFilter(f.id)}
              className="inline-flex items-center"
              style={{
                padding: "6px 13px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-switzer)",
                fontSize: 12.5,
                fontWeight: 600,
                background: active ? "#123532" : "rgba(255,255,255,.75)",
                boxShadow: active ? "none" : `inset 0 0 0 1px ${studioColors.ring}`,
                color: active ? "#fff" : "#414651",
                transition: "background .12s,color .12s",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load the media library: {loadError}
        </div>
      ) : items === null ? (
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      ) : (
        <>
          {/* Asset grid + dropzone tile */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(168px,1fr))", gap: 14 }}>
            {items.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className="hover:shadow-[inset_0_0_0_1px_#074A4D]"
                style={{
                  textAlign: "left",
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
                  background: "#ffffff",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
                  fontFamily: "var(--font-switzer)",
                  transition: "box-shadow .12s",
                }}
              >
                <div style={{ height: 110, background: `#F8F2E1 ${a.url ? `url('${a.url}')` : ""} center/cover no-repeat` }} />
                <div style={{ padding: "9px 12px 11px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {assetName(a)}
                  </div>
                  <div style={{ fontSize: 10.5, color: studioColors.faintGray, fontFamily: studioFonts.mono, marginTop: 2 }}>
                    {a.width && a.height ? `${a.width}×${a.height} · ` : ""}{assetKb(a)} KB
                  </div>
                </div>
              </button>
            ))}

            <div
              onClick={() => !uploading && fileInput.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!uploading && e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
              }}
              className="grid place-items-center hover:border-[#074A4D] hover:text-[#074A4D]"
              style={{
                minHeight: 158,
                borderRadius: 16,
                border: "1.5px dashed #B8B8B8",
                color: studioColors.mutedGray,
                cursor: uploading ? "progress" : "pointer",
                background: "rgba(255,255,255,.45)",
                transition: "border-color .12s,color .12s",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5" />
                  <path d="M4 16.5V20h16v-3.5" />
                </svg>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>
                  {uploading ? "Uploading…" : (
                    <>
                      Drop images
                      <br />
                      or click to upload
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {items.length === 0 && (
            <div style={{ padding: "30px 20px 10px", textAlign: "center", color: studioColors.mutedGray, fontSize: 13 }}>
              {search || collFilter !== "" ? "No assets match this filter." : "No assets yet — upload the first image."}
            </div>
          )}
        </>
      )}

      {selected && (
        <AssetDetailDrawer
          asset={selected}
          onClose={() => setSelectedId(null)}
          onUpdated={(updated) => setItems((prev) => prev?.map((a) => (a.id === updated.id ? updated : a)) ?? prev)}
          onDeleted={(id) => {
            setSelectedId(null);
            setItems((prev) => prev?.filter((a) => a.id !== id) ?? prev);
          }}
        />
      )}
    </section>
  );
}
