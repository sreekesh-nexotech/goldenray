"use client";

// src/components/Studio/Roles/RolesScreen.tsx
//
// Roles & access — the internal user list backed by auth/users/ (admin only:
// everyone else gets a 403 and sees the lock banner), a "Preview as" segmented
// control that drives capability gating across the whole studio, and the
// team list backed by the platform's users/ and roles/ endpoints.

import { useEffect, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill, SelectField, GhostButton, thStyle, tdStyle } from "../shared/primitives";
import { ConfirmDialog } from "../shared/overlays";
import { initialsOf, studioColors } from "../shared/format";
import { InviteModal, type NewUserPayload } from "./InviteModal";
import {
  getUsers,
  createUser,
  patchUser,
  deactivateUser,
  reactivateUser,
  forceUserReset,
  isAuthError,
  StudioApiError,
  type StudioUser,
} from "@/services/studioService";
import { getRoles, type StudioRole } from "@/services/adminService";

// The design uses tighter row paddings than the shared tdStyle (12px): member
// rows are 11px, permission-matrix rows are 13px.
const memberTd = { ...tdStyle, padding: "11px 16px" } as const;

/* -------------------------------------------------------------------------- */
/*  Row helpers                                                                */
/* -------------------------------------------------------------------------- */

/** Display name for a user row. */
function displayName(u: StudioUser): string {
  return u.full_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email;
}

const activePill = { label: "Active", bg: "#C3E0BD", ink: "#0A6B31" };
const inactivePill = { label: "Deactivated", bg: "#E5E7EB", ink: "#5B5B5B" };

/* -------------------------------------------------------------------------- */
/*  Member row                                                                  */
/* -------------------------------------------------------------------------- */

function MemberRow({
  user,
  self,
  canChangeRole,
  canSetActive,
  canForceReset,
  busy,
  roles,
  onRoleChange,
  onDeactivate,
  onReactivate,
  onForceReset,
}: {
  user: StudioUser;
  self: boolean;
  /** `users.edit` — assigning a role. */
  canChangeRole: boolean;
  /** `users.archive` — deactivate / reactivate are actions, not a PATCH. */
  canSetActive: boolean;
  /** `users.manage` — force-reset invalidates the user's password. */
  canForceReset: boolean;
  busy: boolean;
  /** Phase 1 roles (§6.17); the select assigns one of these. */
  roles: StudioRole[];
  onRoleChange: (roleUid: string) => void;
  onDeactivate: () => void;
  onForceReset: () => void;
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
            <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>{user.email}</div>
          </div>
        </div>
      </td>
      <td style={memberTd}>
        {canChangeRole ? (
          <div style={{ maxWidth: 150 }}>
            <SelectField
              value={user.role?.uid ?? ""}
              ariaLabel={`Role for ${name}`}
              onChange={(v) => v && onRoleChange(v)}
              style={{ fontSize: 13, padding: "8px 30px 8px 11px", borderRadius: 10 }}
            >
              {!user.role && <option value="">No role</option>}
              {roles.map((r) => (
                <option key={r.uid} value={r.uid}>
                  {r.name}
                </option>
              ))}
            </SelectField>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: studioColors.bodyGray, fontWeight: 500 }}>
            {user.role?.name ?? "No role"}
          </span>
        )}
      </td>
      <td style={memberTd}>
        <StatusPill pill={user.is_active ? activePill : inactivePill} />
        {user.must_reset_password && (
          <div style={{ fontSize: 11, color: studioColors.faintGray, marginTop: 3 }}>Password reset pending</div>
        )}
      </td>
      <td style={memberTd}>
        <div className="flex justify-end" style={{ gap: 6 }}>
          {canSetActive && !user.is_active && (
            <GhostButton onClick={onReactivate} disabled={busy} style={{ height: 30, padding: "0 11px", fontSize: 12, borderRadius: 9 }}>
              Reactivate
            </GhostButton>
          )}
          {canForceReset && user.is_active && (
            <GhostButton onClick={onForceReset} disabled={busy} style={{ height: 30, padding: "0 11px", fontSize: 12, borderRadius: 9 }}>
              Reset password
            </GhostButton>
          )}
          {canSetActive && user.is_active && (
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

/* -------------------------------------------------------------------------- */
/*  Screen                                                                      */
/* -------------------------------------------------------------------------- */

export default function RolesScreen() {
  const { tips, toast, me, can } = useStudio();
  // accounts/views/users.py maps these three ways; `isAdmin` hid the difference.
  const canInvite = can("users", "create");
  const canChangeRole = can("users", "edit");
  const canSetActive = can("users", "archive");
  const canForceReset = can("users", "manage");
  const canSeeUsers = can("users", "view");

  const [users, setUsers] = useState<StudioUser[] | null>(null);
  const [roles, setRoles] = useState<StudioRole[]>([]);
  const [forbidden, setForbidden] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<StudioUser | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [confirmReset, setConfirmReset] = useState<StudioUser | null>(null);
  const [resetting, setResetting] = useState(false);

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

  /** Force a password reset: the user's current password stops working. */
  const doForceReset = async () => {
    if (!confirmReset) return;
    setResetting(true);
    try {
      const updated = await forceUserReset(confirmReset.uid, confirmReset.version);
      replaceUser(updated);
      toast(`${displayName(confirmReset)} must set a new password`);
      setConfirmReset(null);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Reset failed: ${err.message}` : "Reset failed", "error");
    } finally {
      setResetting(false);
    }
  };

  const replaceUser = (u: StudioUser) => setUsers((prev) => prev?.map((x) => (x.uid === u.uid ? u : x)) ?? prev);

  useEffect(() => {
    getRoles().then((p) => setRoles(p.results)).catch(() => {});
  }, []);

  const changeRole = async (u: StudioUser, roleUid: string) => {
    setBusyId(u.uid);
    try {
      // Permissions come from the role, so changing it is the whole change;
      // `expected_version` makes a concurrent edit a 409 rather than a silent
      // overwrite.
      const updated = await patchUser(u.uid, { role: roleUid, expected_version: u.version });
      replaceUser(updated);
      toast(`Role updated to ${updated.role?.name ?? "no role"}`);
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
      const updated = await deactivateUser(confirmUser.uid, confirmUser.version);
      replaceUser(updated);
      toast(`${displayName(confirmUser)} deactivated`);
      setConfirmUser(null);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Remove failed: ${err.message}` : "Remove failed", "error");
    } finally {
      setDeactivating(false);
    }
  };

  const reactivate = async (u: StudioUser) => {
    setBusyId(u.uid);
    try {
      // `is_active` is read-only on the user resource; reactivating is an action.
      const updated = await reactivateUser(u.uid, u.version);
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
      // Only the no-password branch sends mail, so don't claim an invite that never went out.
      toast(payload.password ? `${created.email} created` : `${created.email} invited`);
      setInviteOpen(false);
    } catch (err) {
      // Re-throw with the API's message so the modal shows it inline. A rejected
      // password comes back as a field error, which carries the actual rule
      // (too common, too similar to the e-mail) that the generic message omits.
      if (err instanceof StudioApiError) {
        throw new Error(err.fieldError("password") ?? err.errors?.[0] ?? err.message);
      }
      throw new Error("Couldn’t create the user");
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
          {canInvite && !forbidden && (
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

        {/* Read-only state: the user may view the team but not change it. */}
        {!forbidden && !canSeeUsers && (
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
            Your role can view the team but not change it — adding teammates and changing roles
            needs the users module.
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
            Viewing the team needs the users module — ask someone who manages access.
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
                  const self = me?.user.uid === u.uid;
                  return (
                    <MemberRow
                      key={u.uid}
                      user={u}
                      self={self}
                      canChangeRole={canChangeRole && !self}
                      canSetActive={canSetActive && !self}
                      busy={busyId === u.uid}
                      roles={roles}
                      onRoleChange={(v) => changeRole(u, v)}
                      canForceReset={canForceReset && !self}
                      onDeactivate={() => setConfirmUser(u)}
                      onForceReset={() => setConfirmReset(u)}
                      onReactivate={() => reactivate(u)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmReset !== null}
        title="Force a password reset?"
        busy={resetting}
        busyLabel="Resetting…"
        confirmLabel="Reset password"
        onCancel={() => setConfirmReset(null)}
        onConfirm={() => void doForceReset()}
      >
        {confirmReset && (
          <>
            <b style={{ color: studioColors.tealDeep }}>{displayName(confirmReset)}</b> will be signed out and
            their current password will stop working. They set a new one from the e-mail they receive.
          </>
        )}
      </ConfirmDialog>

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

      <InviteModal
        roles={roles} open={inviteOpen} onClose={() => setInviteOpen(false)} onCreate={handleCreate} />
    </section>
  );
}
