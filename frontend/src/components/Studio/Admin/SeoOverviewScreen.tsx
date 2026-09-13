"use client";

// src/components/Studio/Admin/SeoOverviewScreen.tsx
//
// SEO overview (§6.7, screen 07): every page, FAQ and job with its validity
// indicator, worst first. Rows open the record's own editor — this screen
// finds the gaps; the editors close them. No scoring, by design.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { EmptyState, ErrorBox, FilterSelect, ListTable, Pill, StateRow, Td, Th, Toolbar } from "../shared/listing";
import { getSeoOverview, type SeoOverview, type SeoOverviewRow, type SeoRecordKind } from "@/services/adminService";
import type { SeoStatus } from "@/services/faqService";
import type { StudioModule } from "@/services/studioService";

const KIND_LABEL: Record<SeoRecordKind, string> = { page: "Page", faq: "FAQ", job: "Job" };
const COLS = 6;

/** The module that owns each record kind — where its SEO is actually edited. */
const KIND_MODULE: Record<SeoRecordKind, StudioModule> = { page: "pages", faq: "faqs", job: "job_positions" };

function editorHref(r: SeoOverviewRow): string {
  if (r.kind === "page") return `/studio/pages/${r.id}`;
  if (r.kind === "faq") return `/studio/faqs/${r.id}`;
  return `/studio/careers/positions/${r.id}`;
}

export default function SeoOverviewScreen() {
  const router = useRouter();
  const { tips, can } = useStudio();
  const [data, setData] = useState<SeoOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<SeoRecordKind | "">("");
  const [status, setStatus] = useState<SeoStatus | "">("");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setError(null);
    getSeoOverview({ kind, seo_status: status })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load SEO overview"));
  }, [kind, status]);
  useEffect(load, [load]);

  const q = search.trim().toLowerCase();
  const rows = (data?.results ?? []).filter((r) => !q || r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q));

  return (
    <>
      <PageHeader title="SEO" subtitle="Where titles, descriptions and structured data are missing or over length, across every record that publishes a URL." />
      {tips && <TipBanner>A red row will misbehave in search results; amber is length advice. Open the row to fix it in the record&apos;s own editor — FAQPage and JobPosting schema are generated, never typed.</TipBanner>}
      {error && <ErrorBox message={error} onRetry={load} />}

      {data && (
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
          {(["error", "warning", "ok"] as SeoStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(status === s ? "" : s)}
              className="flex items-center gap-2"
              style={{ border: "none", borderRadius: 12, padding: "10px 14px", cursor: "pointer", background: "#ffffff", boxShadow: status === s ? "inset 0 0 0 1.5px #074A4D" : `inset 0 0 0 1px ${studioColors.ring}`, fontFamily: "var(--font-switzer)" }}
            >
              <Pill status={s} size="sm" />
              <span style={{ fontWeight: 700, fontSize: 15, color: studioColors.tealDeep, fontFamily: studioFonts.num }}>{data.counts[s]}</span>
            </button>
          ))}
        </div>
      )}

      <Toolbar search={search} onSearch={setSearch} placeholder="Search by name or URL…" filtering={Boolean(kind || status || search)} onClear={() => { setKind(""); setStatus(""); setSearch(""); }}>
        <FilterSelect value={kind} onChange={(v) => setKind(v as SeoRecordKind | "")} ariaLabel="Filter by type" width={140}>
          <option value="">All types</option>
          <option value="page">Pages</option>
          <option value="faq">FAQs</option>
          <option value="job">Jobs</option>
        </FilterSelect>
      </Toolbar>

      <ListTable
        minWidth={860}
        head={
          <>
            <Th>Record</Th>
            <Th>Type</Th>
            <Th>SEO title</Th>
            <Th>Description</Th>
            <Th>Schema</Th>
            <Th>Status</Th>
          </>
        }
      >
        {data === null && !error && <StateRow colSpan={COLS}>Loading…</StateRow>}
        {data && rows.length === 0 && (
          <StateRow colSpan={COLS}>
            <EmptyState title="Nothing to show" hint={status === "error" ? "No records need attention." : "Try widening the filters."} />
          </StateRow>
        )}
        {rows.map((r) => {
          // SEO is edited inside each record's own editor, so a row only opens
          // when this user can reach that module; otherwise it reads as a plain
          // report line rather than a link into a 403.
          const openable = can(KIND_MODULE[r.kind]);
          return (
          <tr
            key={`${r.kind}-${r.id}`}
            className={openable ? "cursor-pointer transition-colors hover:bg-[rgba(7,74,77,0.03)]" : undefined}
            title={openable ? undefined : "Edited from a module your role does not include"}
            onClick={openable ? () => router.push(editorHref(r)) : undefined}
          >
            <Td>
              <div style={{ fontWeight: 600, color: studioColors.tealDeep, maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
              <div style={{ fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>{r.path}</div>
            </Td>
            <Td>
              <span style={{ fontSize: 12.5 }}>{KIND_LABEL[r.kind]}</span>
              <span style={{ fontSize: 11, color: studioColors.faintGray, marginLeft: 6 }}>{r.record_status}</span>
            </Td>
            <Td>
              <Cell text={r.seo_title} max={60} />
            </Td>
            <Td>
              <Cell text={r.meta_description} max={160} />
            </Td>
            <Td mono>{r.schema_type === "none" ? "—" : r.schema_type}</Td>
            <Td>
              <div className="flex items-center">
                <Pill status={r.seo_status} size="sm" />
                {r.issues.length > 0 && (
                  <span title={r.issues.map((i) => i.message).join("\n")} style={{ fontSize: 11.5, color: studioColors.mutedGray, marginLeft: 6 }}>
                    {r.issues.length}
                  </span>
                )}
              </div>
            </Td>
          </tr>
          );
        })}
      </ListTable>
    </>
  );
}

function Cell({ text, max }: { text: string; max: number }) {
  if (!text) return <span style={{ color: studioColors.danger, fontSize: 12.5 }}>Missing</span>;
  const over = text.length > max;
  return (
    <div>
      <div style={{ fontSize: 12.5, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ fontSize: 10.5, color: over ? studioColors.amberInk : studioColors.faintGray, fontFamily: studioFonts.mono }}>{text.length} / {max}</div>
    </div>
  );
}
