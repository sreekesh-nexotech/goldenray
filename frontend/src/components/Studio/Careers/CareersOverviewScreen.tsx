"use client";

// src/components/Studio/Careers/CareersOverviewScreen.tsx
//
// Careers operational dashboard (§6.10): counts, open positions, recent
// applications, two quick actions. Positions come from the CMS; applications
// come from the main goldenray API, so the two loads run independently and
// each half renders as soon as it lands.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { Card, CardHeader, CardTitle, GhostButton, GoldButton, PageHeader, SectionIcon } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { ErrorBox, Pill, fmtDate } from "../shared/listing";
import { getCareersOverview, type CareersOverview } from "@/services/careersService";
import { getCareerApplications, type CareerApplication } from "@/services/careerApplicationService";

function StatTile({ label, value, sub, href, gold }: { label: string; value: number | string; sub?: string; href?: string; gold?: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={href ? () => router.push(href) : undefined}
      className={href ? "transition-shadow hover:shadow-[inset_0_0_0_1px_#074A4D]" : ""}
      style={{ textAlign: "left", border: "none", cursor: href ? "pointer" : "default", background: gold ? studioColors.gold : "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${gold ? studioColors.gold : studioColors.ring}`, padding: "16px 18px", fontFamily: "var(--font-switzer)" }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: gold ? studioColors.goldInk : studioColors.mutedGray }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, marginTop: 6, color: gold ? studioColors.goldInk : studioColors.tealDeep, fontFamily: studioFonts.num }}>{value}</div>
      {sub && <div style={{ fontSize: 12, marginTop: 4, color: gold ? "rgba(39,34,24,.7)" : studioColors.faintGray }}>{sub}</div>}
    </button>
  );
}

export default function CareersOverviewScreen() {
  const router = useRouter();
  const { can } = useStudio();
  const [overview, setOverview] = useState<CareersOverview | null>(null);
  const [apps, setApps] = useState<CareerApplication[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCareersOverview().then(setOverview).catch((e) => setError(e instanceof Error ? e.message : "Failed to load careers overview"));
    if (can("applications")) getCareerApplications().then(setApps).catch(() => setApps([]));
  }, [can]);

  const weekAgo = Date.now() - 7 * 86400000;
  const newApps = apps?.filter((a) => new Date(a.created_at).getTime() >= weekAgo).length ?? 0;

  return (
    <>
      <PageHeader
        title="Careers"
        subtitle="Open positions, the application queue and departments, at a glance."
        actions={
          <>
            {can("applications") && <GhostButton onClick={() => router.push("/studio/careers/applications")}>View applications</GhostButton>}
            {can("job_positions", "create") && <GoldButton onClick={() => router.push("/studio/careers/positions/new")}>+ Add position</GoldButton>}
          </>
        }
      />

      {error && <ErrorBox message={error} />}

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", marginBottom: 20 }}>
        <StatTile label="Active positions" value={overview?.counts.active_positions ?? "…"} sub={overview ? `${overview.counts.draft_positions} draft · ${overview.counts.closed_positions} closed` : undefined} href="/studio/careers/positions" gold />
        <StatTile label="Total applications" value={apps ? apps.length : "…"} href={can("applications") ? "/studio/careers/applications" : undefined} />
        <StatTile label="New this week" value={apps ? newApps : "…"} sub="applications received" href={can("applications") ? "/studio/careers/applications" : undefined} />
        <StatTile label="Departments" value={overview?.counts.departments ?? "…"} sub="active" href={can("departments") ? "/studio/careers/departments" : undefined} />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <Card>
          <CardHeader>
            <SectionIcon>
              <rect x="2.5" y="7" width="19" height="13.5" rx="2.5" />
              <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
            </SectionIcon>
            <CardTitle>Open positions</CardTitle>
            <button type="button" onClick={() => router.push("/studio/careers/positions")} style={{ marginLeft: "auto", border: "none", background: "transparent", color: studioColors.teal, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              All positions →
            </button>
          </CardHeader>
          <div>
            {overview === null && !error && <div style={{ padding: 16, fontSize: 13, color: studioColors.mutedGray }}>Loading…</div>}
            {overview && overview.open_positions.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: studioColors.mutedGray, textAlign: "center" }}>Nothing is published right now.</div>
            )}
            {overview?.open_positions.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => router.push(`/studio/careers/positions/${p.id}`)}
                className="flex w-full items-center gap-3 text-left transition-colors hover:bg-[rgba(7,74,77,0.03)]"
                style={{ border: "none", background: "transparent", padding: "11px 16px", cursor: "pointer", boxShadow: `inset 0 -1px 0 rgba(229,231,235,.7)`, fontFamily: "var(--font-switzer)" }}
              >
                <div className="min-w-0" style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: studioColors.tealDeep }}>{p.title}</div>
                  <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>{p.department_name} · {p.location} · {p.employment_type_label}</div>
                </div>
                <span style={{ fontSize: 11.5, color: studioColors.mutedGray, fontFamily: studioFonts.num }}>{fmtDate(p.published_at)}</span>
              </button>
            ))}
          </div>
        </Card>

        {can("applications") && (
          <Card>
            <CardHeader>
              <SectionIcon>
                <path d="M6 3.5h8l4 4v13H6Z" />
                <path d="M14 3.5v4h4" />
              </SectionIcon>
              <CardTitle>Recent applications</CardTitle>
              <button type="button" onClick={() => router.push("/studio/careers/applications")} style={{ marginLeft: "auto", border: "none", background: "transparent", color: studioColors.teal, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                Queue →
              </button>
            </CardHeader>
            <div>
              {apps === null && <div style={{ padding: 16, fontSize: 13, color: studioColors.mutedGray }}>Loading…</div>}
              {apps && apps.length === 0 && <div style={{ padding: 20, fontSize: 13, color: studioColors.mutedGray, textAlign: "center" }}>No applications yet.</div>}
              {apps?.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center gap-3" style={{ padding: "11px 16px", boxShadow: `inset 0 -1px 0 rgba(229,231,235,.7)` }}>
                  <div className="min-w-0" style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: studioColors.tealDeep }}>{a.full_name}</div>
                    <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>{a.position} · {a.total_experience}</div>
                  </div>
                  <Pill status={(a as CareerApplication & { status?: string }).status ?? "new"} size="sm" />
                  <span style={{ fontSize: 11.5, color: studioColors.mutedGray, fontFamily: studioFonts.num }}>{fmtDate(a.created_at)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
