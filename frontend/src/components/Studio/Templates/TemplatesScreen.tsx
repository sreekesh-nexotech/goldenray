"use client";

// src/components/Studio/Templates/TemplatesScreen.tsx
//
// Templates — the structure builder. A tab per template exposes its image
// groups and attribute fields; labels are editable and "required" toggles are
// live, but everything is presentation-only (a working copy, no persistence).

import { useEffect, useState } from "react";
import { templates, entries } from "@/data/studio";
import type { AttributeType, ImageGroupKind } from "@/types/studio";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { PageHeader, TipBanner, GoldButton, GhostButton, CardHeader, CardTitle, CardMeta } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { FieldRow, FieldTableHeader, type ChipStyle } from "./FieldRow";

/* -------------------------------------------------------------------------- */
/*  Working-copy state shapes (add a local `req` to attributes)                */
/* -------------------------------------------------------------------------- */

interface WorkingGroup {
  key: string;
  label: string;
  kind: ImageGroupKind;
  req: boolean;
  max?: number;
}

interface WorkingAttr {
  key: string;
  label: string;
  type: AttributeType;
  req: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Type-chip derivations                                                      */
/* -------------------------------------------------------------------------- */

function groupChip(g: WorkingGroup): ChipStyle {
  if (g.kind === "single") {
    return { label: "Single image", bg: "rgba(173,214,216,.45)", ink: "#074A4D" };
  }
  return { label: `Repeatable · max ${g.max ?? 0}`, bg: "rgba(253,246,210,.9)", ink: "#8A6117" };
}

function attrChip(a: WorkingAttr): ChipStyle {
  switch (a.type) {
    case "number":
      return { label: "Number", bg: "rgba(195,223,189,.5)", ink: "#0A6B31" };
    case "enum":
      return { label: "Choice", bg: "rgba(251,232,218,.85)", ink: "#9C4B21" };
    case "text":
      return { label: "Long text", bg: "rgba(248,242,225,.95)", ink: "#414651", ring: true };
    case "string":
    default:
      return { label: "Short text", bg: "rgba(248,242,225,.95)", ink: "#414651", ring: true };
  }
}

/* -------------------------------------------------------------------------- */

export default function TemplatesScreen() {
  const { tips, toast } = useStudio();
  const { canManageStructure, role } = useCapabilities();
  const readOnly = !canManageStructure;

  const [activeId, setActiveId] = useState<string>("solar-guide");
  const [groups, setGroups] = useState<WorkingGroup[]>([]);
  const [attrs, setAttrs] = useState<WorkingAttr[]>([]);

  // Reset the working copy whenever the active template changes.
  useEffect(() => {
    const tpl = templates.find((t) => t.id === activeId) ?? templates[0];
    setGroups(tpl.groups.map((g) => ({ key: g.key, label: g.label, kind: g.kind, req: g.req, max: g.max })));
    setAttrs(tpl.attrs.map((a) => ({ key: a.key, label: a.label, type: a.type, req: false })));
  }, [activeId]);

  const usedBy = entries.filter((e) => e.tpl === activeId).length;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Templates"
        subtitle="Set structure once — every entry using the template inherits its image groups and attributes."
        actions={
          canManageStructure ? (
            <>
              <GhostButton style={{ height: 38, padding: "0 15px" }} onClick={() => toast("Template duplicated")}>
                Duplicate
              </GhostButton>
              <GoldButton style={{ height: 38 }} onClick={() => toast("Template saved")}>
                Save template
              </GoldButton>
            </>
          ) : undefined
        }
      />

      {/* Role lock banner */}
      {!canManageStructure && (
        <div
          className="mb-3.5 flex items-center gap-2.5"
          style={{
            padding: "11px 15px",
            background: "rgba(251,232,218,.75)",
            borderRadius: 12,
            boxShadow: "inset 0 0 0 1px rgba(156,75,33,.35)",
            fontSize: 12.5,
            color: "#9C4B21",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
          </svg>
          <div>
            Read-only — only <b>Admins</b> change structure. You&#8217;re previewing as <b>{role}</b>.
          </div>
        </div>
      )}

      {/* Tips banner */}
      {tips && (
        <TipBanner mb={14}>
          A <b style={{ color: studioColors.tealDeep }}>single</b> group holds one image; a{" "}
          <b style={{ color: studioColors.tealDeep }}>repeatable</b> group holds many — that&#8217;s how a template supports N images. Rename{" "}
          <b style={{ color: studioColors.tealDeep }}>labels</b> freely; <b style={{ color: studioColors.tealDeep }}>keys</b> are the API contract and never change.
        </TipBanner>
      )}

      {/* Template tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {templates.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className="inline-flex items-center transition-colors"
              style={{
                padding: "6px 13px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: studioFonts.mono,
                fontSize: 12,
                fontWeight: 600,
                background: active ? "#123532" : "rgba(255,255,255,.75)",
                boxShadow: active ? "none" : "inset 0 0 0 1px #E5E7EB",
                color: active ? "#fff" : "#414651",
              }}
            >
              {t.id}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 12, color: studioColors.faintGray }}>
          used by <b style={{ color: studioColors.tealDeep, fontFamily: "'Inter',var(--font-switzer)" }}>{usedBy}</b> entries
        </span>
      </div>

      {/* Image groups card */}
      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, marginBottom: 16, overflow: "hidden" }}>
        <CardHeader>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={studioColors.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m20.5 15-5-5L5 20.5" />
          </svg>
          <CardTitle>Image groups</CardTitle>
          <CardMeta>defines how many images an entry can hold</CardMeta>
        </CardHeader>
        <div style={{ padding: "6px 16px 16px", overflowX: "auto" }}>
          <FieldTableHeader />
          {groups.map((g, i) => (
            <FieldRow
              key={g.key}
              label={g.label}
              keyName={g.key}
              chip={groupChip(g)}
              required={g.req}
              readOnly={readOnly}
              canEdit={canManageStructure}
              onLabel={(v) => setGroups((prev) => prev.map((x, j) => (j === i ? { ...x, label: v } : x)))}
              onToggle={() => setGroups((prev) => prev.map((x, j) => (j === i ? { ...x, req: !x.req } : x)))}
              onRemove={() => setGroups((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          {canManageStructure && (
            <AddButton label="+ Add image group" onClick={() => toast("Image group added")} />
          )}
        </div>
      </div>

      {/* Attribute fields card */}
      <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, overflow: "hidden" }}>
        <CardHeader>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={studioColors.teal} strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 8h9" />
            <circle cx="17" cy="8" r="2.6" />
            <path d="M20 16h-9" />
            <circle cx="7" cy="16" r="2.6" />
          </svg>
          <CardTitle>Attribute fields</CardTitle>
          <CardMeta>typed · predefined · renamable</CardMeta>
        </CardHeader>
        <div style={{ padding: "6px 16px 16px", overflowX: "auto" }}>
          <FieldTableHeader />
          {attrs.map((a, i) => (
            <FieldRow
              key={a.key}
              label={a.label}
              keyName={a.key}
              chip={attrChip(a)}
              required={a.req}
              readOnly={readOnly}
              canEdit={canManageStructure}
              onLabel={(v) => setAttrs((prev) => prev.map((x, j) => (j === i ? { ...x, label: v } : x)))}
              onToggle={() => setAttrs((prev) => prev.map((x, j) => (j === i ? { ...x, req: !x.req } : x)))}
              onRemove={() => setAttrs((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          {canManageStructure && (
            <AddButton label="+ Add attribute" onClick={() => toast("Attribute added")} />
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashed "add" button (shared by both cards)                                 */
/* -------------------------------------------------------------------------- */

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-[7px] transition-colors hover:border-[#074A4D] hover:text-[#074A4D]"
      style={{
        height: 32,
        padding: "0 13px",
        borderRadius: 12,
        border: `1.5px dashed ${studioColors.hairline}`,
        background: "transparent",
        color: studioColors.bodyGray,
        fontFamily: "var(--font-switzer)",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
