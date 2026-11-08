"use client";

// src/components/Studio/Roles/EditUserModal.tsx
//
// Correcting an account's details: name, phone, title and e-mail.
//
// Until this existed a typo'd name was permanent -- the screen could change
// someone's role, reset their password and deactivate them, but not fix how
// their name was spelled.
//
// Role is deliberately not here. It stays the inline dropdown on the row, which
// already works and is the one field whose change has an immediate security
// effect; burying it in a form behind a Save button would make it feel like an
// edit among others rather than a grant of access.
//
// Three rules come from `accounts/services/users.py` and are mirrored rather
// than re-invented, so what the form offers is what the API will accept:
//
//   * changing an **e-mail** needs `users.manage`, not just `users.edit`;
//   * an e-mail already in use is a 409, which is worth saying next to the field
//     rather than as a toast;
//   * `expected_version` makes a concurrent edit a 409 instead of a silent
//     overwrite.

import { useState } from "react";
import { GhostButton, GoldButton, TextInput, FieldLabel } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { StudioApiError, patchUser, type StudioUser } from "@/services/studioService";

export interface EditUserModalProps {
  user: StudioUser;
  /** `users.manage` — without it the e-mail field is read-only, as the API requires. */
  canChangeEmail: boolean;
  onSaved: (user: StudioUser) => void;
  onClose: () => void;
}

export default function EditUserModal({ user, canChangeEmail, onSaved, onClose }: EditUserModalProps) {
  const [form, setForm] = useState({
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    phone_e164: user.phone_e164 ?? "",
    title: user.title ?? "",
    email: user.email ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  // Only what actually changed. The service ignores unchanged values anyway, but
  // sending an unchanged e-mail would trip the `users.manage` check for a user
  // who only meant to fix a surname.
  const changes = Object.fromEntries(
    Object.entries(form).filter(([key, value]) => {
      if (key === "email" && !canChangeEmail) return false;
      const current = (user[key as keyof StudioUser] ?? "") as string;
      return value.trim() !== (current ?? "").trim();
    })
  );
  const dirty = Object.keys(changes).length > 0;

  const save = async () => {
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const updated = await patchUser(user.uid, { ...changes, expected_version: user.version });
      onSaved(updated);
      onClose();
    } catch (err) {
      if (err instanceof StudioApiError) {
        // Per-field messages belong beside their field; everything else is one line.
        const perField: Record<string, string> = {};
        for (const [field, messages] of Object.entries(err.fieldErrors ?? {})) {
          perField[field] = Array.isArray(messages) ? (messages as string[]).join(" ") : String(messages);
        }
        setFieldErrors(perField);
        setError(
          err.code === "stale_version"
            ? "Someone else changed this account while you were editing it. Close this and try again."
            : Object.keys(perField).length
              ? null
              : err.message
        );
      } else {
        setError(err instanceof Error ? err.message : "Could not save");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${user.full_name || user.email}`}
      className="fixed inset-0 grid place-items-center"
      style={{ background: "rgba(7,43,45,.38)", zIndex: 60, padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          width: "min(520px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 18px 50px rgba(7,43,45,.22)",
          padding: 22,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: studioColors.tealDeep }}>Edit account</h2>
        <p style={{ margin: "4px 0 18px", fontSize: 12.5, color: studioColors.mutedGray }}>
          Their role is changed from the list, and their password from “Reset password”.
        </p>

        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <Field label="First name" error={fieldErrors.first_name}>
            <TextInput value={form.first_name} onChange={(v) => set("first_name", v)} ariaLabel="First name" />
          </Field>
          <Field label="Last name" error={fieldErrors.last_name}>
            <TextInput value={form.last_name} onChange={(v) => set("last_name", v)} ariaLabel="Last name" />
          </Field>
          <Field label="Phone" hint="With the country code, e.g. +919876543210." error={fieldErrors.phone_e164}>
            <TextInput value={form.phone_e164} onChange={(v) => set("phone_e164", v)} ariaLabel="Phone" />
          </Field>
          <Field label="Title" error={fieldErrors.title}>
            <TextInput value={form.title} onChange={(v) => set("title", v)} ariaLabel="Title" />
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field
            label="E-mail"
            hint={
              canChangeEmail
                ? "This is also how they sign in, so changing it changes their sign-in."
                : "Changing an e-mail address needs the users.manage permission."
            }
            error={fieldErrors.email}
          >
            {canChangeEmail ? (
              <TextInput value={form.email} onChange={(v) => set("email", v)} ariaLabel="E-mail" />
            ) : (
              <p
                style={{
                  margin: 0,
                  padding: "9px 11px",
                  borderRadius: 10,
                  background: "rgba(0,0,0,.03)",
                  fontSize: 13,
                  color: studioColors.mutedGray,
                }}
              >
                {user.email}
              </p>
            )}
          </Field>
        </div>

        {error && (
          <p role="alert" style={{ margin: "14px 0 0", fontSize: 12.5, color: studioColors.danger, lineHeight: 1.5 }}>
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2" style={{ marginTop: 20 }}>
          <GhostButton onClick={onClose} disabled={saving}>
            Cancel
          </GhostButton>
          <GoldButton onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "No changes"}
          </GoldButton>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
      {error ? (
        <p style={{ margin: "5px 0 0", fontSize: 11.5, color: studioColors.danger, lineHeight: 1.45 }}>{error}</p>
      ) : hint ? (
        <p style={{ margin: "5px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.45 }}>{hint}</p>
      ) : null}
    </div>
  );
}
