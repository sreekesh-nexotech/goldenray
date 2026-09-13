"use client";

// src/components/Studio/Pages/PagesScreen.tsx
//
// Pages list (§6.2): every maintainable route on the site — name, URL,
// status, last updated — plus what each page carries (image slots, FAQs) and
// its SEO validity. Opening a row goes to the controlled maintenance view.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { EmptyState, ErrorBox, FilterSelect, ListTable, LockedTag, Pill, StateRow, Td, Th, Toolbar, fmtDate } from "../shared/listing";
import { getPages, type PageListItem } from "@/services/pagesService";

const COLS = 6;

export default function PagesScreen() {
  const router = useRouter();
  const { tips } = useStudio();
  const [rows, setRows] = useState<PageListItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");

  const load = useCallback(() => {
    setLoadError(null);
    getPages()
      .then((p) => setRows(p.results))
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load pages"));
  }, []);
  useEffect(load, [load]);

  const groups = useMemo(() => Array.from(new Set((rows ?? []).map((r) => r.group).filter(Boolean))), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (rows ?? []).filter((r) => (!group || r.group === group) && (!q || r.name.toLowerCase().includes(q) || r.route.toLowerCase().includes(q)));
  }, [rows, search, group]);

  return (
    <>
      <PageHeader title="Pages" subtitle="Approved website pages. Replace images, correct exposed text and maintain SEO — the page's copy and layout stay as built." />

      {tips && (
        <TipBanner>
          Pages are registered from the site&apos;s real routes; you cannot add or delete one here. A locked
          page still exposes its image slots, text fields and SEO — the lock is on everything else.
        </TipBanner>
      )}

      {loadError && <ErrorBox message={loadError} onRetry={load} />}

      <Toolbar search={search} onSearch={setSearch} placeholder="Search by name or URL…" filtering={Boolean(search || group)} onClear={() => { setSearch(""); setGroup(""); }}>
        <FilterSelect value={group} onChange={setGroup} ariaLabel="Filter by group" width={170}>
          <option value="">All groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </FilterSelect>
      </Toolbar>

      <ListTable
        head={
          <>
            <Th>Page</Th>
            <Th>URL</Th>
            <Th>Status</Th>
            <Th>Maintains</Th>
            <Th>SEO</Th>
            <Th>Updated</Th>
          </>
        }
      >
        {rows === null && !loadError && <StateRow colSpan={COLS}>Loading…</StateRow>}
        {rows && filtered.length === 0 && (
          <StateRow colSpan={COLS}>
            <EmptyState title={rows.length ? "No pages match" : "No pages registered"} hint={rows.length ? undefined : "Run `manage.py seed_pages` on the CMS to register the site's routes."} />
          </StateRow>
        )}
        {filtered.map((r) => (
          <tr key={r.id} className="cursor-pointer transition-colors hover:bg-[rgba(7,74,77,0.03)]" onClick={() => router.push(`/studio/pages/${r.id}`)}>
            <Td>
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 600, color: studioColors.tealDeep }}>{r.name}</span>
                {r.is_protected && <LockedTag />}
              </div>
              {r.group && <div style={{ fontSize: 11, color: studioColors.faintGray }}>{r.group}</div>}
            </Td>
            <Td mono>{r.route}</Td>
            <Td>
              <Pill status={r.status} size="sm" />
            </Td>
            <Td>
              <span style={{ fontSize: 12.5, color: studioColors.bodyGray }}>
                {r.image_slot_count} image{r.image_slot_count === 1 ? "" : "s"} · {r.faq_count} FAQ{r.faq_count === 1 ? "" : "s"}
              </span>
            </Td>
            <Td>
              <Pill status={r.seo_status} size="sm" />
            </Td>
            <Td>
              <span style={{ fontSize: 12.5, fontFamily: studioFonts.num }}>{fmtDate(r.updated_at)}</span>
            </Td>
          </tr>
        ))}
      </ListTable>
    </>
  );
}
