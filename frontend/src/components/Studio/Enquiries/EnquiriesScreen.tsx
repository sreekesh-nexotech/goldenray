"use client";

// src/components/Studio/Enquiries/EnquiriesScreen.tsx
//
// Enquiries — every contact request captured by the site footer / home page
// forms, read from GET lead-collection-home/ on the main Flarize API (not the
// CMS admin API). The endpoint returns the full list newest-first with no
// pagination, so search, sort and paging are all done client-side.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { DropdownMenu, type MenuItem } from "../shared/overlays";
import { humanTime, studioColors, studioFonts } from "../shared/format";
import { getContactEnquiries, type ContactEnquiry } from "@/services/basicContactService";

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

type Row = ContactEnquiry & { ts: number };

export default function EnquiriesScreen() {
  const { tips, toast } = useStudio();

  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [q, setQ] = useState("");
  const [search, setSearch] = useState(""); // debounced copy of q
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [menuAt, setMenuAt] = useState<{ top: number; left: number } | null>(null);

  const sortBtn = useRef<HTMLButtonElement>(null);

  const load = async (): Promise<Row[] | null> => {
    try {
      const data = await getContactEnquiries();
      const mapped = data.map((e) => ({ ...e, ts: Date.parse(e.created_at) }));
      setRows(mapped);
      setNow(Date.now());
      setLoadError(null);
      return mapped;
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load enquiries");
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    getContactEnquiries()
      .then((data) => {
        if (cancelled) return;
        setRows(data.map((e) => ({ ...e, ts: Date.parse(e.created_at) })));
        setNow(Date.now());
        setLoadError(null);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load enquiries"));
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
  }, [search, sortKey]);

  const refresh = async () => {
    setRefreshing(true);
    const fresh = await load();
    setRefreshing(false);
    if (fresh) toast(`${fresh.length} ${fresh.length === 1 ? "enquiry" : "enquiries"} loaded`);
    else toast("Couldn’t refresh enquiries", "error");
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

  const filtered = useMemo(() => {
    const list = search
      ? all.filter(
          (r) =>
            r.name.toLowerCase().includes(search) ||
            r.phone_number.toLowerCase().includes(search)
        )
      : all;
    const sorted = [...list];
    if (sortKey === "newest") sorted.sort((a, b) => b.ts - a.ts);
    else if (sortKey === "oldest") sorted.sort((a, b) => a.ts - b.ts);
    else sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [all, search, sortKey]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortDef = SORTS.find((s) => s.key === sortKey)!;
  const loading = rows === null && loadError === null;
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
        title="Enquiries"
        titleSuffix={
          rows !== null ? (
            <span style={{ fontWeight: 500, fontSize: 15, color: studioColors.faintGray }}>
              {" "}
              · {stats.total} {stats.total === 1 ? "enquiry" : "enquiries"}
            </span>
          ) : undefined
        }
        subtitle="Name, phone number and time of every request submitted through the site’s contact forms."
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
          These come straight from the <b style={{ color: studioColors.tealDeep }}>footer &amp; home page</b> contact
          forms. Times are shown in your local timezone ({localZone()}); tap a number to call it.
        </TipBanner>
      )}

      {/* Summary tiles */}
      <div className="mb-3.5 grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
        <StatTile label="Total enquiries" value={rows === null ? "—" : String(stats.total)} />
        <StatTile label="Today" value={rows === null ? "—" : String(stats.today)} />
        <StatTile label="Last 7 days" value={rows === null ? "—" : String(stats.week)} />
      </div>

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load enquiries: {loadError}
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
                placeholder="Search by name or phone number…"
                aria-label="Search enquiries"
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
            {search !== "" && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="inline-flex items-center hover:bg-[rgba(7,74,77,0.05)]"
                style={clearButtonStyle}
              >
                Clear search
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  {["Name", "Phone number", "Date", "Time", "Received"].map((h) => (
                    <th key={h} style={headStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => {
                  const valid = !Number.isNaN(r.ts);
                  const d = valid ? new Date(r.ts) : null;
                  return (
                    <tr key={r.id} className="hover:bg-[rgba(248,242,225,0.5)]">
                      <td style={cellStyle}>
                        <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>
                          {r.name?.trim() || "—"}
                        </div>
                        <div style={{ fontFamily: studioFonts.mono, fontSize: 11, color: studioColors.faintGray, marginTop: 2 }}>
                          #{r.id}
                        </div>
                      </td>
                      <td style={cellStyle}>
                        <a
                          href={`tel:${r.phone_number}`}
                          style={{ fontFamily: studioFonts.mono, fontSize: 13, color: studioColors.teal, textDecoration: "none" }}
                        >
                          {r.phone_number}
                        </a>
                      </td>
                      <td style={{ ...cellStyle, fontSize: 13, color: studioColors.bodyGray, whiteSpace: "nowrap" }}>
                        {d ? dateFmt.format(d) : "—"}
                      </td>
                      <td style={{ ...cellStyle, fontFamily: studioFonts.num, fontSize: 13, color: studioColors.bodyGray, whiteSpace: "nowrap" }}>
                        {d ? timeFmt.format(d) : "—"}
                      </td>
                      <td style={{ ...cellStyle, fontSize: 12.5, color: studioColors.faintGray, whiteSpace: "nowrap" }}>
                        {valid ? humanTime(r.ts, now) : "—"}
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
                <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <div style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep, marginTop: 8 }}>
                {search ? "No enquiries match" : "No enquiries yet"}
              </div>
              <div style={{ fontSize: 12.5, color: studioColors.bodyGray, marginTop: 3 }}>
                {search
                  ? "Try a different name or phone number."
                  : "New submissions from the site’s contact forms will appear here."}
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
    </section>
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
