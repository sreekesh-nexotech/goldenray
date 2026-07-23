"use client";

// src/components/Studio/Roles/RolesScreen.tsx
//
// Roles & access — the internal user list backed by auth/users/ (admin only:
// everyone else gets a 403 and sees the lock banner), a "Preview as" segmented
// control that drives capability gating across the whole studio, and the
// read-only role permission matrix (presentational copy of the server rules).

import { useEffect, useState } from "react";
import type { Role } from "@/types/studio";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill, SelectField, GhostButton, thStyle, tdStyle } from "../shared/primitives";
import { ConfirmDialog } from "../shared/overlays";
import { initialsOf, studioColors } from "../shared/format";
import { InviteModal, type NewUserPayload } from "./InviteModal";
import {
  getUsers,
  createUser,
  patchUser,
  deleteUser,
  isAuthError,
  StudioApiError,
  type StudioUser,
  type StudioApiRole,
} from "@/services/studioService";

// The design uses tighter row paddings than the shared tdStyle (12px): member
// rows are 11px, permission-matrix rows are 13px.
const memberTd = { ...tdStyle, padding: "11px 16px" } as const;
const matrixTd = { ...tdStyle, padding: "13px 16px" } as const;

/* -------------------------------------------------------------------------- */
/*  Static presentational copy (mirrors the server's role rules)               */
/* -------------------------------------------------------------------------- */

const roleOptions: Role[] = ["Admin", "Editor", "Author"];

const apiRoleOptions: { value: StudioApiRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "author", label: "Author" },
];

const apiRoleLabel: Record<StudioApiRole, string> = { admin: "Admin", editor: "Editor", author: "Author" };

const rolePreviewNotes: Record<Role, string> = {
  Admin: "Admins manage structure, publish and delete.",
  Editor: "Editors write, publish and delete — but not structure.",
  Author: "Authors write drafts; an editor publishes them.",
};

const rolePermissions: { role: Role; sub: string; cells: boolean[] }[] = [
  { role: "Admin", sub: "Full control — structure, content, people", cells: [true, true, true, true] },
  { role: "Editor", sub: "Content & publishing, no structure", cells: [false, true, true, true] },
  { role: "Author", sub: "Writes drafts; an editor publishes", cells: [false, true, false, false] },
];

/** Display name for a user row. */
function displayName(u: StudioUser): string {
  return [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username;
}

const activePill = { label: "Active", bg: "#C3E0BD", ink: "#0A6B31" };
const inactivePill = { label: "Deactivated", bg: "#E5E7EB", ink: "#5B5B5B" };

/* -------------------------------------------------------------------------- */
/*  Preview-as segmented control                                               */
/* -------------------------------------------------------------------------- */

function PreviewSegment() {
  const { role, setRole } = useStudio();
  return (
    <div style={{ display: "flex", gap: 4, background: "rgba(248,242,225,.95)", padding: 4, borderRadius: 12 }}>
      {roleOptions.map((r) => {
        const active = role === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            style={{
              height: 30,
              padding: "0 15px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-switzer)",
              fontSize: 12.5,
              fontWeight: 600,
              transition: "background .12s,color .12s",
              background: active ? "#ffffff" : "transparent",
              color: active ? studioColors.tealDeep : studioColors.bodyGray,
              boxShadow: active ? "0 1px 2px rgba(10,13,18,.08)" : "none",
            }}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Member row                                                                  */
/* -------------------------------------------------------------------------- */

function MemberRow({
  user,
  self,
  editable,
  busy,
  onRoleChange,
  onDeactivate,
  onReactivate,
}: {
  user: StudioUser;
  self: boolean;
  editable: boolean;
  busy: boolean;
  onRoleChange: (v: StudioApiRole) => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}) {
  const name = displayName(user);
  return (
    <tr style={{ opacity: user.is_active ? 1 : 0.65 }}>
      <td style={memberTd}>
        <div className="flex items-center gap-2.5">
          <div
            className="grid place-items-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: studioColors.cream,
              boxShadow: "inset 0 0 0 1px rgba(18,53,50,.15)",
              color: "#074A4D",
              fontSize: 10.5,
              fontWeight: 700,
              flex: "none",
            }}
          >
            {initialsOf(name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center" style={{ gap: 7 }}>
              <span style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{name}</span>
              {self && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#074A4D",
                    background: "rgba(173,214,216,.5)",
                    padding: "1px 7px",
                    borderRadius: 999,
                  }}
                >
                  You
                </span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>{user.email || user.username}</div>
          </div>
        </div>
      </td>
      <td style={memberTd}>
        {editable ? (
          <div style={{ maxWidth: 150 }}>
            <SelectField
              value={user.role}
              ariaLabel={`Role for ${name}`}
              onChange={(v) => onRoleChange(v as StudioApiRole)}
              style={{ fontSize: 13, padding: "8px 30px 8px 11px", borderRadius: 10 }}
            >
              {apiRoleOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectField>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: studioColors.bodyGray, fontWeight: 500 }}>{apiRoleLabel[user.role]}</span>
        )}
      </td>
      <td style={memberTd}>
        <StatusPill pill={user.is_active ? activePill : inactivePill} />
      </td>
      <td style={memberTd}>
        <div className="flex justify-end" style={{ gap: 6 }}>
          {editable && !user.is_active && (
            <GhostButton onClick={onReactivate} disabled={busy} style={{ height: 30, padding: "0 11px", fontSize: 12, borderRadius: 9 }}>
              Reactivate
            </GhostButton>
          )}
          {editable && user.is_active && (
            <button
              type="button"
              onClick={onDeactivate}
              disabled={busy}
              aria-label={`Deactivate ${name}`}
              className="inline-flex items-center transition-colors hover:bg-[rgba(220,38,38,0.08)]"
              style={{
                height: 30,
                padding: "0 11px",
                borderRadius: 9,
                border: "none",
                background: "transparent",
                color: studioColors.danger,
                fontFamily: "var(--font-switzer)",
                fontSize: 12,
                fontWeight: 600,
                cursor: busy ? "default" : "pointer",
              }}
            >
              Remove
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/*  Permission matrix cell                                                      */
/* -------------------------------------------------------------------------- */

function PermCell({ yes }: { yes: boolean }) {
  return (
    <td style={matrixTd}>
      {yes ? (
        <span
          className="inline-grid place-items-center"
          style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(195,223,189,.6)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A6B31" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
      ) : (
        <span style={{ color: studioColors.hairline }}>&#8212;</span>
      )}
    </td>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                      */
/* -------------------------------------------------------------------------- */

export default function RolesScreen() {
  const { role, tips, toast, me } = useStudio();
  const { isAdmin } = useCapabilities();

  const [users, setUsers] = useState<StudioUser[] | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmUser, setConfirmUser] = useState<StudioUser | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUsers()
      .then((page) => !cancelled && setUsers(page.results))
      .catch((err) => {
        if (cancelled) return;
        if (isAuthError(err)) setForbidden(true);
        else setLoadError(err instanceof Error ? err.message : "Failed to load users");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const replaceUser = (u: StudioUser) => setUsers((prev) => prev?.map((x) => (x.id === u.id ? u : x)) ?? prev);

  const changeRole = async (u: StudioUser, next: StudioApiRole) => {
    setBusyId(u.id);
    try {
      const updated = await patchUser(u.id, { role: next });
      replaceUser(updated);
      toast(`Role updated to ${apiRoleLabel[next]}`);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Update failed: ${err.message}` : "Update failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  const deactivate = async () => {
    if (!confirmUser) return;
    setDeactivating(true);
    try {
      await deleteUser(confirmUser.id);
      replaceUser({ ...confirmUser, is_active: false });
      toast(`${displayName(confirmUser)} deactivated`);
      setConfirmUser(null);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Remove failed: ${err.message}` : "Remove failed", "error");
    } finally {
      setDeactivating(false);
    }
  };

  const reactivate = async (u: StudioUser) => {
    setBusyId(u.id);
    try {
      const updated = await patchUser(u.id, { is_active: true });
      replaceUser(updated);
      toast(`${displayName(u)} reactivated`);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Reactivate failed: ${err.message}` : "Reactivate failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (payload: NewUserPayload) => {
    try {
      const created = await createUser(payload);
      setUsers((prev) => [...(prev ?? []), created]);
      toast(`${created.username} added`);
      setInviteOpen(false);
    } catch (err) {
      // Re-throw with the API's message so the modal shows it inline.
      throw new Error(err instanceof StudioApiError ? err.message : "Couldn’t create the user");
    }
  };

  const memberCount = users?.length ?? 0;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Roles & access"
        subtitle="Who can do what inside the CMS. The delivery API stays public read-only regardless."
      />

      {tips && (
        <TipBanner mb={14}>
          Use <b style={{ color: studioColors.tealDeep }}>Preview as</b> to feel the gating — publish buttons, bulk actions and the template builder react across the whole studio.
        </TipBanner>
      )}

      {/* Team members card */}
      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden", marginBottom: 14 }}>
        <div className="flex flex-wrap items-center" style={{ gap: 12, padding: "13px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep }}>Team members</span>
            {users !== null && <span style={{ fontSize: 12, color: studioColors.faintGray }}> &#183; {memberCount}</span>}
          </div>
          {isAdmin && !forbidden && (
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center transition-[filter] hover:brightness-[.96]"
              style={{
                marginLeft: "auto",
                gap: 6,
                height: 36,
                padding: "0 15px",
                borderRadius: 12,
                border: "none",
                background: studioColors.gold,
                color: studioColors.goldInk,
                fontFamily: "var(--font-switzer)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
              Add user
            </button>
          )}
        </div>

        {/* Preview-as lock: real admin previewing a lesser role sees the
            view-only state the lesser role would get. */}
        {!forbidden && !isAdmin && (
          <div
            className="flex items-center"
            style={{
              gap: 9,
              padding: "10px 16px",
              background: "rgba(251,232,218,.6)",
              color: "#9C4B21",
              fontSize: 12,
              lineHeight: 1.45,
              boxShadow: `inset 0 -1px 0 ${studioColors.ring}`,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
              <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
              <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
            Only Admins can add teammates or change roles — this list is view-only for {role}s.
          </div>
        )}

        {forbidden ? (
          <div
            className="flex items-center"
            style={{
              gap: 9,
              padding: "14px 16px",
              background: "rgba(251,232,218,.6)",
              color: "#9C4B21",
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
              <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
              <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
            Only Admins can view and manage the team — ask an Admin if you need access changed.
          </div>
        ) : loadError ? (
          <div role="alert" style={{ padding: "16px", fontSize: 13, color: studioColors.danger }}>
            Couldn’t load the team: {loadError}
          </div>
        ) : users === null ? (
          <div style={{ padding: "16px", fontSize: 13, color: studioColors.mutedGray }}>Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Member</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, width: 150 }} />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const self = me?.id === u.id;
                  return (
                    <MemberRow
                      key={u.id}
                      user={u}
                      self={self}
                      editable={isAdmin && !self}
                      busy={busyId === u.id}
                      onRoleChange={(v) => changeRole(u, v)}
                      onDeactivate={() => setConfirmUser(u)}
                      onReactivate={() => reactivate(u)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview-as bar */}
      <div
        className="flex flex-wrap items-center"
        style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "13px 16px", marginBottom: 14, gap: 14 }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>Preview the CMS as</span>
        <PreviewSegment />
        <span style={{ fontSize: 12, color: studioColors.bodyGray }}>{rolePreviewNotes[role]}</span>
      </div>

      {/* Permission matrix */}
      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Manage structure</th>
                <th style={thStyle}>Author entries</th>
                <th style={thStyle}>Publish</th>
                <th style={thStyle}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions.map((r) => (
                <tr key={r.role}>
                  <td style={matrixTd}>
                    <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{r.role}</div>
                    <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 1 }}>{r.sub}</div>
                  </td>
                  {r.cells.map((c, i) => (
                    <PermCell key={i} yes={c} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmUser !== null}
        title="Deactivate user?"
        confirmLabel="Deactivate"
        busy={deactivating}
        busyLabel="Deactivating…"
        onCancel={() => setConfirmUser(null)}
        onConfirm={deactivate}
      >
        {confirmUser && (
          <>
            <b style={{ color: studioColors.tealDeep }}>{displayName(confirmUser)}</b> will lose access to the
            studio immediately. Their authorship history stays intact, and an Admin can reactivate the account
            later.
          </>
        )}
      </ConfirmDialog>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onCreate={handleCreate} />
    </section>
  );
}
