"use client";

// src/components/Studio/Dashboard/DashboardScreen.tsx
//
// Dashboard — headline counts (each a shortcut into a filtered list) plus a
// "recently edited" table. All figures are derived from the static entries.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { entries, collections, assets } from "@/data/studio";
import { STUDIO_NOW } from "@/data/studio/constants";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill, thStyle, tdStyle } from "../shared/primitives";
import { statusPill, humanTime, studioColors, studioFonts } from "../shared/format";

const published = entries.filter((e) => e.status === "published").length;
const drafts = entries.filter((e) => e.status === "draft").length;
const folders = new Set(assets.map((a) => a.folder)).size;
const collNames = collections.map((c) => c.name).join(", ");

const recent = entries
  .filter((e) => e._ts >= STUDIO_NOW - 7 * 24 * 3600e3)
  .sort((a, b) => b._ts - a._ts);

const collName = (id: string) => collections.find((c) => c.id === id)?.name ?? id;

function StatCard({
  href,
  label,
  value,
  sub,
  gold = false,
}: {
  href: string;
  label: string;
  value: number | string;
  sub: string;
  gold?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group text-left"
      style={{
        border: "none",
        cursor: "pointer",
        background: gold ? studioColors.gold : "#ffffff",
        borderRadius: 16,
        boxShadow: gold ? "none" : `inset 0 0 0 1px ${studioColors.ring}`,
        padding: "16px 18px",
        fontFamily: "var(--font-switzer)",
        transition: gold ? "filter .12s" : "box-shadow .12s",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (gold) e.currentTarget.style.filter = "brightness(.96)";
        else e.currentTarget.style.boxShadow = "inset 0 0 0 1px #074A4D";
      }}
      onMouseLeave={(e) => {
        if (gold) e.currentTarget.style.filter = "none";
        else e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${studioColors.ring}`;
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: gold ? "rgba(39,34,24,.62)" : studioColors.mutedGray }}>
        {label}
      </div>
      <div style={{ fontFamily: studioFonts.num, fontWeight: 700, fontSize: 30, letterSpacing: "-.5px", color: gold ? "#272218" : studioColors.tealDeep, marginTop: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 12.5, color: gold ? "rgba(39,34,24,.75)" : studioColors.bodyGray, marginTop: 2 }}>{sub}</div>
    </Link>
  );
}

export default function DashboardScreen() {
  const { tips } = useStudio();
  const router = useRouter();

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader title="Dashboard" subtitle="What’s live on flarize.com/blog and what’s still in progress." />

      {tips && (
        <TipBanner>
          Every count is a shortcut into a filtered <b style={{ color: studioColors.tealDeep }}>Entries</b> list.{" "}
          <b style={{ color: studioColors.tealDeep }}>Published</b> is live,{" "}
          <b style={{ color: studioColors.tealDeep }}>Draft</b> is invisible to the site,{" "}
          <b style={{ color: studioColors.tealDeep }}>Modified</b> is live but has unpublished edits.
        </TipBanner>
      )}

      <div className="mb-4 grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        <StatCard href="/studio/entries" label="Published" value={published} sub="live on the website now" gold />
        <StatCard href="/studio/entries" label="Drafts" value={drafts} sub="not yet visible publicly" />
        <StatCard href="/studio/collections" label="Collections" value={collections.length} sub={collNames} />
        <StatCard href="/studio/media" label="Media assets" value={assets.length} sub={`across ${folders} folders`} />
      </div>

      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden" }}>
        <div className="flex items-center" style={{ padding: "13px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep }}>Recently edited</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>last 7 days</span>
        </div>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Collection</th>
                <th style={thStyle}>Template</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => router.push(`/studio/entries/${e.id}`)}
                  className="cursor-pointer hover:bg-[rgba(248,242,225,0.5)]"
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{e.title}</div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: studioColors.bodyGray }}>{collName(e.coll)}</td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: studioFonts.mono, fontSize: 11.5, color: studioColors.bodyGray, background: "rgba(248,242,225,.9)", padding: "2px 8px", borderRadius: 6 }}>
                      {e.tpl}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <StatusPill pill={statusPill(e.status)} />
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12.5, color: studioColors.faintGray }}>{humanTime(e._ts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
