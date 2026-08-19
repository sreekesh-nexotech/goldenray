"use client";

// The bank comparison table shown under the public calculator. Everything the
// cards render — rate, loan limits, upfront, eligibility, fees, tenure and the
// bullet list — is edited here.

import { GhostButton, TextArea } from "../shared/primitives";
import { studioColors } from "../shared/format";
import type { EMIBank } from "@/services/emiCalculator";
import { banks as banksApi, type EMIBankInput } from "@/services/emiConfigService";
import {
  EmptyRow,
  Field,
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  ToggleField,
  str,
} from "./shared";
import { useEditableRows } from "./useEditableRows";

const toInput = (row: EMIBank): EMIBankInput => ({
  name: row.name,
  abbr: row.abbr,
  logo_bg: row.logo_bg,
  interest_rate: row.interest_rate,
  min_loan: row.min_loan,
  max_loan: row.max_loan,
  upfront_requirement: row.upfront_requirement,
  eligibility: row.eligibility,
  cibil_required: Number(row.cibil_required) || 0,
  processing_fee_percent: row.processing_fee_percent,
  processing_fee_note: row.processing_fee_note,
  approval_min_days: Number(row.approval_min_days) || 0,
  approval_max_days: Number(row.approval_max_days) || 0,
  max_tenure_years: Number(row.max_tenure_years) || 0,
  features: row.features,
  best_for: row.best_for,
  is_recommended: row.is_recommended,
  sort_order: Number(row.sort_order) || 0,
  is_active: row.is_active,
  // `slug` is omitted: the API derives it from the name on create and it must
  // stay stable afterwards.
});

export default function BanksPanel({
  initial,
  readOnly,
  notify,
}: {
  initial: EMIBank[];
  readOnly: boolean;
  notify: { success: (m: string) => void; error: (m: string) => void };
}) {
  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows(
    initial,
    banksApi,
    toInput,
    notify
  );

  return (
    <div>
      <PanelIntro
        title="Bank comparison"
        action={
          !readOnly && (
            <GhostButton
              onClick={() =>
                add({
                  name: "",
                  abbr: "",
                  slug: "",
                  logo_bg: "#074A4D",
                  interest_rate: "8.00",
                  min_loan: "0",
                  max_loan: "0",
                  upfront_requirement: "",
                  eligibility: "",
                  cibil_required: 0,
                  processing_fee_percent: "0",
                  processing_fee_note: "",
                  approval_min_days: 0,
                  approval_max_days: 0,
                  max_tenure_years: 0,
                  features: [],
                  best_for: "",
                  is_recommended: false,
                  sort_order: rows.length + 1,
                  is_active: true,
                })
              }
            >
              + Add bank
            </GhostButton>
          )
        }
      >
        Cards on the public page are filtered by the customer&apos;s loan amount
        and CIBIL score, then sorted by what they said matters most. Leave the
        bullet list empty and the card builds its own from the fields below.
      </PanelIntro>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && <EmptyRow>No banks configured yet.</EmptyRow>}

        {rows.map((row) => (
          <RowCard
            key={row.id}
            title={
              <span className="inline-flex items-center gap-2">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: row.logo_bg || studioColors.teal,
                    color: "#fff",
                    fontSize: 8.5,
                    fontWeight: 800,
                  }}
                >
                  {row.abbr || "—"}
                </span>
                {row.name || "New bank"}
              </span>
            }
            meta={
              <>
                {Number(row.interest_rate).toFixed(2)}% p.a.
                {row.is_recommended && (
                  <span
                    style={{
                      marginLeft: 8,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(247,186,65,.22)",
                      color: studioColors.amberInk,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Recommended
                  </span>
                )}
              </>
            }
            dirty={isDirty(row)}
            busy={busyId === row.id}
            readOnly={readOnly}
            onSave={() => save(row.id)}
            onDiscard={() => discard(row.id)}
            onDelete={() => remove(row.id)}
          >
            <FieldGrid>
              <TextField
                label="Bank name"
                value={str(row.name)}
                onChange={(v) => patch(row.id, { name: v })}
                placeholder="State Bank of India"
                disabled={readOnly}
              />
              <TextField
                label="Logo initials"
                value={str(row.abbr)}
                onChange={(v) => patch(row.id, { abbr: v })}
                placeholder="SBI"
                disabled={readOnly}
              />
              <TextField
                label="Logo colour"
                value={str(row.logo_bg)}
                onChange={(v) => patch(row.id, { logo_bg: v })}
                placeholder="#1D4ED8"
                disabled={readOnly}
                hint="Hex, e.g. #1D4ED8."
              />
              <NumberField
                label="Interest rate"
                value={str(row.interest_rate)}
                onChange={(v) => patch(row.id, { interest_rate: v })}
                suffix="%"
                disabled={readOnly}
              />
              <NumberField
                label="Minimum loan"
                value={str(row.min_loan)}
                onChange={(v) => patch(row.id, { min_loan: v })}
                prefix="₹"
                disabled={readOnly}
              />
              <NumberField
                label="Maximum loan"
                value={str(row.max_loan)}
                onChange={(v) => patch(row.id, { max_loan: v })}
                prefix="₹"
                disabled={readOnly}
                hint="Cards are filtered against this."
              />
              <NumberField
                label="CIBIL required"
                value={str(row.cibil_required)}
                onChange={(v) => patch(row.id, { cibil_required: Number(v) || 0 })}
                disabled={readOnly}
                hint="0 = no published minimum."
              />
              <NumberField
                label="Processing fee"
                value={str(row.processing_fee_percent)}
                onChange={(v) => patch(row.id, { processing_fee_percent: v })}
                suffix="%"
                disabled={readOnly}
              />
              <TextField
                label="Fee note"
                value={str(row.processing_fee_note)}
                onChange={(v) => patch(row.id, { processing_fee_note: v })}
                placeholder="₹500 flat"
                disabled={readOnly}
                hint="Overrides the % when set."
              />
              <NumberField
                label="Approval from"
                value={str(row.approval_min_days)}
                onChange={(v) => patch(row.id, { approval_min_days: Number(v) || 0 })}
                suffix="days"
                disabled={readOnly}
              />
              <NumberField
                label="Approval up to"
                value={str(row.approval_max_days)}
                onChange={(v) => patch(row.id, { approval_max_days: Number(v) || 0 })}
                suffix="days"
                disabled={readOnly}
              />
              <NumberField
                label="Maximum tenure"
                value={str(row.max_tenure_years)}
                onChange={(v) => patch(row.id, { max_tenure_years: Number(v) || 0 })}
                suffix="yrs"
                disabled={readOnly}
              />
              <TextField
                label="Upfront requirement"
                value={str(row.upfront_requirement)}
                onChange={(v) => patch(row.id, { upfront_requirement: v })}
                placeholder="10% of project cost"
                disabled={readOnly}
              />
              <TextField
                label="Eligibility"
                value={str(row.eligibility)}
                onChange={(v) => patch(row.id, { eligibility: v })}
                placeholder="CIBIL 700+, salaried or self-employed"
                disabled={readOnly}
              />
              <NumberField
                label="Display order"
                value={str(row.sort_order)}
                onChange={(v) => patch(row.id, { sort_order: Number(v) || 0 })}
                disabled={readOnly}
              />
            </FieldGrid>

            <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
              <Field
                label="Card bullets"
                hint="One per line. Leave empty to auto-build them from the fields above."
              >
                <TextArea
                  value={row.features.join("\n")}
                  onChange={
                    readOnly
                      ? undefined
                      : (v) => patch(row.id, { features: v.split("\n") })
                  }
                  placeholder={"Up to ₹6L loan amount\n5–7 days approval\nZero processing fee"}
                  minHeight={92}
                />
              </Field>
              <TextField
                label="Best for"
                value={str(row.best_for)}
                onChange={(v) => patch(row.id, { best_for: v })}
                placeholder="Most Kerala homeowners — 3kW, first-time solar buyers"
                disabled={readOnly}
              />
              <div className="flex flex-wrap gap-6">
                <ToggleField
                  label="Flarize Recommended"
                  checked={row.is_recommended}
                  onChange={() => patch(row.id, { is_recommended: !row.is_recommended })}
                  disabled={readOnly}
                  hint="Pins the card to the top with a gold badge."
                />
                <ToggleField
                  label="Show on the site"
                  checked={row.is_active}
                  onChange={() => patch(row.id, { is_active: !row.is_active })}
                  disabled={readOnly}
                />
              </div>
            </div>
          </RowCard>
        ))}
      </div>
    </div>
  );
}
