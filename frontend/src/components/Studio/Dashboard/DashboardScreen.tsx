"use client";

// src/components/Studio/Dashboard/DashboardScreen.tsx
//
// Dashboard — headline counts (each a shortcut into a filtered list) plus a
// "recently edited" table. All figures come from GET dashboard/ on the admin
// API, loaded once by StudioProvider.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill, thStyle, tdStyle } from "../shared/primitives";
import { statusPill, humanTime, studioColors, studioFonts } from "../shared/format";

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
  const { tips, dashboard, shellLoading, shellError } = useStudio();
  const router = useRouter();

  if (shellError) {
    return (
      <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
        <PageHeader title="Dashboard" subtitle="What’s live on flarize.com/blog and what’s still in progress." />
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load the dashboard: {shellError}
        </div>
      </section>
    );
  }

  if (shellLoading || !dashboard) {
    return (
      <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
        <PageHeader title="Dashboard" subtitle="What’s live on flarize.com/blog and what’s still in progress." />
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      </section>
    );
  }

  const { counts, recent_entries: recent } = dashboard;
  const now = Date.now();

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader title="Dashboard" subtitle="What’s live on flarize.com/blog and what’s still in progress." />

      {tips && (
        <TipBanner>
          Every count is a shortcut into a filtered <b style={{ color: studioColors.tealDeep }}>Entries</b> list.{" "}
          <b style={{ color: studioColors.tealDeep }}>Published</b> is live,{" "}
          <b style={{ color: studioColors.tealDeep }}>Draft</b> is invisible to the site.
        </TipBanner>
      )}

      <div className="mb-4 grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        <StatCard href="/studio/entries" label="Published" value={counts.entries_published} sub="live on the website now" gold />
        <StatCard href="/studio/entries" label="Drafts" value={counts.entries_draft} sub="not yet visible publicly" />
        <StatCard href="/studio/collections" label="Collections" value={counts.collections} sub={`${counts.templates} templates`} />
        <StatCard href="/studio/media" label="Media assets" value={counts.media_assets} sub="in the shared library" />
      </div>

      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden" }}>
        <div className="flex items-center" style={{ padding: "13px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep }}>Recently edited</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>latest updates</span>
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
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, fontSize: 13, color: studioColors.mutedGray }}>
                    No entries yet — create the first one from “+ New entry”.
                  </td>
                </tr>
              )}
              {recent.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => router.push(`/studio/entries/${e.id}`)}
                  className="cursor-pointer hover:bg-[rgba(248,242,225,0.5)]"
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{e.title}</div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: studioColors.bodyGray }}>{e.collection_name}</td>
                  <td style={tdStyle}>
                    {e.template_slug ? (
                      <span style={{ fontFamily: studioFonts.mono, fontSize: 11.5, color: studioColors.bodyGray, background: "rgba(248,242,225,.9)", padding: "2px 8px", borderRadius: 6 }}>
                        {e.template_slug}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12.5, color: studioColors.faintGray }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <StatusPill pill={statusPill(e.status)} />
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12.5, color: studioColors.faintGray }}>
                    {humanTime(Date.parse(e.updated_at), now)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
