"use client";

// src/components/Studio/Bom/StringConfigPanel.tsx
//
// How the panels wire to the inverter, and whether that wiring is safe to install.
//
// This is the one panel on the screen that is not about money. Two of its findings
// protect hardware: a string whose cold-morning open-circuit voltage exceeds the
// inverter's rating can destroy it, and one whose hot-afternoon operating voltage drops
// below the MPPT window simply stops producing. Both are invisible until after
// installation, so a critical finding is shown as prominently as a price.

import type { BomStringConfig } from "@/services/bomStaffService";
import { Card, CardHeader, CardMeta, CardTitle } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { Stat } from "./shared";

const TONE: Record<string, { bg: string; ink: string; label: string }> = {
  critical: { bg: "rgba(220,38,38,.10)", ink: studioColors.danger, label: "Must fix" },
  warning: { bg: "rgba(247,186,65,.14)", ink: studioColors.amberInk, label: "Check" },
  info: { bg: "rgba(7,74,77,.06)", ink: studioColors.bodyGray, label: "Note" },
};

export default function StringConfigPanel({ config }: { config: BomStringConfig | null | undefined }) {
  // Absent rather than empty: without the panel's Voc or the inverter's MPPT count there
  // is nothing to compute, and the engine returns nothing rather than a guess.
  if (!config) return null;

  if (config.is_micro) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wiring</CardTitle>
        </CardHeader>
        <p style={{ fontSize: 13, color: studioColors.bodyGray, padding: "12px 16px", margin: 0 }}>
          {config.message ?? `${config.micro_count} micro-inverters — one per panel, so there are no strings to configure.`}
        </p>
      </Card>
    );
  }

  if (config.is_optimizer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wiring</CardTitle>
        </CardHeader>
        <p style={{ fontSize: 13, color: studioColors.bodyGray, padding: "12px 16px", margin: 0 }}>
          Optimisers condition each panel, so the string is limited by count rather than voltage —
          up to {config.max_string_length} panels.
        </p>
      </Card>
    );
  }

  const blockers = (config.warnings ?? []).filter((w) => w.severity === "critical");

  return (
    <Card>
      <CardHeader>
        <CardTitle>String &amp; MPPT layout</CardTitle>
        <CardMeta>
          {config.is_valid ? "Installable" : `${blockers.length} blocker${blockers.length === 1 ? "" : "s"}`}
        </CardMeta>
      </CardHeader>
      <div className="flex flex-col gap-3 p-4">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Panels per string" value={String(config.panels_per_string)} />
          <Stat label="Strings" value={`${config.total_strings} across ${config.mppt_count} MPPT`} />
          <Stat label="Voc at 15°C" value={`${config.string_voc_cold} V`} />
          <Stat label="Vmp at 70°C" value={`${config.string_vmp_hot} V`} />
        </dl>

        {config.mppt_allocation?.length ? (
          <div className="flex flex-wrap gap-2">
            {config.mppt_allocation.map((mppt) => (
              <span
                key={mppt.mppt}
                style={{
                  fontSize: 11.5,
                  fontFamily: studioFonts.num,
                  color: studioColors.tealDeep,
                  background: studioColors.cream,
                  borderRadius: 8,
                  padding: "4px 9px",
                }}
              >
                MPPT {mppt.mppt}: {mppt.strings} × {config.panels_per_string} = {mppt.panels} panels
                {mppt.label ? ` · ${mppt.label}` : ""}
              </span>
            ))}
          </div>
        ) : null}

        {config.empty_slots ? (
          <p style={{ fontSize: 11.5, color: studioColors.mutedGray, margin: 0 }}>
            The last string has {config.empty_slots} empty slot{config.empty_slots > 1 ? "s" : ""}.
          </p>
        ) : null}

        {(config.warnings ?? []).map((warning) => {
          const tone = TONE[warning.severity] ?? TONE.info;
          return (
            <div
              key={warning.code}
              role={warning.severity === "critical" ? "alert" : undefined}
              style={{ padding: "10px 12px", borderRadius: 10, background: tone.bg }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: tone.ink }}>
                {tone.label}
              </span>
              <p style={{ fontSize: 12.5, color: studioColors.bodyGray, margin: "3px 0 0" }}>{warning.message}</p>
            </div>
          );
        })}

        <p style={{ fontSize: 11.5, color: studioColors.mutedGray, margin: 0 }}>
          Allow about {config.dc_cable_recommended_m} m of DC cable.
        </p>
      </div>
    </Card>
  );
}
