"use client";

// src/components/Studio/BomAdmin/OffersTab.tsx
//
// Discount offers, and the approval lifecycle the platform puts around them.
//
// This is the one admin surface where the platform is deliberately stricter
// than the source tool, and the UI has to show that rather than hide it:
//
//   * An offer is DRAFT until approved, and only an ACTIVE one discounts a
//     quote. A saved offer is not a live offer.
//   * `status` is not an editable field. It moves only through approve /
//     activate / pause / archive, and each is separately permissioned
//     (`offers.approve`, `offers.publish`, `offers.archive`), so each button
//     asks for the verb the API actually enforces.
//   * Editing an APPROVED offer sends it back to DRAFT for re-approval. That
//     is worth saying before someone saves a typo fix on a live campaign.
//
// Targeting is four explicit columns rather than the source's free-form
// condition blob, so "which offers apply here?" is a question the database
// answers and this screen can state plainly.

import { useCallback, useMemo, useState } from "react";
import { GhostButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import {
  EmptyRow,
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  ToggleField,
  inr,
  str,
} from "../shared/rows";
import { useEditableRows } from "../shared/useEditableRows";
import {
  OFFER_TRANSITIONS,
  offers,
  saveErrorMessage,
  versioned,
  type OfferInput,
  type OfferRow,
  type OfferStatus,
  type OfferSystem,
  type OfferTier,
  type OfferType,
} from "@/services/bomAdminService";
import type { StudioAction } from "@/services/studioService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const SYSTEMS: OfferSystem[] = ["ALL", "ONGRID", "HYBRID", "UPGRADE"];
const TIERS: OfferTier[] = ["ALL", "BASE", "VALUE", "PREMIUM"];

/** Only an ACTIVE offer actually comes off a customer's price. */
const STATUS_TONE: Record<OfferStatus, { bg: string; fg: string; note: string }> = {
  DRAFT: { bg: "rgba(120,126,134,.12)", fg: "#5b6169", note: "Not offered to anyone yet." },
  APPROVED: { bg: "rgba(247,186,65,.18)", fg: "#8a6400", note: "Approved, but not discounting quotes until activated." },
  ACTIVE: { bg: "rgba(13,110,112,.12)", fg: "#0d6e70", note: "Live — discounting quotes now." },
  PAUSED: { bg: "rgba(247,186,65,.18)", fg: "#8a6400", note: "Temporarily not applied." },
  EXPIRED: { bg: "rgba(120,126,134,.12)", fg: "#5b6169", note: "Past its end date." },
  ARCHIVED: { bg: "rgba(120,126,134,.10)", fg: "#787e86", note: "Retired." },
};

export default function OffersTab({
  items,
  readOnly,
  can,
  notify,
}: {
  items: OfferRow[];
  readOnly: boolean;
  can: (action: StudioAction) => boolean;
  notify: Notify;
}) {
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const api = useMemo(
    () => ({
      create: offers.create,
      update: offers.update,
      remove: (uid: string) => offers.remove(uid),
    }),
    []
  );

  const toInput = useMemo(
    () =>
      versioned<OfferRow, OfferInput>((row) => ({
        // `code` is generated when blank and cannot be changed afterwards, so it
        // is only sent for a row that does not exist yet.
        ...(row.uid.startsWith("new:") ? { code: row.code || undefined } : {}),
        name: row.name.trim(),
        type: row.type,
        value: str(row.value),
        applies_to_system: row.applies_to_system,
        applies_to_tier: row.applies_to_tier,
        applies_to_size_key: row.applies_to_size_key,
        starts_on: row.starts_on || null,
        ends_on: row.ends_on || null,
        print_on_quotation: row.print_on_quotation,
        stackable: row.stackable,
        description: row.description,
      })),
    []
  );

  const { rows, isDirty, patch, add, discard, save, remove, replace, busyId } = useEditableRows<
    OfferRow,
    OfferInput
  >(items, api, toInput, notify, saveErrorMessage);

  const runTransition = useCallback(
    async (row: OfferRow, action: "approve" | "activate" | "pause" | "archive") => {
      setBusyAction(row.uid);
      try {
        const next = await offers[action](row.uid, { expected_version: row.version });
        replace(next);
        notify.success(`Offer ${action === "activate" ? "activated" : `${action}d`}`);
      } catch (err) {
        notify.error(saveErrorMessage(err));
      } finally {
        setBusyAction(null);
      }
    },
    [notify, replace]
  );

  return (
    <section>
      <PanelIntro title="Offers">
        Discounts the calculator can apply. An offer only comes off a price once it is
        <strong> active</strong> — saving it is not the same as publishing it.
      </PanelIntro>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && <EmptyRow>No offers configured.</EmptyRow>}
        {rows.map((row) => {
          const isNew = row.uid.startsWith("new:");
          const tone = STATUS_TONE[row.status] ?? STATUS_TONE.DRAFT;
          const dirty = isDirty(row);
          return (
            <RowCard
              key={row.uid}
              title={row.name || "New offer"}
              meta={
                <span className="inline-flex items-center gap-2">
                  {!isNew && <StatusChip status={row.status} />}
                  <span>
                    {row.type === "PERCENT" ? `${str(row.value)}%` : inr(row.value)} ·{" "}
                    {targetLabel(row)}
                  </span>
                </span>
              }
              dirty={dirty}
              busy={busyId === row.uid || busyAction === row.uid}
              readOnly={readOnly}
              onSave={() => save(row.uid)}
              onDiscard={() => discard(row.uid)}
              // DRAFT only, and gated on `archive` rather than `edit`: an offer
              // that has ever been live is retired, not deleted.
              onDelete={row.status === "DRAFT" && can("archive") ? () => remove(row.uid) : undefined}
            >
              {!isNew && (
                <p style={{ margin: "0 0 14px", fontSize: 12, color: studioColors.mutedGray }}>
                  {tone.note}
                </p>
              )}

              <FieldGrid>
                <TextField
                  label="Name"
                  value={row.name}
                  onChange={(v) => patch(row.uid, { name: v })}
                  hint="Shown to the customer when the offer is applied."
                  disabled={readOnly}
                />
                <div>
                  <Choices
                    label="Discount"
                    options={[
                      { key: "FLAT", label: "Flat ₹" },
                      { key: "PERCENT", label: "Percent" },
                    ]}
                    value={row.type}
                    onChange={(v) => patch(row.uid, { type: v as OfferType })}
                    disabled={readOnly}
                  />
                </div>
                <NumberField
                  label={row.type === "PERCENT" ? "Percentage" : "Amount"}
                  value={str(row.value)}
                  onChange={(v) => patch(row.uid, { value: v })}
                  prefix={row.type === "FLAT" ? "₹" : undefined}
                  suffix={row.type === "PERCENT" ? "%" : undefined}
                  hint={row.type === "PERCENT" ? "At most 100." : undefined}
                  disabled={readOnly}
                />
                <div>
                  <Choices
                    label="System"
                    options={SYSTEMS.map((s) => ({ key: s, label: label(s) }))}
                    value={row.applies_to_system}
                    onChange={(v) => patch(row.uid, { applies_to_system: v as OfferSystem })}
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <Choices
                    label="Tier"
                    options={TIERS.map((t) => ({ key: t, label: label(t) }))}
                    value={row.applies_to_tier}
                    onChange={(v) => patch(row.uid, { applies_to_tier: v as OfferTier })}
                    disabled={readOnly}
                  />
                </div>
                <TextField
                  label="Size"
                  value={row.applies_to_size_key}
                  onChange={(v) => patch(row.uid, { applies_to_size_key: v })}
                  placeholder="blank = every size"
                  hint="A size key: 3, 5sp, 5tp …"
                  disabled={readOnly}
                />
                <TextField
                  label="Starts on"
                  value={row.starts_on ?? ""}
                  onChange={(v) => patch(row.uid, { starts_on: v })}
                  placeholder="YYYY-MM-DD"
                  hint="Blank = no start date."
                  disabled={readOnly}
                />
                <TextField
                  label="Ends on"
                  value={row.ends_on ?? ""}
                  onChange={(v) => patch(row.uid, { ends_on: v })}
                  placeholder="YYYY-MM-DD"
                  hint="Blank = runs until paused."
                  disabled={readOnly}
                />
                <ToggleField
                  label="Print on the quotation"
                  checked={row.print_on_quotation}
                  onChange={() => patch(row.uid, { print_on_quotation: !row.print_on_quotation })}
                  disabled={readOnly}
                />
                <ToggleField
                  label="Can combine with others"
                  checked={row.stackable}
                  onChange={() => patch(row.uid, { stackable: !row.stackable })}
                  disabled={readOnly}
                />
              </FieldGrid>

              {dirty && row.status === "APPROVED" && (
                <p
                  style={{
                    marginTop: 14,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(247,186,65,.14)",
                    color: studioColors.amberInk,
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  Saving a change to an approved offer returns it to draft, and it will need
                  approving again before it can go live.
                </p>
              )}

              {!isNew && !dirty && (
                <Transitions
                  row={row}
                  can={can}
                  busy={busyAction === row.uid}
                  onRun={(action) => runTransition(row, action)}
                />
              )}
            </RowCard>
          );
        })}

        {!readOnly && can("create") && (
          <GhostButton
            onClick={() =>
              add({
                code: "",
                name: "",
                type: "FLAT",
                value: "0",
                status: "DRAFT",
                status_changed_at: null,
                applies_to_system: "ALL",
                applies_to_tier: "ALL",
                applies_to_size_key: "",
                starts_on: null,
                ends_on: null,
                print_on_quotation: true,
                stackable: false,
                description: "",
                content_version: 1,
                transitions: [],
                version: 0,
              } as Omit<OfferRow, "uid">)
            }
          >
            Add offer
          </GhostButton>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The transitions this status allows, each shown only if the user holds the verb
 * the endpoint checks — a button that is certain to 403 is worse than no button.
 */
function Transitions({
  row,
  can,
  busy,
  onRun,
}: {
  row: OfferRow;
  can: (action: StudioAction) => boolean;
  busy: boolean;
  onRun: (action: "approve" | "activate" | "pause" | "archive") => void;
}) {
  const available = (OFFER_TRANSITIONS[row.status] ?? []).filter((t) => can(t.permission));
  if (available.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${studioColors.ring}` }}
    >
      {available.map((t) => (
        <GhostButton key={t.action} onClick={() => onRun(t.action)} disabled={busy} style={{ height: 32, fontSize: 12 }}>
          {busy ? "Working…" : t.label}
        </GhostButton>
      ))}
    </div>
  );
}

function StatusChip({ status }: { status: OfferStatus }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.DRAFT;
  return (
    <span
      style={{
        background: tone.bg,
        color: tone.fg,
        borderRadius: 999,
        padding: "2px 9px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".02em",
      }}
    >
      {label(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bits                                                                       */
/* -------------------------------------------------------------------------- */

function Choices({
  label: fieldLabel,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
        {fieldLabel}
      </p>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const on = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              disabled={disabled}
              onClick={() => onChange(o.key)}
              style={{
                appearance: "none",
                border: `1px solid ${on ? studioColors.teal : studioColors.ring}`,
                background: on ? "rgba(13,110,112,.08)" : "#fff",
                color: on ? studioColors.tealDeep : studioColors.mutedGray,
                borderRadius: 9,
                padding: "6px 11px",
                fontFamily: "var(--font-switzer)",
                fontSize: 12,
                fontWeight: on ? 600 : 500,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function label(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function targetLabel(row: OfferRow): string {
  const parts: string[] = [];
  if (row.applies_to_system !== "ALL") parts.push(label(row.applies_to_system));
  if (row.applies_to_tier !== "ALL") parts.push(label(row.applies_to_tier));
  if (row.applies_to_size_key) parts.push(row.applies_to_size_key);
  return parts.length ? parts.join(" / ") : "every configuration";
}
