"use client";

// src/components/Studio/Roles/InviteModal.tsx
//
// Invite-a-user modal for the Roles & access screen. Presentation-only: local
// form state, no network. "Send invitation" fires the parent's toast + close.

import { useState } from "react";
import type { Role } from "@/types/studio";
import { Modal, ModalTitle, ModalActions } from "../shared/overlays";
import { FieldLabel, TextInput } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";

const roleChoices: { value: Role; label: string }[] = [
  { value: "Admin", label: "Admin — full access" },
  { value: "Editor", label: "Editor — content & publishing" },
  { value: "Author", label: "Author — writes drafts" },
];

const fieldRing = `inset 0 0 0 1px ${studioColors.inputRing},0 1px 2px rgba(10,13,18,.05)`;
const fieldRingFocus = "inset 0 0 0 1.5px #074A4D,0 1px 2px rgba(10,13,18,.05)";

export function InviteModal({
  open,
  onClose,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Author");

  const reset = () => {
    setName("");
    setEmail("");
    setRole("Author");
  };

  const cancel = () => {
    reset();
    onClose();
  };

  const send = () => {
    onSend();
    reset();
  };

  return (
    <Modal open={open} onClose={cancel} ariaLabel="Invite user" width={460}>
      <ModalTitle>Invite a user</ModalTitle>
      <p style={{ fontSize: 12.5, color: studioColors.bodyGray, margin: "4px 0 16px", lineHeight: 1.5 }}>
        They&#8217;ll get an email invite to join the Flarize content studio.
      </p>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel
          suffix={
            <span style={{ fontFamily: studioFonts.mono, fontSize: 10.5, color: studioColors.faintGray, fontWeight: 400 }}>
              optional
            </span>
          }
        >
          Full name
        </FieldLabel>
        <TextInput value={name} onChange={setName} placeholder="Ravi Kumar" style={{ borderRadius: 12 }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Work email</FieldLabel>
        <TextInput value={email} onChange={setEmail} type="email" placeholder="name@flarize.com" style={{ borderRadius: 12 }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Role</FieldLabel>
        <div className="relative">
          <select
            value={role}
            aria-label="Role"
            onChange={(e) => setRole(e.target.value as Role)}
            onFocus={(e) => (e.currentTarget.style.boxShadow = fieldRingFocus)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = fieldRing)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px 32px 11px 12px",
              border: "none",
              borderRadius: 12,
              background: "#ffffff",
              boxShadow: fieldRing,
              fontFamily: "var(--font-switzer)",
              fontSize: 14,
              lineHeight: "20px",
              color: studioColors.tealDeep,
              appearance: "none",
              cursor: "pointer",
            }}
          >
            {roleChoices.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2" style={{ color: studioColors.mutedGray }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      <ModalActions>
        <button
          type="button"
          onClick={cancel}
          className="inline-flex items-center"
          style={{
            height: 36,
            padding: "0 14px",
            borderRadius: 12,
            border: "none",
            background: "#ffffff",
            boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
            color: studioColors.labelGray,
            fontFamily: "var(--font-switzer)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "inset 0 0 0 1px #074A4D";
            e.currentTarget.style.color = "#074A4D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${studioColors.inputRing}`;
            e.currentTarget.style.color = studioColors.labelGray;
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={send}
          className="inline-flex items-center transition-[filter] hover:brightness-[.96]"
          style={{
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
          Send invitation
        </button>
      </ModalActions>
    </Modal>
  );
}
