"use client";

// src/components/Studio/Taxonomy/TaxonomyScreen.tsx
//
// Authors & taxonomy — the reusable lookups (authors, categories, tags, badges)
// that entries reference. Presentation only: each "+ Add" affordance toggles a
// local inline input whose confirm is a toast stub — the imported lookup arrays
// are never mutated.

import { useState, type CSSProperties, type ReactNode } from "react";
import { authors, categories, tags, badges, badgeColors } from "@/data/studio";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";

/* -------------------------------------------------------------------------- */
/*  Card shell — header (title + "+ Add") + body, with local add state         */
/* -------------------------------------------------------------------------- */

interface AddState {
  adding: boolean;
  input: string;
  setInput: (v: string) => void;
  /** Toast stub + clear + close. */
  confirm: () => void;
  /** Enter → confirm. */
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function TaxonomyCard({
  title,
  toastMsg,
  bodyStyle,
  children,
}: {
  title: string;
  toastMsg: string;
  bodyStyle: CSSProperties;
  children: (state: AddState) => ReactNode;
}) {
  const { toast } = useStudio();
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");

  const confirm = () => {
    toast(toastMsg);
    setInput("");
    setAdding(false);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirm();
    }
  };

  return (
    <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: "inset 0 0 0 1px #E5E7EB", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", boxShadow: "inset 0 -1px 0 #E5E7EB" }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: studioColors.tealDeep }}>{title}</span>
        <button
          type="button"
          onClick={() => setAdding(true)}
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            height: 28,
            padding: "0 11px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: studioColors.teal,
            fontFamily: "var(--font-switzer)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(7,74,77,.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          + Add
        </button>
      </div>
      <div style={bodyStyle}>{children({ adding, input, setInput, confirm, onKeyDown })}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared inline chip-input style (categories / tags / badges)                */
/* -------------------------------------------------------------------------- */

const chipInputBase: CSSProperties = {
  boxSizing: "border-box",
  padding: "5px 11px",
  border: "none",
  borderRadius: 999,
  background: "#ffffff",
  boxShadow: "inset 0 0 0 1.5px #074A4D",
  color: studioColors.tealDeep,
};

/* -------------------------------------------------------------------------- */
/*  Screen                                                                      */
/* -------------------------------------------------------------------------- */

const chipsBodyStyle: CSSProperties = {
  padding: "14px 16px",
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
  alignContent: "flex-start",
};

export default function TaxonomyScreen() {
  const { tips } = useStudio();

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Authors & taxonomy"
        subtitle="The reusable lookups entries reference — authors, categories, tags and badges."
      />

      {tips && (
        <TipBanner mb={14}>
          Managed once, attached from the editor’s <b style={{ color: studioColors.tealDeep }}>Organize</b> panel — one
          “Subsidy” category, not five spellings. Counts update live.
        </TipBanner>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
        {/* Authors */}
        <TaxonomyCard
          title="Authors"
          toastMsg="Author added"
          bodyStyle={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 11 }}
        >
          {({ adding, input, setInput, confirm, onKeyDown }) => (
            <>
              {authors.map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: studioColors.cream,
                      boxShadow: "inset 0 0 0 1px rgba(18,53,50,.15)",
                      color: studioColors.teal,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 10.5,
                      fontWeight: 700,
                      flex: "none",
                    }}
                  >
                    {a.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>{a.meta}</div>
                  </div>
                </div>
              ))}
              {adding && (
                <div style={{ display: "flex", gap: 7 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Author name↵"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "8px 11px",
                      border: "none",
                      borderRadius: 10,
                      background: "#ffffff",
                      boxShadow: "inset 0 0 0 1.5px #074A4D",
                      fontFamily: "var(--font-switzer)",
                      fontSize: 13,
                      color: studioColors.tealDeep,
                    }}
                  />
                  <button
                    type="button"
                    onClick={confirm}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 35,
                      padding: "0 13px",
                      borderRadius: 10,
                      border: "none",
                      background: studioColors.gold,
                      color: "#272218",
                      fontFamily: "var(--font-switzer)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(.96)")}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                  >
                    Add
                  </button>
                </div>
              )}
            </>
          )}
        </TaxonomyCard>

        {/* Categories */}
        <TaxonomyCard title="Categories" toastMsg="Category added" bodyStyle={chipsBodyStyle}>
          {({ adding, input, setInput, confirm, onKeyDown }) => (
            <>
              {categories.map((c) => (
                <span
                  key={c}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "rgba(173,214,216,.45)",
                    color: studioColors.teal,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {c}
                </span>
              ))}
              {adding && (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={confirm}
                  placeholder="Category↵"
                  style={{
                    ...chipInputBase,
                    width: 120,
                    fontFamily: "var(--font-switzer)",
                    fontSize: 12.5,
                  }}
                />
              )}
            </>
          )}
        </TaxonomyCard>

        {/* Tags */}
        <TaxonomyCard title="Tags" toastMsg="Tag added" bodyStyle={chipsBodyStyle}>
          {({ adding, input, setInput, confirm, onKeyDown }) => (
            <>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "rgba(248,242,225,.95)",
                    boxShadow: "inset 0 0 0 1px #E5E7EB",
                    color: "#414651",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: studioFonts.mono,
                  }}
                >
                  {t}
                </span>
              ))}
              {adding && (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={confirm}
                  placeholder="tag↵"
                  style={{
                    ...chipInputBase,
                    width: 100,
                    fontFamily: studioFonts.mono,
                    fontSize: 12,
                  }}
                />
              )}
            </>
          )}
        </TaxonomyCard>

        {/* Badges */}
        <TaxonomyCard title="Badges" toastMsg="Badge added" bodyStyle={chipsBodyStyle}>
          {({ adding, input, setInput, confirm, onKeyDown }) => (
            <>
              {badges.map((b) => {
                const c = badgeColors[b] ?? { bg: "rgba(173,214,216,.55)", ink: "#074A4D" };
                return (
                  <span
                    key={b}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: c.bg,
                      color: c.ink,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                    {b}
                  </span>
                );
              })}
              {adding && (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={confirm}
                  placeholder="Badge↵"
                  style={{
                    ...chipInputBase,
                    width: 120,
                    fontFamily: "var(--font-switzer)",
                    fontSize: 12.5,
                  }}
                />
              )}
              <div style={{ width: "100%", fontSize: 11.5, color: studioColors.faintGray, marginTop: 4 }}>
                Attached via the <b style={{ color: "#414651" }}>Reviewed by</b> attribute on entries.
              </div>
            </>
          )}
        </TaxonomyCard>
      </div>
    </section>
  );
}
