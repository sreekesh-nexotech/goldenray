"use client";

// src/components/Studio/Admin/RolesMatrixScreen.tsx
//
// Roles & Permissions (§6.17): a role list on the left, the module × action
// matrix on the right. The grid is rendered from GET roles/registry/
// so it cannot drift from what the API enforces — a cell that is not allowed
// for a module simply is not drawn.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import { Card, CardHeader, CardTitle, DangerButton, FieldLabel, GhostButton, GoldButton, PageHeader, TextInput, TipBanner } from "../shared/primitives";
import { ConfirmDialog, Modal, ModalTitle } from "../shared/overlays";
import { slugify, studioColors, studioFonts } from "../shared/format";
import { ErrorBox } from "../shared/listing";
import { createRole, deleteRole, getPermissionRegistry, getRoles, roleModuleCount, updateRole, type PermissionRegistry, type StudioRole } from "@/services/adminService";
import type { StudioAction, StudioModule, StudioPermissionMap, StudioScope, StudioScopeMap } from "@/services/studioService";

export default function RolesMatrixScreen() {
  const { tips, toast, can } = useStudio();
  // accounts/views/roles.py splits these three ways; one boolean hid it.
  const canCreate = can("roles", "create");                 // POST roles/
  const canManage = can("roles", "edit");                   // PATCH roles/<uid>/
  const canDelete = can("roles", "manage");                 // DELETE roles/<uid>/

  const [registry, setRegistry] = useState<PermissionRegistry | null>(null);
  const [roles, setRoles] = useState<StudioRole[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StudioPermissionMap>({});
  // Record scopes ({module: "all"|"owned"|…}). The backend keeps a scope only
  // for a module the role actually permits, so this draft is kept in step with
  // `draft` on every grant and revoke (accounts/registry.py normalise_scopes).
  const [scopeDraft, setScopeDraft] = useState<StudioScopeMap>({});
  const [meta, setMeta] = useState({ name: "", description: "" });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  // Slug tracks the name until the user edits it, then stays put.
  const [newSlug, setNewSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(() => {
    setLoadError(null);
    return Promise.all([getPermissionRegistry(), getRoles()])
      .then(([reg, rs]) => {
        setRegistry(reg);
        setRoles(rs.results);
        setSelectedId((cur) => cur ?? rs.results[0]?.uid ?? null);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load roles"));
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(() => roles?.find((r) => r.uid === selectedId) ?? null, [roles, selectedId]);

  useEffect(() => {
    if (!selected) return;
    setDraft(JSON.parse(JSON.stringify(selected.permissions)));
    setScopeDraft(JSON.parse(JSON.stringify(selected.scopes ?? {})));
    setMeta({ name: selected.name, description: selected.description });
    setDirty(false);
  }, [selected]);

  /** The registry's spec for one module (groups are only a display grouping). */
  /** `{all: "All records", owned: "Own records", …}` from the registry. */
  const scopeLabels: Record<string, string> = Object.fromEntries(
    (registry?.scopes ?? []).map((sc) => [sc.key, sc.label]),
  );

  /** Pairs the server refuses on the caller's own record (attendance.edit, …). */
  const selfDenied = (m: StudioModule, a: StudioAction) =>
    Boolean(registry?.self_action_denied?.some((x) => x.module === m && x.action === a));

  const moduleSpec = (m: StudioModule) =>
    registry?.groups.flatMap((g) => g.modules).find((x) => x.key === m);

  const has = (m: StudioModule, a: StudioAction) => Boolean(draft[m]?.includes(a));

  /** Keep `scopeDraft` consistent with a module's permitted/not state. */
  const syncScope = (m: StudioModule, permitted: boolean) =>
    setScopeDraft((sc) => {
      const next = { ...sc };
      if (!permitted) {
        delete next[m]; // the server drops scopes for unpermitted modules
      } else if (next[m] === undefined) {
        next[m] = moduleSpec(m)?.default_scope ?? "all";
      }
      return next;
    });

  const toggle = (m: StudioModule, a: StudioAction) => {
    if (!canManage) return;
    let permitted = true;
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
      permitted = cur.size > 0;
      return next;
    });
    syncScope(m, permitted);
    setDirty(true);
  };
  const toggleModule = (m: StudioModule, allowed: StudioAction[]) => {
    if (!canManage) return;
    let permitted = true;
    setDraft((d) => {
      const all = (d[m]?.length ?? 0) === allowed.length;
      const next = { ...d };
      if (all) delete next[m];
      else next[m] = [...allowed];
      permitted = !all;
      return next;
    });
    syncScope(m, permitted);
    setDirty(true);
  };

  /** Set the record scope for one module. */
  const setScope = (m: StudioModule, value: StudioScope) => {
    if (!canManage) return;
    setScopeDraft((sc) => ({ ...sc, [m]: value }));
    setDirty(true);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateRole(selected.uid, { ...meta, permissions: draft, scopes: scopeDraft, expected_version: selected.version });
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
      const r = await createRole({
        name: newName.trim(),
        slug: (slugTouched ? newSlug : slugify(newName)).trim(),
        description: newDesc.trim(),
        permissions: { dashboard: ["view"] },
      });
      setCreating(false);
      setNewName("");
      setNewSlug("");
      setSlugTouched(false);
      setNewDesc("");
      toast("Role created");
      await load();
      setSelectedId(r.uid);
    } catch (err) {
      setNewError(err instanceof Error ? err.message : "Could not create role");
    }
  };

  const remove = async () => {
    if (!selected) return;
    try {
      await deleteRole(selected.uid);
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
        actions={canCreate ? <GoldButton onClick={() => setCreating(true)}>+ New role</GoldButton> : undefined}
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
              const active = r.uid === selectedId;
              return (
                <button
                  key={r.uid}
                  type="button"
                  onClick={() => setSelectedId(r.uid)}
                  className="text-left transition-colors"
                  style={{ border: "none", borderRadius: 10, padding: "10px 12px", cursor: "pointer", background: active ? "rgba(7,74,77,.08)" : "transparent", fontFamily: "var(--font-switzer)" }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: studioColors.tealDeep }}>{r.name}</span>
                    {r.is_system && <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: studioColors.faintGray }}>Built-in</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 2 }}>
                    {roleModuleCount(r)} module{roleModuleCount(r) === 1 ? "" : "s"} · {r.user_count} user{r.user_count === 1 ? "" : "s"}
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
                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <TextInput value={meta.name} onChange={(v) => { setMeta({ ...meta, name: v }); setDirty(true); }} />
                  </div>
                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <TextInput value={meta.description} onChange={(v) => { setMeta({ ...meta, description: v }); setDirty(true); }} />
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>
                  What this role may do is set by the permission grid below — and, for modules that offer a choice, by its record scope.
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
                      <GroupRows key={g.label || "top"} group={g} actions={registry.actions} has={has} toggle={toggle} toggleModule={toggleModule}
                        scopeOf={(m) => scopeDraft[m]} setScope={setScope} scopeLabels={scopeLabels} selfDenied={selfDenied} canManage={canManage} />
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
          <div>
            <FieldLabel>Slug</FieldLabel>
            <TextInput
              value={slugTouched ? newSlug : slugify(newName)}
              onChange={(v) => { setSlugTouched(true); setNewSlug(v); }}
              placeholder="marketing-editor"
            />
            <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 4 }}>
              Fixed once the role exists. Filled in from the name unless you change it.
            </div>
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <TextInput value={newDesc} onChange={setNewDesc} placeholder="What this role is for" />
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
  scopeOf,
  setScope,
  scopeLabels,
  selfDenied,
  canManage,
}: {
  group: PermissionRegistry["groups"][number];
  actions: PermissionRegistry["actions"];
  has: (m: StudioModule, a: StudioAction) => boolean;
  toggle: (m: StudioModule, a: StudioAction) => void;
  toggleModule: (m: StudioModule, allowed: StudioAction[]) => void;
  /** Current record scope for a module, or undefined when not permitted. */
  scopeOf: (m: StudioModule) => StudioScope | undefined;
  setScope: (m: StudioModule, value: StudioScope) => void;
  /** `{key,label}` for every scope in the registry's vocabulary. */
  scopeLabels: Record<string, string>;
  /** Module/action pairs the server refuses on your own record. */
  selfDenied: (m: StudioModule, a: StudioAction) => boolean;
  canManage: boolean;
}) {
  return (
    <>
      {group.label && (
        <tr>
          <td colSpan={actions.length + 1} style={{ padding: "10px 16px 4px", fontSize: 10.5, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: studioColors.teal }}>
            {group.label}
          </td>
        </tr>
      )}
      {group.modules.map((m) => {
        const granted = actions.filter((a) => has(m.key, a.key)).length;
        const all = granted === m.actions.length;
        return (
          <tr key={m.key} style={{ boxShadow: "inset 0 -1px 0 rgba(229,231,235,.7)" }}>
            <td style={{ padding: "9px 16px" }}>
              <button type="button" onClick={() => toggleModule(m.key, m.actions)} disabled={!canManage} className="text-left" title={m.description} style={{ border: "none", background: "transparent", cursor: canManage ? "pointer" : "default", padding: 0, fontFamily: "var(--font-switzer)" }}>
                <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>
                  {m.key} · {all ? "all" : `${granted}/${m.actions.length}`}
                </div>
              </button>
              {/* Record scope: only modules with a real choice, and only while
                  the role permits the module (the server drops the rest). */}
              {m.scopes.length > 1 && granted > 0 && (
                <div className="flex items-center" style={{ gap: 6, marginTop: 5 }}>
                  <span style={{ fontSize: 10.5, color: studioColors.faintGray, textTransform: "uppercase", letterSpacing: ".06em" }}>Records</span>
                  <select
                    value={scopeOf(m.key) ?? m.default_scope}
                    disabled={!canManage}
                    aria-label={`Record scope for ${m.label}`}
                    onChange={(e) => setScope(m.key, e.target.value as StudioScope)}
                    style={{ fontFamily: "var(--font-switzer)", fontSize: 11.5, padding: "3px 7px", borderRadius: 8, border: "none", boxShadow: `inset 0 0 0 1.5px ${studioColors.inputRing}`, background: "#ffffff", color: studioColors.tealDeep, cursor: canManage ? "pointer" : "default" }}
                  >
                    {m.scopes.map((sc) => (
                      <option key={sc} value={sc}>{scopeLabels[sc] ?? sc}</option>
                    ))}
                  </select>
                </div>
              )}
              {m.permission_only && granted > 0 && (
                <div style={{ fontSize: 10.5, color: studioColors.faintGray, marginTop: 4 }}>No record scope — permission only.</div>
              )}
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
                    title={selfDenied(m.key, a.key) ? `${a.label} is refused on your own record` : undefined}
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
