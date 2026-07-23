"use client";

// src/components/Studio/Entries/EntriesListScreen.tsx
//
// Entries list — the working surface for a single collection, driven by
// GET entries/ on the admin API. Collection tabs, search, status filter, sort
// and pagination are all server-side query params; rows are selectable for
// bulk publish/unpublish/delete and each ⋯ menu offers duplicate, publish and
// delete (real workflow endpoints).

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill } from "../shared/primitives";
import { DropdownMenu, ConfirmDialog, type MenuItem } from "../shared/overlays";
import { statusPill, studioColors, studioFonts } from "../shared/format";
import {
  getEntries,
  getCollections,
  publishEntry,
  unpublishEntry,
  duplicateEntry,
  deleteEntry,
  StudioApiError,
  type StudioCollection,
  type StudioEntryListItem,
} from "@/services/studioService";

/* -------------------------------------------------------------------------- */
/*  Sort + status option tables (mapped to server query params)                */
/* -------------------------------------------------------------------------- */

type SortKey = "recent" | "title" | "published";
type StatusKey = "any" | "published" | "draft";

const SORTS: { key: SortKey; label: string; long: string; ordering: string }[] = [
  { key: "recent", label: "Recently edited", long: "recently edited", ordering: "-updated_at" },
  { key: "title", label: "Title A–Z", long: "title A–Z", ordering: "title" },
  { key: "published", label: "Recently published", long: "recently published", ordering: "-published_at" },
];

const STATUSES: { key: StatusKey; label: string }[] = [
  { key: "any", label: "Any status" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
];

/** DRF page size (settings.REST_FRAMEWORK.PAGE_SIZE). */
const PAGE_SIZE = 25;

/** "Published" cell: the editorial date wins, else the publish timestamp. */
function publishedLabel(e: StudioEntryListItem): string {
  return e.published_on ?? e.published_at?.slice(0, 10) ?? "—";
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
  // The design fills + ticks the box only when fully checked; a partial page
  // selection stays visually empty (but is announced as "mixed").
  const on = checked;
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
  | { kind: "row"; id: number; top: number; left: number }
  | null;

type ConfirmState = { ids: number[]; titles: string[] } | null;

const chevron = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function EntriesListScreen() {
  const router = useRouter();
  const { tips, toast } = useStudio();
  const { canPublish, canDelete } = useCapabilities();

  const [colls, setColls] = useState<StudioCollection[] | null>(null);
  const [activeColl, setActiveColl] = useState<number | null>(null);
  const [rows, setRows] = useState<StudioEntryListItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const [q, setQ] = useState("");
  const [search, setSearch] = useState(""); // debounced copy of q
  const [statusKey, setStatusKey] = useState<StatusKey>("any");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<MenuState>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmState>(null);
  const [deleting, setDeleting] = useState(false);

  const sortBtn = useRef<HTMLButtonElement>(null);
  const statusBtn = useRef<HTMLButtonElement>(null);

  // Collection tabs.
  useEffect(() => {
    let cancelled = false;
    getCollections()
      .then((p) => {
        if (cancelled) return;
        setColls(p.results);
        setActiveColl((cur) => cur ?? p.results[0]?.id ?? null);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load collections"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce the search box into the server-side `search` param.
  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  const sortDef = SORTS.find((s) => s.key === sortKey)!;
  const statusDef = STATUSES.find((s) => s.key === statusKey)!;
  const hasFilters = search !== "" || statusKey !== "any";

  const queryParams = useMemo(
    () => ({
      collection: activeColl ?? undefined,
      status: statusKey === "any" ? undefined : statusKey,
      search: search || undefined,
      ordering: sortDef.ordering,
      page,
    }),
    [activeColl, statusKey, search, sortDef.ordering, page]
  );

  const load = async () => {
    if (activeColl === null) return;
    try {
      const p = await getEntries(queryParams);
      setRows(p.results);
      setTotal(p.count);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load entries");
    }
  };

  // Fetch whenever a query param changes.
  useEffect(() => {
    if (activeColl === null) return;
    let cancelled = false;
    getEntries(queryParams)
      .then((p) => {
        if (cancelled) return;
        setRows(p.results);
        setTotal(p.count);
        setLoadError(null);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load entries"));
    return () => {
      cancelled = true;
    };
  }, [queryParams, activeColl]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Keep the page in range when the underlying list shrinks.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Reset to page 1 when the tab or filters change; drop selection on tab change.
  useEffect(() => {
    setPage(1);
  }, [activeColl, search, statusKey]);

  useEffect(() => {
    setSelected(new Set());
  }, [activeColl]);

  const collection = colls?.find((c) => c.id === activeColl) ?? null;
  const pageRows = rows ?? [];
  const pageIds = pageRows.map((r) => r.id);
  const selCount = selected.size;
  const hasSel = selCount > 0;
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  const toggleRow = (id: number) => {
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

  const clearFilters = () => {
    setQ("");
    setStatusKey("any");
  };

  /* --- workflow actions ---------------------------------------------------- */

  /** Run an action over many ids, toast a summary, refresh the list. */
  const runBulk = async (ids: number[], run: (id: number) => Promise<unknown>, verb: string) => {
    setWorking(true);
    const results = await Promise.allSettled(ids.map((id) => run(id)));
    const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
    const ok = ids.length - failed.length;
    if (ok > 0) toast(`${verb} ${ok} ${ok === 1 ? "entry" : "entries"}`);
    for (const f of failed.slice(0, 3)) {
      const r = f.reason;
      toast(r instanceof StudioApiError ? (r.errors?.[0] ?? r.message) : `${verb} failed`, "error");
    }
    clearSel();
    await load();
    setWorking(false);
  };

  const doPublish = (ids: number[]) => runBulk(ids, publishEntry, "Published");
  const doUnpublish = (ids: number[]) => runBulk(ids, unpublishEntry, "Unpublished");

  const doDuplicate = async (entry: StudioEntryListItem) => {
    setWorking(true);
    try {
      await duplicateEntry(entry.id);
      toast(`Duplicated “${entry.title}” as a draft`);
      await load();
    } catch (err) {
      toast(err instanceof StudioApiError ? `Duplicate failed: ${err.message}` : "Duplicate failed", "error");
    } finally {
      setWorking(false);
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    await runBulk(confirmDelete.ids, deleteEntry, "Deleted");
    setDeleting(false);
    setConfirmDelete(null);
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

  const openRowMenu = (e: React.MouseEvent, id: number) => {
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
    const entry = pageRows.find((e) => e.id === menu.id);
    if (!entry) return [];
    const items: MenuItem[] = [{ label: "Duplicate", onClick: () => void doDuplicate(entry) }];
    if (canPublish) {
      const isLive = entry.status === "published";
      items.push({
        label: isLive ? "Unpublish" : "Publish",
        onClick: () => void (isLive ? doUnpublish([entry.id]) : doPublish([entry.id])),
      });
    }
    if (canDelete) {
      items.push({
        label: "Delete",
        color: studioColors.danger,
        onClick: () => setConfirmDelete({ ids: [entry.id], titles: [entry.title] }),
      });
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, sortKey, statusKey, canPublish, canDelete, pageRows]);

  /* --- render ------------------------------------------------------------- */

  const loading = rows === null || colls === null;
  const emptyFiltered = !loading && total === 0 && hasFilters;
  const emptyCollection = !loading && total === 0 && !hasFilters;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={14}
        title={collection?.plural_name ?? "Entries"}
        titleSuffix={
          !loading ? (
            <span style={{ fontWeight: 500, fontSize: 15, color: studioColors.faintGray }}>
              {" "}
              · {total} {total === 1 ? "entry" : "entries"}
            </span>
          ) : undefined
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
        {(colls ?? []).map((c) => {
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
              {c.plural_name}
            </button>
          );
        })}
      </div>

      {tips && (
        <TipBanner mb={14}>
          Click a row to open the editor. Tick rows for <b style={{ color: studioColors.tealDeep }}>bulk actions</b>; the{" "}
          <b style={{ color: studioColors.tealDeep }}>⋯</b> menu has duplicate, publish and delete.
        </TipBanner>
      )}

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: "inset 0 0 0 1px #E5E7EB", padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load entries: {loadError}
        </div>
      ) : loading ? (
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      ) : (
      <div
        aria-busy={working}
        style={{ background: "#ffffff", borderRadius: 16, boxShadow: "inset 0 0 0 1px #E5E7EB", opacity: working ? 0.6 : 1, pointerEvents: working ? "none" : "auto", transition: "opacity .15s" }}
      >
        {/* Bulk bar OR toolbar */}
        {hasSel ? (
          <div className="flex items-center gap-2" style={{ padding: "10px 14px", background: "#123532", borderRadius: "16px 16px 0 0" }}>
            <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 600, marginRight: 6 }}>
              {selCount} selected
            </span>
            {canPublish && (
              <>
                <BulkButton onClick={() => void doPublish([...selected])}>Publish</BulkButton>
                <BulkButton onClick={() => void doUnpublish([...selected])}>Unpublish</BulkButton>
              </>
            )}
            {canDelete && (
              <BulkButton
                onClick={() =>
                  setConfirmDelete({
                    ids: [...selected],
                    titles: pageRows.filter((r) => selected.has(r.id)).map((r) => r.title),
                  })
                }
                danger
              >
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
                {["Title", "Template", "Author", "Status", "Published"].map((h) => (
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
                    <td style={{ ...cellStyle, fontSize: 12.5, color: "#5B5B5B" }}>
                      {e.template_slug ? (
                        <span style={{ fontFamily: studioFonts.mono, fontSize: 11.5, background: "rgba(248,242,225,.9)", padding: "2px 8px", borderRadius: 6 }}>
                          {e.template_slug}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ ...cellStyle, fontSize: 13, color: "#5B5B5B" }}>{e.author_name ?? "—"}</td>
                    <td style={cellStyle}>
                      <StatusPill pill={pill} />
                    </td>
                    <td style={{ ...cellStyle, fontSize: 12.5, color: "#898989" }}>{publishedLabel(e)}</td>
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
              {emptyFiltered ? "No entries match" : `No entries in ${collection?.plural_name ?? "this collection"} yet`}
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
        <div className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-2" style={{ padding: "10px 16px", color: "#898989", fontSize: 12 }}>
          <span>{showing}</span>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2 max-md:w-full max-md:justify-between">
            <span className="min-w-0 truncate" style={{ fontFamily: studioFonts.mono, fontSize: 11 }}>sorted by {sortDef.long}</span>
            {totalPages > 1 && (
              <div className="flex flex-none items-center gap-1.5">
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
                <span className="whitespace-nowrap" style={{ fontFamily: studioFonts.num, fontSize: 11.5, color: "#5B5B5B" }}>
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
      )}

      <DropdownMenu open={menu !== null} onClose={() => setMenu(null)} top={menu?.top ?? 0} left={menu?.left ?? 0} items={menuItems} />

      <ConfirmDialog
        open={confirmDelete !== null}
        title={confirmDelete && confirmDelete.ids.length > 1 ? `Delete ${confirmDelete.ids.length} entries?` : "Delete entry?"}
        busy={deleting}
        busyLabel="Deleting…"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={doDelete}
      >
        {confirmDelete && (
          <>
            {confirmDelete.ids.length === 1 ? (
              <>
                <b style={{ color: studioColors.tealDeep }}>{confirmDelete.titles[0]}</b> will be deleted
                permanently — a published entry disappears from the live site immediately.
              </>
            ) : (
              <>
                <b style={{ color: studioColors.tealDeep }}>{confirmDelete.ids.length} entries</b> will be deleted
                permanently — published ones disappear from the live site immediately.
              </>
            )}{" "}
            This can&#8217;t be undone.
          </>
        )}
      </ConfirmDialog>
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
