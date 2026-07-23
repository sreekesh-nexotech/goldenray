"use client";

// src/components/Studio/Roles/InviteModal.tsx
//
// Add-a-user modal for the Roles & access screen. POSTs auth/users/ via the
// parent's onCreate handler (admin only): username + password are required,
// email is optional, role picks the access level.

import { useState } from "react";
import { Modal, ModalTitle, ModalActions } from "../shared/overlays";
import { FieldLabel, TextInput, GhostButton, GoldButton } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import type { StudioApiRole } from "@/services/studioService";

const roleChoices: { value: StudioApiRole; label: string }[] = [
  { value: "admin", label: "Admin — full access" },
  { value: "editor", label: "Editor — content & publishing" },
  { value: "author", label: "Author — writes drafts" },
];

const fieldRing = `inset 0 0 0 1px ${studioColors.inputRing},0 1px 2px rgba(10,13,18,.05)`;
const fieldRingFocus = "inset 0 0 0 1.5px #074A4D,0 1px 2px rgba(10,13,18,.05)";

export interface NewUserPayload {
  username: string;
  password: string;
  role: StudioApiRole;
  email?: string;
}

export function InviteModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  /** POST the user; resolve on success (parent closes), throw with a message to show. */
  onCreate: (payload: NewUserPayload) => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StudioApiRole>("author");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("author");
    setError("");
  };

  const cancel = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!username.trim()) {
      setError("Enter a username");
      return;
    }
    if (!password) {
      setError("Enter a password");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await onCreate({
        username: username.trim(),
        password,
        role,
        email: email.trim() || undefined,
      });
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t create the user");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={cancel} ariaLabel="Add user" width={460}>
      <ModalTitle>Add a user</ModalTitle>
      <p style={{ fontSize: 12.5, color: studioColors.bodyGray, margin: "4px 0 16px", lineHeight: 1.5 }}>
        Creates an internal account for the Flarize content studio — share the credentials with them directly.
      </p>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Username</FieldLabel>
        <TextInput value={username} onChange={setUsername} placeholder="ravi.kumar" style={{ borderRadius: 12 }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel
          suffix={
            <span style={{ fontFamily: studioFonts.mono, fontSize: 10.5, color: studioColors.faintGray, fontWeight: 400 }}>
              optional
            </span>
          }
        >
          Work email
        </FieldLabel>
        <TextInput value={email} onChange={setEmail} type="email" placeholder="name@flarize.com" style={{ borderRadius: 12 }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Password</FieldLabel>
        <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" style={{ borderRadius: 12 }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Role</FieldLabel>
        <div className="relative">
          <select
            value={role}
            aria-label="Role"
            onChange={(e) => setRole(e.target.value as StudioApiRole)}
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

      {error && (
        <div role="alert" style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <ModalActions>
        <GhostButton onClick={cancel} style={{ height: 36, padding: "0 14px", fontSize: 13 }}>
          Cancel
        </GhostButton>
        <GoldButton onClick={submit} disabled={busy} style={{ height: 36, padding: "0 15px", fontSize: 13 }}>
          {busy ? "Creating…" : "Create user"}
        </GoldButton>
      </ModalActions>
    </Modal>
  );
}
