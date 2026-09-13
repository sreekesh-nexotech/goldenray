"use client";

// src/components/Studio/Dashboard/DashboardScreen.tsx
//
// Dashboard (§6.1) — one answer to "what needs attention?": headline counts
// (each a shortcut into the module), the four quick actions, and a recent-
// activity feed. CMS-owned counts come from GET dashboard/ via StudioProvider;
// leads and applications live on the goldenray service and are fetched here
// only when the user's role can see them. No analytics — by design.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { GhostButton, GoldButton, PageHeader, TipBanner } from "../shared/primitives";
import { humanTime, studioColors, studioFonts } from "../shared/format";
import { Pill } from "../shared/listing";
import { getCareerApplications } from "@/services/careerApplicationService";
import { getContactEnquiries } from "@/services/basicContactService";

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

const KIND_LABEL = { faq: "FAQ", job: "Job", blog: "Blog", lead: "Lead", application: "Applied" } as const;

/** One feed line; the CMS supplies faq/job/blog, this screen adds lead/application. */
interface ActivityLine {
  kind: keyof typeof KIND_LABEL;
  label: string;
  detail: string;
  href: string;
  actor: string | null;
  at: string;
  /** Pill status; the CMS lines derive it from `detail`. */
  status: string;
}

export default function DashboardScreen() {
  const { tips, dashboard, shellLoading, shellError, can } = useStudio();
  const router = useRouter();

  // Cross-service counts, only for roles that can see the modules.
  const [newApps, setNewApps] = useState<number | null>(null);
  const [totalApps, setTotalApps] = useState<number | null>(null);
  const [leads, setLeads] = useState<number | null>(null);
  // §6.1 lists "lead received" and "application received" in recent activity;
  // both live on the goldenray service, so their lines are built here and
  // merged with the CMS feed by time.
  const [crossActivity, setCrossActivity] = useState<ActivityLine[]>([]);

  useEffect(() => {
    if (can("applications")) {
      getCareerApplications()
        .then((rows) => {
          setTotalApps(rows.length);
          setNewApps(rows.filter((r) => r.status === "new").length);
          setCrossActivity((prev) => [
            ...prev.filter((a) => a.kind !== "application"),
            ...rows.slice(0, 5).map<ActivityLine>((r) => ({
              kind: "application",
              label: r.full_name,
              detail: `Application received · ${r.display_position}`,
              href: "/studio/careers/applications",
              actor: null,
              at: r.created_at,
              status: r.status,
            })),
          ]);
        })
        .catch(() => {});
    }
    if (can("leads")) {
      getContactEnquiries()
        .then((rows) => {
          setLeads(rows.length);
          setCrossActivity((prev) => [
            ...prev.filter((a) => a.kind !== "lead"),
            ...rows.slice(0, 5).map<ActivityLine>((r) => ({
              kind: "lead",
              label: r.name,
              detail: `Lead received · ${r.phone_number}`,
              href: "/studio/enquiries",
              actor: null,
              at: r.created_at,
              status: "new",
            })),
          ]);
        })
        .catch(() => {});
    }
  }, [can]);

  const frame = (body: React.ReactNode) => (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        title="Dashboard"
        subtitle="What needs attention across the website, careers and leads."
        actions={
          <>
            {can("faqs", "create") && <GhostButton onClick={() => router.push("/studio/faqs/new")}>+ Add FAQ</GhostButton>}
            {can("job_positions", "create") && <GhostButton onClick={() => router.push("/studio/careers/positions/new")}>+ Add job</GhostButton>}
            {can("leads") && <GhostButton onClick={() => router.push("/studio/enquiries")}>View leads</GhostButton>}
            {can("applications") && <GoldButton onClick={() => router.push("/studio/careers/applications")}>View applications</GoldButton>}
          </>
        }
      />
      {body}
    </section>
  );

  if (shellError) {
    return frame(
      <div role="alert" style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}>
        Couldn’t load the dashboard: {shellError}
      </div>
    );
  }
  if (shellLoading || !dashboard) {
    return frame(<div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>);
  }

  const { counts, recent_activity } = dashboard;
  const now = Date.now();
  const activity: ActivityLine[] = [
    ...recent_activity.map<ActivityLine>((a) => ({ ...a, status: a.detail.split(" · ")[0].toLowerCase() })),
    ...crossActivity,
  ]
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, 10);

  return frame(
    <>
      {tips && (
        <TipBanner>
          Every count is a shortcut. Gold tiles are things people are waiting on — new applications and leads —
          and the rest is what is live or still in draft.
        </TipBanner>
      )}

      <div className="mb-4 grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))" }}>
        {can("applications") && (
          <StatCard href="/studio/careers/applications" label="New applications" value={newApps ?? "…"} sub={totalApps !== null ? `${totalApps} in the queue` : "loading the queue"} gold />
        )}
        {can("leads") && <StatCard href="/studio/enquiries" label="Leads" value={leads ?? "…"} sub="contact enquiries received" gold={!can("applications")} />}
        {can("blogs") && <StatCard href="/studio/entries" label="Published blogs" value={counts.entries_published} sub={`${counts.entries_draft} in draft`} />}
        {can("job_positions") && <StatCard href="/studio/careers/positions" label="Active jobs" value={counts.positions_active} sub={`${counts.positions_draft} in draft · ${counts.departments} departments`} />}
        {can("faqs") && <StatCard href="/studio/faqs" label="FAQs live" value={counts.faqs_published} sub={`${counts.faqs_draft} in draft`} />}
        {can("seo") && <StatCard href="/studio/seo" label="SEO to fix" value={counts.pages_seo_issues} sub={`of ${counts.pages} pages need attention`} />}
        {can("media") && <StatCard href="/studio/media" label="Media assets" value={counts.media_assets} sub="in the shared library" />}
      </div>

      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden" }}>
        <div className="flex items-center" style={{ padding: "13px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep }}>Recent activity</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>leads · applications · content · FAQs · jobs</span>
        </div>
        <div>
          {activity.length === 0 && (
            <div style={{ padding: "22px 16px", fontSize: 13, color: studioColors.mutedGray }}>Nothing has changed yet.</div>
          )}
          {activity.map((a, i) => (
            <button
              key={`${a.kind}-${a.href}-${i}`}
              type="button"
              onClick={() => router.push(a.href)}
              className="flex w-full items-center gap-3 text-left transition-colors hover:bg-[rgba(248,242,225,0.5)]"
              style={{ border: "none", background: "transparent", padding: "11px 16px", cursor: "pointer", boxShadow: "inset 0 -1px 0 rgba(229,231,235,.7)", fontFamily: "var(--font-switzer)" }}
            >
              <span style={{ width: 52, flex: "none", fontSize: 10.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: studioColors.teal }}>{KIND_LABEL[a.kind]}</span>
              <span className="min-w-0" style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 600, fontSize: 13.5, color: studioColors.tealDeep, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.label}</span>
                <span style={{ display: "block", fontSize: 11.5, color: studioColors.faintGray }}>{a.detail}{a.actor ? ` · ${a.actor}` : ""}</span>
              </span>
              <Pill status={a.status} size="sm" />
              <span style={{ fontSize: 12, color: studioColors.faintGray, whiteSpace: "nowrap" }}>{humanTime(Date.parse(a.at), now)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
