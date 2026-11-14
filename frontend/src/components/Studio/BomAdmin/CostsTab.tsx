"use client";

// src/components/Studio/BomAdmin/CostsTab.tsx
//
// The cost rates behind every quote: installation, service, transport, the
// structure rates and the repair allowance.
//
// Three things make this tab different from the row editors beside it, all of
// them from the platform's contract rather than choice:
//
// 1. **It saves as a batch.** The source tool writes each field as the cursor
//    leaves it, so changing the GP and GI rates together is two writes that can
//    half-succeed and leave the tiers priced against different vintages. Here
//    every pending change goes in one call under one effective date.
//
// 2. **Values are append-only and dated.** A save does not overwrite a rate; it
//    opens a new effective row and closes the previous one. So what a quote was
//    priced against six months ago is still answerable, and that is worth
//    showing rather than hiding behind an input that looks like a text box.
//
// 3. **Margin keys may be hidden.** Without `pricing_internal.view` the API
//    returns them as `hidden: true` with a null value. The tab says so instead
//    of rendering an empty field that looks like an unset rate.

import { useCallback, useMemo, useState } from "react";
import { GhostButton, GoldButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { EmptyRow, FieldGrid, NumberField, PanelIntro, TextField, inr } from "../shared/rows";
import {
  BOM_COST_KEYS,
  costConfig,
  saveErrorMessage,
  type CostConfigBody,
  type CostKeySpec,
  type CostRow,
} from "@/services/bomAdminService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export default function CostsTab({
  initial,
  readOnly,
  notify,
}: {
  initial: CostConfigBody;
  readOnly: boolean;
  notify: Notify;
}) {
  const [body, setBody] = useState(initial);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const specs = useMemo(() => {
    const byKey = new Map(body.keys.map((k) => [k.key, k]));
    return BOM_COST_KEYS.map((entry) => ({ ...entry, spec: byKey.get(entry.key) })).filter(
      (e): e is typeof e & { spec: CostKeySpec } => Boolean(e.spec)
    );
  }, [body]);

  const current = useMemo(() => {
    const map = new Map<string, CostRow>();
    for (const row of body.current) map.set(row.key, row);
    return map;
  }, [body]);

  const pending = Object.entries(edits).filter(([key, value]) => {
    const row = current.get(key);
    return value !== "" && value !== valueOf(row);
  });

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const result = await costConfig.put({
        entries: pending.map(([key, value]) => ({
          key,
          value: Number(value),
          // The uid of the row we read. The API 409s if it has since moved on,
          // rather than appending on top of someone else's change.
          current_uid: current.get(key)?.uid ?? null,
        })),
        note: note.trim() || undefined,
      });
      setBody((prev) => ({ ...prev, current: result.current }));
      setEdits({});
      setNote("");
      notify.success(
        result.written.length === 1
          ? "1 rate updated"
          : `${result.written.length} rates updated`
      );
    } catch (err) {
      notify.error(saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [pending, current, note, notify]);

  return (
    <section>
      <PanelIntro title="Cost rates">
        What a system costs Golden Ray to install, which is what the margin is taken on.
        Saving opens a new dated rate rather than overwriting the old one, so earlier
        quotes stay explainable.
      </PanelIntro>

      {specs.length === 0 && <EmptyRow>No cost keys are configured.</EmptyRow>}

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: `inset 0 0 0 ${pending.length ? "1.5px" : "1px"} ${
            pending.length ? studioColors.gold : studioColors.ring
          }`,
          padding: 16,
          transition: "box-shadow .15s",
        }}
      >
        <FieldGrid>
          {specs.map(({ key, label, hint, spec }) => {
            const row = current.get(key);
            if (row?.hidden) {
              return (
                <div key={key}>
                  <p style={{ margin: "0 0 4px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
                    {label}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: studioColors.amberInk, lineHeight: 1.5 }}>
                    Hidden — this is margin data and your role does not include internal
                    pricing.
                  </p>
                </div>
              );
            }
            const saved = valueOf(row);
            const value = edits[key] ?? saved;
            const changed = value !== "" && value !== saved;
            return (
              <NumberField
                key={key}
                label={changed ? `${label} ·` : label}
                value={value}
                onChange={(v) => setEdits((prev) => ({ ...prev, [key]: v }))}
                prefix={spec.kind === "money" ? "₹" : undefined}
                hint={
                  changed && saved !== ""
                    ? `${hint ? `${hint} ` : ""}Currently ${
                        spec.kind === "money" ? inr(saved) : saved
                      }.`
                    : hint
                }
                disabled={readOnly}
              />
            );
          })}
        </FieldGrid>

        {!readOnly && (
          <div
            className="flex flex-wrap items-end gap-3"
            style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${studioColors.ring}` }}
          >
            <div style={{ flex: "1 1 240px", minWidth: 200 }}>
              <TextField
                label="Why"
                value={note}
                onChange={setNote}
                placeholder="e.g. GI supplier increase from October"
                hint="Stored with the new rates. Optional, but it is what makes an old quote explainable."
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              {pending.length > 0 && (
                <GhostButton onClick={() => setEdits({})} disabled={saving}>
                  Discard
                </GhostButton>
              )}
              <GoldButton onClick={save} disabled={saving || pending.length === 0}>
                {saving
                  ? "Saving…"
                  : pending.length === 0
                    ? "No changes"
                    : `Save ${pending.length} change${pending.length === 1 ? "" : "s"}`}
              </GoldButton>
            </div>
          </div>
        )}
      </div>

      {pending.length > 0 && (
        <p
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(247,186,65,.14)",
            color: studioColors.amberInk,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {pending.length === 1 ? "This rate" : `These ${pending.length} rates`} will apply to
          every quote produced from today. Quotes already issued keep the rates they were
          priced with.
        </p>
      )}
    </section>
  );
}

/** The current value as a form string; "" when the key has no row yet. */
function valueOf(row: CostRow | undefined): string {
  if (!row || row.value === null || row.value === undefined) return "";
  return typeof row.value === "object" ? "" : String(row.value);
}
