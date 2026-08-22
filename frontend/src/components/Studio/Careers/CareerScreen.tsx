"use client";

// src/components/Studio/Careers/CareerScreen.tsx
//
// Career — every application captured by the Careers page forms, read from
// GET job-applications/ on the main Flarize API (not the CMS admin API). The
// endpoint returns the full list newest-first with no pagination, so search,
// sort and paging are all done client-side — same shape as the Enquiries
// screen next door.

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useStudio } from "../shared/StudioContext";
import { DangerButton, PageHeader, TipBanner } from "../shared/primitives";
import { ConfirmDialog, DropdownMenu, Modal, ModalTitle, type MenuItem } from "../shared/overlays";
import { humanTime, studioColors, studioFonts } from "../shared/format";
import {
  deleteCareerApplication,
  getCareerApplications,
  type CareerApplication,
} from "@/services/careerApplicationService";

/* -------------------------------------------------------------------------- */
/*  Sorting + date helpers                                                     */
/* -------------------------------------------------------------------------- */

type SortKey = "newest" | "oldest" | "name";

const SORTS: { key: SortKey; label: string; long: string }[] = [
  { key: "newest", label: "Newest first", long: "newest first" },
  { key: "oldest", label: "Oldest first", long: "oldest first" },
  { key: "name", label: "Name A–Z", long: "name A–Z" },
];

const PAGE_SIZE = 25;

// Timestamps arrive as UTC ISO strings and are rendered in the viewer's local
// timezone (IST for the team). Rows only render after the client fetch, so
// there is no server/client formatting mismatch.
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

function localZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local time";
  } catch {
    return "local time";
  }
}

/** Start of "today" in local time, as an epoch value. */
function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                      */
/* -------------------------------------------------------------------------- */

type Row = CareerApplication & { ts: number };

/**
 * Where the resume / portfolio actually download from.
 *
 * `resume_download_url` is an /api/ route that streams the file as an
 * attachment; the plain `resume` field is a MEDIA_URL path that only resolves
 * while the backend runs with DEBUG on. Prefer the former, fall back to the
 * latter so a backend that predates the download route still works locally.
 */
function fileHref(row: Row, kind: "resume" | "portfolio"): string | null {
  return kind === "resume"
    ? row.resume_download_url || row.resume
    : row.portfolio_download_url || row.portfolio_file;
}

export default function CareerScreen() {
  const { tips, toast } = useStudio();

  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [q, setQ] = useState("");
  const [search, setSearch] = useState(""); // debounced copy of q
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [position, setPosition] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [menuAt, setMenuAt] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState<Row | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sortBtn = useRef<HTMLButtonElement>(null);

  const load = async (): Promise<Row[] | null> => {
    try {
      const data = await getCareerApplications();
      const mapped = data.map((a) => ({ ...a, ts: Date.parse(a.created_at) }));
      setRows(mapped);
      setNow(Date.now());
      setLoadError(null);
      return mapped;
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load applications");
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    getCareerApplications()
      .then((data) => {
        if (cancelled) return;
        setRows(data.map((a) => ({ ...a, ts: Date.parse(a.created_at) })));
        setNow(Date.now());
        setLoadError(null);
      })
      .catch(
        (err) =>
          !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load applications")
      );
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, position]);

  const refresh = async () => {
    setRefreshing(true);
    const fresh = await load();
    setRefreshing(false);
    if (fresh) toast(`${fresh.length} ${fresh.length === 1 ? "application" : "applications"} loaded`);
    else toast("Couldn’t refresh applications", "error");
  };

  const doDelete = async () => {
    const target = confirmDelete;
    if (!target) return;
    setDeleting(true);
    try {
      await deleteCareerApplication(target.id);
      // Drop it locally rather than refetching — the list is unpaginated and a
      // full reload would flash the whole table for a single-row change.
      setRows((prev) => (prev ? prev.filter((r) => r.id !== target.id) : prev));
      setOpen((prev) => (prev?.id === target.id ? null : prev));
      setConfirmDelete(null);
      toast(`Application from ${target.full_name?.trim() || `#${target.id}`} deleted`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn’t delete the application", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* --- derived data -------------------------------------------------------- */

  const all = useMemo(() => rows ?? [], [rows]);

  const stats = useMemo(() => {
    const dayStart = startOfToday();
    const weekStart = dayStart - 6 * 86400000; // today + the previous 6 days
    return {
      total: all.length,
      today: all.filter((r) => r.ts >= dayStart).length,
      week: all.filter((r) => r.ts >= weekStart).length,
    };
  }, [all]);

  // Positions actually present in the data — the model can grow new openings
  // without this screen needing a change.
  const positions = useMemo(() => {
    const seen = new Set<string>();
    for (const r of all) if (r.position) seen.add(r.position);
    return [...seen].sort((a, b) => a.localeCompare(b));
  }, [all]);

  const filtered = useMemo(() => {
    let list = position === "all" ? all : all.filter((r) => r.position === position);
    if (search) {
      list = list.filter((r) =>
        [r.full_name, r.email, r.phone, r.position, r.location, r.current_company]
          .some((v) => (v || "").toLowerCase().includes(search))
      );
    }
    const sorted = [...list];
    if (sortKey === "newest") sorted.sort((a, b) => b.ts - a.ts);
    else if (sortKey === "oldest") sorted.sort((a, b) => a.ts - b.ts);
    else sorted.sort((a, b) => a.full_name.localeCompare(b.full_name));
    return sorted;
  }, [all, search, sortKey, position]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortDef = SORTS.find((s) => s.key === sortKey)!;
  const loading = rows === null && loadError === null;
  const filtering = search !== "" || position !== "all";
  const showing =
    total === 0
      ? "Showing 0 of 0"
      : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`;

  const menuItems: MenuItem[] = SORTS.map((s) => ({
    label: s.label,
    note: s.key === sortKey ? "✓" : undefined,
    onClick: () => setSortKey(s.key),
  }));

  const openSortMenu = () => {
    const el = sortBtn.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuAt({ top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - 216 - 8) });
  };

  /* --- render -------------------------------------------------------------- */

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        mb={14}
        title="Career"
        titleSuffix={
          rows !== null ? (
            <span style={{ fontWeight: 500, fontSize: 15, color: studioColors.faintGray }}>
              {" "}
              · {stats.total} {stats.total === 1 ? "application" : "applications"}
            </span>
          ) : undefined
        }
        subtitle="Every application submitted through the Careers page — candidate details, resume and time of submission."
        actions={
          <>
            <button
              ref={sortBtn}
              type="button"
              aria-haspopup="menu"
              onClick={openSortMenu}
              className="inline-flex items-center gap-[7px]"
              style={sortButtonStyle}
            >
              Sort: {sortDef.label}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={refreshing}
              className="inline-flex items-center gap-[7px] transition-[filter] hover:brightness-[.96]"
              style={{ ...refreshButtonStyle, opacity: refreshing ? 0.6 : 1, cursor: refreshing ? "default" : "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-2.6-6.4" />
                <path d="M21 3v6h-6" />
              </svg>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </>
        }
      />

      {tips && (
        <TipBanner mb={14}>
          These come straight from the <b style={{ color: studioColors.tealDeep }}>Careers page</b> application forms.
          Open a row to see the full profile and download the resume. Times are shown in your local timezone (
          {localZone()}).
        </TipBanner>
      )}

      {/* Summary tiles */}
      <div className="mb-3.5 grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
        <StatTile label="Total applications" value={rows === null ? "—" : String(stats.total)} />
        <StatTile label="Today" value={rows === null ? "—" : String(stats.today)} />
        <StatTile label="Last 7 days" value={rows === null ? "—" : String(stats.week)} />
      </div>

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load applications: {loadError}
        </div>
      ) : loading ? (
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      ) : (
        <div
          aria-busy={refreshing}
          style={{
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
            opacity: refreshing ? 0.6 : 1,
            transition: "opacity .15s",
          }}
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2" style={{ padding: "11px 14px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}>
            <div
              className="flex items-center gap-2"
              style={{
                flex: 1,
                minWidth: 200,
                background: "rgba(248,242,225,.6)",
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
                placeholder="Search by name, email, phone, position or location…"
                aria-label="Search career applications"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  background: "none",
                  outline: "none",
                  fontFamily: "var(--font-switzer)",
                  fontSize: 13.5,
                  color: studioColors.tealDeep,
                  height: "100%",
                }}
              />
            </div>
            {positions.length > 1 && (
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                aria-label="Filter by position"
                style={selectStyle}
              >
                <option value="all">All positions</option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
            {filtering && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setPosition("all");
                }}
                className="inline-flex items-center hover:bg-[rgba(7,74,77,0.05)]"
                style={clearButtonStyle}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr>
                  {["Candidate", "Position", "Phone", "Experience", "Date", "Received", "Resume"].map((h) => (
                    <th key={h} style={headStyle}>
                      {h}
                    </th>
                  ))}
                  <th style={{ ...headStyle, textAlign: "right" }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => {
                  const valid = !Number.isNaN(r.ts);
                  const d = valid ? new Date(r.ts) : null;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setOpen(r)}
                      className="cursor-pointer hover:bg-[rgba(248,242,225,0.5)]"
                    >
                      <td style={cellStyle}>
                        <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>
                          {r.full_name?.trim() || "—"}
                        </div>
                        <div style={{ fontSize: 12, color: studioColors.bodyGray, marginTop: 2 }}>
                          {r.email || "—"}
                        </div>
                        <div style={{ fontFamily: studioFonts.mono, fontSize: 11, color: studioColors.faintGray, marginTop: 2 }}>
                          #{r.id}
                          {r.location ? ` · ${r.location}` : ""}
                        </div>
                      </td>
                      <td style={{ ...cellStyle, fontSize: 13, color: studioColors.bodyGray }}>
                        {r.position || "—"}
                      </td>
                      <td style={cellStyle}>
                        <a
                          href={`tel:${r.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ fontFamily: studioFonts.mono, fontSize: 13, color: studioColors.teal, textDecoration: "none" }}
                        >
                          {r.phone}
                        </a>
                      </td>
                      <td style={{ ...cellStyle, fontSize: 13, color: studioColors.bodyGray, whiteSpace: "nowrap" }}>
                        {r.total_experience || "—"}
                      </td>
                      <td style={{ ...cellStyle, fontSize: 13, color: studioColors.bodyGray, whiteSpace: "nowrap" }}>
                        {d ? dateFmt.format(d) : "—"}
                      </td>
                      <td style={{ ...cellStyle, fontSize: 12.5, color: studioColors.faintGray, whiteSpace: "nowrap" }}>
                        {valid ? humanTime(r.ts, now) : "—"}
                      </td>
                      <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                        {fileHref(r, "resume") ? (
                          <a
                            href={fileHref(r, "resume")!}
                            // The API sends Content-Disposition: attachment, so this
                            // downloads rather than navigating. _blank keeps the old
                            // MEDIA_URL fallback from replacing the Studio page.
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.teal, textDecoration: "none" }}
                          >
                            Download ↓
                          </a>
                        ) : (
                          <span style={{ fontSize: 12.5, color: studioColors.faintGray }}>—</span>
                        )}
                      </td>
                      <td style={{ ...cellStyle, whiteSpace: "nowrap", textAlign: "right" }}>
                        <button
                          type="button"
                          aria-label={`Delete application from ${r.full_name?.trim() || `#${r.id}`}`}
                          title="Delete application"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(r);
                          }}
                          className="inline-flex items-center justify-center hover:bg-[rgba(185,28,28,0.08)]"
                          style={rowDeleteStyle}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M8 6V4.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 4.5V6" />
                            <path d="M6 6v13.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty states */}
          {total === 0 && (
            <div style={{ padding: "44px 20px", textAlign: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={studioColors.hairline} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="7" width="19" height="13.5" rx="2.5" />
                <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
                <path d="M2.5 12.5h19" />
              </svg>
              <div style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep, marginTop: 8 }}>
                {filtering ? "No applications match" : "No applications yet"}
              </div>
              <div style={{ fontSize: 12.5, color: studioColors.bodyGray, marginTop: 3 }}>
                {filtering
                  ? "Try a different name, position or search term."
                  : "New submissions from the Careers page forms will appear here."}
              </div>
            </div>
          )}

          {/* Footer / pagination */}
          <div
            className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-2"
            style={{ padding: "10px 16px", color: studioColors.faintGray, fontSize: 12 }}
          >
            <span>{showing}</span>
            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2 max-md:w-full max-md:justify-between">
              <span className="min-w-0 truncate" style={{ fontFamily: studioFonts.mono, fontSize: 11 }}>
                {sortDef.long} · times in {localZone()}
              </span>
              {totalPages > 1 && (
                <div className="flex flex-none items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center"
                    style={{ ...pagerStyle, opacity: page <= 1 ? 0.45 : 1 }}
                  >
                    ‹ Prev
                  </button>
                  <span className="whitespace-nowrap" style={{ fontFamily: studioFonts.num, fontSize: 11.5, color: studioColors.bodyGray }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center"
                    style={{ ...pagerStyle, opacity: page >= totalPages ? 0.45 : 1 }}
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DropdownMenu
        open={menuAt !== null}
        onClose={() => setMenuAt(null)}
        top={menuAt?.top ?? 0}
        left={menuAt?.left ?? 0}
        items={menuItems}
      />

      <ApplicationDetail
        row={open}
        onClose={() => setOpen(null)}
        onDelete={(row) => setConfirmDelete(row)}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete application?"
        busy={deleting}
        busyLabel="Deleting…"
        onCancel={() => !deleting && setConfirmDelete(null)}
        onConfirm={() => void doDelete()}
      >
        {confirmDelete && (
          <>
            The application from{" "}
            <b style={{ color: studioColors.tealDeep }}>
              {confirmDelete.full_name?.trim() || `#${confirmDelete.id}`}
            </b>{" "}
            for {confirmDelete.position} will be removed permanently, along with the uploaded resume
            and portfolio. This can&#8217;t be undone.
          </>
        )}
      </ConfirmDialog>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Detail modal                                                               */
/* -------------------------------------------------------------------------- */

function ApplicationDetail({
  row,
  onClose,
  onDelete,
}: {
  row: Row | null;
  onClose: () => void;
  onDelete: (row: Row) => void;
}) {
  const valid = row !== null && !Number.isNaN(row.ts);
  const d = valid ? new Date(row!.ts) : null;

  return (
    <Modal open={row !== null} onClose={onClose} ariaLabel="Application details" width={680}>
      {row && (
        <>
          <div className="flex items-start justify-between gap-3">
            <div style={{ minWidth: 0 }}>
              <ModalTitle>{row.full_name?.trim() || "Application"}</ModalTitle>
              <div style={{ fontSize: 12.5, color: studioColors.bodyGray, marginTop: 3 }}>
                {row.position}
                {d ? ` · ${dateFmt.format(d)}, ${timeFmt.format(d)}` : ""}
                <span style={{ fontFamily: studioFonts.mono, color: studioColors.faintGray }}> · #{row.id}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" style={closeButtonStyle}>
              ✕
            </button>
          </div>

          <div style={{ maxHeight: "60vh", overflowY: "auto", marginTop: 16, paddingRight: 2 }}>
            <DetailSection title="Contact">
              <DetailRow label="Email">
                {row.email ? (
                  <a href={`mailto:${row.email}`} style={linkStyle}>
                    {row.email}
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Phone">
                {row.phone ? (
                  <a href={`tel:${row.phone}`} style={{ ...linkStyle, fontFamily: studioFonts.mono }}>
                    {row.phone}
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Location">{row.location}</DetailRow>
              <DetailRow label="LinkedIn">
                {row.linkedin ? (
                  <a href={row.linkedin} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    {row.linkedin}
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Portfolio site">
                {row.portfolio_website ? (
                  <a href={row.portfolio_website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    {row.portfolio_website}
                  </a>
                ) : null}
              </DetailRow>
            </DetailSection>

            <DetailSection title="Professional">
              <DetailRow label="Current company">{row.current_company}</DetailRow>
              <DetailRow label="Current role">{row.current_role}</DetailRow>
              <DetailRow label="Total experience">{row.total_experience}</DetailRow>
              <DetailRow label="Relevant experience">{row.relevant_experience}</DetailRow>
              <DetailRow label="Current salary">{row.current_salary}</DetailRow>
              <DetailRow label="Expected salary">{row.expected_salary}</DetailRow>
              <DetailRow label="Notice period">{row.notice_period}</DetailRow>
              <DetailRow label="Heard about us">{row.heard_about_us}</DetailRow>
            </DetailSection>

            <DetailSection title="Attachments">
              <DetailRow label="Resume">
                {fileHref(row, "resume") ? (
                  <a href={fileHref(row, "resume")!} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    Download ↓
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Portfolio file">
                {fileHref(row, "portfolio") ? (
                  <a href={fileHref(row, "portfolio")!} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    Download ↓
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Declaration">
                {row.declaration_accepted ? "Accepted" : "Not accepted"}
              </DetailRow>
            </DetailSection>
          </div>

          <div
            className="flex justify-end"
            style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${studioColors.ring}` }}
          >
            <DangerButton onClick={() => onDelete(row)}>Delete application</DangerButton>
          </div>
        </>
      )}
    </Modal>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: studioColors.mutedGray,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ background: "rgba(248,242,225,.4)", borderRadius: 12, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "4px 14px" }}>
        {children}
      </div>
    </div>
  );
}

/** One label/value line. Empty values render as an em dash, never a blank row. */
function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  const empty = children === null || children === undefined || children === "";
  return (
    <div
      className="flex flex-wrap gap-x-3 gap-y-0.5"
      style={{ padding: "9px 0", borderBottom: `1px solid rgba(229,231,235,.7)` }}
    >
      <div style={{ width: 168, flex: "none", fontSize: 12.5, color: studioColors.mutedGray }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: studioColors.tealDeep, wordBreak: "break-word" }}>
        {empty ? <span style={{ color: studioColors.faintGray }}>—</span> : children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Local pieces + styles                                                      */
/* -------------------------------------------------------------------------- */

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
        padding: "12px 15px",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 600, color: studioColors.mutedGray }}>
        {label}
      </div>
      <div style={{ fontFamily: studioFonts.num, fontSize: 24, fontWeight: 600, color: studioColors.tealDeep, marginTop: 4, lineHeight: 1.1 }}>
        {value}
      </div>
    </div>
  );
}

const headStyle: CSSProperties = {
  textAlign: "left",
  fontSize: 11,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: studioColors.mutedGray,
  fontWeight: 600,
  padding: "9px 16px",
  background: "rgba(248,242,225,.55)",
  borderBottom: `1px solid ${studioColors.ring}`,
  fontFamily: "var(--font-switzer)",
};

const cellStyle: CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid rgba(229,231,235,.7)",
};

const linkStyle: CSSProperties = {
  color: studioColors.teal,
  textDecoration: "none",
  fontWeight: 500,
};

const sortButtonStyle: CSSProperties = {
  height: 36,
  padding: "0 13px",
  borderRadius: 12,
  border: "none",
  background: "#ffffff",
  boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
  color: studioColors.labelGray,
  fontFamily: "var(--font-switzer)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const refreshButtonStyle: CSSProperties = {
  height: 36,
  padding: "0 15px",
  borderRadius: 12,
  border: "none",
  background: studioColors.gold,
  color: studioColors.goldInk,
  fontFamily: "var(--font-switzer)",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  transition: "filter .12s",
};

const selectStyle: CSSProperties = {
  height: 36,
  padding: "0 11px",
  borderRadius: 12,
  border: "none",
  background: "#ffffff",
  boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
  color: studioColors.labelGray,
  fontFamily: "var(--font-switzer)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  maxWidth: 200,
};

const clearButtonStyle: CSSProperties = {
  height: 34,
  padding: "0 12px",
  borderRadius: 999,
  border: "none",
  background: "transparent",
  boxShadow: `inset 0 0 0 1px ${studioColors.teal}`,
  color: studioColors.teal,
  fontFamily: "var(--font-switzer)",
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
};

const closeButtonStyle: CSSProperties = {
  flex: "none",
  height: 28,
  width: 28,
  borderRadius: 9,
  border: "none",
  background: "transparent",
  boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
  color: studioColors.mutedGray,
  fontSize: 12,
  cursor: "pointer",
  lineHeight: 1,
};

const rowDeleteStyle: CSSProperties = {
  height: 30,
  width: 30,
  borderRadius: 9,
  border: "none",
  background: "transparent",
  boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
  color: studioColors.danger,
  cursor: "pointer",
  transition: "background .12s",
};

const pagerStyle: CSSProperties = {
  height: 28,
  padding: "0 11px",
  borderRadius: 10,
  border: "none",
  background: "#ffffff",
  boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
  color: studioColors.labelGray,
  fontFamily: "var(--font-switzer)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
