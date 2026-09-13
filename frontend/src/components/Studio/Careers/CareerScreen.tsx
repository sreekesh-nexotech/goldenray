"use client";

// src/components/Studio/Careers/CareerScreen.tsx
//
// Applications (§6.13, §6.14) — the one queue for career applications, read
// from GET job-applications/ on the main Flarize API (not the CMS admin API).
// The endpoint returns the full list newest-first with no pagination, so
// search, sort and paging are all done client-side — same shape as the
// Enquiries screen next door. Status, notes, the timeline and assignment to a
// posting live in the detail modal; rows are archived, never deleted.

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useStudio } from "../shared/StudioContext";
import { DangerButton, FieldLabel, GhostButton, GoldButton, PageHeader, SelectField, TextArea, TipBanner } from "../shared/primitives";
import { ConfirmDialog, DropdownMenu, Modal, ModalTitle, type MenuItem } from "../shared/overlays";
import { humanTime, studioColors, studioFonts } from "../shared/format";
import { Pill, fmtDate } from "../shared/listing";
import {
  APPLICATION_STATUSES,
  addApplicationNote,
  archiveCareerApplication,
  assignApplication,
  downloadApplicationFile,
  getCareerApplication,
  getCareerApplications,
  restoreApplication,
  setApplicationStatus,
  type ApplicationStatus,
  type CareerApplication,
  type CareerApplicationDetail,
} from "@/services/careerApplicationService";
import { getPositions, type PositionListItem } from "@/services/careersService";

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

/** Whether a resume / portfolio exists to download. Bytes come via the service. */
function hasFile(row: Row, kind: "resume" | "portfolio"): boolean {
  return kind === "resume" ? Boolean(row.resume_download_url || row.resume) : Boolean(row.portfolio_download_url || row.portfolio_file);
}

export default function CareerScreen() {
  const { tips, toast, can } = useStudio();
  const canEdit = can("applications", "edit");
  const canArchive = can("applications", "archive");

  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [q, setQ] = useState("");
  const [search, setSearch] = useState(""); // debounced copy of q
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [position, setPosition] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [department, setDepartment] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);
  const [menuAt, setMenuAt] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState<Row | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sortBtn = useRef<HTMLButtonElement>(null);

  const load = async (): Promise<Row[] | null> => {
    try {
      const data = await getCareerApplications({ includeArchived: showArchived });
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
    getCareerApplications({ includeArchived: showArchived })
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
  }, [showArchived]);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, position, statusFilter, department]);

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
      await archiveCareerApplication(target.id);
      // Drop it locally rather than refetching — the list is unpaginated and a
      // full reload would flash the whole table for a single-row change.
      setRows((prev) => (prev ? prev.filter((r) => r.id !== target.id) : prev));
      setOpen((prev) => (prev?.id === target.id ? null : prev));
      setConfirmDelete(null);
      toast(`Application from ${target.full_name?.trim() || `#${target.id}`} archived`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn’t archive the application", "error");
    } finally {
      setDeleting(false);
    }
  };

  /** Patch one row in place after a workflow change in the detail modal. */
  const applyUpdate = (updated: CareerApplication) => {
    setRows((prev) => (prev ? prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)) : prev));
    setOpen((prev) => (prev?.id === updated.id ? { ...prev, ...updated } : prev));
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
      fresh: all.filter((r) => r.status === "new").length,
    };
  }, [all]);

  // Positions actually present in the data — the model can grow new openings
  // without this screen needing a change.
  const positions = useMemo(() => {
    const seen = new Set<string>();
    for (const r of all) if (r.display_position) seen.add(r.display_position);
    return [...seen].sort((a, b) => a.localeCompare(b));
  }, [all]);

  const departments = useMemo(() => {
    const seen = new Set<string>();
    for (const r of all) if (r.department_name) seen.add(r.department_name);
    return [...seen].sort((a, b) => a.localeCompare(b));
  }, [all]);

  const filtered = useMemo(() => {
    let list = position === "all" ? all : all.filter((r) => r.display_position === position);
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (department !== "all") list = list.filter((r) => r.department_name === department);
    if (search) {
      list = list.filter((r) =>
        [r.full_name, r.email, r.phone, r.display_position, r.department_name, r.location, r.current_company]
          .some((v) => (v || "").toLowerCase().includes(search))
      );
    }
    const sorted = [...list];
    if (sortKey === "newest") sorted.sort((a, b) => b.ts - a.ts);
    else if (sortKey === "oldest") sorted.sort((a, b) => a.ts - b.ts);
    else sorted.sort((a, b) => a.full_name.localeCompare(b.full_name));
    return sorted;
  }, [all, search, sortKey, position, statusFilter, department]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortDef = SORTS.find((s) => s.key === sortKey)!;
  const loading = rows === null && loadError === null;
  const filtering = search !== "" || position !== "all" || statusFilter !== "all" || department !== "all";
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
        title="Applications"
        titleSuffix={
          rows !== null ? (
            <span style={{ fontWeight: 500, fontSize: 15, color: studioColors.faintGray }}>
              {" "}
              · {stats.total} {stats.total === 1 ? "application" : "applications"}
            </span>
          ) : undefined
        }
        subtitle="One queue for every application from the Careers page. Open a row to move it through the workflow, add notes and download the resume."
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
        <StatTile label="New" value={rows === null ? "—" : String(stats.fresh)} />
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
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")} aria-label="Filter by status" style={selectStyle}>
              <option value="all">All statuses</option>
              {APPLICATION_STATUSES.map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
            {departments.length > 0 && (
              <select value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Filter by department" style={selectStyle}>
                <option value="all">All departments</option>
                {departments.map((dpt) => (
                  <option key={dpt} value={dpt}>
                    {dpt}
                  </option>
                ))}
              </select>
            )}
            <label className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, color: studioColors.bodyGray, cursor: "pointer" }}>
              <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
              Archived
            </label>
            {filtering && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setPosition("all");
                  setStatusFilter("all");
                  setDepartment("all");
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
                  {["Candidate", "Position", "Status", "Experience", "Applied", "Received", "Resume"].map((h) => (
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
                        <div>{r.display_position || "—"}</div>
                        {r.department_name && <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 2 }}>{r.department_name}</div>}
                      </td>
                      <td style={cellStyle}>
                        <div className="flex items-center gap-1.5">
                          <Pill status={r.status ?? "new"} size="sm" />
                          {r.archived_at && <Pill status="archived" size="sm" />}
                        </div>
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
                        {hasFile(r, "resume") ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadApplicationFile(r.id, "resume").catch((err) => toast(err instanceof Error ? err.message : "Download failed", "error"));
                            }}
                            style={{ border: "none", background: "transparent", padding: 0, fontSize: 12.5, fontWeight: 600, color: studioColors.teal, cursor: "pointer", fontFamily: "var(--font-switzer)" }}
                          >
                            Download ↓
                          </button>
                        ) : (
                          <span style={{ fontSize: 12.5, color: studioColors.faintGray }}>—</span>
                        )}
                      </td>
                      <td style={{ ...cellStyle, whiteSpace: "nowrap", textAlign: "right" }}>
                        {canArchive && !r.archived_at && (
                          <button
                            type="button"
                            aria-label={`Archive application from ${r.full_name?.trim() || `#${r.id}`}`}
                            title="Archive application"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(r);
                            }}
                            className="inline-flex items-center justify-center hover:bg-[rgba(7,74,77,0.08)]"
                            style={rowDeleteStyle}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="4" rx="1" />
                              <path d="M5 8v11a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8" />
                              <path d="M10 12h4" />
                            </svg>
                          </button>
                        )}
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
        canEdit={canEdit}
        canArchive={canArchive}
        onClose={() => setOpen(null)}
        onArchive={(row) => setConfirmDelete(row)}
        onUpdated={applyUpdate}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Archive application?"
        confirmLabel="Archive"
        busy={deleting}
        busyLabel="Archiving…"
        onCancel={() => !deleting && setConfirmDelete(null)}
        onConfirm={() => void doDelete()}
      >
        {confirmDelete && (
          <>
            The application from{" "}
            <b style={{ color: studioColors.tealDeep }}>
              {confirmDelete.full_name?.trim() || `#${confirmDelete.id}`}
            </b>{" "}
            for {confirmDelete.display_position} leaves the queue. Nothing is deleted — the record, files,
            notes and timeline are kept, and it can be restored from the archived view.
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
  canEdit,
  canArchive,
  onClose,
  onArchive,
  onUpdated,
}: {
  row: Row | null;
  canEdit: boolean;
  canArchive: boolean;
  onClose: () => void;
  onArchive: (row: Row) => void;
  onUpdated: (updated: CareerApplication) => void;
}) {
  const { toast } = useStudio();
  const valid = row !== null && !Number.isNaN(row.ts);
  const d = valid ? new Date(row!.ts) : null;

  // The list row has the core fields; notes and the timeline come from the
  // detail endpoint once the modal opens.
  const [detail, setDetail] = useState<CareerApplicationDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [nextStatus, setNextStatus] = useState<ApplicationStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [positions, setPositions] = useState<PositionListItem[]>([]);
  const [assignTo, setAssignTo] = useState("");

  useEffect(() => {
    if (!row) {
      setDetail(null);
      setNextStatus("");
      setStatusNote("");
      setNoteBody("");
      setAssignTo("");
      return;
    }
    let cancelled = false;
    setDetailError(null);
    getCareerApplication(row.id)
      .then((dt) => !cancelled && setDetail(dt))
      .catch((err) => !cancelled && setDetailError(err instanceof Error ? err.message : "Couldn’t load the timeline"));
    getPositions({ include_archived: false })
      .then((p) => !cancelled && setPositions(p.results))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [row]);

  const run = async (fn: () => Promise<CareerApplicationDetail>, done: string) => {
    setBusy(true);
    try {
      const dt = await fn();
      setDetail(dt);
      onUpdated(dt);
      toast(done);
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Action failed", "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const current = detail ?? row;
  const transitions = detail?.allowed_transitions ?? [];

  return (
    <Modal open={row !== null} onClose={onClose} ariaLabel="Application details" width={760}>
      {row && current && (
        <>
          <div className="flex items-start justify-between gap-3">
            <div style={{ minWidth: 0 }}>
              <div className="flex flex-wrap items-center gap-2">
                <ModalTitle>{row.full_name?.trim() || "Application"}</ModalTitle>
                <Pill status={current.status ?? "new"} size="sm" />
                {current.archived_at && <Pill status="archived" size="sm" />}
              </div>
              <div style={{ fontSize: 12.5, color: studioColors.bodyGray, marginTop: 3 }}>
                {current.display_position}
                {current.department_name ? ` · ${current.department_name}` : ""}
                {d ? ` · ${dateFmt.format(d)}, ${timeFmt.format(d)}` : ""}
                <span style={{ fontFamily: studioFonts.mono, color: studioColors.faintGray }}> · #{row.id}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" style={closeButtonStyle}>
              ✕
            </button>
          </div>

          <div style={{ maxHeight: "64vh", overflowY: "auto", marginTop: 16, paddingRight: 2 }}>
            {/* ── Workflow (§6.13) ─────────────────────────────────────── */}
            {canEdit && !current.archived_at && (
              <DetailSection title="Status">
                <div className="flex flex-col gap-2.5" style={{ padding: "10px 0" }}>
                  {detailError && <div style={{ fontSize: 12.5, color: studioColors.danger }}>{detailError}</div>}
                  <div className="grid gap-2" style={{ gridTemplateColumns: "200px 1fr auto" }}>
                    <SelectField value={nextStatus} onChange={(v) => setNextStatus(v as ApplicationStatus | "")} ariaLabel="Move to status">
                      <option value="">Move to…</option>
                      {APPLICATION_STATUSES.filter((st) => transitions.includes(st.key)).map((st) => (
                        <option key={st.key} value={st.key}>
                          {st.label}
                        </option>
                      ))}
                    </SelectField>
                    <input
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Reason or note for the timeline (optional)"
                      aria-label="Status note"
                      style={{ border: "none", borderRadius: 12, padding: "10px 12px", boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`, fontFamily: "var(--font-switzer)", fontSize: 13, color: studioColors.tealDeep, background: "#fff" }}
                    />
                    <GoldButton
                      disabled={!nextStatus || busy}
                      style={{ height: 40, padding: "0 14px", fontSize: 13, opacity: nextStatus ? 1 : 0.6 }}
                      onClick={async () => {
                        if (!nextStatus) return;
                        const ok = await run(() => setApplicationStatus(row.id, nextStatus, statusNote), `Moved to ${APPLICATION_STATUSES.find((st) => st.key === nextStatus)?.label}`);
                        if (ok) {
                          setNextStatus("");
                          setStatusNote("");
                        }
                      }}
                    >
                      Update
                    </GoldButton>
                  </div>
                  {detail && transitions.length === 0 && (
                    <div style={{ fontSize: 12, color: studioColors.faintGray }}>No further moves from {current.status}.</div>
                  )}
                </div>
              </DetailSection>
            )}

            {/* ── Assign a general application to a posting (§6.14) ────── */}
            {canEdit && !current.archived_at && !current.position_id && positions.length > 0 && (
              <DetailSection title="Link to a position">
                <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto", padding: "10px 0" }}>
                  <SelectField value={assignTo} onChange={setAssignTo} ariaLabel="Assign to position">
                    <option value="">Choose a posting…</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — {p.department_name}
                      </option>
                    ))}
                  </SelectField>
                  <GhostButton
                    disabled={!assignTo || busy}
                    style={{ height: 40, padding: "0 14px", fontSize: 13 }}
                    onClick={async () => {
                      const p = positions.find((x) => String(x.id) === assignTo);
                      if (!p) return;
                      const ok = await run(() => assignApplication(row.id, { position_id: p.id, position_title: p.title, department_name: p.department_name }), `Linked to ${p.title}`);
                      if (ok) setAssignTo("");
                    }}
                  >
                    Link
                  </GhostButton>
                  <div style={{ gridColumn: "1 / -1", fontSize: 11.5, color: studioColors.faintGray }}>
                    The original submission (&ldquo;{current.position}&rdquo;) is kept as sent.
                  </div>
                </div>
              </DetailSection>
            )}

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
              <DetailRow label="Applied for">{current.display_position}</DetailRow>
              <DetailRow label="Department">{current.department_name}</DetailRow>
              <DetailRow label="Current company">{row.current_company}</DetailRow>
              <DetailRow label="Current role">{row.current_role}</DetailRow>
              <DetailRow label="Total experience">{row.total_experience}</DetailRow>
              <DetailRow label="Relevant experience">{row.relevant_experience}</DetailRow>
              <DetailRow label="Current salary">{row.current_salary}</DetailRow>
              <DetailRow label="Expected salary">{row.expected_salary}</DetailRow>
              <DetailRow label="Notice period">{row.notice_period}</DetailRow>
              <DetailRow label="Heard about us">{row.heard_about_us}</DetailRow>
            </DetailSection>

            <DetailSection title="Documents">
              <DetailRow label="Resume">
                {hasFile(row, "resume") ? (
                  <button type="button" onClick={() => downloadApplicationFile(row.id, "resume").catch((err) => toast(err instanceof Error ? err.message : "Download failed", "error"))} style={{ ...linkStyle, border: "none", background: "transparent", padding: 0, cursor: "pointer", fontFamily: "var(--font-switzer)", fontSize: 13 }}>
                    Download ↓
                  </button>
                ) : null}
              </DetailRow>
              <DetailRow label="Portfolio file">
                {hasFile(row, "portfolio") ? (
                  <button type="button" onClick={() => downloadApplicationFile(row.id, "portfolio").catch((err) => toast(err instanceof Error ? err.message : "Download failed", "error"))} style={{ ...linkStyle, border: "none", background: "transparent", padding: 0, cursor: "pointer", fontFamily: "var(--font-switzer)", fontSize: 13 }}>
                    Download ↓
                  </button>
                ) : null}
              </DetailRow>
              <DetailRow label="Declaration">{row.declaration_accepted ? "Accepted" : "Not accepted"}</DetailRow>
            </DetailSection>

            {/* ── Internal notes (§6.14) ───────────────────────────────── */}
            <DetailSection title="Internal notes">
              <div style={{ padding: "8px 0" }} className="flex flex-col gap-2.5">
                {detail?.notes.length === 0 && <div style={{ fontSize: 12.5, color: studioColors.faintGray }}>No notes yet. Only the hiring team sees these.</div>}
                {detail?.notes.map((n) => (
                  <div key={n.id} style={{ padding: "8px 10px", borderRadius: 10, background: "#ffffff", boxShadow: `inset 0 0 0 1px ${studioColors.ring}` }}>
                    <div style={{ fontSize: 13, color: studioColors.tealDeep, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{n.body}</div>
                    <div style={{ fontSize: 11, color: studioColors.faintGray, marginTop: 4 }}>
                      {n.author || "Unknown"} · {fmtDate(n.created_at)}
                    </div>
                  </div>
                ))}
                {canEdit && (
                  <div>
                    <FieldLabel>Add a note</FieldLabel>
                    <TextArea value={noteBody} onChange={setNoteBody} minHeight={56} placeholder="Interview feedback, follow-ups, anything the team should know." />
                    <div className="flex justify-end" style={{ marginTop: 6 }}>
                      <GhostButton
                        disabled={!noteBody.trim() || busy}
                        style={{ height: 34, padding: "0 12px", fontSize: 12.5 }}
                        onClick={async () => {
                          const ok = await run(() => addApplicationNote(row.id, noteBody), "Note added");
                          if (ok) setNoteBody("");
                        }}
                      >
                        Add note
                      </GhostButton>
                    </div>
                  </div>
                )}
              </div>
            </DetailSection>

            {/* ── Timeline (§6.14) ─────────────────────────────────────── */}
            <DetailSection title="Timeline">
              <div style={{ padding: "8px 0" }} className="flex flex-col gap-1.5">
                {!detail && !detailError && <div style={{ fontSize: 12.5, color: studioColors.faintGray }}>Loading…</div>}
                {detail?.events.length === 0 && <div style={{ fontSize: 12.5, color: studioColors.faintGray }}>Received before the timeline existed.</div>}
                {detail?.events.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-2.5" style={{ fontSize: 12.5 }}>
                    <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: "50%", background: studioColors.teal, flex: "none" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: studioColors.tealDeep, fontWeight: 500 }}>{ev.kind_label}</span>
                      {ev.kind === "status" && (
                        <span style={{ color: studioColors.bodyGray }}>
                          {" "}
                          {ev.from_status} → <b>{ev.to_status}</b>
                        </span>
                      )}
                      {ev.detail && ev.kind !== "status" && <span style={{ color: studioColors.bodyGray }}> · {ev.detail}</span>}
                      {ev.detail && ev.kind === "status" && <div style={{ color: studioColors.bodyGray, fontStyle: "italic" }}>{ev.detail}</div>}
                    </div>
                    <span style={{ color: studioColors.faintGray, whiteSpace: "nowrap", fontSize: 11.5 }}>
                      {ev.actor ? `${ev.actor} · ` : ""}
                      {fmtDate(ev.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>

          <div className="flex flex-wrap justify-end gap-2" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${studioColors.ring}` }}>
            {current.archived_at ? (
              canEdit && (
                <GhostButton disabled={busy} onClick={() => void run(() => restoreApplication(row.id), "Restored to the queue")}>
                  Restore to queue
                </GhostButton>
              )
            ) : (
              canArchive && <DangerButton onClick={() => onArchive(row)}>Archive</DangerButton>
            )}
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
  color: studioColors.teal,
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
