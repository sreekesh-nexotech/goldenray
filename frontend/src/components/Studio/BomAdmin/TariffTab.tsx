"use client";

// src/components/Studio/BomAdmin/TariffTab.tsx
//
// The electricity tariff the bill helper reads: KSEB's LT-1A slabs, the fixed
// charges, duty, meter rent, and the yield and coverage assumptions that turn a
// bill into a system size.
//
// This is the most consequential screen in BOM Admin and the least obviously so.
// Nothing here is a price, so a mistake does not look like a pricing mistake --
// it looks like a slightly different recommended size, which nobody questions.
// Typing the coverage target as `85` rather than `0.85` is a hundredfold error
// that renders as a plausible number. So the tab validates before it saves, and
// shows a live worked example underneath, where a wrong slab is visible as a
// wrong answer rather than as a wrong digit.
//
// Storage is `CostConfig`'s, not a model of its own: append-only dated rows, an
// audit trail, a server-side validator and `pricing.edit` gating already exist
// there, and `engines/energy.py` reads the tariff from exactly that key. A
// dedicated table would have duplicated all of it and created a second answer to
// "what is the current tariff?".

import { useCallback, useMemo, useState } from "react";
import { GhostButton, GoldButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { EmptyRow, FieldGrid, NumberField, PanelIntro, inr } from "../shared/rows";
import {
  ENERGY_CONFIG_KEY,
  costConfig,
  readEnergyConfig,
  saveErrorMessage,
  validateTariff,
  type CostConfigBody,
  type EnergyConfig,
  type FixedChargeSlab,
  type TariffRegion,
  type TariffSlab,
} from "@/services/bomAdminService";
import { estimateBill, sizeFromBill } from "./tariffPreview";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export default function TariffTab({
  initial,
  readOnly,
  notify,
}: {
  initial: CostConfigBody;
  readOnly: boolean;
  notify: Notify;
}) {
  const [body, setBody] = useState(initial);
  const saved = useMemo(() => readEnergyConfig(body), [body]);
  const [draft, setDraft] = useState<EnergyConfig | null>(saved);
  const [saving, setSaving] = useState(false);
  const [regionId, setRegionId] = useState(() => Object.keys(saved?.regions ?? {})[0] ?? "");

  const row = body.current.find((r) => r.key === ENERGY_CONFIG_KEY);
  const region = draft?.regions?.[regionId];
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const problems = region ? validateTariff(region) : [];

  const patchRegion = useCallback(
    (changes: Partial<TariffRegion>) =>
      setDraft((prev) =>
        prev
          ? { ...prev, regions: { ...prev.regions, [regionId]: { ...prev.regions[regionId], ...changes } } }
          : prev
      ),
    [regionId]
  );

  const save = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const result = await costConfig.put({
        entries: [{ key: ENERGY_CONFIG_KEY, value: draft, current_uid: row?.uid ?? null }],
      });
      setBody((prev) => ({ ...prev, current: result.current }));
      notify.success("Tariff saved");
    } catch (err) {
      notify.error(saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [draft, row, notify]);

  if (row?.hidden) {
    return (
      <EmptyRow>
        The tariff is hidden from your role. It needs the internal pricing permission.
      </EmptyRow>
    );
  }

  if (!saved || !draft || !region) {
    return (
      <section>
        <PanelIntro title="Electricity tariff">
          The slabs the bill helper uses to turn a customer&apos;s bill into a system size.
        </PanelIntro>
        <EmptyRow>
          No tariff is configured, so the bill helper cannot convert a bill. It has to be
          set once from the current KSEB order before it can be edited here.
        </EmptyRow>
      </section>
    );
  }

  return (
    <section>
      <PanelIntro title="Electricity tariff">
        What the bill helper reads to turn a customer&apos;s bill into a recommended size.
        A wrong slab does not look wrong — it looks like a slightly different
        recommendation — so check the worked example at the bottom before saving.
      </PanelIntro>

      {Object.keys(draft.regions).length > 1 && (
        <div className="flex flex-wrap gap-1" style={{ marginBottom: 14 }}>
          {Object.entries(draft.regions).map(([id, r]) => (
            <button key={id} type="button" onClick={() => setRegionId(id)} style={pill(id === regionId)}>
              {r.regionName || id}
            </button>
          ))}
        </div>
      )}

      <Card dirty={dirty}>
        <Identity region={region} />

        <Section
          title="Telescopic slabs"
          hint="Up to the non-telescopic threshold, each slab is charged only on the units that fall inside it. Thresholds are bi-monthly units, as KSEB bills."
        >
          <SlabTable
            slabs={region.tariffSlabs}
            onChange={(tariffSlabs) => patchRegion({ tariffSlabs })}
            readOnly={readOnly}
            valueLabel="₹ / unit"
            valueKey="ratePerUnit"
          />
        </Section>

        <Section
          title="Non-telescopic slabs"
          hint="Above the threshold the whole consumption is charged at one flat rate — not just the excess. That cliff is why the threshold matters more than any single rate."
        >
          <div style={{ maxWidth: 280, marginBottom: 12 }}>
            <NumberField
              label="Non-telescopic above"
              value={String(region.nonTelescopicThreshold ?? "")}
              onChange={(v) => patchRegion({ nonTelescopicThreshold: Number(v) || 0 })}
              suffix="units"
              hint="Bi-monthly."
              disabled={readOnly}
            />
          </div>
          <SlabTable
            slabs={region.nonTelescopicSlabs}
            onChange={(nonTelescopicSlabs) => patchRegion({ nonTelescopicSlabs })}
            readOnly={readOnly}
            valueLabel="₹ / unit"
            valueKey="ratePerUnit"
          />
        </Section>

        <Section
          title="Fixed charge"
          hint="Depends on the consumption band and the connection phase, so the two tables are separate. Values are bi-monthly."
        >
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div>
              <PhaseHeading>Single phase</PhaseHeading>
              <FixedTable
                slabs={region.fixedChargeSlabs.singlePhase}
                onChange={(singlePhase) =>
                  patchRegion({ fixedChargeSlabs: { ...region.fixedChargeSlabs, singlePhase } })
                }
                readOnly={readOnly}
              />
            </div>
            <div>
              <PhaseHeading>Three phase</PhaseHeading>
              <FixedTable
                slabs={region.fixedChargeSlabs.threePhase}
                onChange={(threePhase) =>
                  patchRegion({ fixedChargeSlabs: { ...region.fixedChargeSlabs, threePhase } })
                }
                readOnly={readOnly}
              />
            </div>
          </div>
        </Section>

        <Section title="Duty, meter rent and sizing" hint="">
          <FieldGrid>
            <NumberField
              label="Electricity duty"
              value={String(region.electricityDutyPct ?? "")}
              onChange={(v) => patchRegion({ electricityDutyPct: Number(v) || 0 })}
              suffix="%"
              hint="Charged on the energy charge only."
              disabled={readOnly}
            />
            <NumberField
              label="Meter rent — 1 phase"
              value={String(region.meterRent?.singlePhaseBiMonthly ?? "")}
              onChange={(v) =>
                patchRegion({ meterRent: { ...region.meterRent, singlePhaseBiMonthly: Number(v) || 0 } })
              }
              prefix="₹"
              hint="Bi-monthly."
              disabled={readOnly}
            />
            <NumberField
              label="Meter rent — 3 phase"
              value={String(region.meterRent?.threePhaseBiMonthly ?? "")}
              onChange={(v) =>
                patchRegion({ meterRent: { ...region.meterRent, threePhaseBiMonthly: Number(v) || 0 } })
              }
              prefix="₹"
              hint="Bi-monthly."
              disabled={readOnly}
            />
            <NumberField
              label="Daily generation"
              value={String(region.yield?.dailyGenPerKw ?? "")}
              onChange={(v) => patchRegion({ yield: { ...region.yield, dailyGenPerKw: Number(v) || 0 } })}
              suffix="kWh/kW/day"
              hint="4.0 is the conservative Kerala average."
              disabled={readOnly}
            />
            <NumberField
              label="Coverage target"
              value={String(region.sizing?.coverageTarget ?? "")}
              onChange={(v) => patchRegion({ sizing: { ...region.sizing, coverageTarget: Number(v) || 0 } })}
              hint="A fraction, not a percentage: 0.85 means cover 85% of consumption."
              disabled={readOnly}
            />
          </FieldGrid>
        </Section>

        <Preview region={region} />

        {problems.length > 0 && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(214,69,65,.08)",
              color: studioColors.danger,
              fontSize: 12.5,
              lineHeight: 1.6,
            }}
          >
            <strong>This tariff cannot be saved yet:</strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {!readOnly && (
          <div
            className="flex flex-wrap items-center gap-2"
            style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${studioColors.ring}` }}
          >
            <span style={{ fontSize: 12, color: studioColors.mutedGray }}>
              Saving opens a new dated tariff; quotes already issued keep the one they used.
            </span>
            <div className="ml-auto flex items-center gap-2">
              {dirty && (
                <GhostButton onClick={() => setDraft(saved)} disabled={saving}>
                  Discard
                </GhostButton>
              )}
              <GoldButton onClick={save} disabled={saving || !dirty || problems.length > 0}>
                {saving ? "Saving…" : dirty ? "Save tariff" : "No changes"}
              </GoldButton>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Worked example                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The same arithmetic the engine does, run on the draft as it is typed.
 *
 * This is the part that makes the tab safe to use. The fields above are numbers
 * whose correctness nobody can eyeball; "a ₹3,000 bill means a 2 kW system" is a
 * claim a person can agree or disagree with immediately.
 *
 * It is an illustration, not the quote: the engine's bisection is authoritative
 * and runs server-side. Shown as a range of bills so a mistake that only bites in
 * one band -- the non-telescopic cliff especially -- is still visible.
 */
function Preview({ region }: { region: TariffRegion }) {
  const rows = useMemo(
    () => [1000, 2000, 3000, 5000, 8000].map((bill) => ({ bill, ...sizeFromBill(region, bill) })),
    [region]
  );

  return (
    <Section
      title="Worked example"
      hint="What a customer with this bill would be told, using the tariff above. Check a couple of these before saving — a wrong slab shows up here as a wrong answer."
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr>
              {["Bi-monthly bill", "Units", "Monthly units", "System size"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === "Bi-monthly bill" ? "left" : "right",
                    padding: "7px 10px",
                    color: studioColors.mutedGray,
                    fontWeight: 600,
                    fontSize: 11.5,
                    borderBottom: `1px solid ${studioColors.ring}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.bill}>
                <td style={cell()}>{inr(r.bill)}</td>
                <td style={cell(true)}>{r.units ?? "—"}</td>
                <td style={cell(true)}>{r.units === null ? "—" : Math.round(r.units / 2)}</td>
                <td style={{ ...cell(true), fontWeight: 600, color: studioColors.tealDeep }}>
                  {r.kw === null ? "—" : `${r.kw.toFixed(1)} kW`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>
        An illustration. The quote engine computes the authoritative figure server-side; this
        is here so an obviously wrong tariff is obvious before it is saved.
      </p>
    </Section>
  );
}

function cell(right = false) {
  return {
    padding: "7px 10px",
    textAlign: right ? ("right" as const) : ("left" as const),
    borderBottom: `1px solid ${studioColors.ring}`,
    color: studioColors.bodyGray,
  };
}

/* -------------------------------------------------------------------------- */
/*  Slab tables                                                                */
/* -------------------------------------------------------------------------- */

function SlabTable({
  slabs,
  onChange,
  readOnly,
  valueLabel,
  valueKey,
}: {
  slabs: TariffSlab[];
  onChange: (slabs: TariffSlab[]) => void;
  readOnly: boolean;
  valueLabel: string;
  valueKey: "ratePerUnit";
}) {
  const patch = (i: number, changes: Partial<TariffSlab>) =>
    onChange(slabs.map((s, n) => (n === i ? { ...s, ...changes } : s)));

  return (
    <div>
      <Grid header={["Up to (units)", valueLabel]} />
      {slabs.map((slab, i) => (
        <Row key={i} onRemove={readOnly ? undefined : () => onChange(slabs.filter((_, n) => n !== i))}>
          <Cell
            value={slab.upToUnits === null ? "" : String(slab.upToUnits ?? "")}
            placeholder="no limit"
            onChange={(v) => patch(i, { upToUnits: v === "" ? null : Number(v) })}
            disabled={readOnly}
          />
          <Cell
            value={String(slab[valueKey] ?? "")}
            onChange={(v) => patch(i, { [valueKey]: Number(v) || 0 } as Partial<TariffSlab>)}
            disabled={readOnly}
          />
        </Row>
      ))}
      {!readOnly && (
        <GhostButton
          style={{ marginTop: 8, height: 32, fontSize: 12 }}
          onClick={() =>
            onChange([...slabs, { upToUnits: (slabs.at(-1)?.upToUnits ?? 0) + 100, ratePerUnit: 0 }])
          }
        >
          Add slab
        </GhostButton>
      )}
    </div>
  );
}

function FixedTable({
  slabs,
  onChange,
  readOnly,
}: {
  slabs: FixedChargeSlab[];
  onChange: (slabs: FixedChargeSlab[]) => void;
  readOnly: boolean;
}) {
  const patch = (i: number, changes: Partial<FixedChargeSlab>) =>
    onChange(slabs.map((s, n) => (n === i ? { ...s, ...changes } : s)));

  return (
    <div>
      <Grid header={["Up to (units)", "₹ bi-monthly"]} />
      {slabs.map((slab, i) => (
        <Row key={i} onRemove={readOnly ? undefined : () => onChange(slabs.filter((_, n) => n !== i))}>
          <Cell
            value={slab.upToUnits === null ? "" : String(slab.upToUnits ?? "")}
            placeholder="no limit"
            onChange={(v) => patch(i, { upToUnits: v === "" ? null : Number(v) })}
            disabled={readOnly}
          />
          <Cell
            value={String(slab.chargeBiMonthly ?? "")}
            onChange={(v) => patch(i, { chargeBiMonthly: Number(v) || 0 })}
            disabled={readOnly}
          />
        </Row>
      ))}
      {!readOnly && (
        <GhostButton
          style={{ marginTop: 8, height: 32, fontSize: 12 }}
          onClick={() =>
            onChange([...slabs, { upToUnits: (slabs.at(-1)?.upToUnits ?? 0) + 100, chargeBiMonthly: 0 }])
          }
        >
          Add band
        </GhostButton>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bits                                                                       */
/* -------------------------------------------------------------------------- */

function Identity({ region }: { region: TariffRegion }) {
  const bits = [region.tariffName, region.tariffVersion, region.effectivePeriod, region.tariffOrder].filter(Boolean);
  if (!bits.length) return null;
  return (
    <p style={{ margin: "0 0 16px", fontSize: 12, color: studioColors.mutedGray, lineHeight: 1.5 }}>
      {region.discom && <strong style={{ color: studioColors.tealDeep }}>{region.discom} · </strong>}
      {bits.join(" · ")}
    </p>
  );
}

function Card({ dirty, children }: { dirty: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: `inset 0 0 0 ${dirty ? "1.5px" : "1px"} ${dirty ? studioColors.gold : studioColors.ring}`,
        padding: 16,
        transition: "box-shadow .15s",
      }}
    >
      {children}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${studioColors.ring}` }}>
      <p style={{ margin: "0 0 2px", fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep }}>{title}</p>
      {hint && (
        <p style={{ margin: "0 0 12px", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>{hint}</p>
      )}
      {children}
    </div>
  );
}

function PhaseHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>{children}</p>
  );
}

function Grid({ header }: { header: string[] }) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
      {header.map((h) => (
        <span key={h} style={{ flex: 1, fontSize: 11, fontWeight: 600, color: studioColors.mutedGray }}>
          {h}
        </span>
      ))}
      <span style={{ width: 28 }} />
    </div>
  );
}

function Row({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
      {children}
      <button
        type="button"
        onClick={onRemove}
        disabled={!onRemove}
        aria-label="Remove"
        style={{
          width: 28,
          height: 30,
          border: "none",
          background: "transparent",
          color: onRemove ? studioColors.danger : "transparent",
          cursor: onRemove ? "pointer" : "default",
          fontSize: 15,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

function Cell({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      inputMode="decimal"
      style={{
        flex: 1,
        minWidth: 0,
        height: 30,
        padding: "0 9px",
        borderRadius: 8,
        border: `1px solid ${studioColors.ring}`,
        fontFamily: "var(--font-switzer)",
        fontSize: 12.5,
        color: studioColors.bodyGray,
        background: disabled ? "rgba(0,0,0,.02)" : "#fff",
      }}
    />
  );
}

function pill(active: boolean) {
  return {
    appearance: "none" as const,
    border: `1px solid ${active ? studioColors.teal : studioColors.ring}`,
    background: active ? "rgba(13,110,112,.08)" : "#fff",
    color: active ? studioColors.tealDeep : studioColors.mutedGray,
    borderRadius: 999,
    padding: "6px 13px",
    fontFamily: "var(--font-switzer)",
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
  };
}

export { estimateBill };
