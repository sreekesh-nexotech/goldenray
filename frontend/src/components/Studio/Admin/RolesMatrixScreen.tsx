"use client";

// src/components/Studio/Admin/RolesMatrixScreen.tsx
//
// Roles & Permissions (§6.17): a role list on the left, the module × action
// matrix on the right. The grid is rendered from GET auth/permission-registry/
// so it cannot drift from what the API enforces — a cell that is not allowed
// for a module simply is not drawn.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import { Card, CardHeader, CardTitle, DangerButton, FieldLabel, GhostButton, GoldButton, PageHeader, SelectField, TextInput, TipBanner } from "../shared/primitives";
import { ConfirmDialog, Modal, ModalTitle } from "../shared/overlays";
import { slugify, studioColors, studioFonts } from "../shared/format";
import { ErrorBox } from "../shared/listing";
import { createRole, deleteRole, getPermissionRegistry, getRoles, updateRole, type PermissionRegistry, type StudioRole } from "@/services/adminService";
import type { StudioAction, StudioModule, StudioPermissionMap } from "@/services/studioService";

export default function RolesMatrixScreen() {
  const { tips, toast, can } = useStudio();
  const canManage = can("roles", "manage") || can("roles", "edit");
  // Deleting a role is the one action the API reserves for `manage`.
  const canDelete = can("roles", "manage");

  const [registry, setRegistry] = useState<PermissionRegistry | null>(null);
  const [roles, setRoles] = useState<StudioRole[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<StudioPermissionMap>({});
  const [meta, setMeta] = useState({ name: "", description: "", legacy_role: "author" as StudioRole["legacy_role"] });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(() => {
    setLoadError(null);
    return Promise.all([getPermissionRegistry(), getRoles()])
      .then(([reg, rs]) => {
        setRegistry(reg);
        setRoles(rs.results);
        setSelectedId((cur) => cur ?? rs.results[0]?.id ?? null);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load roles"));
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(() => roles?.find((r) => r.id === selectedId) ?? null, [roles, selectedId]);

  useEffect(() => {
    if (!selected) return;
    setDraft(JSON.parse(JSON.stringify(selected.permissions)));
    setMeta({ name: selected.name, description: selected.description, legacy_role: selected.legacy_role });
    setDirty(false);
  }, [selected]);

  const has = (m: StudioModule, a: StudioAction) => Boolean(draft[m]?.includes(a));
  const toggle = (m: StudioModule, a: StudioAction) => {
    if (!canManage) return;
    setDraft((d) => {
      const cur = new Set(d[m] ?? []);
      if (cur.has(a)) cur.delete(a);
      else {
        cur.add(a);
        cur.add("view"); // any grant implies being able to see the module
      }
      const next = { ...d };
      if (cur.size) next[m] = Array.from(cur);
      else delete next[m];
      return next;
    });
    setDirty(true);
  };
  const toggleModule = (m: StudioModule, allowed: StudioAction[]) => {
    if (!canManage) return;
    setDraft((d) => {
      const all = (d[m]?.length ?? 0) === allowed.length;
      const next = { ...d };
      if (all) delete next[m];
      else next[m] = [...allowed];
      return next;
    });
    setDirty(true);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateRole(selected.id, { ...meta, permissions: draft });
      toast("Role saved");
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save role", "error");
    } finally {
      setSaving(false);
    }
  };

  const create = async () => {
    if (!newName.trim()) {
      setNewError("Enter a role name.");
      return;
    }
    try {
      const r = await createRole({ name: newName.trim(), slug: slugify(newName), description: "", permissions: { dashboard: ["view"] }, legacy_role: "author" });
      setCreating(false);
      setNewName("");
      toast("Role created");
      await load();
      setSelectedId(r.id);
    } catch (err) {
      setNewError(err instanceof Error ? err.message : "Could not create role");
    }
  };

  const remove = async () => {
    if (!selected) return;
    try {
      await deleteRole(selected.id);
      toast("Role deleted");
      setSelectedId(null);
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete role", "error");
    }
  };

  if (loadError) return <ErrorBox message={loadError} onRetry={() => void load()} />;

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        subtitle="What each role can do, per module. Users pick up the matrix of the role they are assigned."
        actions={canManage ? <GoldButton onClick={() => setCreating(true)}>+ New role</GoldButton> : undefined}
      />

      {tips && (
        <TipBanner>
          Built-in roles can be edited but not deleted. <b>View</b> is implied by any other grant. Comparison, Quotation
          Analyzer and Group Purchasing are Phase 2 and do not appear here.
        </TipBanner>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: "260px minmax(0, 1fr)" }}>
        {/* Role list */}
        <Card style={{ alignSelf: "start" }}>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray }}>{roles?.length ?? 0}</span>
          </CardHeader>
          <div className="flex flex-col" style={{ padding: 6 }}>
            {roles === null && <div style={{ padding: 12, fontSize: 13, color: studioColors.mutedGray }}>Loading…</div>}
            {roles?.map((r) => {
              const active = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className="text-left transition-colors"
                  style={{ border: "none", borderRadius: 10, padding: "10px 12px", cursor: "pointer", background: active ? "rgba(7,74,77,.08)" : "transparent", fontFamily: "var(--font-switzer)" }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: studioColors.tealDeep }}>{r.name}</span>
                    {r.is_system && <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: studioColors.faintGray }}>Built-in</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 2 }}>
                    {r.module_count} module{r.module_count === 1 ? "" : "s"} · {r.user_count} user{r.user_count === 1 ? "" : "s"}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Matrix */}
        {selected && registry && (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{selected.name}</CardTitle>
                {dirty && <span style={{ fontSize: 11.5, color: studioColors.amberInk, fontWeight: 600, marginLeft: 8 }}>Unsaved changes</span>}
                <div className="ml-auto flex gap-2">
                  {canDelete && !selected.is_system && (
                    <DangerButton onClick={() => setConfirmDelete(true)} style={{ height: 34, padding: "0 12px", fontSize: 12.5 }}>Delete</DangerButton>
                  )}
                  {canManage && (
                    <GoldButton onClick={() => void save()} disabled={!dirty || saving} style={{ height: 34, padding: "0 14px", fontSize: 12.5, opacity: dirty ? 1 : 0.6 }}>
                      {saving ? "Saving…" : "Save role"}
                    </GoldButton>
                  )}
                </div>
              </CardHeader>
              <div style={{ padding: 16 }} className="grid gap-3" >
                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 180px" }}>
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <TextInput value={meta.name} onChange={(v) => { setMeta({ ...meta, name: v }); setDirty(true); }} />
                  </div>
                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <TextInput value={meta.description} onChange={(v) => { setMeta({ ...meta, description: v }); setDirty(true); }} />
                  </div>
                  <div>
                    <FieldLabel>Token role</FieldLabel>
                    <SelectField value={meta.legacy_role} onChange={(v) => { setMeta({ ...meta, legacy_role: v as StudioRole["legacy_role"] }); setDirty(true); }}>
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="author">author</option>
                    </SelectField>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>
                  Token role is what the main backend reads for EMI and application changes: <code>editor</code> or above can write there.
                </div>
              </div>
            </Card>

            <Card style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: studioColors.mutedGray, background: "rgba(248,242,225,.55)", borderBottom: `1px solid ${studioColors.ring}` }}>Module</th>
                      {registry.actions.map((a) => (
                        <th key={a.key} style={{ textAlign: "center", padding: "10px 8px", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: studioColors.mutedGray, background: "rgba(248,242,225,.55)", borderBottom: `1px solid ${studioColors.ring}`, width: 84 }}>
                          {a.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registry.groups.map((g) => (
                      <GroupRows key={g.title || "top"} group={g} actions={registry.actions} has={has} toggle={toggle} toggleModule={toggleModule} canManage={canManage} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} ariaLabel="New role">
        <ModalTitle>New role</ModalTitle>
        <div className="flex flex-col gap-3" style={{ marginTop: 14 }}>
          <div>
            <FieldLabel>Role name</FieldLabel>
            <TextInput value={newName} onChange={setNewName} placeholder="Marketing Editor" />
          </div>
          <div style={{ fontSize: 12.5, color: studioColors.mutedGray }}>It starts with Dashboard only — grant modules in the matrix afterwards.</div>
          {newError && <div style={{ fontSize: 12.5, color: studioColors.danger }}>{newError}</div>}
          <div className="flex justify-end gap-2">
            <GhostButton onClick={() => setCreating(false)}>Cancel</GhostButton>
            <GoldButton onClick={() => void create()}>Create</GoldButton>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmDelete} title={`Delete "${selected?.name}"?`} confirmLabel="Delete" onCancel={() => setConfirmDelete(false)} onConfirm={() => { setConfirmDelete(false); void remove(); }}>
        Only possible while no user holds this role. This cannot be undone.
      </ConfirmDialog>
    </>
  );
}

function GroupRows({
  group,
  actions,
  has,
  toggle,
  toggleModule,
  canManage,
}: {
  group: PermissionRegistry["groups"][number];
  actions: PermissionRegistry["actions"];
  has: (m: StudioModule, a: StudioAction) => boolean;
  toggle: (m: StudioModule, a: StudioAction) => void;
  toggleModule: (m: StudioModule, allowed: StudioAction[]) => void;
  canManage: boolean;
}) {
  return (
    <>
      {group.title && (
        <tr>
          <td colSpan={actions.length + 1} style={{ padding: "10px 16px 4px", fontSize: 10.5, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: studioColors.teal }}>
            {group.title}
          </td>
        </tr>
      )}
      {group.modules.map((m) => {
        const granted = actions.filter((a) => has(m.key, a.key)).length;
        const all = granted === m.actions.length;
        return (
          <tr key={m.key} style={{ boxShadow: "inset 0 -1px 0 rgba(229,231,235,.7)" }}>
            <td style={{ padding: "9px 16px" }}>
              <button type="button" onClick={() => toggleModule(m.key, m.actions)} disabled={!canManage} className="text-left" style={{ border: "none", background: "transparent", cursor: canManage ? "pointer" : "default", padding: 0, fontFamily: "var(--font-switzer)" }}>
                <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>
                  {m.key} · {all ? "all" : `${granted}/${m.actions.length}`}
                </div>
              </button>
            </td>
            {actions.map((a) => {
              const allowed = m.actions.includes(a.key);
              if (!allowed) return <td key={a.key} style={{ textAlign: "center", color: "#D5D7DA" }}>·</td>;
              const on = has(m.key, a.key);
              return (
                <td key={a.key} style={{ textAlign: "center", padding: "6px 8px" }}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`${a.label} ${m.label}`}
                    disabled={!canManage}
                    onClick={() => toggle(m.key, a.key)}
                    className="transition-colors"
                    style={{ width: 22, height: 22, borderRadius: 6, border: "none", cursor: canManage ? "pointer" : "default", background: on ? studioColors.teal : "#ffffff", boxShadow: on ? "none" : `inset 0 0 0 1.5px ${studioColors.inputRing}`, display: "inline-grid", placeItems: "center" }}
                  >
                    {on && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12.5 4.5 4.5L19 7" />
                      </svg>
                    )}
                  </button>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
