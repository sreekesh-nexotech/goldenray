"use client";

// src/components/Studio/Roles/RolesScreen.tsx
//
// Roles & access — the team member list (with inline role editing for admins),
// a "Preview as" segmented control that drives capability gating across the
// whole studio, and the read-only role permission matrix.

import { useState } from "react";
import { members, rolePermissions, rolePreviewNotes, roleOptions } from "@/data/studio";
import type { Member, Role } from "@/types/studio";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { PageHeader, TipBanner, StatusPill, SelectField, thStyle, tdStyle } from "../shared/primitives";
import { memberStatusPill, studioColors } from "../shared/format";
import { InviteModal } from "./InviteModal";

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
  member,
  roleValue,
  editable,
  onRoleChange,
}: {
  member: Member;
  roleValue: Role;
  editable: boolean;
  onRoleChange: (v: Role) => void;
}) {
  const { toast } = useStudio();
  const { isAdmin } = useCapabilities();
  const pill = memberStatusPill(member.status);
  const canResend = member.status === "invited";
  const canRemove = isAdmin && !member.self;
  const removeLabel = member.status === "invited" ? "Revoke" : "Remove";

  return (
    <tr>
      <td style={tdStyle}>
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
            {member.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center" style={{ gap: 7 }}>
              <span style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{member.name}</span>
              {member.self && (
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
            <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>{member.email}</div>
          </div>
        </div>
      </td>
      <td style={tdStyle}>
        {editable ? (
          <div style={{ maxWidth: 150 }}>
            <SelectField
              value={roleValue}
              ariaLabel={`Role for ${member.name}`}
              onChange={(v) => onRoleChange(v as Role)}
              style={{ fontSize: 13 }}
            >
              {roleOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </SelectField>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: studioColors.bodyGray, fontWeight: 500 }}>{roleValue}</span>
        )}
      </td>
      <td style={tdStyle}>
        <StatusPill pill={pill} />
      </td>
      <td style={tdStyle}>
        <div className="flex justify-end" style={{ gap: 6 }}>
          {canResend && (
            <button
              type="button"
              onClick={() => toast("Invitation resent")}
              className="inline-flex items-center transition-colors hover:bg-[rgba(7,74,77,0.05)]"
              style={{
                height: 30,
                padding: "0 11px",
                borderRadius: 9,
                border: "none",
                background: "#ffffff",
                boxShadow: "inset 0 0 0 1px #074A4D",
                color: "#074A4D",
                fontFamily: "var(--font-switzer)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Resend
            </button>
          )}
          {canRemove && (
            <button
              type="button"
              onClick={() => toast(`${removeLabel === "Revoke" ? "Invitation revoked" : "Member removed"}`)}
              aria-label={`${removeLabel} ${member.name}`}
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
                cursor: "pointer",
              }}
            >
              {removeLabel}
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
    <td style={tdStyle}>
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
  const { role, tips, toast } = useStudio();
  const { isAdmin } = useCapabilities();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleState, setRoleState] = useState<Record<string, Role>>(() =>
    Object.fromEntries(members.map((m) => [m.id, m.role]))
  );

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        title="Roles & access"
        subtitle="Who can do what inside the CMS. The delivery API stays public read-only regardless."
      />

      {tips && (
        <TipBanner>
          Use <b style={{ color: studioColors.tealDeep }}>Preview as</b> to feel the gating — publish buttons, bulk actions and the template builder react across the whole prototype.
        </TipBanner>
      )}

      {/* Team members card */}
      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden", marginBottom: 14 }}>
        <div className="flex flex-wrap items-center" style={{ gap: 12, padding: "13px 16px", boxShadow: `inset 0 -1px 0 ${studioColors.ring}` }}>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: studioColors.tealDeep }}>Team members</span>
            <span style={{ fontSize: 12, color: studioColors.faintGray }}> &#183; {members.length}</span>
          </div>
          {isAdmin && (
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
              Invite user
            </button>
          )}
        </div>

        {!isAdmin && (
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
            Only Admins can invite teammates or change roles — this list is view-only for you.
          </div>
        )}

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
              {members.map((m) => {
                const editable = isAdmin && !m.self;
                return (
                  <MemberRow
                    key={m.id}
                    member={m}
                    roleValue={roleState[m.id]}
                    editable={editable}
                    onRoleChange={(v) => {
                      setRoleState((s) => ({ ...s, [m.id]: v }));
                      toast(`Role updated to ${v}`);
                    }}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
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
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{r.name}</div>
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

      <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 10, padding: "0 4px" }}>
        Role changes here are a prototype preview — in production this screen manages invitations and role assignment.
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSend={() => {
          toast("Invitation sent");
          setInviteOpen(false);
        }}
      />
    </section>
  );
}
