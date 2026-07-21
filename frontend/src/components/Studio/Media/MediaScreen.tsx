"use client";

// src/components/Studio/Media/MediaScreen.tsx
//
// Media library — the shared asset store. A search box + folder chips filter a
// responsive grid of asset tiles; each tile opens a right-side detail drawer.
// Presentation only: uploads and drag/drop are toast stubs, filters are local
// state, and the alt-text field in the drawer is local UI state.

import { useMemo, useState } from "react";
import { assets, mediaFolders, entries } from "@/data/studio";
import type { Asset } from "@/types/studio";
import { studioColors, studioFonts } from "../shared/format";
import { PageHeader, TipBanner, GoldButton } from "../shared/primitives";
import { useStudio } from "../shared/StudioContext";
import AssetDetailDrawer from "./AssetDetailDrawer";

/** Count entries that reference an asset id across any image slot. */
function usedInCount(assetId: string): number {
  let n = 0;
  for (const e of entries) {
    const hit = Object.values(e.images).some((v) =>
      Array.isArray(v) ? v.includes(assetId) : v === assetId
    );
    if (hit) n += 1;
  }
  return n;
}

export default function MediaScreen() {
  const { tips, toast } = useStudio();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState<string>("All media");
  const [selected, setSelected] = useState<Asset | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return assets.filter((a) => {
      const inFolder = folder === "All media" || a.folder === folder;
      const matches =
        needle === "" ||
        a.name.toLowerCase().includes(needle) ||
        a.alt.toLowerCase().includes(needle);
      return inFolder && matches;
    });
  }, [q, folder]);

  const upload = () => toast("Uploads open your file picker");

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        title="Media library"
        subtitle="Every uploaded image — reused across entries and served by the delivery API."
        actions={<GoldButton onClick={upload}>Upload images</GoldButton>}
      />

      {tips && (
        <TipBanner>
          Shared asset store — authors pick from here when filling an image slot, or upload on the spot.
          Each asset keeps <b style={{ color: studioColors.tealDeep }}>alt text</b>, served by the API as{" "}
          <b style={{ color: studioColors.tealDeep }}>alternativeText</b>. Real drag &amp; drop works here.
        </TipBanner>
      )}

      {/* Toolbar: search + folder chips */}
      <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 16 }}>
        <div
          className="flex items-center gap-2"
          style={{
            width: 260,
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

        {mediaFolders.map((f) => {
          const active = folder === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFolder(f)}
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
              {f}
            </button>
          );
        })}
      </div>

      {/* Asset grid + dropzone tile */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(168px,1fr))", gap: 14 }}>
        {filtered.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
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
            <div style={{ height: 110, background: `#F8F2E1 url('${a.src}') center/cover no-repeat` }} />
            <div style={{ padding: "9px 12px 11px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {a.name}
              </div>
              <div style={{ fontSize: 10.5, color: studioColors.faintGray, fontFamily: studioFonts.mono, marginTop: 2 }}>
                {a.w}×{a.h} · {a.kb} KB
              </div>
            </div>
          </button>
        ))}

        <div
          onClick={upload}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            toast("Drop to upload");
          }}
          className="grid place-items-center hover:border-[#074A4D] hover:text-[#074A4D]"
          style={{
            minHeight: 158,
            borderRadius: 16,
            border: "1.5px dashed #B8B8B8",
            color: studioColors.mutedGray,
            cursor: "pointer",
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
              Drop images
              <br />
              or click to upload
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: "30px 20px 10px", textAlign: "center", color: studioColors.mutedGray, fontSize: 13 }}>
          No assets match this search.
        </div>
      )}

      {selected && (
        <AssetDetailDrawer
          asset={selected}
          usedIn={usedInCount(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
