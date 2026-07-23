"use client";

// src/components/Studio/Taxonomy/TaxonomyScreen.tsx
//
// Authors & taxonomy — the reusable lookups (authors, categories, tags, badges)
// that entries reference, backed by the admin API's standard CRUD endpoints.
// Each card's "+ Add" opens an inline input whose confirm POSTs and appends
// the created row.

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { studioColors, studioFonts, initialsOf, slugify } from "../shared/format";
import {
  getAuthors,
  createAuthor,
  getCategories,
  createCategory,
  getTags,
  createTag,
  getBadges,
  createBadge,
  StudioApiError,
  type StudioAuthor,
  type StudioCategory,
  type StudioTag,
  type StudioBadge,
} from "@/services/studioService";

/* -------------------------------------------------------------------------- */
/*  Card shell — header (title + "+ Add") + body, with async add state         */
/* -------------------------------------------------------------------------- */

interface AddState {
  adding: boolean;
  busy: boolean;
  input: string;
  setInput: (v: string) => void;
  /** POST via the parent handler, then clear + close. */
  confirm: () => void;
  /** Enter → confirm. */
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function TaxonomyCard({
  title,
  onAdd,
  bodyStyle,
  children,
}: {
  title: string;
  /** Create the value server-side; resolve on success, throw to keep the input. */
  onAdd: (value: string) => Promise<void>;
  bodyStyle: CSSProperties;
  children: (state: AddState) => ReactNode;
}) {
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");

  const confirm = async () => {
    const value = input.trim();
    if (!value) {
      // Nothing typed — just close the input.
      setInput("");
      setAdding(false);
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await onAdd(value);
      setInput("");
      setAdding(false);
    } catch {
      /* handler already toasted — keep the input so the user can retry */
    } finally {
      setBusy(false);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void confirm();
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
      <div style={bodyStyle}>{children({ adding, busy, input, setInput, confirm: () => void confirm(), onKeyDown })}</div>
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

/** Translucent chip background derived from a badge's hex color. */
function badgeBg(color: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? `${color}22` : "rgba(173,214,216,.55)";
}

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
  const { tips, toast } = useStudio();

  const [authors, setAuthors] = useState<StudioAuthor[] | null>(null);
  const [categories, setCategories] = useState<StudioCategory[] | null>(null);
  const [tags, setTags] = useState<StudioTag[] | null>(null);
  const [badges, setBadges] = useState<StudioBadge[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAuthors(), getCategories(), getTags(), getBadges()])
      .then(([a, c, t, b]) => {
        if (cancelled) return;
        setAuthors(a.results);
        setCategories(c.results);
        setTags(t.results);
        setBadges(b.results);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load taxonomy"));
    return () => {
      cancelled = true;
    };
  }, []);

  /** Wrap a create call: toast success/error, append on success. */
  const adder = <T,>(
    create: (value: string) => Promise<T>,
    append: (row: T) => void,
    successMsg: string
  ) => async (value: string) => {
    try {
      const row = await create(value);
      append(row);
      toast(successMsg);
    } catch (err) {
      toast(err instanceof StudioApiError ? err.message : "Couldn’t save", "error");
      throw err; // keep the inline input open for a retry
    }
  };

  const loading = authors === null || categories === null || tags === null || badges === null;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Authors & taxonomy"
        subtitle="The reusable lookups entries reference — authors, categories, tags and badges."
      />

      {tips && (
        <TipBanner mb={14}>
          Managed once, attached from the editor’s <b style={{ color: studioColors.tealDeep }}>Organize</b> panel — one
          “Subsidy” category, not five spellings.
        </TipBanner>
      )}

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: "inset 0 0 0 1px #E5E7EB", padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load taxonomy: {loadError}
        </div>
      ) : loading ? (
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))", gap: 14 }}>
          {/* Authors */}
          <TaxonomyCard
            title="Authors"
            onAdd={adder(
              (name) => createAuthor({ name }),
              (a) => setAuthors((prev) => [...(prev ?? []), a]),
              "Author added"
            )}
            bodyStyle={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 11 }}
          >
            {({ adding, busy, input, setInput, confirm, onKeyDown }) => (
              <>
                {authors.length === 0 && !adding && (
                  <div style={{ fontSize: 12.5, color: studioColors.mutedGray }}>No authors yet.</div>
                )}
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
                      {initialsOf(a.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>{a.name}</div>
                      {(a.role || a.bio) && (
                        <div className="truncate" style={{ fontSize: 11.5, color: studioColors.faintGray }}>
                          {a.role || a.bio}
                        </div>
                      )}
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
                      disabled={busy}
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
                        cursor: busy ? "default" : "pointer",
                        opacity: busy ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(.96)")}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                    >
                      {busy ? "…" : "Add"}
                    </button>
                  </div>
                )}
              </>
            )}
          </TaxonomyCard>

          {/* Categories */}
          <TaxonomyCard
            title="Categories"
            onAdd={adder(
              (name) => createCategory({ name, slug: slugify(name) }),
              (c) => setCategories((prev) => [...(prev ?? []), c]),
              "Category added"
            )}
            bodyStyle={chipsBodyStyle}
          >
            {({ adding, input, setInput, confirm, onKeyDown }) => (
              <>
                {categories.length === 0 && !adding && (
                  <span style={{ fontSize: 12.5, color: studioColors.mutedGray }}>No categories yet.</span>
                )}
                {categories.map((c) => (
                  <span
                    key={c.id}
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
                    {c.name}
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
          <TaxonomyCard
            title="Tags"
            onAdd={adder(
              (name) => createTag({ name }),
              (t) => setTags((prev) => [...(prev ?? []), t]),
              "Tag added"
            )}
            bodyStyle={chipsBodyStyle}
          >
            {({ adding, input, setInput, confirm, onKeyDown }) => (
              <>
                {tags.length === 0 && !adding && (
                  <span style={{ fontSize: 12.5, color: studioColors.mutedGray }}>No tags yet.</span>
                )}
                {tags.map((t) => (
                  <span
                    key={t.id}
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
                    {t.name}
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
          <TaxonomyCard
            title="Badges"
            onAdd={adder(
              (label) => createBadge({ label }),
              (b) => setBadges((prev) => [...(prev ?? []), b]),
              "Badge added"
            )}
            bodyStyle={chipsBodyStyle}
          >
            {({ adding, input, setInput, confirm, onKeyDown }) => (
              <>
                {badges.length === 0 && !adding && (
                  <span style={{ fontSize: 12.5, color: studioColors.mutedGray }}>No badges yet.</span>
                )}
                {badges.map((b) => (
                  <span
                    key={b.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: badgeBg(b.color),
                      color: b.color || studioColors.tealDeep,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                    {b.label}
                  </span>
                ))}
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
      )}
    </section>
  );
}
