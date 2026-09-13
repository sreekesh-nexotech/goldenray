"use client";

// src/components/Studio/Faqs/FaqListScreen.tsx
//
// FAQ list (§6.4): search, filter by page / category / status, the seven
// specified columns, and reordering. Order is per page + section and is what
// the site renders, so the up/down controls only unlock once the list is
// narrowed to one page — reordering a mixed list would have no meaning.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { GoldButton, PageHeader, TipBanner } from "../shared/primitives";
import { ConfirmDialog, DropdownMenu, type MenuItem } from "../shared/overlays";
import { studioColors } from "../shared/format";
import {
  EmptyState,
  ErrorBox,
  FilterSelect,
  ListTable,
  Pager,
  Pill,
  StateRow,
  Td,
  Th,
  Toolbar,
  fmtDate,
} from "../shared/listing";
import {
  archiveFaq,
  getFaqCategories,
  getFaqs,
  publishFaq,
  reorderFaqs,
  restoreFaq,
  unpublishFaq,
  type FaqCategory,
  type FaqListItem,
  type FaqStatus,
} from "@/services/faqService";
import { getPages, type PageListItem } from "@/services/pagesService";
import { StudioApiError } from "@/services/studioService";

const COLS = 7;

export default function FaqListScreen() {
  const router = useRouter();
  const { tips, toast, can } = useStudio();

  const [rows, setRows] = useState<FaqListItem[] | null>(null);
  const [count, setCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);

  const [search, setSearch] = useState("");
  const [pageId, setPageId] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<FaqStatus | "">("");
  const [pageNo, setPageNo] = useState(1);

  const [menu, setMenu] = useState<{ row: FaqListItem; top: number; left: number } | null>(null);
  const [confirmArchive, setConfirmArchive] = useState<FaqListItem | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Lookups for the filter selects — loaded once.
  useEffect(() => {
    getPages().then((p) => setPages(p.results)).catch(() => {});
    getFaqCategories().then((c) => setCategories(c.results)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoadError(null);
    return getFaqs({
      search: search || undefined,
      page_id: pageId ? Number(pageId) : "",
      category: category ? Number(category) : "",
      status,
      page: pageNo,
      // Archived rows only show when the status filter asks for them.
      include_archived: status === "archived",
    })
      .then((p) => {
        setRows(p.results);
        setCount(p.count);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load FAQs"));
  }, [search, pageId, category, status, pageNo]);

  // Debounce typing; filters fire immediately via the same effect.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(load, search ? 250 : 0);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [load, search]);

  const filtering = Boolean(search || pageId || category || status);
  const clearFilters = () => {
    setSearch("");
    setPageId("");
    setCategory("");
    setStatus("");
    setPageNo(1);
  };

  // Reordering needs a single page in view; sections within it reorder
  // independently. Rows arrive already in page → section → order.
  const reorderable = Boolean(pageId) && !search && can("faqs", "edit");

  const move = async (row: FaqListItem, dir: -1 | 1) => {
    if (!rows) return;
    const section = rows.filter((r) => r.section === row.section && r.page === row.page);
    const idx = section.findIndex((r) => r.id === row.id);
    const swap = idx + dir;
    if (swap < 0 || swap >= section.length) return;
    const order = section.map((r) => r.id);
    [order[idx], order[swap]] = [order[swap], order[idx]];
    setBusyId(row.id);
    try {
      await reorderFaqs(row.page, row.section, order);
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not reorder", "error");
    } finally {
      setBusyId(null);
    }
  };

  const act = async (label: string, fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await load();
    } catch (err) {
      const msg =
        err instanceof StudioApiError && err.errors?.length
          ? `${label}: ${err.errors.join(" ")}`
          : err instanceof Error
            ? err.message
            : `${label} failed`;
      toast(msg, "error");
    }
  };

  const menuItems = (row: FaqListItem): MenuItem[] => {
    const items: MenuItem[] = [];
    if (can("faqs", "edit")) items.push({ label: "Edit", onClick: () => router.push(`/studio/faqs/${row.id}`) });
    else items.push({ label: "View", onClick: () => router.push(`/studio/faqs/${row.id}`) });
    if (can("faqs", "publish")) {
      if (row.status === "published")
        items.push({ label: "Unpublish", note: "back to draft", onClick: () => act("Unpublish", () => unpublishFaq(row.id), "Unpublished") });
      else if (row.status === "draft")
        items.push({ label: "Publish", note: "live on the site", onClick: () => act("Publish", () => publishFaq(row.id), "Published") });
    }
    if (row.status === "archived") {
      if (can("faqs", "edit")) items.push({ label: "Restore", note: "as a draft", onClick: () => act("Restore", () => restoreFaq(row.id), "Restored") });
    } else if (can("faqs", "archive")) {
      items.push({ label: "Archive", color: studioColors.danger, onClick: () => setConfirmArchive(row) });
    }
    return items;
  };

  const activePage = useMemo(() => pages.find((p) => String(p.id) === pageId), [pages, pageId]);

  return (
    <>
      <PageHeader
        title="FAQs"
        subtitle="Questions and answers shown on the website, managed per page. Order here is the order visitors see."
        actions={
          can("faqs", "create") ? (
            <GoldButton onClick={() => router.push("/studio/faqs/new")}>+ New FAQ</GoldButton>
          ) : undefined
        }
      />

      {tips && (
        <TipBanner>
          Each FAQ belongs to one page. Filter to a page to reorder its questions; the FAQPage schema for
          that page is generated from these records automatically — nothing to type.
        </TipBanner>
      )}

      {loadError && <ErrorBox message={loadError} onRetry={load} />}

      <Toolbar search={search} onSearch={(v) => { setSearch(v); setPageNo(1); }} placeholder="Search questions or answers…" filtering={filtering} onClear={clearFilters}>
        <FilterSelect value={pageId} onChange={(v) => { setPageId(v); setPageNo(1); }} ariaLabel="Filter by page" width={200}>
          <option value="">All pages</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={category} onChange={(v) => { setCategory(v); setPageNo(1); }} ariaLabel="Filter by category" width={160}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={status} onChange={(v) => { setStatus(v as FaqStatus | ""); setPageNo(1); }} ariaLabel="Filter by status" width={140}>
          <option value="">Active</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </FilterSelect>
      </Toolbar>

      {activePage && (
        <div style={{ fontSize: 12.5, color: studioColors.mutedGray, marginBottom: 10 }}>
          Showing FAQs on <b style={{ color: studioColors.tealDeep }}>{activePage.route}</b>
          {reorderable ? " — use the arrows to reorder within a section." : ""}
        </div>
      )}

      <ListTable
        minWidth={860}
        head={
          <>
            <Th>Question</Th>
            <Th>Page</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th style={{ width: 96 }}>Order</Th>
            <Th>Updated</Th>
            <Th style={{ width: 56 }} />
          </>
        }
      >
        {rows === null && !loadError && <StateRow colSpan={COLS}>Loading…</StateRow>}
        {rows && rows.length === 0 && (
          <StateRow colSpan={COLS}>
            <EmptyState
              title={filtering ? "No FAQs match" : "No FAQs yet"}
              hint={filtering ? "Try widening the filters." : "Add the first question and attach it to the page it belongs on."}
              action={!filtering && can("faqs", "create") ? <GoldButton onClick={() => router.push("/studio/faqs/new")}>+ New FAQ</GoldButton> : undefined}
            />
          </StateRow>
        )}
        {rows?.map((row, i) => {
          const prevSection = i > 0 ? rows[i - 1].section : null;
          const showSection = reorderable && row.section !== prevSection;
          return (
            <FaqRow
              key={row.id}
              row={row}
              showSection={showSection}
              reorderable={reorderable}
              busy={busyId === row.id}
              onMove={(d) => move(row, d)}
              onOpen={() => router.push(`/studio/faqs/${row.id}`)}
              onMenu={(top, left) => setMenu({ row, top, left })}
            />
          );
        })}
      </ListTable>

      <Pager page={pageNo} count={count} onPage={setPageNo} />

      <DropdownMenu
        open={menu !== null}
        onClose={() => setMenu(null)}
        top={menu?.top ?? 0}
        left={menu?.left ?? 0}
        items={menu ? menuItems(menu.row) : []}
      />

      <ConfirmDialog
        open={confirmArchive !== null}
        title="Archive this FAQ?"
        confirmLabel="Archive"
        onCancel={() => setConfirmArchive(null)}
        onConfirm={async () => {
          const row = confirmArchive;
          setConfirmArchive(null);
          if (row) await act("Archive", () => archiveFaq(row.id), "Archived");
        }}
      >
        It comes off the website but stays here, and can be restored as a draft later.
      </ConfirmDialog>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row                                                                        */
/* -------------------------------------------------------------------------- */

function FaqRow({
  row,
  showSection,
  reorderable,
  busy,
  onMove,
  onOpen,
  onMenu,
}: {
  row: FaqListItem;
  showSection: boolean;
  reorderable: boolean;
  busy: boolean;
  onMove: (dir: -1 | 1) => void;
  onOpen: () => void;
  onMenu: (top: number, left: number) => void;
}) {
  return (
    <>
      {showSection && (
        <tr>
          <td colSpan={COLS} style={{ padding: "8px 16px 4px", fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: studioColors.mutedGray, background: "rgba(248,242,225,.35)" }}>
            {row.section ? `Section · ${row.section}` : "Default section"}
          </td>
        </tr>
      )}
      <tr
        className="cursor-pointer transition-colors hover:bg-[rgba(7,74,77,0.03)]"
        onClick={onOpen}
      >
        <Td>
          <div style={{ fontWeight: 600, color: studioColors.tealDeep, maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {row.question}
          </div>
        </Td>
        <Td>
          <div style={{ fontSize: 13 }}>{row.page_name}</div>
          <div style={{ fontSize: 11, color: studioColors.faintGray }}>{row.page_route}{row.section ? ` · ${row.section}` : ""}</div>
        </Td>
        <Td>{row.category_name ?? <span style={{ color: studioColors.faintGray }}>—</span>}</Td>
        <Td>
          <Pill status={row.status} size="sm" />
        </Td>
        <Td>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <span style={{ width: 22, textAlign: "right", fontVariantNumeric: "tabular-nums", color: studioColors.mutedGray, fontSize: 12.5 }}>{row.display_order + 1}</span>
            {reorderable && (
              <>
                <OrderBtn dir={-1} disabled={busy} onClick={() => onMove(-1)} />
                <OrderBtn dir={1} disabled={busy} onClick={() => onMove(1)} />
              </>
            )}
          </div>
        </Td>
        <Td>
          <div style={{ fontSize: 12.5 }}>{fmtDate(row.updated_at)}</div>
          {row.updated_by_name && <div style={{ fontSize: 11, color: studioColors.faintGray }}>{row.updated_by_name}</div>}
        </Td>
        <Td>
          <button
            type="button"
            aria-label="More actions"
            aria-haspopup="menu"
            onClick={(e) => {
              e.stopPropagation();
              const r = e.currentTarget.getBoundingClientRect();
              onMenu(r.bottom + 6, r.right - 180);
            }}
            className="grid place-items-center transition-colors hover:bg-[rgba(7,74,77,0.06)]"
            style={{ width: 30, height: 30, border: "none", borderRadius: 8, background: "transparent", color: studioColors.mutedGray, cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
        </Td>
      </tr>
    </>
  );
}

function OrderBtn({ dir, disabled, onClick }: { dir: -1 | 1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === -1 ? "Move up" : "Move down"}
      disabled={disabled}
      onClick={onClick}
      className="grid place-items-center transition-colors hover:bg-[rgba(7,74,77,0.08)]"
      style={{ width: 24, height: 24, border: "none", borderRadius: 6, background: "transparent", color: studioColors.teal, cursor: disabled ? "wait" : "pointer", opacity: disabled ? 0.5 : 1 }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {dir === -1 ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
      </svg>
    </button>
  );
}
