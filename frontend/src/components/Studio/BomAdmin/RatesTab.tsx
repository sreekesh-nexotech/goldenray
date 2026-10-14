"use client";

// src/components/Studio/BomAdmin/RatesTab.tsx
//
// The price list: what a customer is quoted when a rate exists for their
// configuration.
//
// This is the biggest lever on a quote in the whole of BOM Admin. When a market
// rate exists the engine quotes `market_rate + add-ons + price deltas` and
// ignores the cost-plus ladder entirely, so a number typed here *is* the selling
// price -- not an input to it.
//
// Two platform rules shape the screen, and both are followed rather than worked
// around:
//
//   * **Only DRAFT sets are editable.** An ACTIVE set is what customers are being
//     quoted from today; editing it in place would rewrite history. Revising
//     prices means cloning it, editing the copy and activating that.
//   * **Exactly one set is ACTIVE**, and activating retires the previous one. The
//     engine reads only the ACTIVE set, so a complete DRAFT set is priced as if
//     it did not exist -- every quote silently falls back to cost-plus. That is
//     easy to not notice, so the screen says it outright.
//
// Rates are shown by their Flarize key (`hybrid_value_0_dcr_up5`) because that is
// what the price list itself calls each cell, and grouped by system type so the
// DCR / non-DCR and upgrade-ready dimensions are visible rather than buried in a
// flat list of 99 rows.

import { useCallback, useMemo, useState } from "react";
import { GhostButton, GoldButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { EmptyRow, PanelIntro, TextField, inr } from "../shared/rows";
import {
  deletableReason,
  rateSets,
  saveErrorMessage,
  toRateInput,
  type MarketRate,
  type MarketRateSet,
  type RateSetStatus,
} from "@/services/bomAdminService";
import type { StudioAction } from "@/services/studioService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const STATUS_TONE: Record<RateSetStatus, { bg: string; fg: string }> = {
  DRAFT: { bg: "rgba(120,126,134,.12)", fg: "#5b6169" },
  ACTIVE: { bg: "rgba(13,110,112,.12)", fg: "#0d6e70" },
  RETIRED: { bg: "rgba(120,126,134,.10)", fg: "#787e86" },
};

export default function RatesTab({
  sets: initialSets,
  readOnly,
  can,
  notify,
}: {
  sets: MarketRateSet[];
  readOnly: boolean;
  can: (action: StudioAction) => boolean;
  notify: Notify;
}) {
  const [sets, setSets] = useState(initialSets);
  // Open the ACTIVE set by default — it is the one that matters, and seeing
  // "no set is active" immediately is the point.
  const [openUid, setOpenUid] = useState(
    () => sets.find((s) => s.status === "ACTIVE")?.uid ?? sets[0]?.uid ?? ""
  );
  const [rates, setRates] = useState<MarketRate[] | null>(null);
  const [saved, setSaved] = useState<MarketRate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = sets.find((s) => s.uid === openUid);
  const active = sets.find((s) => s.status === "ACTIVE");
  const editable = Boolean(set && set.status === "DRAFT" && !readOnly);
  const dirty = Boolean(rates && saved && JSON.stringify(rates) !== JSON.stringify(saved));

  const load = useCallback(
    async (uid: string) => {
      setOpenUid(uid);
      setRates(null);
      setSaved(null);
      setLoading(true);
      try {
        const rows = await rateSets.rates(uid);
        setRates(rows);
        setSaved(rows);
      } catch (err) {
        notify.error(saveErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [notify]
  );

  const save = useCallback(async () => {
    if (!set || !rates) return;
    setBusy(true);
    try {
      // The whole set goes, always: `put_rates` deletes what it is not sent.
      const result = await rateSets.replaceRates(set.uid, rates.map(toRateInput), set.version);
      setSets((prev) => prev.map((s) => (s.uid === result.set.uid ? result.set : s)));
      setSaved(rates);
      const { created, updated, deleted } = result.outcome;
      notify.success(`Saved — ${updated} changed, ${created} added, ${deleted} removed`);
    } catch (err) {
      notify.error(saveErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, [set, rates, notify]);

  const clone = useCallback(async () => {
    if (!set) return;
    setBusy(true);
    try {
      const next = await rateSets.create({
        name: `${set.name} — revised ${new Date().toISOString().slice(0, 10)}`,
        note: `Copied from ${set.name} to revise prices.`,
        copy_from_uid: set.uid,
      });
      setSets((prev) => [next, ...prev]);
      notify.success("New draft created from this set");
      await load(next.uid);
    } catch (err) {
      notify.error(saveErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, [set, notify, load]);

  const remove = useCallback(
    async (target: MarketRateSet) => {
      setBusy(true);
      try {
        await rateSets.remove(target.uid, target.version);
        setSets((prev) => prev.filter((s) => s.uid !== target.uid));
        // Deleting the open set leaves the grid showing prices that no longer exist.
        if (target.uid === openUid) {
          setRates(null);
          setSaved(null);
          setOpenUid("");
        }
        notify.success("Price list deleted");
      } catch (err) {
        notify.error(saveErrorMessage(err));
      } finally {
        setBusy(false);
      }
    },
    [openUid, notify]
  );

  const activate = useCallback(async () => {
    if (!set) return;
    setBusy(true);
    try {
      const next = await rateSets.activate(set.uid, { expected_version: set.version });
      setSets((prev) =>
        prev.map((s) =>
          s.uid === next.uid ? next : s.status === "ACTIVE" ? { ...s, status: "RETIRED" as const } : s
        )
      );
      notify.success("This price list is now live");
    } catch (err) {
      notify.error(saveErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, [set, notify]);

  return (
    <section>
      <PanelIntro title="Market rates">
        The price list. Where a rate exists for a configuration it <em>is</em> the selling
        price — the cost-plus calculation is not used at all. Only the active set is
        quoted from.
      </PanelIntro>

      {!active && (
        <Banner tone="warn">
          <strong>No price list is active.</strong> Until one is activated every quote is
          priced cost-plus, whatever rates are stored here.
        </Banner>
      )}

      <div className="flex flex-col gap-2" style={{ marginBottom: 16 }}>
        {sets.length === 0 && <EmptyRow>No price lists yet.</EmptyRow>}
        {sets.map((s) => (
          <SetRow
            key={s.uid}
            set={s}
            open={s.uid === openUid}
            onOpen={() => load(s.uid)}
            busy={busy}
            canPublish={can("publish")}
            canEdit={!readOnly}
            onClone={clone}
            onActivate={activate}
            onDelete={() => remove(s)}
          />
        ))}
      </div>

      {loading && <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>Loading prices…</p>}

      {set && rates && (
        <>
          {set.status !== "DRAFT" && (
            <Banner tone="info">
              {set.status === "ACTIVE"
                ? "This is the live price list, so it is read-only — changing it would rewrite what customers have already been quoted. Use “Copy to a new draft” to revise prices."
                : "This price list has been retired and is read-only."}
            </Banner>
          )}

          <Grid rates={rates} onChange={setRates} editable={editable} />

          {editable && (
            <div
              className="flex flex-wrap items-center gap-2"
              style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${studioColors.ring}` }}
            >
              <span style={{ fontSize: 12, color: studioColors.mutedGray }}>
                This is a draft, so saving changes nothing a customer sees until it is activated.
              </span>
              <div className="ml-auto flex items-center gap-2">
                {dirty && (
                  <GhostButton onClick={() => setRates(saved)} disabled={busy}>
                    Discard
                  </GhostButton>
                )}
                <GoldButton onClick={save} disabled={busy || !dirty}>
                  {busy ? "Saving…" : dirty ? "Save prices" : "No changes"}
                </GoldButton>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Set list                                                                   */
/* -------------------------------------------------------------------------- */

function SetRow({
  set,
  open,
  onOpen,
  busy,
  canPublish,
  canEdit,
  onClone,
  onActivate,
  onDelete,
}: {
  set: MarketRateSet;
  open: boolean;
  onOpen: () => void;
  busy: boolean;
  canPublish: boolean;
  canEdit: boolean;
  onClone: () => void;
  onActivate: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState<"activate" | "delete" | null>(null);
  const blocked = deletableReason(set);
  const tone = STATUS_TONE[set.status];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: `inset 0 0 0 ${open ? "1.5px" : "1px"} ${open ? studioColors.teal : studioColors.ring}`,
        padding: "11px 14px",
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onOpen}
          style={{
            appearance: "none",
            border: "none",
            background: "transparent",
            padding: 0,
            fontFamily: "var(--font-switzer)",
            fontSize: 13.5,
            fontWeight: 600,
            color: studioColors.tealDeep,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {set.name}
        </button>
        <span
          style={{
            background: tone.bg,
            color: tone.fg,
            borderRadius: 999,
            padding: "2px 9px",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {set.status}
        </span>
        <span style={{ fontSize: 12, color: studioColors.mutedGray }}>
          {set.rate_count} {set.rate_count === 1 ? "price" : "prices"}
          {set.activated_at && ` · live since ${set.activated_at.slice(0, 10)}`}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {canEdit && set.status !== "DRAFT" && (
            <GhostButton onClick={onClone} disabled={busy} style={{ height: 30, fontSize: 12 }}>
              Copy to a new draft
            </GhostButton>
          )}
          {canPublish && set.status === "DRAFT" && !confirming && (
            <GhostButton onClick={() => setConfirming("activate")} disabled={busy} style={{ height: 30, fontSize: 12 }}>
              Activate
            </GhostButton>
          )}
          {/* The live list is never deletable; a released one is refused by the server,
              which knows about releases and this payload does not. */}
          {canEdit && !blocked && !confirming && (
            <button
              type="button"
              onClick={() => setConfirming("delete")}
              disabled={busy}
              style={{
                height: 30,
                padding: "0 11px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: studioColors.danger,
                fontFamily: "var(--font-switzer)",
                fontSize: 12,
                fontWeight: 600,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {confirming === "activate" && (
        <Confirm tone="amber" busy={busy} onCancel={() => setConfirming(null)} onConfirm={() => { setConfirming(null); onActivate(); }} label="Yes, make this live" busyLabel="Activating…">
          <strong>Activating changes what customers are quoted.</strong> Every one of these{" "}
          {set.rate_count} prices starts applying immediately, and the price list that is live
          now is retired. Quotes already issued keep their prices.
        </Confirm>
      )}

      {confirming === "delete" && (
        <Confirm tone="danger" busy={busy} onCancel={() => setConfirming(null)} onConfirm={() => { setConfirming(null); onDelete(); }} label="Yes, delete it" busyLabel="Deleting…">
          <strong>Delete “{set.name}”?</strong> Its {set.rate_count}{" "}
          {set.rate_count === 1 ? "price goes" : "prices go"} with it. Quotes already issued
          keep the prices they were given, and the live price list is unaffected — but if
          this set is the only record of an old price, that record goes too.
        </Confirm>
      )}
    </div>
  );
}

/**
 * An inline confirmation, used for the two actions on a set that are hard to take
 * back: activating one (it changes what customers are quoted) and deleting one.
 *
 * Inline rather than a modal so the set it refers to stays on screen and visibly
 * named -- "delete which list?" is exactly the question a dialog floating over a
 * list of near-identical names invites.
 */
function Confirm({
  tone,
  busy,
  onConfirm,
  onCancel,
  label,
  busyLabel,
  children,
}: {
  tone: "amber" | "danger";
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  label: string;
  busyLabel: string;
  children: React.ReactNode;
}) {
  const danger = tone === "danger";
  return (
    <div
      style={{
        marginTop: 12,
        padding: "12px 14px",
        borderRadius: 10,
        background: danger ? "rgba(214,69,65,.08)" : "rgba(247,186,65,.14)",
        color: danger ? studioColors.danger : studioColors.amberInk,
        fontSize: 12.5,
        lineHeight: 1.6,
      }}
    >
      {children}
      <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
        <GoldButton onClick={onConfirm} disabled={busy} style={{ height: 32, fontSize: 12 }}>
          {busy ? busyLabel : label}
        </GoldButton>
        <GhostButton onClick={onCancel} disabled={busy} style={{ height: 32, fontSize: 12 }}>
          Cancel
        </GhostButton>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The price grid                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Grouped by system type, then by the dimensions that actually distinguish a
 * price: tier and battery band, with DCR and upgrade-ready as columns.
 *
 * `diffBase` rows are shown separately and labelled, because they are not prices
 * — they carry the baseline that component swaps are costed against, and reading
 * a ₹0 diffBase as "this configuration is free" would be an easy mistake.
 */
function Grid({
  rates,
  onChange,
  editable,
}: {
  rates: MarketRate[];
  onChange: (rates: MarketRate[]) => void;
  editable: boolean;
}) {
  const [search, setSearch] = useState("");
  const needle = search.trim().toLowerCase();

  const groups = useMemo(() => {
    const visible = needle ? rates.filter((r) => r.key.toLowerCase().includes(needle)) : rates;
    const by = new Map<string, MarketRate[]>();
    for (const rate of visible) {
      const label = rate.variant === "diffBase" ? "Price-difference baselines" : labelFor(rate.system_type);
      const list = by.get(label);
      if (list) list.push(rate);
      else by.set(label, [rate]);
    }
    return [...by.entries()];
  }, [rates, needle]);

  const setPrice = (uid: string, value: string) =>
    onChange(rates.map((r) => (r.uid === uid ? { ...r, customer_price_incl_gst: value } : r)));

  if (!rates.length) return <EmptyRow>This price list has no prices in it.</EmptyRow>;

  return (
    <div>
      <div style={{ maxWidth: 320, marginBottom: 12 }}>
        <TextField label="" value={search} onChange={setSearch} placeholder="Filter by key, e.g. hybrid_value…" />
      </div>

      {groups.length === 0 && <EmptyRow>No prices match that filter.</EmptyRow>}

      {groups.map(([label, rows]) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <p style={{ margin: "0 0 8px", fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep }}>
            {label}
            <span style={{ fontWeight: 400, color: studioColors.mutedGray }}> · {rows.length}</span>
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr>
                  {["Key", "Applies to", "Price (incl. GST)"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        textAlign: i === 2 ? "right" : "left",
                        padding: "6px 10px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: studioColors.mutedGray,
                        borderBottom: `1px solid ${studioColors.ring}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((rate) => (
                  <tr key={rate.uid}>
                    <td style={td()}>
                      <code style={{ fontSize: 11.5, color: studioColors.bodyGray }}>{rate.key}</code>
                    </td>
                    <td style={{ ...td(), color: studioColors.mutedGray, fontSize: 11.5 }}>{describe(rate)}</td>
                    <td style={{ ...td(), textAlign: "right", width: 170 }}>
                      {editable ? (
                        <input
                          value={rate.customer_price_incl_gst}
                          onChange={(e) => setPrice(rate.uid, e.target.value)}
                          inputMode="decimal"
                          aria-label={`Price for ${rate.key}`}
                          style={{
                            width: 140,
                            height: 30,
                            padding: "0 9px",
                            borderRadius: 8,
                            border: `1px solid ${studioColors.ring}`,
                            fontFamily: "var(--font-switzer)",
                            fontSize: 12.5,
                            textAlign: "right",
                            color: studioColors.bodyGray,
                          }}
                        />
                      ) : Number(rate.customer_price_incl_gst) > 0 ? (
                        inr(rate.customer_price_incl_gst)
                      ) : (
                        <span style={{ color: studioColors.mutedGray }}>not set</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bits                                                                       */
/* -------------------------------------------------------------------------- */

function td() {
  return {
    padding: "6px 10px",
    borderBottom: `1px solid ${studioColors.ring}`,
    color: studioColors.bodyGray,
  };
}

function labelFor(systemType: string): string {
  return { ONGRID: "On-grid", HYBRID: "Hybrid", UPGRADE: "Upgrades" }[systemType] ?? systemType;
}

/** The dimensions that distinguish this price, in words. */
function describe(rate: MarketRate): string {
  const bits: string[] = [];
  if (rate.tier) bits.push(rate.tier.charAt(0) + rate.tier.slice(1).toLowerCase());
  if (rate.from_size_key) bits.push(`${rate.from_size_key} → ${rate.size_key} kW`);
  else if (rate.size_key) bits.push(`${rate.size_key} kW`);
  if (rate.battery_config && rate.battery_config !== "0") bits.push(`${rate.battery_config} battery`);
  if (rate.dcr) bits.push(rate.dcr === "dcr" ? "DCR" : "Non-DCR");
  if (rate.future_size_key) bits.push(`ready for ${rate.future_size_key} kW`);
  return bits.join(" · ") || "—";
}

function Banner({ tone, children }: { tone: "warn" | "info"; children: React.ReactNode }) {
  const warn = tone === "warn";
  return (
    <div
      style={{
        margin: "0 0 14px",
        padding: "11px 14px",
        borderRadius: 10,
        background: warn ? "rgba(247,186,65,.14)" : "rgba(13,110,112,.06)",
        color: warn ? studioColors.amberInk : studioColors.bodyGray,
        fontSize: 12.5,
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}
