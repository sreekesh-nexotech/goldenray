"use client";

// src/components/Studio/Roles/InviteModal.tsx
//
// Add-a-user modal for the Roles & access screen. POSTs users/ via the parent's
// onCreate handler, gated on `users.create`.
//
// Two ways to give the new account a password, matching the platform's two
// branches in `accounts.services.users.create_user`:
//
//  - "Email an invitation" (default) — no password is sent; the server stores an
//    unusable one, sets must_reset_password and mails a single-use link.
//  - "Set a password now" — the password is sent and stored, no invitation goes
//    out, and the account can sign in straight away. The fallback for when mail
//    is not deliverable (a console-only EMAIL_BACKEND, or no SMTP relay yet).

import { useState } from "react";
import { Modal, ModalTitle, ModalActions } from "../shared/overlays";
import { FieldLabel, TextInput, GhostButton, GoldButton } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import type { StudioRole } from "@/services/adminService";

const fieldRing = `inset 0 0 0 1px ${studioColors.inputRing},0 1px 2px rgba(10,13,18,.05)`;
const fieldRingFocus = "inset 0 0 0 1.5px #074A4D,0 1px 2px rgba(10,13,18,.05)";

/**
 * E-mail is the login and the role is identified by its uid. `password` is
 * optional: left out, the platform e-mails an invitation link instead.
 */
export interface NewUserPayload {
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

/** Mirrors the server's AUTH_PASSWORD_VALIDATORS so the obvious rejects never cost a round-trip. */
const MIN_PASSWORD_LENGTH = 10;

/** One of the two password routes: a radio with a title and a one-line consequence. */
function ModeChoice({
  checked,
  onSelect,
  title,
  hint,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  hint: string;
}) {
  return (
    <label
      className="flex cursor-pointer items-start"
      style={{
        gap: 9,
        padding: "10px 12px",
        borderRadius: 12,
        background: checked ? "rgba(173,214,216,.22)" : "#ffffff",
        boxShadow: checked ? "inset 0 0 0 1.5px #074A4D" : fieldRing,
      }}
    >
      <input
        type="radio"
        name="flz-new-user-password-mode"
        checked={checked}
        onChange={onSelect}
        style={{ accentColor: "#074A4D", marginTop: 2, cursor: "pointer", flex: "none" }}
      />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>{title}</span>
        <span style={{ display: "block", fontSize: 11.5, color: studioColors.bodyGray, lineHeight: 1.45, marginTop: 1 }}>{hint}</span>
      </span>
    </label>
  );
}

export function InviteModal({
  open,
  onClose,
  onCreate,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  /** POST the user; resolve on success (parent closes), throw with a message to show. */
  onCreate: (payload: NewUserPayload) => Promise<void>;
  roles: StudioRole[];
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<string>("");
  const [mode, setMode] = useState<"invite" | "password">("invite");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("");
    setMode("invite");
    setPassword("");
    setConfirm("");
    setReveal(false);
    setError("");
  };

  const cancel = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!email.trim()) {
      setError("Enter a work e-mail address");
      return;
    }
    if (!role) {
      setError("Choose a role");
      return;
    }
    if (mode === "password") {
      // Catch the cheap cases here; the server is still the authority on the
      // full policy (common passwords, similarity to the e-mail) and its
      // field error is surfaced verbatim by the catch below.
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`The password needs at least ${MIN_PASSWORD_LENGTH} characters`);
        return;
      }
      if (password !== confirm) {
        setError("The two passwords do not match");
        return;
      }
    }
    setError("");
    setBusy(true);
    try {
      await onCreate({
        email: email.trim(),
        role,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        password: mode === "password" ? password : undefined,
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
        Creates an internal account for the Flarize content studio.
      </p>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Work email</FieldLabel>
        <TextInput value={email} onChange={setEmail} type="email" placeholder="name@flarize.com" style={{ borderRadius: 12 }} />
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 14 }}>
        <div>
          <FieldLabel
            suffix={
              <span style={{ fontFamily: studioFonts.mono, fontSize: 10.5, color: studioColors.faintGray, fontWeight: 400 }}>
                optional
              </span>
            }
          >
            First name
          </FieldLabel>
          <TextInput value={firstName} onChange={setFirstName} placeholder="Ravi" style={{ borderRadius: 12 }} />
        </div>
        <div>
          <FieldLabel>Last name</FieldLabel>
          <TextInput value={lastName} onChange={setLastName} placeholder="Kumar" style={{ borderRadius: 12 }} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Role</FieldLabel>
        <div className="relative">
          <select
            value={role}
            aria-label="Role"
            onChange={(e) => setRole(e.target.value)}
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
            <option value="">Choose a role…</option>
            {roles.map((r) => (
              <option key={r.uid} value={r.uid}>
                {r.name}
                {r.description ? ` — ${r.description.slice(0, 48)}${r.description.length > 48 ? "…" : ""}` : ""}
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

      <div style={{ marginBottom: mode === "password" ? 14 : 20 }}>
        <FieldLabel>Password</FieldLabel>
        <div role="radiogroup" aria-label="How the account gets its password" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ModeChoice
            checked={mode === "invite"}
            onSelect={() => {
              setMode("invite");
              setError("");
            }}
            title="Email an invitation"
            hint="They set their own password from a single-use link. Needs working e-mail delivery."
          />
          <ModeChoice
            checked={mode === "password"}
            onSelect={() => {
              setMode("password");
              setError("");
            }}
            title="Set a password now"
            hint="No e-mail is sent. Share the password yourself — use this when mail is not deliverable."
          />
        </div>
      </div>

      {mode === "password" && (
        <div style={{ marginBottom: 20 }}>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <FieldLabel>New password</FieldLabel>
              <TextInput
                value={password}
                onChange={setPassword}
                type={reveal ? "text" : "password"}
                placeholder="At least 10 characters"
                ariaLabel="New password"
                style={{ borderRadius: 12 }}
              />
            </div>
            <div>
              <FieldLabel>Confirm</FieldLabel>
              <TextInput
                value={confirm}
                onChange={setConfirm}
                type={reveal ? "text" : "password"}
                placeholder="Repeat it"
                ariaLabel="Confirm password"
                style={{ borderRadius: 12 }}
              />
            </div>
          </div>
          <div className="flex items-center" style={{ justifyContent: "space-between", marginTop: 8, gap: 10 }}>
            <label className="flex items-center" style={{ gap: 6, fontSize: 12, color: studioColors.bodyGray, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={reveal}
                onChange={(e) => setReveal(e.target.checked)}
                style={{ accentColor: "#074A4D", cursor: "pointer" }}
              />
              Show password
            </label>
            <span style={{ fontSize: 11.5, color: studioColors.faintGray, textAlign: "right" }}>
              They can change it later from their own profile.
            </span>
          </div>
        </div>
      )}

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
          {busy ? "Creating…" : mode === "invite" ? "Send invitation" : "Create user"}
        </GoldButton>
      </ModalActions>
    </Modal>
  );
}
