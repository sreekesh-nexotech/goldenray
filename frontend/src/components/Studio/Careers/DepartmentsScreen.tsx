"use client";

// src/components/Studio/Careers/DepartmentsScreen.tsx
//
// Departments (§6.15): name, description, active state, and the number of
// jobs that depend on each. Deleting is refused by the API while jobs remain,
// so the row menu offers Deactivate first and Delete only when it can succeed.

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import { FieldLabel, GhostButton, GoldButton, PageHeader, TextArea, TextInput, TipBanner } from "../shared/primitives";
import { ConfirmDialog, DropdownMenu, Modal, ModalTitle, type MenuItem } from "../shared/overlays";
import { slugify, studioColors, studioFonts } from "../shared/format";
import { EmptyState, ErrorBox, ListTable, Pill, StateRow, Td, Th, fmtDate } from "../shared/listing";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment, type Department } from "@/services/careersService";

const COLS = 5;

export default function DepartmentsScreen() {
  const { tips, toast, can } = useStudio();
  const [rows, setRows] = useState<Department[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Department | "new" | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [menu, setMenu] = useState<{ row: Department; top: number; left: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Department | null>(null);

  const load = useCallback(() => {
    setLoadError(null);
    return getDepartments()
      .then((p) => setRows(p.results))
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load departments"));
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const open = (d: Department | "new") => {
    setEditing(d);
    setName(d === "new" ? "" : d.name);
    setSlug(d === "new" ? "" : d.slug);
    setSlugTouched(d !== "new");
    setDescription(d === "new" ? "" : d.description);
    setFormError("");
  };

  const submit = async () => {
    if (!name.trim()) {
      setFormError("Enter a department name.");
      return;
    }
    setSaving(true);
    try {
      if (editing === "new") await createDepartment({ name: name.trim(), slug: slug || slugify(name), description });
      else if (editing) await updateDepartment(editing.id, { name: name.trim(), slug, description });
      toast(editing === "new" ? "Department added" : "Saved");
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d: Department) => {
    try {
      await updateDepartment(d.id, { is_active: !d.is_active });
      toast(d.is_active ? "Deactivated" : "Activated");
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update", "error");
    }
  };

  const remove = async (d: Department) => {
    try {
      await deleteDepartment(d.id);
      toast("Department deleted");
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete", "error");
    }
  };

  const menuItems = (d: Department): MenuItem[] => {
    const items: MenuItem[] = [];
    if (can("departments", "edit")) {
      items.push({ label: "Edit", onClick: () => open(d) });
      items.push({ label: d.is_active ? "Deactivate" : "Activate", note: d.is_active ? "hidden from new jobs" : undefined, onClick: () => toggleActive(d) });
    }
    if (can("departments", "archive")) {
      items.push(
        d.job_count > 0
          ? { label: "Delete", note: `${d.job_count} job${d.job_count === 1 ? "" : "s"} depend on it`, color: studioColors.faintGray }
          : { label: "Delete", color: studioColors.danger, onClick: () => setConfirmDelete(d) }
      );
    }
    return items;
  };

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="The teams jobs are posted under. A department with jobs can be deactivated but not deleted."
        actions={can("departments", "create") ? <GoldButton onClick={() => open("new")}>+ Add department</GoldButton> : undefined}
      />

      {tips && <TipBanner>Deactivating hides a department from the position editor without touching the jobs already under it.</TipBanner>}
      {loadError && <ErrorBox message={loadError} onRetry={() => void load()} />}

      <ListTable
        minWidth={640}
        head={
          <>
            <Th>Department</Th>
            <Th>Status</Th>
            <Th style={{ textAlign: "right" }}>Jobs</Th>
            <Th>Updated</Th>
            <Th style={{ width: 56 }} />
          </>
        }
      >
        {rows === null && !loadError && <StateRow colSpan={COLS}>Loading…</StateRow>}
        {rows && rows.length === 0 && (
          <StateRow colSpan={COLS}>
            <EmptyState title="No departments yet" hint="Add the first one — positions need a department before they can be published." action={can("departments", "create") ? <GoldButton onClick={() => open("new")}>+ Add department</GoldButton> : undefined} />
          </StateRow>
        )}
        {rows?.map((d) => (
          <tr key={d.id} className="transition-colors hover:bg-[rgba(7,74,77,0.03)]">
            <Td>
              <div style={{ fontWeight: 600, color: studioColors.tealDeep }}>{d.name}</div>
              {d.description && <div style={{ fontSize: 12, color: studioColors.bodyGray, marginTop: 2, maxWidth: 480 }}>{d.description}</div>}
              <div style={{ fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono, marginTop: 2 }}>{d.slug}</div>
            </Td>
            <Td>
              <Pill status={d.is_active ? "active" : "inactive"} size="sm" />
            </Td>
            <Td style={{ textAlign: "right", fontFamily: studioFonts.num, fontVariantNumeric: "tabular-nums" }}>
              <div>{d.job_count}</div>
              <div style={{ fontSize: 11, color: studioColors.faintGray }}>{d.open_job_count} open</div>
            </Td>
            <Td>
              <span style={{ fontSize: 12.5, fontFamily: studioFonts.num }}>{fmtDate(d.updated_at)}</span>
            </Td>
            <Td>
              <button
                type="button"
                aria-label="More actions"
                aria-haspopup="menu"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setMenu({ row: d, top: r.bottom + 6, left: r.right - 200 });
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

      <DropdownMenu open={menu !== null} onClose={() => setMenu(null)} top={menu?.top ?? 0} left={menu?.left ?? 0} items={menu ? menuItems(menu.row) : []} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} ariaLabel={editing === "new" ? "Add department" : "Edit department"}>
        <ModalTitle>{editing === "new" ? "Add department" : "Edit department"}</ModalTitle>
        <div className="flex flex-col gap-3" style={{ marginTop: 14 }}>
          <div>
            <FieldLabel>Name *</FieldLabel>
            <TextInput
              value={name}
              onChange={(v) => {
                setName(v);
                if (!slugTouched) setSlug(slugify(v));
              }}
              placeholder="Engineering"
            />
          </div>
          <div>
            <FieldLabel>Slug</FieldLabel>
            <TextInput value={slug} onChange={(v) => { setSlug(slugify(v)); setSlugTouched(true); }} mono />
          </div>
          <div>
            <FieldLabel>Short description</FieldLabel>
            <TextArea value={description} onChange={setDescription} minHeight={64} placeholder="Shown on the careers page next to the department." />
          </div>
          {formError && <div style={{ fontSize: 12.5, color: studioColors.danger }}>{formError}</div>}
          <div className="flex justify-end gap-2" style={{ marginTop: 4 }}>
            <GhostButton onClick={() => setEditing(null)}>Cancel</GhostButton>
            <GoldButton onClick={() => void submit()} disabled={saving}>
              {saving ? "Saving…" : editing === "new" ? "Add" : "Save"}
            </GoldButton>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete !== null}
        title={`Delete "${confirmDelete?.name}"?`}
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          const d = confirmDelete;
          setConfirmDelete(null);
          if (d) await remove(d);
        }}
      >
        No jobs depend on this department, so it can be removed. This cannot be undone.
      </ConfirmDialog>
    </>
  );
}
