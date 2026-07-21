"use client";

// src/components/Studio/EntryEditor/EntryEditorScreen.tsx
//
// Entry editor — the template-driven authoring surface. Every field group is
// driven by the entry's template (image groups + attributes). Presentation
// layer: local state seeded from the static entry; publish/save/discard are
// toast stubs. Swap the seed + handlers for API calls during integration.

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  entries,
  collections,
  templates,
  authors,
  assets,
  categories as allCategories,
  badges as allBadges,
} from "@/data/studio";
import type { Entry, Template } from "@/types/studio";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { DropdownMenu } from "../shared/overlays";
import {
  TipBanner,
  StatusPill,
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  SectionIcon,
  FieldLabel,
  KeyTag,
  TextInput,
  TextArea,
  SelectField,
} from "../shared/primitives";
import { statusPill, humanTime, slugify, studioColors, studioFonts } from "../shared/format";
import ImagePickerModal from "./ImagePickerModal";
import RichTextBlock from "./RichTextBlock";
import type { EntryStatus } from "@/types/studio";

const assetSrc = (id?: string) => assets.find((a) => a.id === id)?.src || "";

/** URL prefix shown under the slug field, per collection. */
const urlPrefixFor = (coll: string) =>
  coll === "articles" ? "/blog/" : coll === "case-studies" ? "/case-studies/" : "/";

/** Build a blank draft for the "new entry" route. */
function blankEntry(): Entry {
  return {
    id: "new",
    coll: "articles",
    tpl: "solar-guide",
    title: "",
    slug: "",
    slugT: true,
    excerpt: "",
    author: "flarize",
    cats: [],
    tags: [],
    status: "draft",
    pubDate: null,
    _ts: Date.now(),
    savedTs: Date.now(),
    images: {},
    attrs: {},
    blocks: [{ id: "nb1", label: "Introduction", html: "" }],
    seo: { mt: "", md: "", cu: "", kw: "" },
  };
}

interface PickerTarget {
  groupKey: string;
  mode: "single" | "repeat";
}

export default function EntryEditorScreen({ entryId }: { entryId: string }) {
  const router = useRouter();
  const { tips, toast } = useStudio();
  const { canPublish, role } = useCapabilities();

  const seed = useMemo<Entry>(
    () => (entryId === "new" ? blankEntry() : entries.find((e) => e.id === entryId) || blankEntry()),
    [entryId]
  );

  const [title, setTitle] = useState(seed.title);
  const [slug, setSlug] = useState(seed.slug);
  const [excerpt, setExcerpt] = useState(seed.excerpt);
  const [tplId, setTplId] = useState(seed.tpl);
  const [authorId, setAuthorId] = useState(seed.author);
  const [cats, setCats] = useState<string[]>(seed.cats);
  const [tags, setTags] = useState<string[]>(seed.tags);
  const [attrs, setAttrs] = useState<Record<string, string>>(seed.attrs);
  const [seo, setSeo] = useState(seed.seo);
  const [images, setImages] = useState<Record<string, string | string[]>>(seed.images);
  const [status, setStatus] = useState<EntryStatus>(seed.status);
  const [blocks, setBlocks] = useState(seed.blocks);

  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [addCatAnchor, setAddCatAnchor] = useState<{ top: number; left: number } | null>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const collection = collections.find((c) => c.id === seed.coll);
  const template = templates.find((t) => t.id === tplId) as Template;
  const pill = statusPill(status);

  const slugDupe = useMemo(() => {
    const other = entries.find((e) => e.id !== seed.id && e.coll === seed.coll && e.slug === slug && slug);
    return other ? other.title : null;
  }, [slug, seed.id, seed.coll]);

  const headTitle = title || "Untitled entry";
  const metaLine = `${seed.coll} · ${tplId} · edited ${humanTime(seed._ts)}`;
  const publishLabel = status === "modified" ? "Publish changes" : "Publish";
  const showPublish = canPublish && status !== "published";
  const canUnpub = canPublish && (status === "published" || status === "modified");
  const isLive = status === "published" || status === "modified";

  /* ---- image group helpers ---- */
  const setGroup = (key: string, value: string | string[]) => setImages((m) => ({ ...m, [key]: value }));
  const pickImage = (assetId: string) => {
    if (!picker) return;
    if (picker.mode === "single") setGroup(picker.groupKey, assetId);
    else {
      const cur = (images[picker.groupKey] as string[]) || [];
      setGroup(picker.groupKey, [...cur, assetId]);
    }
    setPicker(null);
  };

  /* ---- attribute helpers ---- */
  const shortAttrs = template.attrs.filter((a) => a.type !== "text");
  const longAttrs = template.attrs.filter((a) => a.type === "text");
  const setAttr = (key: string, v: string) => setAttrs((m) => ({ ...m, [key]: v }));
  const enumOptions = (key: string, opts?: string[]) => (key === "badge" ? allBadges : opts || []);

  /* ---- taxonomy helpers ---- */
  const remainingCats = allCategories.filter((c) => !cats.includes(c));
  const addTag = () => {
    const t = slugify(tagInput);
    if (t && !tags.includes(t)) setTags((x) => [...x, t]);
    setTagInput("");
    setAddingTag(false);
  };

  /* ---- content block helpers ---- */
  const addBlock = () =>
    setBlocks((b) => [...b, { id: `b${b.length + 1}_${Date.now()}`, label: "Body", html: "" }]);
  const removeBlock = (id: string) => setBlocks((b) => b.filter((x) => x.id !== id));

  const cardCls = "mb-4 overflow-hidden";

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      {/* Back link */}
      <button
        onClick={() => router.push("/studio/entries")}
        className="inline-flex items-center gap-1.5 hover:bg-[rgba(7,74,77,0.06)]"
        style={{ border: "none", background: "none", padding: "4px 8px", margin: "0 0 10px -8px", borderRadius: 8, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, color: studioColors.teal, cursor: "pointer" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        {collection?.name || "Entries"}
      </button>

      {/* Title row + actions */}
      <div className="mb-4 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, color: studioColors.tealDeep, fontFamily: "var(--font-switzer)", textWrap: "balance" } as React.CSSProperties}>
            {headTitle}
          </h2>
          <div className="mt-[7px] flex flex-wrap items-center gap-2.5">
            <StatusPill pill={pill} />
            <span style={{ fontSize: 11.5, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>{metaLine}</span>
          </div>
        </div>
        <div className="flex flex-none items-center gap-2">
          <button
            onClick={() => router.push("/studio/entries")}
            className="inline-flex items-center hover:bg-[rgba(7,74,77,0.06)]"
            style={{ height: 38, padding: "0 13px", borderRadius: 12, border: "none", background: "transparent", color: studioColors.bodyGray, fontFamily: "var(--font-switzer)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Discard
          </button>
          <button
            onClick={() => toast("Draft saved")}
            className="inline-flex items-center hover:bg-[rgba(7,74,77,0.05)]"
            style={{ height: 38, padding: "0 15px", borderRadius: 12, border: "none", background: "#ffffff", boxShadow: `inset 0 0 0 1px ${studioColors.teal}`, color: studioColors.teal, fontFamily: "var(--font-switzer)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Save draft
          </button>
          {showPublish && (
            <button
              onClick={() => {
                setStatus("published");
                toast(status === "modified" ? "Changes published" : "Entry published");
              }}
              className="inline-flex items-center transition-[filter] hover:brightness-[.96]"
              style={{ height: 38, padding: "0 16px", borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
            >
              {publishLabel}
            </button>
          )}
        </div>
      </div>

      {tips && (
        <TipBanner>
          Every field here is driven by the entry’s <b style={{ color: studioColors.tealDeep }}>template</b> — switch it in the
          right rail and watch the image groups and attributes change. Labels are renamable in the template builder;{" "}
          <b style={{ color: studioColors.tealDeep }}>machine keys never change</b>, so the website’s API contract stays intact.
        </TipBanner>
      )}

      <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1fr)_300px] grid-cols-1">
        {/* ---------------- main column ---------------- */}
        <div className="min-w-0">
          {/* Basics */}
          <Card className={cardCls}>
            <CardHeader>
              <SectionIcon>
                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
              </SectionIcon>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 15 }}>
                <FieldLabel>
                  Title <span style={{ color: studioColors.danger }}>*</span>
                </FieldLabel>
                <TextInput value={title} onChange={setTitle} placeholder="Give this entry a title" />
              </div>
              <div style={{ marginBottom: 15 }}>
                <FieldLabel suffix={<KeyTag>→ slug</KeyTag>}>
                  URL slug <span style={{ color: studioColors.danger }}>*</span>
                </FieldLabel>
                <div className="flex gap-2">
                  <TextInput
                    value={slug}
                    onChange={setSlug}
                    placeholder="url-slug"
                    mono
                    style={slugDupe ? { boxShadow: `inset 0 0 0 1.5px ${studioColors.danger},0 1px 2px rgba(10,13,18,.05)` } : undefined}
                  />
                  <button
                    onClick={() => setSlug(slugify(title))}
                    title="Regenerate from title"
                    className="grid flex-none place-items-center hover:shadow-[inset_0_0_0_1px_#074A4D]"
                    style={{ width: 40, height: 40, border: "none", borderRadius: 12, background: "#ffffff", boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`, color: studioColors.bodyGray, cursor: "pointer" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
                      <path d="M20 3.5V8h-4.5" />
                    </svg>
                  </button>
                </div>
                <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 6 }}>
                  flarize.com{urlPrefixFor(seed.coll)}
                  <b style={{ color: studioColors.teal, fontFamily: studioFonts.mono, fontWeight: 600 }}>{slug || "…"}</b> — auto-generated from the title, editable.
                </div>
                {slugDupe && (
                  <div className="mt-1.5 flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 4 2.8 19.5h18.4Z" strokeLinejoin="round" />
                      <path d="M12 10v4.2M12 16.8h.01" />
                    </svg>
                    Already used by “{slugDupe}” in this collection — publishing is blocked until it’s unique.
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 2 }}>
                <FieldLabel suffix={<KeyTag>{excerpt.length} / 160</KeyTag>}>Excerpt</FieldLabel>
                <TextArea value={excerpt} onChange={setExcerpt} placeholder="Short summary shown on blog cards and in search results…" />
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className={cardCls}>
            <CardHeader>
              <SectionIcon>
                <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m20.5 15-5-5L5 20.5" />
              </SectionIcon>
              <CardTitle>Images</CardTitle>
              <CardMeta>from template · {template.groups.length} groups</CardMeta>
            </CardHeader>
            <div className="flex flex-col gap-4" style={{ padding: 16 }}>
              {template.groups.map((g) => {
                const single = g.kind === "single";
                const val = images[g.key];
                const items = (Array.isArray(val) ? val : []) as string[];
                const kindLabel = single ? "Single image" : `Repeatable · max ${g.max}`;
                const kindBg = single ? "rgba(173,214,216,.45)" : "rgba(253,246,210,.9)";
                const kindInk = single ? "#074A4D" : "#8A6117";
                return (
                  <div key={g.key}>
                    <div className="mb-2 flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>{g.label}</span>
                      {g.req && <span style={{ color: studioColors.danger, fontWeight: 600 }}>*</span>}
                      <span style={{ fontFamily: studioFonts.mono, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: kindBg, color: kindInk }}>{kindLabel}</span>
                      <code style={{ marginLeft: "auto", fontFamily: studioFonts.mono, fontSize: 11, color: studioColors.faintGray }}>{g.key}</code>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {single && typeof val === "string" && val ? (
                        <div className="relative" style={{ width: 122, height: 80, borderRadius: 12, background: `#F8F2E1 url('${assetSrc(val)}') center/cover no-repeat`, boxShadow: "inset 0 0 0 1px rgba(18,53,50,.12)" }}>
                          <button onClick={() => setGroup(g.key, "")} title="Remove" aria-label="Remove image" className="absolute grid place-items-center hover:bg-[#DC2626]" style={{ top: 5, right: 5, width: 19, height: 19, borderRadius: "50%", border: "none", background: "rgba(18,53,50,.68)", color: "#ffffff", cursor: "pointer" }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                          </button>
                          <button onClick={() => setPicker({ groupKey: g.key, mode: "single" })} className="absolute hover:bg-white" style={{ left: 5, bottom: 5, border: "none", borderRadius: 6, background: "rgba(255,255,255,.94)", color: studioColors.teal, fontFamily: "var(--font-switzer)", fontSize: 10, fontWeight: 600, padding: "3px 8px", cursor: "pointer" }}>Replace</button>
                        </div>
                      ) : single ? (
                        <button onClick={() => setPicker({ groupKey: g.key, mode: "single" })} className="grid place-items-center hover:border-[#074A4D] hover:text-[#074A4D]" style={{ width: 122, height: 80, borderRadius: 12, border: "1.5px dashed #B8B8B8", background: "rgba(248,242,225,.5)", cursor: "pointer", color: studioColors.mutedGray, fontFamily: "var(--font-switzer)" }}>
                          <span className="grid place-items-center gap-[3px]">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m20.5 15-5-5L5 20.5" /></svg>
                            <span style={{ fontSize: 11, fontWeight: 600 }}>Choose</span>
                          </span>
                        </button>
                      ) : (
                        <>
                          {items.map((it, i) => (
                            <div key={i} className="relative" style={{ width: 98, height: 68, borderRadius: 12, background: `#F8F2E1 url('${assetSrc(it)}') center/cover no-repeat`, boxShadow: "inset 0 0 0 1px rgba(18,53,50,.12)" }}>
                              <button onClick={() => setGroup(g.key, items.filter((_, j) => j !== i))} title="Remove" aria-label="Remove image" className="absolute grid place-items-center hover:bg-[#DC2626]" style={{ top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", border: "none", background: "rgba(18,53,50,.68)", color: "#ffffff", cursor: "pointer" }}>
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                              </button>
                            </div>
                          ))}
                          {(!g.max || items.length < g.max) && (
                            <button onClick={() => setPicker({ groupKey: g.key, mode: "repeat" })} aria-label={`Add image to ${g.label}`} className="grid place-items-center hover:border-[#074A4D] hover:text-[#074A4D]" style={{ width: 98, height: 68, borderRadius: 12, border: "1.5px dashed #B8B8B8", background: "rgba(248,242,225,.5)", cursor: "pointer", color: studioColors.mutedGray, fontSize: 20, fontWeight: 500, fontFamily: "var(--font-switzer)" }}>+</button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Content */}
          <Card className={cardCls}>
            <CardHeader>
              <SectionIcon>
                <path d="M4 6h16M4 12h16M4 18h10" />
              </SectionIcon>
              <CardTitle>Content</CardTitle>
              <CardMeta>rich text · {blocks.length} blocks</CardMeta>
            </CardHeader>
            <div style={{ padding: 16 }}>
              {blocks.map((b, i) => (
                <RichTextBlock
                  key={b.id}
                  label={b.label}
                  html={b.html}
                  canRemove={i > 0}
                  onRemove={() => removeBlock(b.id)}
                />
              ))}
              <button onClick={addBlock} className="inline-flex items-center gap-1.5 hover:border-[#074A4D] hover:text-[#074A4D]" style={{ height: 34, padding: "0 13px", borderRadius: 12, border: "1.5px dashed #B8B8B8", background: "transparent", color: studioColors.bodyGray, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                + Add content block
              </button>
            </div>
          </Card>

          {/* Attributes */}
          {template.attrs.length > 0 && (
            <Card className={cardCls}>
              <CardHeader>
                <SectionIcon>
                  <path d="M4 8h9" />
                  <circle cx="17" cy="8" r="2.6" />
                  <path d="M20 16h-9" />
                  <circle cx="7" cy="16" r="2.6" />
                </SectionIcon>
                <CardTitle>Attributes</CardTitle>
                <CardMeta>from template · keys fixed</CardMeta>
              </CardHeader>
              <div style={{ padding: 16 }}>
                {shortAttrs.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-3.5">
                    {shortAttrs.map((a) => (
                      <div key={a.key} style={{ marginBottom: 15 }}>
                        <FieldLabel suffix={<KeyTag>{a.key} · {a.type}</KeyTag>}>{a.label}</FieldLabel>
                        {a.type === "number" ? (
                          <TextInput value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} type="number" style={{ fontFamily: studioFonts.num }} />
                        ) : a.type === "enum" ? (
                          <SelectField value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} ariaLabel={a.label}>
                            <option value="">—</option>
                            {enumOptions(a.key, a.options).map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </SelectField>
                        ) : (
                          <TextInput value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} placeholder={a.label} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {longAttrs.map((a) => (
                  <div key={a.key} style={{ marginBottom: 15 }}>
                    <FieldLabel suffix={<KeyTag>{a.key} · {a.type}</KeyTag>}>{a.label}</FieldLabel>
                    <TextArea value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} placeholder="Optional callout shown in a highlighted box…" minHeight={56} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SEO */}
          <Card className={cardCls}>
            <CardHeader>
              <SectionIcon>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </SectionIcon>
              <CardTitle>SEO &amp; metadata</CardTitle>
              <CardMeta>injected into the page &lt;head&gt;</CardMeta>
            </CardHeader>
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 15 }}>
                <FieldLabel suffix={<KeyTag>metaTitle · {seo.mt.length} / 60</KeyTag>}>Meta title</FieldLabel>
                <TextInput value={seo.mt} onChange={(v) => setSeo((s) => ({ ...s, mt: v }))} placeholder="Shown as the tab + search result title" />
              </div>
              <div style={{ marginBottom: 15 }}>
                <FieldLabel suffix={<KeyTag>metaDescription · {seo.md.length} / 160</KeyTag>}>Meta description</FieldLabel>
                <TextArea value={seo.md} onChange={(v) => setSeo((s) => ({ ...s, md: v }))} placeholder="One or two sentences for search results…" minHeight={52} />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <FieldLabel suffix={<KeyTag>canonicalUrl</KeyTag>}>Canonical URL</FieldLabel>
                  <TextInput value={seo.cu} onChange={(v) => setSeo((s) => ({ ...s, cu: v }))} placeholder="https://…" mono style={{ fontSize: 12.5 }} />
                </div>
                <div>
                  <FieldLabel suffix={<KeyTag>keywords</KeyTag>}>Keywords</FieldLabel>
                  <TextInput value={seo.kw} onChange={(v) => setSeo((s) => ({ ...s, kw: v }))} placeholder="comma, separated" style={{ fontSize: 13.5 }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ---------------- right rail ---------------- */}
        <div className="sticky top-0 flex flex-col gap-3.5">
          {/* Publish state */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, marginBottom: 11 }}>Publish state</div>
            <div className="flex flex-col gap-[9px]" style={{ fontSize: 12.5, color: studioColors.bodyGray }}>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <StatusPill pill={pill} size="sm" />
              </div>
              <div className="flex justify-between">
                <span>Last published</span>
                <span style={{ color: studioColors.tealDeep, fontWeight: 500 }}>{seed.pubDate || "—"}</span>
              </div>
              {status === "modified" && (
                <div className="flex justify-between">
                  <span>Draft edits</span>
                  <span style={{ color: "#8A6117", fontWeight: 600 }}>unpublished</span>
                </div>
              )}
            </div>
            {showPublish && (
              <button onClick={() => { setStatus("published"); toast("Entry published"); }} className="mt-[13px] inline-flex h-[38px] w-full items-center justify-center transition-[filter] hover:brightness-[.96]" style={{ borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
                {publishLabel}
              </button>
            )}
            {canUnpub && (
              <button onClick={() => { setStatus("draft"); toast("Entry unpublished"); }} className="mt-[7px] inline-flex h-8 w-full items-center justify-center hover:bg-[rgba(7,74,77,0.06)]" style={{ borderRadius: 12, border: "none", background: "transparent", color: studioColors.bodyGray, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                Unpublish
              </button>
            )}
            {isLive && (
              <button onClick={() => toast("Opening the live page")} className="mt-[2px] inline-flex h-8 w-full items-center justify-center gap-1.5 hover:bg-[rgba(7,74,77,0.06)]" style={{ borderRadius: 12, border: "none", background: "transparent", color: studioColors.teal, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                View live
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4 11 13" /></svg>
              </button>
            )}
            {role === "Author" && (
              <div style={{ marginTop: 12, padding: "9px 11px", background: "rgba(248,242,225,.85)", borderRadius: 10, fontSize: 11.5, color: studioColors.bodyGray, lineHeight: 1.5 }}>
                Authors can’t publish — an Editor reviews this draft and takes it live.
              </div>
            )}
          </Card>

          {/* Template */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, marginBottom: 10 }}>Template</div>
            <SelectField value={tplId} onChange={setTplId} mono style={{ fontSize: 13 }}>
              {(collection?.tpls || [tplId]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </SelectField>
            <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 7, lineHeight: 1.45 }}>
              Controls which image groups, attributes &amp; layout this entry exposes.
            </div>
          </Card>

          {/* Organize */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, marginBottom: 10 }}>Organize</div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 5 }}>Author</label>
              <SelectField value={authorId} onChange={setAuthorId} ariaLabel="Author" style={{ fontSize: 13, padding: "9px 32px 9px 12px" }}>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </SelectField>
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}>Categories</label>
              <div className="flex flex-wrap gap-1.5">
                {cats.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5" style={{ padding: "4px 6px 4px 11px", borderRadius: 999, background: "rgba(173,214,216,.45)", color: studioColors.teal, fontSize: 12, fontWeight: 600 }}>
                    {c}
                    <button onClick={() => setCats((x) => x.filter((y) => y !== c))} className="grid place-items-center opacity-65 hover:opacity-100" style={{ border: "none", background: "none", cursor: "pointer", color: "inherit", padding: 2 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                  </span>
                ))}
                {remainingCats.length > 0 && (
                  <button
                    onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAddCatAnchor({ top: r.bottom + 4, left: r.left }); }}
                    aria-haspopup="menu"
                    aria-label="Add category"
                    className="inline-flex items-center hover:border-[#074A4D] hover:text-[#074A4D]"
                    style={{ padding: "4px 11px", borderRadius: 999, border: "1px dashed #B8B8B8", background: "transparent", color: studioColors.mutedGray, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-switzer)" }}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}>Tags</label>
              <div className="flex flex-wrap items-center gap-1.5">
                {tags.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5" style={{ padding: "4px 6px 4px 11px", borderRadius: 999, background: "rgba(248,242,225,.95)", boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, color: studioColors.labelGray, fontSize: 12, fontWeight: 500, fontFamily: studioFonts.mono }}>
                    {c}
                    <button onClick={() => setTags((x) => x.filter((y) => y !== c))} className="grid place-items-center opacity-55 hover:opacity-100" style={{ border: "none", background: "none", cursor: "pointer", color: "inherit", padding: 2 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                  </span>
                ))}
                {addingTag ? (
                  <input
                    ref={tagInputRef}
                    autoFocus
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addTag(); }}
                    onBlur={addTag}
                    placeholder="tag name⏎"
                    style={{ width: 110, boxSizing: "border-box", padding: "5px 10px", border: "none", borderRadius: 999, background: "#ffffff", boxShadow: "inset 0 0 0 1.5px #074A4D", fontFamily: studioFonts.mono, fontSize: 12, color: studioColors.tealDeep }}
                  />
                ) : (
                  <button onClick={() => setAddingTag(true)} className="inline-flex items-center hover:border-[#074A4D] hover:text-[#074A4D]" style={{ padding: "4px 11px", borderRadius: 999, border: "1px dashed #B8B8B8", background: "transparent", color: studioColors.mutedGray, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-switzer)" }}>+</button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add-category menu */}
      <DropdownMenu
        open={!!addCatAnchor}
        onClose={() => setAddCatAnchor(null)}
        top={addCatAnchor?.top || 0}
        left={addCatAnchor?.left || 0}
        items={remainingCats.map((c) => ({ label: c, onClick: () => setCats((x) => [...x, c]) }))}
      />

      {/* Image picker */}
      <ImagePickerModal
        open={!!picker}
        onClose={() => setPicker(null)}
        onPick={pickImage}
        onUpload={() => { toast("Uploads land in the media library"); setPicker(null); }}
        groupLabel={template.groups.find((g) => g.key === picker?.groupKey)?.label}
      />
    </section>
  );
}
