"use client";

// src/components/Studio/Bom/BomLinesTable.tsx
//
// The bill of materials, in one of two modes. Quotation mode shows money; dispatch mode
// is a picking list -- item, quantity, unit and nothing else -- because the warehouse
// should not be handed our prices (Golden-Ray-BOM calls these `quotation` and `dispatch`,
// App.jsx:3049).
//
// In dispatch mode the price fields are not merely hidden here, they are absent: the
// screen re-quotes with `mode=dispatch` and the server strips them. So this component
// never has a price to leak, and the column gating below is the second of two locks
// rather than the only one.

import { useMemo } from "react";
import type { BomQuoteLine, BomQuoteResponse } from "@/services/bomStaffService";
import { Card, CardHeader, CardMeta, CardTitle, thStyle, tdStyle } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { inr } from "./shared";

export type BomMode = "quotation" | "dispatch";

/** Readable section headings; anything unmapped is title-cased from its slug. */
const SECTION_LABEL: Record<string, string> = {
  panel: "Panels",
  inverter: "Inverter",
  dcdb: "DCDB",
  acdb: "ACDB",
  meter: "Meter",
  structure: "Mounting structure",
  battery: "Battery",
  wiring: "Wiring",
  panels: "Panels",
  misc: "Consumables",
};

const label = (section: string) =>
  SECTION_LABEL[section] ?? (section ? section.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()) : "Items");

export default function BomLinesTable({ result, mode }: { result: BomQuoteResponse; mode: BomMode }) {
  const sections = useMemo(() => {
    // Insertion order is the engine's order, which groups a system the way it is built.
    const groups = new Map<string, BomQuoteLine[]>();
    for (const line of result.bom_lines) {
      const existing = groups.get(line.section);
      if (existing) existing.push(line);
      else groups.set(line.section, [line]);
    }
    return [...groups.entries()];
  }, [result.bom_lines]);

  const money = mode === "quotation";
  const itemCount = result.bom_lines.length;
  const totalUnits = result.bom_lines.reduce((sum, line) => sum + (Number(line.qty) || 0), 0);

  return (
    <Card style={{ overflowX: "auto" }}>
      <CardHeader>
        <CardTitle>{money ? "Bill of materials" : "Dispatch list"}</CardTitle>
        <CardMeta>
          {itemCount} line{itemCount === 1 ? "" : "s"} · {Math.round(totalUnits)} units
        </CardMeta>
      </CardHeader>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: money ? 620 : 380 }}>
        <thead>
          <tr>
            <th style={thStyle}>Item</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Qty</th>
            {money && (
              <>
                <th style={{ ...thStyle, textAlign: "right" }}>Unit price</th>
                <th style={{ ...thStyle, textAlign: "right" }}>GST</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sections.map(([section, lines]) => (
            <Section key={section} section={section} lines={lines} money={money} />
          ))}
          {!itemCount && (
            <tr>
              <td colSpan={money ? 5 : 2} style={{ ...tdStyle, color: studioColors.mutedGray }}>
                No items for this configuration.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function Section({ section, lines, money }: { section: string; lines: BomQuoteLine[]; money: boolean }) {
  const subtotal = lines.reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
  const num = { ...tdStyle, textAlign: "right" as const, fontFamily: studioFonts.num };
  return (
    <>
      <tr>
        <td
          colSpan={money ? 5 : 2}
          style={{
            ...tdStyle,
            fontWeight: 600,
            fontSize: 11.5,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            color: studioColors.labelGray,
            background: "rgba(248,242,225,.45)",
          }}
        >
          {label(section)}
          {money && (
            <span style={{ float: "right", fontFamily: studioFonts.num, textTransform: "none", letterSpacing: 0 }}>
              {inr(subtotal)}
            </span>
          )}
        </td>
      </tr>
      {lines.map((line, index) => (
        <tr key={`${line.pos}-${line.name}-${index}`}>
          <td style={tdStyle}>
            {line.name}
            {line.brand && <span style={{ color: studioColors.mutedGray }}> · {line.brand}</span>}
          </td>
          <td style={num}>
            {line.qty} {line.unit}
          </td>
          {money && (
            <>
              <td style={num}>{inr(line.unit_price)}</td>
              <td style={num}>{line.gst_pct}%</td>
              <td style={num}>{inr(line.amount)}</td>
            </>
          )}
        </tr>
      ))}
    </>
  );
}
