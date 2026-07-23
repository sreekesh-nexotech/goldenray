"use client";

// src/components/Studio/DeliveryApi/DeliveryApiScreen.tsx
//
// Delivery API (reference view) — shows how flarize.com reads published content
// through the read-only public API. The response preview is derived from the
// newest published article so it mirrors what the live site would receive.

import type { CSSProperties, ReactNode } from "react";
import { entries, assets } from "@/data/studio";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";

/* -------------------------------------------------------------------------- */
/*  Derive the JSON preview from the newest published article                  */
/* -------------------------------------------------------------------------- */

const CDN_ORIGIN = "https://golden-ray.b-cdn.net";

const publishedArticles = entries.filter(
  (e) => e.coll === "articles" && e.status === "published"
);

const newest = [...publishedArticles].sort((a, b) => b._ts - a._ts)[0];

const coverKey = newest.images.coverImg;
const coverId = Array.isArray(coverKey) ? coverKey[0] : coverKey;
const coverAsset = assets.find((a) => a.id === coverId);

const preview = {
  docId: "hx7k2p9qm3",
  title: newest.title,
  slug: newest.slug,
  excerpt: newest.excerpt,
  readTime: Number(newest.attrs.readTime),
  coverUrl: coverAsset ? `${CDN_ORIGIN}${coverAsset.src}` : "",
  coverAlt: coverAsset ? coverAsset.alt : "",
  cat: newest.cats[0] ?? "",
  mt: newest.seo.mt,
  pubAt: "2026-07-18T09:12:00.000Z",
  total: publishedArticles.length,
} as const;

const mainUrl = `https://flarize.com/api/articles?filters[slug][$eq]=${preview.slug}&populate=*`;

/* -------------------------------------------------------------------------- */
/*  Syntax-highlight tokens (colours transcribed 1:1 from the design)          */
/* -------------------------------------------------------------------------- */

function K({ children }: { children: ReactNode }) {
  return <span style={{ color: "#F7BA41" }}>{children}</span>;
}
function N({ children }: { children: ReactNode }) {
  return <span style={{ color: "#ADD6D8" }}>{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span style={{ color: "#F8F2E1" }}>{`"${children}"`}</span>;
}

const preStyle: CSSProperties = {
  margin: 0,
  padding: "18px 20px",
  background: "#123532",
  fontFamily: studioFonts.mono,
  fontSize: 12,
  lineHeight: 1.7,
  color: "rgba(255,255,255,.5)",
  overflowX: "auto",
};

/* -------------------------------------------------------------------------- */
/*  Endpoint reference cards                                                    */
/* -------------------------------------------------------------------------- */

const refCards: { label: string; code: string; desc: string }[] = [
  { label: "List", code: "GET /api/articles?populate=*", desc: "All published articles, for the blog index page." },
  { label: "Detail", code: "?filters[slug][$eq]=…", desc: "One page by its URL slug — what each blog page requests." },
  { label: "Slugs", code: "?fields[0]=slug", desc: "Just slugs, so the site can pre-build every page." },
];

/* -------------------------------------------------------------------------- */

export default function DeliveryApiScreen() {
  const { tips, toast } = useStudio();

  const copyMain = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(mainUrl).catch(() => {});
    }
    toast("Copied");
  };

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Delivery API"
        subtitle="How flarize.com reads published content. Read-only, public — drafts never appear."
      />

      {tips && (
        <TipBanner mb={14}>
          The <b style={{ color: studioColors.tealDeep }}>output</b> of the whole system. The response below is live — it
          reflects the newest published article. This is why labels are renamable but{" "}
          <b style={{ color: studioColors.tealDeep }}>keys are fixed</b>: the keys are the contract.
        </TipBanner>
      )}

      {/* Main endpoint card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          className="flex flex-wrap items-center"
          style={{ gap: 10, padding: "12px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}
        >
          <span
            style={{
              fontFamily: studioFonts.mono,
              fontSize: 11.5,
              fontWeight: 700,
              color: "#0A6B31",
              background: "rgba(195,223,189,.6)",
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            GET
          </span>
          <code
            style={{
              fontFamily: studioFonts.mono,
              fontSize: 12.5,
              color: studioColors.tealDeep,
              wordBreak: "break-all",
              flex: 1,
              minWidth: 220,
            }}
          >
            {mainUrl}
          </code>
          <button
            type="button"
            onClick={copyMain}
            className="inline-flex items-center transition-colors hover:bg-[rgba(7,74,77,0.05)]"
            style={{
              gap: 6,
              height: 30,
              padding: "0 12px",
              borderRadius: 10,
              border: "none",
              background: "#ffffff",
              boxShadow: `inset 0 0 0 1px ${studioColors.teal}`,
              color: studioColors.teal,
              fontFamily: "var(--font-switzer)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Copy
          </button>
        </div>

        <pre style={preStyle}>
{"{\n  "}<K>{`"data"`}</K>{": [{\n    "}<K>{`"id"`}</K>{": "}<N>12</N>{",\n    "}
<K>{`"documentId"`}</K>{": "}<S>{preview.docId}</S>{",\n    "}
<K>{`"title"`}</K>{": "}<S>{preview.title}</S>{",\n    "}
<K>{`"slug"`}</K>{": "}<S>{preview.slug}</S>{",\n    "}
<K>{`"excerpt"`}</K>{": "}<S>{preview.excerpt}</S>{",\n    "}
<K>{`"readTime"`}</K>{": "}<N>{preview.readTime}</N>{",\n    "}
<K>{`"coverImage"`}</K>{": { "}<K>{`"url"`}</K>{": "}<S>{preview.coverUrl}</S>{", "}<K>{`"alternativeText"`}</K>{": "}<S>{preview.coverAlt}</S>{" },\n    "}
<K>{`"categories"`}</K>{": [{ "}<K>{`"name"`}</K>{": "}<S>{preview.cat}</S>{" }],\n    "}
<K>{`"seo"`}</K>{": { "}<K>{`"metaTitle"`}</K>{": "}<S>{preview.mt}</S>{" },\n    "}
<K>{`"publishedAt"`}</K>{": "}<S>{preview.pubAt}</S>{"\n  }],\n  "}
<K>{`"meta"`}</K>{": { "}<K>{`"pagination"`}</K>{": { "}<K>{`"page"`}</K>{": "}<N>1</N>{", "}<K>{`"pageSize"`}</K>{": "}<N>25</N>{", "}<K>{`"total"`}</K>{": "}<N>{preview.total}</N>{" } }\n}"}
        </pre>
      </div>

      {/* Endpoint reference cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(280px,100%),1fr))", gap: 14 }}>
        {refCards.map((c) => (
          <div
            key={c.label}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: studioColors.mutedGray,
                fontWeight: 600,
                marginBottom: 7,
              }}
            >
              {c.label}
            </div>
            <code style={{ fontFamily: studioFonts.mono, fontSize: 11.5, color: "#074A4D" }}>{c.code}</code>
            <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 7, lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
