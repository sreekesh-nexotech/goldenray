"use client";

// src/components/Studio/Careers/PositionsScreen.tsx
//
// Job positions list (§6.11): search; filter by department, location,
// employment type and status; the specified columns; publish / unpublish /
// close / archive from the row menu. Application counts are joined from the
// goldenray API by position id, since that data lives in the other service.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { GoldButton, PageHeader, TipBanner } from "../shared/primitives";
import { ConfirmDialog, DropdownMenu, type MenuItem } from "../shared/overlays";
import { studioColors, studioFonts } from "../shared/format";
import { EmptyState, ErrorBox, FilterSelect, ListTable, Pager, Pill, StateRow, Td, Th, Toolbar, fmtDate } from "../shared/listing";
import {
  EMPLOYMENT_TYPES,
  archivePosition,
  closePosition,
  getDepartments,
  getPositions,
  publishPosition,
  unpublishPosition,
  type Department,
  type EmploymentType,
  type PositionListItem,
  type PositionStatus,
} from "@/services/careersService";
import { getCareerApplications } from "@/services/careerApplicationService";
import { StudioApiError } from "@/services/studioService";

const COLS = 8;

export default function PositionsScreen() {
  const router = useRouter();
  const { tips, toast, can } = useStudio();

  const [rows, setRows] = useState<PositionListItem[] | null>(null);
  const [count, setCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appCounts, setAppCounts] = useState<Record<number, number>>({});

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<EmploymentType | "">("");
  const [status, setStatus] = useState<PositionStatus | "">("");
  const [pageNo, setPageNo] = useState(1);

  const [menu, setMenu] = useState<{ row: PositionListItem; top: number; left: number } | null>(null);
  const [confirmArchive, setConfirmArchive] = useState<PositionListItem | null>(null);

  useEffect(() => {
    getDepartments().then((p) => setDepartments(p.results)).catch(() => {});
    if (can("applications")) {
      // One fetch for the whole list; grouped by the snapshotted position id.
      getCareerApplications()
        .then((apps) => {
          const counts: Record<number, number> = {};
          for (const a of apps as (typeof apps[number] & { position_id?: number | null })[]) {
            if (a.position_id) counts[a.position_id] = (counts[a.position_id] ?? 0) + 1;
          }
          setAppCounts(counts);
        })
        .catch(() => {});
    }
  }, [can]);

  const load = useCallback(() => {
    setLoadError(null);
    return getPositions({
      search: search || undefined,
      department: department ? Number(department) : "",
      location: location || undefined,
      employment_type: type,
      status,
      include_archived: status === "archived",
      page: pageNo,
    })
      .then((p) => {
        setRows(p.results);
        setCount(p.count);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load positions"));
  }, [search, department, location, type, status, pageNo]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(load, search || location ? 250 : 0);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [load, search, location]);

  const filtering = Boolean(search || department || location || type || status);
  const clear = () => {
    setSearch("");
    setDepartment("");
    setLocation("");
    setType("");
    setStatus("");
    setPageNo(1);
  };

  const act = async (label: string, fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await load();
    } catch (err) {
      const msg = err instanceof StudioApiError && err.errors?.length ? `${label}: ${err.errors.join(" ")}` : err instanceof Error ? err.message : `${label} failed`;
      toast(msg, "error");
    }
  };

  const menuItems = (row: PositionListItem): MenuItem[] => {
    const items: MenuItem[] = [{ label: can("job_positions", "edit") ? "Edit" : "View", onClick: () => router.push(`/studio/careers/positions/${row.id}`) }];
    if (row.status !== "archived") items.push({ label: "Preview", note: "public job page", onClick: () => router.push(`/studio/careers/positions/${row.id}?preview=1`) });
    if (can("job_positions", "publish")) {
      if (row.status === "published") items.push({ label: "Unpublish", note: "back to draft", onClick: () => act("Unpublish", () => unpublishPosition(row.id), "Unpublished") });
      else if (row.status === "draft" || row.status === "closed") items.push({ label: "Publish", note: "live on the careers page", onClick: () => act("Publish", () => publishPosition(row.id), "Published") });
    }
    if (can("job_positions", "edit") && row.status === "published") items.push({ label: "Close", note: "stop accepting applications", onClick: () => act("Close", () => closePosition(row.id), "Closed") });
    if (can("job_positions", "archive") && row.status !== "archived") items.push({ label: "Archive", color: studioColors.danger, onClick: () => setConfirmArchive(row) });
    return items;
  };

  const locations = useMemo(() => Array.from(new Set((rows ?? []).map((r) => r.location))).sort(), [rows]);

  return (
    <>
      <PageHeader
        title="Job Positions"
        subtitle="Only published positions appear in Open Positions on the careers page."
        actions={can("job_positions", "create") ? <GoldButton onClick={() => router.push("/studio/careers/positions/new")}>+ Add position</GoldButton> : undefined}
      />

      {tips && <TipBanner>Draft a position, preview it, then publish. Closing keeps the page readable but stops applications; archiving removes it from lists while keeping its applications intact.</TipBanner>}

      {loadError && <ErrorBox message={loadError} onRetry={load} />}

      <Toolbar search={search} onSearch={(v) => { setSearch(v); setPageNo(1); }} placeholder="Search positions…" filtering={filtering} onClear={clear}>
        <FilterSelect value={department} onChange={(v) => { setDepartment(v); setPageNo(1); }} ariaLabel="Filter by department" width={170}>
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={location} onChange={(v) => { setLocation(v); setPageNo(1); }} ariaLabel="Filter by location" width={150}>
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={type} onChange={(v) => { setType(v as EmploymentType | ""); setPageNo(1); }} ariaLabel="Filter by employment type" width={140}>
          <option value="">All types</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={status} onChange={(v) => { setStatus(v as PositionStatus | ""); setPageNo(1); }} ariaLabel="Filter by status" width={130}>
          <option value="">Active</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </FilterSelect>
      </Toolbar>

      <ListTable
        minWidth={920}
        head={
          <>
            <Th>Title</Th>
            <Th>Department</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th style={{ textAlign: "right" }}>Applications</Th>
            <Th>Updated</Th>
            <Th style={{ width: 56 }} />
          </>
        }
      >
        {rows === null && !loadError && <StateRow colSpan={COLS}>Loading…</StateRow>}
        {rows && rows.length === 0 && (
          <StateRow colSpan={COLS}>
            <EmptyState
              title={filtering ? "No positions match" : "No positions yet"}
              hint={filtering ? "Try widening the filters." : "Add the first job. It stays a draft until you publish it."}
              action={!filtering && can("job_positions", "create") ? <GoldButton onClick={() => router.push("/studio/careers/positions/new")}>+ Add position</GoldButton> : undefined}
            />
          </StateRow>
        )}
        {rows?.map((row) => (
          <tr key={row.id} className="cursor-pointer transition-colors hover:bg-[rgba(7,74,77,0.03)]" onClick={() => router.push(`/studio/careers/positions/${row.id}`)}>
            <Td>
              <div style={{ fontWeight: 600, color: studioColors.tealDeep }}>{row.title}</div>
              <div style={{ fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>/career/{row.slug}</div>
            </Td>
            <Td>{row.department_name}</Td>
            <Td>{row.location}</Td>
            <Td>{row.employment_type_label}</Td>
            <Td>
              <Pill status={row.status} size="sm" />
            </Td>
            <Td style={{ textAlign: "right", fontFamily: studioFonts.num, fontVariantNumeric: "tabular-nums" }}>{appCounts[row.id] ?? 0}</Td>
            <Td>
              <span style={{ fontSize: 12.5, fontFamily: studioFonts.num }}>{fmtDate(row.updated_at)}</span>
            </Td>
            <Td>
              <button
                type="button"
                aria-label="More actions"
                aria-haspopup="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  const r = e.currentTarget.getBoundingClientRect();
                  setMenu({ row, top: r.bottom + 6, left: r.right - 200 });
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
        ))}
      </ListTable>

      <Pager page={pageNo} count={count} onPage={setPageNo} />

      <DropdownMenu open={menu !== null} onClose={() => setMenu(null)} top={menu?.top ?? 0} left={menu?.left ?? 0} items={menu ? menuItems(menu.row) : []} />

      <ConfirmDialog
        open={confirmArchive !== null}
        title="Archive this position?"
        confirmLabel="Archive"
        onCancel={() => setConfirmArchive(null)}
        onConfirm={async () => {
          const row = confirmArchive;
          setConfirmArchive(null);
          if (row) await act("Archive", () => archivePosition(row.id), "Archived");
        }}
      >
        It leaves the careers page and the lists here. Applications already received for it are kept.
      </ConfirmDialog>
    </>
  );
}
