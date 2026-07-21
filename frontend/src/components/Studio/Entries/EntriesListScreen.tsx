"use client";

// src/components/Studio/Entries/EntriesListScreen.tsx
//
// Entries list — the working surface for a single collection. Collection tabs
// switch the list; search + status filter it; header sort orders it; rows are
// selectable for bulk actions and each has a ⋯ actions menu. Presentation only:
// bulk/menu actions raise a toast, "+ New entry" and row clicks navigate.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { entries, collections, authors } from "@/data/studio";
import type { Entry } from "@/types/studio";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill } from "../shared/primitives";
import { DropdownMenu, type MenuItem } from "../shared/overlays";
import { statusPill, studioColors, studioFonts } from "../shared/format";

/* -------------------------------------------------------------------------- */
/*  Sort + status option tables                                                */
/* -------------------------------------------------------------------------- */

type SortKey = "recent" | "title" | "published";
type StatusKey = "any" | "published" | "draft" | "modified";

const SORTS: { key: SortKey; label: string; long: string }[] = [
  { key: "recent", label: "Recently edited", long: "recently edited" },
  { key: "title", label: "Title A–Z", long: "title A–Z" },
  { key: "published", label: "Recently published", long: "recently published" },
];

const STATUSES: { key: StatusKey; label: string }[] = [
  { key: "any", label: "Any status" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "modified", label: "Modified" },
];

const PAGE_SIZE = 5;

const authorName = (id: string) => authors.find((a) => a.id === id)?.name ?? id;

function pubTs(e: Entry): number {
  if (!e.pubDate) return -Infinity;
  const t = Date.parse(e.pubDate);
  return Number.isNaN(t) ? -Infinity : t;
}

/* -------------------------------------------------------------------------- */
/*  Custom checkbox (role="checkbox")                                          */
/* -------------------------------------------------------------------------- */

const CHECK_RING = "inset 0 0 0 1.5px #D5D7DA";

function CheckBox({
  checked,
  mixed = false,
  onToggle,
  ariaLabel,
}: {
  checked: boolean;
  mixed?: boolean;
  onToggle: (e: React.MouseEvent | React.KeyboardEvent) => void;
  ariaLabel: string;
}) {
  const on = checked || mixed;
  return (
    <span
      role="checkbox"
      tabIndex={0}
      aria-checked={mixed ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onToggle(e);
        }
      }}
      style={{
        width: 16,
        height: 16,
        borderRadius: 5,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        background: on ? "#074A4D" : "#ffffff",
        boxShadow: on ? "none" : CHECK_RING,
      }}
    >
      {checked ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      ) : mixed ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round">
          <path d="M6 12h12" />
        </svg>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                      */
/* -------------------------------------------------------------------------- */

type MenuState =
  | { kind: "sort"; top: number; left: number }
  | { kind: "status"; top: number; left: number }
  | { kind: "row"; id: string; top: number; left: number }
  | null;

const chevron = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function EntriesListScreen() {
  const router = useRouter();
  const { tips, toast } = useStudio();
  const { canPublish, canDelete } = useCapabilities();

  const [activeColl, setActiveColl] = useState<string>("articles");
  const [q, setQ] = useState("");
  const [statusKey, setStatusKey] = useState<StatusKey>("any");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<MenuState>(null);

  const sortBtn = useRef<HTMLButtonElement>(null);
  const statusBtn = useRef<HTMLButtonElement>(null);

  const collection = collections.find((c) => c.id === activeColl) ?? collections[0];
  const collTotal = useMemo(() => entries.filter((e) => e.coll === activeColl).length, [activeColl]);

  const sortDef = SORTS.find((s) => s.key === sortKey)!;
  const statusDef = STATUSES.find((s) => s.key === statusKey)!;
  const hasFilters = q.trim() !== "" || statusKey !== "any";

  // Filter → sort pipeline (collection scope, search, status, order).
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const rows = entries.filter((e) => {
      if (e.coll !== activeColl) return false;
      if (statusKey !== "any" && e.status !== statusKey) return false;
      if (needle && !e.title.toLowerCase().includes(needle) && !e.slug.toLowerCase().includes(needle)) return false;
      return true;
    });
    const sorted = [...rows];
    if (sortKey === "recent") sorted.sort((a, b) => b._ts - a._ts);
    else if (sortKey === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => pubTs(b) - pubTs(a));
    return sorted;
  }, [activeColl, q, statusKey, sortKey]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Keep the page in range when the underlying list shrinks.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Reset to page 1 + drop selection when the tab or filters change.
  useEffect(() => {
    setPage(1);
  }, [activeColl, q, statusKey]);

  useEffect(() => {
    setSelected(new Set());
  }, [activeColl]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageIds = pageRows.map((r) => r.id);
  const selCount = selected.size;
  const hasSel = selCount > 0;
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearSel = () => setSelected(new Set());

  const bulk = (verb: string) => {
    toast(`${verb} ${selCount} ${selCount === 1 ? "entry" : "entries"}`);
    clearSel();
  };

  const clearFilters = () => {
    setQ("");
    setStatusKey("any");
  };

  // Range label for the footer.
  const showing =
    total === 0
      ? "Showing 0 of 0"
      : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`;

  /* --- menu wiring -------------------------------------------------------- */

  const openFromButton = (kind: "sort" | "status", el: HTMLButtonElement | null) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(r.left, window.innerWidth - 216 - 8);
    setMenu({ kind, top: r.bottom + 6, left });
  };

  const openRowMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const left = Math.min(e.clientX, window.innerWidth - 216 - 8);
    const top = Math.min(e.clientY, window.innerHeight - 160);
    setMenu({ kind: "row", id, top, left });
  };

  const menuItems: MenuItem[] = useMemo(() => {
    if (!menu) return [];
    if (menu.kind === "sort") {
      return SORTS.map((s) => ({
        label: s.label,
        note: s.key === sortKey ? "✓" : undefined,
        onClick: () => setSortKey(s.key),
      }));
    }
    if (menu.kind === "status") {
      return STATUSES.map((s) => ({
        label: s.label,
        note: s.key === statusKey ? "✓" : undefined,
        onClick: () => setStatusKey(s.key),
      }));
    }
    // row actions
    const entry = entries.find((e) => e.id === menu.id);
    if (!entry) return [];
    const items: MenuItem[] = [{ label: "Duplicate", onClick: () => toast(`Duplicated “${entry.title}”`) }];
    if (canPublish) {
      const isLive = entry.status === "published";
      items.push({
        label: isLive ? "Unpublish" : "Publish",
        onClick: () => toast(`${isLive ? "Unpublished" : "Published"} “${entry.title}”`),
      });
    }
    if (canDelete) {
      items.push({ label: "Delete", color: studioColors.danger, onClick: () => toast(`Deleted “${entry.title}”`) });
    }
    return items;
  }, [menu, sortKey, statusKey, canPublish, canDelete, toast]);

  /* --- render ------------------------------------------------------------- */

  const emptyFiltered = total === 0 && hasFilters;
  const emptyCollection = total === 0 && !hasFilters;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        title={collection.name}
        titleSuffix={
          <span style={{ fontWeight: 500, fontSize: 15, color: studioColors.faintGray }}>
            {" "}
            · {collTotal} {collTotal === 1 ? "entry" : "entries"}
          </span>
        }
        subtitle="Search, filter and bulk-act on every entry in this collection."
        actions={
          <>
            <button
              ref={sortBtn}
              type="button"
              aria-haspopup="menu"
              onClick={() => openFromButton("sort", sortBtn.current)}
              className="inline-flex items-center gap-[7px]"
              style={sortButtonStyle}
              onMouseEnter={(e) => hoverRingInk(e.currentTarget, true)}
              onMouseLeave={(e) => hoverRingInk(e.currentTarget, false)}
            >
              Sort: {sortDef.label}
              {chevron}
            </button>
            <button
              type="button"
              onClick={() => router.push("/studio/entries/new")}
              className="inline-flex items-center gap-[7px] transition-[filter] hover:brightness-[.96]"
              style={newButtonStyle}
            >
              + New entry
            </button>
          </>
        }
      />

      {/* Collection tabs */}
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {collections.map((c) => {
          const active = c.id === activeColl;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveColl(c.id)}
              className="inline-flex items-center gap-1.5"
              style={{
                padding: "6px 13px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-switzer)",
                fontSize: 12.5,
                fontWeight: 600,
                transition: "background .12s,color .12s",
                background: active ? "#123532" : "rgba(255,255,255,.75)",
                boxShadow: active ? "none" : "inset 0 0 0 1px #E5E7EB",
                color: active ? "#ffffff" : "#414651",
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {tips && (
        <TipBanner>
          Click a row to open the editor. Tick rows for <b style={{ color: studioColors.tealDeep }}>bulk actions</b>; the{" "}
          <b style={{ color: studioColors.tealDeep }}>⋯</b> menu has duplicate, publish and delete.
        </TipBanner>
      )}

      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: "inset 0 0 0 1px #E5E7EB" }}>
        {/* Bulk bar OR toolbar */}
        {hasSel ? (
          <div className="flex items-center gap-2" style={{ padding: "10px 14px", background: "#123532", borderRadius: "16px 16px 0 0" }}>
            <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 600, marginRight: 6 }}>
              {selCount} selected
            </span>
            {canPublish && (
              <>
                <BulkButton onClick={() => bulk("Published")}>Publish</BulkButton>
                <BulkButton onClick={() => bulk("Unpublished")}>Unpublish</BulkButton>
              </>
            )}
            {canDelete && (
              <BulkButton onClick={() => bulk("Deleted")} danger>
                Delete
              </BulkButton>
            )}
            <button
              type="button"
              onClick={clearSel}
              className="inline-flex items-center hover:bg-[rgba(255,255,255,0.12)]"
              style={{
                marginLeft: "auto",
                height: 30,
                padding: "0 12px",
                borderRadius: 9,
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,.7)",
                fontFamily: "var(--font-switzer)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2" style={{ padding: "11px 14px", boxShadow: "inset 0 -1px 0 #E5E7EB" }}>
            <div
              className="flex items-center gap-2"
              style={{
                flex: 1,
                minWidth: 200,
                background: "rgba(248,242,225,.6)",
                borderRadius: 12,
                boxShadow: "inset 0 0 0 1px #E5E7EB",
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
                placeholder="Search entries…"
                aria-label="Search entries"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  background: "none",
                  outline: "none",
                  fontFamily: "var(--font-switzer)",
                  fontSize: 13.5,
                  color: "#123532",
                  height: "100%",
                }}
              />
            </div>
            <button
              ref={statusBtn}
              type="button"
              aria-haspopup="menu"
              onClick={() => openFromButton("status", statusBtn.current)}
              className="inline-flex items-center gap-1.5"
              style={statusButtonStyle}
              onMouseEnter={(e) => hoverRingInk(e.currentTarget, true)}
              onMouseLeave={(e) => hoverRingInk(e.currentTarget, false)}
            >
              Status: {statusDef.label}
              {chevron}
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr>
                <th style={{ width: 40, padding: "9px 8px 9px 16px", background: "rgba(248,242,225,.55)", borderBottom: "1px solid #E5E7EB" }}>
                  <CheckBox
                    checked={allChecked}
                    mixed={someChecked && !allChecked}
                    onToggle={toggleAll}
                    ariaLabel="Select all rows on this page"
                  />
                </th>
                {["Title", "Category", "Author", "Status", "Published"].map((h) => (
                  <th key={h} style={headStyle}>
                    {h}
                  </th>
                ))}
                <th style={{ width: 44, background: "rgba(248,242,225,.55)", borderBottom: "1px solid #E5E7EB" }} />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((e) => {
                const checked = selected.has(e.id);
                const pill = statusPill(e.status);
                return (
                  <tr
                    key={e.id}
                    onClick={() => router.push(`/studio/entries/${e.id}`)}
                    className="cursor-pointer hover:bg-[rgba(248,242,225,0.5)]"
                  >
                    <td style={{ padding: "12px 8px 12px 16px", borderBottom: "1px solid rgba(229,231,235,.7)" }}>
                      <CheckBox checked={checked} onToggle={() => toggleRow(e.id)} ariaLabel={`Select ${e.title}`} />
                    </td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: 600, color: "#123532", fontSize: 13.5 }}>{e.title}</div>
                      <div style={{ fontFamily: studioFonts.mono, fontSize: 11, color: "#898989", marginTop: 2 }}>{e.slug}</div>
                    </td>
                    <td style={{ ...cellStyle, fontSize: 13, color: "#5B5B5B" }}>{e.cats.length ? e.cats.join(", ") : "—"}</td>
                    <td style={{ ...cellStyle, fontSize: 13, color: "#5B5B5B" }}>{authorName(e.author)}</td>
                    <td style={cellStyle}>
                      <StatusPill pill={pill} />
                    </td>
                    <td style={{ ...cellStyle, fontSize: 12.5, color: "#898989" }}>{e.pubDate ?? "—"}</td>
                    <td style={{ padding: "12px 10px", borderBottom: "1px solid rgba(229,231,235,.7)" }}>
                      <button
                        type="button"
                        aria-label={`Actions for ${e.title}`}
                        aria-haspopup="menu"
                        onClick={(ev) => openRowMenu(ev, e.id)}
                        className="grid place-items-center hover:bg-[rgba(248,242,225,0.95)] hover:text-[#123532]"
                        style={{ border: "none", background: "none", cursor: "pointer", color: "#898989", padding: "5px 7px", borderRadius: 8 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="5" cy="12" r="1.7" />
                          <circle cx="12" cy="12" r="1.7" />
                          <circle cx="19" cy="12" r="1.7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {(emptyFiltered || emptyCollection) && (
          <div style={{ padding: "44px 20px", textAlign: "center" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#123532", marginTop: 8 }}>
              {emptyFiltered ? "No entries match" : `No entries in ${collection.name} yet`}
            </div>
            <div style={{ fontSize: 12.5, color: "#5B5B5B", marginTop: 3 }}>
              {emptyFiltered ? "Try a different search or filter." : "Create the first one."}
            </div>
            {emptyFiltered ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center hover:bg-[rgba(7,74,77,0.05)]"
                style={{
                  marginTop: 12,
                  height: 32,
                  padding: "0 13px",
                  borderRadius: 12,
                  border: "none",
                  background: "transparent",
                  color: "#074A4D",
                  fontFamily: "var(--font-switzer)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "inset 0 0 0 1px #074A4D",
                }}
              >
                Clear filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/studio/entries/new")}
                className="inline-flex items-center transition-[filter] hover:brightness-[.96]"
                style={{
                  marginTop: 12,
                  height: 32,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "#F7BA41",
                  color: "#272218",
                  fontFamily: "var(--font-switzer)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + New entry
              </button>
            )}
          </div>
        )}

        {/* Footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2.5" style={{ padding: "10px 16px", color: "#898989", fontSize: 12 }}>
          <span>{showing}</span>
          <div className="flex items-center gap-2.5">
            <span style={{ fontFamily: studioFonts.mono, fontSize: 11 }}>sorted by {sortDef.long}</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center"
                  style={{ ...pagerStyle, opacity: page <= 1 ? 0.45 : 1 }}
                  onMouseEnter={(e) => page > 1 && hoverRingInk(e.currentTarget, true)}
                  onMouseLeave={(e) => hoverRingInk(e.currentTarget, false)}
                >
                  ‹ Prev
                </button>
                <span style={{ fontFamily: studioFonts.num, fontSize: 11.5, color: "#5B5B5B" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center"
                  style={{ ...pagerStyle, opacity: page >= totalPages ? 0.45 : 1 }}
                  onMouseEnter={(e) => page < totalPages && hoverRingInk(e.currentTarget, true)}
                  onMouseLeave={(e) => hoverRingInk(e.currentTarget, false)}
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DropdownMenu open={menu !== null} onClose={() => setMenu(null)} top={menu?.top ?? 0} left={menu?.left ?? 0} items={menuItems} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Local styles + tiny helpers                                                */
/* -------------------------------------------------------------------------- */

const headStyle: CSSProperties = {
  textAlign: "left",
  fontSize: 11,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: "#757575",
  fontWeight: 600,
  padding: "9px 16px",
  background: "rgba(248,242,225,.55)",
  borderBottom: "1px solid #E5E7EB",
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
  boxShadow: "inset 0 0 0 1px #D5D7DA",
  color: "#414651",
  fontFamily: "var(--font-switzer)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const newButtonStyle: CSSProperties = {
  height: 36,
  padding: "0 15px",
  borderRadius: 12,
  border: "none",
  background: "#F7BA41",
  color: "#272218",
  fontFamily: "var(--font-switzer)",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  transition: "filter .12s",
};

const statusButtonStyle: CSSProperties = {
  height: 34,
  padding: "0 12px",
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-switzer)",
  fontSize: 12.5,
  fontWeight: 600,
  background: "rgba(248,242,225,.9)",
  boxShadow: "inset 0 0 0 1px #E5E7EB",
  color: "#414651",
};

const pagerStyle: CSSProperties = {
  height: 28,
  padding: "0 11px",
  borderRadius: 10,
  border: "none",
  background: "#ffffff",
  boxShadow: "inset 0 0 0 1px #D5D7DA",
  color: "#414651",
  fontFamily: "var(--font-switzer)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

/** Shared hover: swap the ring + ink to teal, matching `style-hover` tokens. */
function hoverRingInk(el: HTMLElement, on: boolean) {
  const base = el.dataset.ring || (el.style.boxShadow.includes("#D5D7DA") ? "#D5D7DA" : "#E5E7EB");
  el.dataset.ring = base;
  el.style.boxShadow = `inset 0 0 0 1px ${on ? "#074A4D" : base}`;
  el.style.color = on ? "#074A4D" : el.dataset.ink || (el.dataset.ink = "#414651");
}

function BulkButton({ children, onClick, danger = false }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center"
      style={{
        height: 30,
        padding: "0 12px",
        borderRadius: 9,
        border: "none",
        background: "rgba(255,255,255,.12)",
        color: danger ? "#FFC9C2" : "#ffffff",
        fontFamily: "var(--font-switzer)",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background .12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "rgba(220,38,38,.35)" : "rgba(255,255,255,.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.12)")}
    >
      {children}
    </button>
  );
}
