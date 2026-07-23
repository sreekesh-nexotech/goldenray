"use client";

// src/components/Studio/EntryEditor/EntryEditorScreen.tsx
//
// Entry editor — the template-driven authoring surface, backed by the admin
// API. GET entries/{id}/ seeds every field; the active template's image groups
// and attribute slots drive the Images and Attributes cards. Save draft does a
// POST (new) / PATCH (existing) with the full replace-all payload; Publish and
// Unpublish call the workflow endpoints (publish surfaces template-validation
// errors). check-slug validates the URL slug against the collection.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { statusPill, slugify, studioColors, studioFonts } from "../shared/format";
import ImagePickerModal, { type PickerAsset } from "./ImagePickerModal";
import RichTextBlock from "./RichTextBlock";
import { blocksToHtml, htmlToBlocks } from "./entryBlocks";
import {
  getEntry,
  createEntry,
  updateEntry,
  checkSlug,
  publishEntry,
  unpublishEntry,
  getCollections,
  getTemplates,
  getAuthors,
  getCategories,
  getTags,
  getMediaAssets,
  uploadMediaAsset,
  StudioApiError,
  type StudioEntryDetail,
  type StudioCollection,
  type StudioTemplate,
  type StudioAuthor,
  type StudioCategory,
  type StudioTag,
  type StudioMediaAsset,
  type EntryWritePayload,
} from "@/services/studioService";

/* -------------------------------------------------------------------------- */
/*  Editor working state                                                       */
/* -------------------------------------------------------------------------- */

interface EditorBlock {
  key: string;
  html: string;
}

interface PickerTarget {
  groupKey: string;
  mode: "single" | "repeat";
}

type SlugState = { checking: boolean; available: boolean | null; suggestion: string | null };

let blockSeq = 0;
const newBlockKey = () => `b_${++blockSeq}`;

export default function EntryEditorScreen({ entryId }: { entryId: string }) {
  const router = useRouter();
  const { tips, toast, config } = useStudio();
  const { canPublish, role } = useCapabilities();
  const isNew = entryId === "new";

  // Reference data.
  const [colls, setColls] = useState<StudioCollection[]>([]);
  const [templates, setTemplates] = useState<StudioTemplate[]>([]);
  const [authors, setAuthors] = useState<StudioAuthor[]>([]);
  const [allCategories, setAllCategories] = useState<StudioCategory[]>([]);
  const [allTags, setAllTags] = useState<StudioTag[]>([]);
  const [media, setMedia] = useState<StudioMediaAsset[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Entry identity + form fields.
  const [id, setId] = useState<number | null>(isNew ? null : Number(entryId));
  const [documentMeta, setDocumentMeta] = useState<{ status: "draft" | "published"; published_on: string | null; published_at: string | null }>(
    { status: "draft", published_on: null, published_at: null }
  );
  const [collId, setCollId] = useState<number | null>(null);
  const [tplId, setTplId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [catIds, setCatIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [attrs, setAttrs] = useState<Record<string, string>>({});
  const [seo, setSeo] = useState({ mt: "", md: "", cu: "", kw: "" });
  // group_key → ordered media_asset ids.
  const [images, setImages] = useState<Record<string, number[]>>({});
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);

  const [publishing, setPublishing] = useState(false);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [slugState, setSlugState] = useState<SlugState>({ checking: false, available: null, suggestion: null });

  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [addCatAnchor, setAddCatAnchor] = useState<{ top: number; left: number } | null>(null);
  const [addTagAnchor, setAddTagAnchor] = useState<{ top: number; left: number } | null>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");

  /* ---- initial load: reference data + (existing) entry ------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [collsP, tplsP, authorsP, catsP, tagsP, mediaP] = await Promise.all([
          getCollections(),
          getTemplates(),
          getAuthors(),
          getCategories(),
          getTags(),
          getMediaAssets(),
        ]);
        if (cancelled) return;
        setColls(collsP.results);
        setTemplates(tplsP.results);
        setAuthors(authorsP.results);
        setAllCategories(catsP.results);
        setAllTags(tagsP.results);
        setMedia(mediaP.results);

        if (isNew) {
          setCollId(collsP.results[0]?.id ?? null);
          setTplId(tplsP.results[0]?.id ?? null);
          setBlocks([{ key: newBlockKey(), html: "" }]);
        } else {
          const e = await getEntry(entryId);
          if (cancelled) return;
          seedFromEntry(e);
        }
        setLoadError(null);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load the entry");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  /** Map a fetched entry into the editor's working state. */
  const seedFromEntry = (e: StudioEntryDetail) => {
    setId(e.id);
    setDocumentMeta({ status: e.status, published_on: e.published_on, published_at: e.published_at });
    setCollId(e.collection);
    setTplId(e.template);
    setTitle(e.title);
    setSlug(e.slug);
    setExcerpt(e.excerpt ?? "");
    setAuthorId(e.author?.id ?? null);
    setCatIds(e.categories.map((c) => c.id));
    setTagIds(e.tags.map((t) => t.id));
    setAttrs(Object.fromEntries(e.attribute_values.map((av) => [av.slot_key, av.value == null ? "" : String(av.value)])));
    setSeo({
      mt: e.seo?.meta_title ?? "",
      md: e.seo?.meta_description ?? "",
      cu: e.seo?.canonical_url ?? "",
      kw: e.seo?.keywords ?? "",
    });
    // Group images by group_key, ordered by position.
    const grouped: Record<string, number[]> = {};
    [...e.images]
      .sort((a, b) => a.position - b.position)
      .forEach((im) => {
        if (im.media_asset == null) return;
        (grouped[im.group_key] ??= []).push(im.media_asset);
      });
    setImages(grouped);
    const sortedBlocks = [...e.content_blocks].sort((a, b) => a.order - b.order);
    setBlocks(
      sortedBlocks.length
        ? sortedBlocks.map((b) => ({ key: newBlockKey(), html: blocksToHtml(b.body as never) }))
        : [{ key: newBlockKey(), html: "" }]
    );
  };

  /* ---- derived ----------------------------------------------------------- */
  const collection = colls.find((c) => c.id === collId) ?? null;
  const template = templates.find((t) => t.id === tplId) ?? null;
  const status = documentMeta.status;
  const pill = statusPill(status);
  const mediaById = useMemo(() => new Map(media.map((m) => [m.id, m])), [media]);
  const assetSrc = (assetId?: number) => (assetId != null ? mediaById.get(assetId)?.url ?? "" : "");

  const pickerAssets: PickerAsset[] = useMemo(
    () =>
      media.map((m) => ({
        id: m.id,
        url: m.url,
        name: m.file?.split("/").pop() || `asset-${m.id}`,
        width: m.width,
        height: m.height,
        kb: Math.max(1, Math.round((m.size || 0) / 1024)),
      })),
    [media]
  );

  const headTitle = title || "Untitled entry";
  const publishLabel = "Publish";
  const showPublish = canPublish && status !== "published";
  const canUnpub = canPublish && status === "published";
  const isLive = status === "published";
  const blogPath = config?.blog_path ?? "/blog";

  // Attribute slots split into inline (short) and full-width (long/rich) fields.
  const slots = template?.attribute_slots ?? [];
  const shortSlots = slots.filter((s) => s.type !== "text" && s.type !== "richtext_blocks");
  const longSlots = slots.filter((s) => s.type === "text" || s.type === "richtext_blocks");

  /* ---- image group helpers ---- */
  const groupList = (key: string) => images[key] ?? [];
  const setGroupList = (key: string, list: number[]) => setImages((m) => ({ ...m, [key]: list }));
  const addToGroup = (groupKey: string, mode: "single" | "repeat", assetId: number) => {
    if (mode === "single") setGroupList(groupKey, [assetId]);
    else setGroupList(groupKey, [...groupList(groupKey), assetId]);
  };

  const pickImage = (assetId: number) => {
    if (!picker) return;
    addToGroup(picker.groupKey, picker.mode, assetId);
    setPicker(null);
  };

  /** Upload new image(s) to the media library, then select the first into the
   *  group the picker was opened for. */
  const uploadAndPick = async (files: FileList | File[]) => {
    const target = picker;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!target || list.length === 0) {
      if (list.length === 0) toast("Only image files can be uploaded", "error");
      return;
    }
    setUploadingAsset(true);
    try {
      const uploaded: StudioMediaAsset[] = [];
      for (const file of list) {
        try {
          uploaded.push(await uploadMediaAsset(file, collId != null ? { collection: collId } : undefined));
        } catch (err) {
          toast(err instanceof StudioApiError ? `${file.name}: ${err.message}` : `${file.name}: upload failed`, "error");
        }
      }
      if (uploaded.length === 0) return;
      setMedia((prev) => [...uploaded, ...prev]);
      if (target.mode === "single") {
        setGroupList(target.groupKey, [uploaded[0].id]);
      } else {
        setGroupList(target.groupKey, [...groupList(target.groupKey), ...uploaded.map((a) => a.id)]);
      }
      toast(uploaded.length === 1 ? "Image uploaded" : `${uploaded.length} images uploaded`);
      setPicker(null);
    } finally {
      setUploadingAsset(false);
    }
  };

  /* ---- attribute helpers ---- */
  const setAttr = (key: string, v: string) => setAttrs((m) => ({ ...m, [key]: v }));
  const enumChoices = (slot: { options: Record<string, unknown> }): string[] => {
    const choices = slot.options?.choices;
    return Array.isArray(choices) ? (choices as string[]) : [];
  };

  /* ---- taxonomy helpers ---- */
  const remainingCats = allCategories.filter((c) => !catIds.includes(c.id));
  const remainingTags = allTags.filter((t) => !tagIds.includes(t.id));
  const catName = (cid: number) => allCategories.find((c) => c.id === cid)?.name ?? String(cid);
  const tagName = (tid: number) => allTags.find((t) => t.id === tid)?.name ?? String(tid);

  const addTag = async () => {
    const name = tagInput.trim();
    setAddingTag(false);
    setTagInput("");
    if (!name) return;
    const existing = allTags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (!tagIds.includes(existing.id)) setTagIds((x) => [...x, existing.id]);
      return;
    }
    // Create the tag on the fly, then attach it.
    try {
      const { createTag } = await import("@/services/studioService");
      const created = await createTag({ name });
      setAllTags((prev) => [...prev, created]);
      setTagIds((x) => [...x, created.id]);
    } catch (err) {
      toast(err instanceof StudioApiError ? err.message : "Couldn’t add the tag", "error");
    }
  };

  /* ---- content block helpers ---- */
  const setBlockHtml = (key: string, html: string) =>
    setBlocks((b) => b.map((x) => (x.key === key ? { ...x, html } : x)));
  const addBlock = () => setBlocks((b) => [...b, { key: newBlockKey(), html: "" }]);
  const removeBlock = (key: string) => setBlocks((b) => b.filter((x) => x.key !== key));

  /* ---- slug check -------------------------------------------------------- */
  const runSlugCheck = async () => {
    if (!collId || !slug.trim()) {
      setSlugState({ checking: false, available: null, suggestion: null });
      return;
    }
    setSlugState((s) => ({ ...s, checking: true }));
    try {
      const res = await checkSlug(collId, slug.trim());
      setSlugState({ checking: false, available: res.available, suggestion: res.available ? null : res.suggestion });
    } catch {
      setSlugState({ checking: false, available: null, suggestion: null });
    }
  };

  /* ---- save / publish ---------------------------------------------------- */

  /** Assemble the full write payload from working state. */
  const buildPayload = (): EntryWritePayload | null => {
    if (!collId) {
      toast("Pick a collection first", "error");
      return null;
    }
    const imageRows = Object.entries(images).flatMap(([group_key, ids]) =>
      ids.map((mediaId, position) => ({ group_key, position, media_asset: mediaId }))
    );
    const attrRows = slots
      .map((s) => {
        const raw = attrs[s.key];
        if (raw === undefined || raw === "") return null;
        const value: unknown = s.type === "number" ? Number(raw) : s.type === "boolean" ? raw === "true" : raw;
        return { slot_key: s.key, value };
      })
      .filter(Boolean) as { slot_key: string; value: unknown }[];
    const contentRows = blocks.map((b, i) => ({
      component: "shared.rich-text",
      body: htmlToBlocks(b.html),
      order: i,
    }));

    return {
      collection: collId,
      template: tplId ?? null,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      author: authorId ?? null,
      categories: catIds,
      tags: tagIds,
      content_blocks: contentRows,
      images: imageRows,
      attribute_values: attrRows,
      seo: {
        meta_title: seo.mt || null,
        meta_description: seo.md || null,
        canonical_url: seo.cu || null,
        keywords: seo.kw || null,
      },
    };
  };

  /**
   * Persist and return the saved entry (or null on failure/validation).
   * Deliberately does NOT re-seed the editor from the response — that would
   * remount the content blocks and yank the caret mid-edit. Local state is the
   * source of truth; we only sync identity + publish metadata back.
   */
  const persist = async (): Promise<StudioEntryDetail | null> => {
    if (!title.trim()) {
      toast("Give the entry a title", "error");
      return null;
    }
    if (!slug.trim()) {
      toast("Give the entry a URL slug", "error");
      return null;
    }
    const payload = buildPayload();
    if (!payload) return null;
    try {
      const saved = id == null ? await createEntry(payload) : await updateEntry(id, payload);
      const wasNew = id == null;
      setId(saved.id);
      setDocumentMeta({ status: saved.status, published_on: saved.published_on, published_at: saved.published_at });
      savedSnapshot.current = snapshot; // keep the auto-save baseline in sync
      // A new entry gets its real id in the URL — via history.replaceState so
      // the route param doesn't change and the editor isn't remounted/refetched.
      if (wasNew && typeof window !== "undefined") {
        window.history.replaceState(null, "", `/studio/entries/${saved.id}`);
      }
      return saved;
    } catch (err) {
      toast(err instanceof StudioApiError ? `Save failed: ${err.message}` : "Save failed", "error");
      return null;
    }
  };

  /* ---- auto-save (debounced; new entries auto-create on first title) ----- */

  // A serialized fingerprint of every persisted field. Block identity (keys)
  // is excluded so a re-render never counts as a change.
  const snapshot = useMemo(
    () =>
      JSON.stringify({
        collId, tplId, title, slug, excerpt, authorId, catIds, tagIds, attrs, seo, images,
        blocks: blocks.map((b) => b.html),
      }),
    [collId, tplId, title, slug, excerpt, authorId, catIds, tagIds, attrs, seo, images, blocks]
  );
  const savedSnapshot = useRef<string | null>(null);

  const autoSave = async () => {
    // New entries auto-create once they have the required title + slug;
    // existing ones PATCH. Skip while a slug is known-duplicate.
    if (!title.trim() || !slug.trim() || slugState.available === false) return;
    const payload = buildPayload();
    if (!payload) return;
    setAutoState("saving");
    try {
      if (id == null) {
        const created = await createEntry(payload);
        setId(created.id);
        setDocumentMeta({ status: created.status, published_on: created.published_on, published_at: created.published_at });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/studio/entries/${created.id}`);
        }
      } else {
        await updateEntry(id, payload);
      }
      savedSnapshot.current = snapshot;
      setAutoState("saved");
    } catch (err) {
      setAutoState("error");
      toast(err instanceof StudioApiError ? `Save failed: ${err.message}` : "Save failed", "error");
    }
  };

  useEffect(() => {
    if (loading) return;
    // First run after the form seeds establishes the baseline — no save.
    if (savedSnapshot.current === null) {
      savedSnapshot.current = snapshot;
      return;
    }
    if (snapshot === savedSnapshot.current) return;
    const t = setTimeout(() => void autoSave(), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, loading]);

  const publish = async () => {
    setPublishing(true);
    const saved = await persist();
    if (!saved) {
      setPublishing(false);
      return;
    }
    try {
      await publishEntry(saved.id);
      toast("Entry published");
      // Re-pull publish metadata only (not the whole form — avoids remount).
      const fresh = await getEntry(saved.id);
      setDocumentMeta({ status: fresh.status, published_on: fresh.published_on, published_at: fresh.published_at });
    } catch (err) {
      if (err instanceof StudioApiError && err.errors?.length) {
        err.errors.slice(0, 3).forEach((m) => toast(m, "error"));
      } else {
        toast(err instanceof StudioApiError ? `Publish failed: ${err.message}` : "Publish failed", "error");
      }
    } finally {
      setPublishing(false);
    }
  };

  const unpublish = async () => {
    if (id == null) return;
    setPublishing(true);
    try {
      await unpublishEntry(id);
      setDocumentMeta((m) => ({ ...m, status: "draft" }));
      toast("Entry unpublished");
    } catch (err) {
      toast(err instanceof StudioApiError ? `Unpublish failed: ${err.message}` : "Unpublish failed", "error");
    } finally {
      setPublishing(false);
    }
  };

  const busy = publishing;
  const cardCls = "mb-4 overflow-hidden";

  /* ---- render ------------------------------------------------------------ */

  if (loading) {
    return (
      <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      </section>
    );
  }
  if (loadError) {
    return (
      <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
        <div role="alert" style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}>
          Couldn’t load the entry: {loadError}
        </div>
      </section>
    );
  }

  const slugInvalid = slugState.available === false;

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
        {collection?.plural_name || "Entries"}
      </button>

      {/* Title row + actions */}
      <div className="mb-4 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, color: studioColors.tealDeep, fontFamily: "var(--font-switzer)", textWrap: "balance" } as React.CSSProperties}>
            {headTitle}
          </h2>
          <div className="mt-[7px] flex flex-wrap items-center gap-2.5">
            <StatusPill pill={pill} />
            <span style={{ fontSize: 11.5, color: studioColors.faintGray, fontFamily: studioFonts.mono }}>
              {collection?.api_uid ?? "—"} · {template?.slug ?? "no template"}
            </span>
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
          <span
            aria-live="polite"
            className="inline-flex items-center gap-1.5"
            style={{ height: 38, padding: "0 8px", fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, color: autoState === "error" ? studioColors.danger : studioColors.mutedGray }}
          >
            {autoState === "saving" ? (
              "Saving…"
            ) : autoState === "error" ? (
              "Save failed — retrying on next edit"
            ) : autoState === "saved" ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A6B31" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                All changes saved
              </>
            ) : id == null ? (
              "Add a title to start — saves automatically"
            ) : (
              "Auto-saves as you edit"
            )}
          </span>
          {showPublish && (
            <button
              onClick={publish}
              disabled={busy}
              className="inline-flex items-center transition-[filter] hover:brightness-[.96]"
              style={{ height: 38, padding: "0 16px", borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 13.5, fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}
            >
              {publishing ? "Publishing…" : publishLabel}
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
                <FieldLabel suffix={<KeyTag fontSize={10.5}>→ slug</KeyTag>}>
                  URL slug <span style={{ color: studioColors.danger }}>*</span>
                </FieldLabel>
                <div className="flex gap-2">
                  <TextInput
                    value={slug}
                    onChange={(v) => {
                      setSlug(v);
                      setSlugState({ checking: false, available: null, suggestion: null });
                    }}
                    onBlur={runSlugCheck}
                    placeholder="url-slug"
                    mono
                    style={slugInvalid ? { boxShadow: `inset 0 0 0 1.5px ${studioColors.danger},0 1px 2px rgba(10,13,18,.05)` } : undefined}
                  />
                  <button
                    onClick={() => { setSlug(slugify(title)); setSlugState({ checking: false, available: null, suggestion: null }); }}
                    title="Regenerate from title"
                    className="grid flex-none place-items-center"
                    style={{ width: 40, height: 40, border: "none", borderRadius: 12, background: "#ffffff", boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`, color: studioColors.bodyGray, cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 0 0 1px #074A4D"; e.currentTarget.style.color = "#074A4D"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${studioColors.inputRing}`; e.currentTarget.style.color = studioColors.bodyGray; }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
                      <path d="M20 3.5V8h-4.5" />
                    </svg>
                  </button>
                </div>
                <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 6 }}>
                  {blogPath}/
                  <b style={{ color: studioColors.teal, fontFamily: studioFonts.mono, fontWeight: 600 }}>{slug || "…"}</b>
                  {slugState.checking ? " — checking…" : " — auto-generated from the title, editable."}
                </div>
                {slugInvalid && (
                  <div className="mt-1.5 flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 4 2.8 19.5h18.4Z" strokeLinejoin="round" />
                      <path d="M12 10v4.2M12 16.8h.01" />
                    </svg>
                    Taken in this collection.
                    {slugState.suggestion && (
                      <button
                        onClick={() => { setSlug(slugState.suggestion!); setSlugState({ checking: false, available: true, suggestion: null }); }}
                        style={{ border: "none", background: "none", color: studioColors.teal, fontWeight: 600, cursor: "pointer", fontFamily: studioFonts.mono, fontSize: 12 }}
                      >
                        Use “{slugState.suggestion}”
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 2 }}>
                <FieldLabel suffix={<KeyTag fontSize={10.5}>{excerpt.length} / 160</KeyTag>}>Excerpt</FieldLabel>
                <TextArea value={excerpt} onChange={setExcerpt} placeholder="Short summary shown on blog cards and in search results…" />
              </div>
            </div>
          </Card>

          {/* Images */}
          {template && template.image_groups.length > 0 && (
            <Card className={cardCls}>
              <CardHeader>
                <SectionIcon>
                  <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m20.5 15-5-5L5 20.5" />
                </SectionIcon>
                <CardTitle>Images</CardTitle>
                <CardMeta>from template · {template.image_groups.length} groups</CardMeta>
              </CardHeader>
              <div className="flex flex-col gap-4" style={{ padding: 16 }}>
                {template.image_groups.map((g) => {
                  const single = !g.repeatable;
                  const items = groupList(g.key);
                  const kindLabel = single ? "Single image" : g.max_items ? `Repeatable · max ${g.max_items}` : "Repeatable";
                  const kindBg = single ? "rgba(173,214,216,.45)" : "rgba(253,246,210,.9)";
                  const kindInk = single ? "#074A4D" : "#8A6117";
                  const firstId = items[0];
                  return (
                    <div key={g.key}>
                      <div className="mb-2 flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>{g.label}</span>
                        {g.required && <span style={{ color: studioColors.danger, fontWeight: 600 }}>*</span>}
                        <span style={{ fontFamily: studioFonts.mono, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: kindBg, color: kindInk }}>{kindLabel}</span>
                        <code style={{ marginLeft: "auto", fontFamily: studioFonts.mono, fontSize: 11, color: studioColors.faintGray }}>{g.key}</code>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {single && firstId != null ? (
                          <div className="relative" style={{ width: 122, height: 80, borderRadius: 12, background: `#F8F2E1 url('${assetSrc(firstId)}') center/cover no-repeat`, boxShadow: "inset 0 0 0 1px rgba(18,53,50,.12)" }}>
                            <button onClick={() => setGroupList(g.key, [])} title="Remove" aria-label="Remove image" className="absolute grid place-items-center hover:bg-[#DC2626]" style={{ top: 5, right: 5, width: 19, height: 19, borderRadius: "50%", border: "none", background: "rgba(18,53,50,.68)", color: "#ffffff", cursor: "pointer" }}>
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
                            {items.map((assetId, i) => (
                              <div key={i} className="relative" style={{ width: 98, height: 68, borderRadius: 12, background: `#F8F2E1 url('${assetSrc(assetId)}') center/cover no-repeat`, boxShadow: "inset 0 0 0 1px rgba(18,53,50,.12)" }}>
                                <button onClick={() => setGroupList(g.key, items.filter((_, j) => j !== i))} title="Remove" aria-label="Remove image" className="absolute grid place-items-center hover:bg-[#DC2626]" style={{ top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", border: "none", background: "rgba(18,53,50,.68)", color: "#ffffff", cursor: "pointer" }}>
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                                </button>
                              </div>
                            ))}
                            {(!g.max_items || items.length < g.max_items) && (
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
          )}

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
                  key={b.key}
                  label={i === 0 ? "Introduction" : `Block ${i + 1}`}
                  html={b.html}
                  canRemove={blocks.length > 1}
                  onRemove={() => removeBlock(b.key)}
                  onChange={(html) => setBlockHtml(b.key, html)}
                />
              ))}
              <button onClick={addBlock} className="inline-flex items-center gap-1.5 hover:border-[#074A4D] hover:text-[#074A4D]" style={{ height: 34, padding: "0 13px", borderRadius: 12, border: "1.5px dashed #B8B8B8", background: "transparent", color: studioColors.bodyGray, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                + Add content block
              </button>
            </div>
          </Card>

          {/* Attributes */}
          {slots.length > 0 && (
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
                {shortSlots.length > 0 && (
                  <div className="grid grid-cols-1 gap-x-3.5 sm:grid-cols-2">
                    {shortSlots.map((a) => (
                      <div key={a.key} style={{ marginBottom: 15 }}>
                        <FieldLabel suffix={<KeyTag>{a.key} · {a.type}</KeyTag>}>
                          {a.label} {a.required && <span style={{ color: studioColors.danger }}>*</span>}
                        </FieldLabel>
                        {a.type === "number" ? (
                          <TextInput value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} type="number" style={{ fontFamily: studioFonts.num }} />
                        ) : a.type === "boolean" ? (
                          <SelectField value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} ariaLabel={a.label}>
                            <option value="">—</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </SelectField>
                        ) : a.type === "enum" ? (
                          <SelectField value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} ariaLabel={a.label}>
                            <option value="">—</option>
                            {enumChoices(a).map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </SelectField>
                        ) : a.type === "date" ? (
                          <TextInput value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} type="date" />
                        ) : (
                          <TextInput value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} placeholder={a.label} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {longSlots.map((a) => (
                  <div key={a.key} style={{ marginBottom: 15 }}>
                    <FieldLabel suffix={<KeyTag>{a.key} · {a.type}</KeyTag>}>
                      {a.label} {a.required && <span style={{ color: studioColors.danger }}>*</span>}
                    </FieldLabel>
                    <TextArea value={attrs[a.key] || ""} onChange={(v) => setAttr(a.key, v)} placeholder={a.label} minHeight={56} />
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
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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
                <span style={{ color: studioColors.tealDeep, fontWeight: 500 }}>
                  {documentMeta.published_on ?? documentMeta.published_at?.slice(0, 10) ?? "—"}
                </span>
              </div>
            </div>
            {showPublish && (
              <button onClick={publish} disabled={busy} className="mt-[13px] inline-flex h-[38px] w-full items-center justify-center transition-[filter] hover:brightness-[.96]" style={{ borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 13.5, fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
                {publishing ? "Publishing…" : publishLabel}
              </button>
            )}
            {canUnpub && (
              <button onClick={unpublish} disabled={busy} className="mt-[7px] inline-flex h-8 w-full items-center justify-center hover:bg-[rgba(7,74,77,0.06)]" style={{ borderRadius: 12, border: "none", background: "transparent", color: studioColors.bodyGray, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: busy ? "default" : "pointer" }}>
                Unpublish
              </button>
            )}
            {isLive && collection && (
              <a
                href={`${config?.site_url ?? ""}${blogPath}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-[2px] inline-flex h-8 w-full items-center justify-center gap-1.5 hover:bg-[rgba(7,74,77,0.06)]"
                style={{ borderRadius: 12, border: "none", background: "transparent", color: studioColors.teal, fontFamily: "var(--font-switzer)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
              >
                View live
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4 11 13" /></svg>
              </a>
            )}
            {role === "Author" && (
              <div style={{ marginTop: 12, padding: "9px 11px", background: "rgba(248,242,225,.85)", borderRadius: 10, fontSize: 11.5, color: studioColors.bodyGray, lineHeight: 1.5 }}>
                Authors can’t publish — an Editor reviews this draft and takes it live.
              </div>
            )}
          </Card>

          {/* Collection + Template */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, marginBottom: 10 }}>Collection &amp; template</div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 5 }}>Collection</label>
            <SelectField value={collId != null ? String(collId) : ""} onChange={(v) => { setCollId(Number(v)); setSlugState({ checking: false, available: null, suggestion: null }); }} ariaLabel="Collection" style={{ fontSize: 13, marginBottom: 12 }}>
              {colls.map((c) => (
                <option key={c.id} value={c.id}>{c.plural_name}</option>
              ))}
            </SelectField>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 5 }}>Template</label>
            <SelectField value={tplId != null ? String(tplId) : ""} onChange={(v) => setTplId(v ? Number(v) : null)} ariaLabel="Template" mono style={{ fontSize: 13 }}>
              <option value="">No template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.slug}</option>
              ))}
            </SelectField>
            <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 7, lineHeight: 1.45 }}>
              Controls which image groups &amp; attributes this entry exposes.
            </div>
          </Card>

          {/* Organize */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep, marginBottom: 10 }}>Organize</div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 5 }}>Author</label>
              <SelectField value={authorId != null ? String(authorId) : ""} onChange={(v) => setAuthorId(v ? Number(v) : null)} ariaLabel="Author" style={{ fontSize: 13, padding: "9px 32px 9px 12px" }}>
                <option value="">—</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </SelectField>
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}>Categories</label>
              <div className="flex flex-wrap gap-1.5">
                {catIds.map((cid) => (
                  <span key={cid} className="inline-flex items-center gap-1.5" style={{ padding: "4px 6px 4px 11px", borderRadius: 999, background: "rgba(173,214,216,.45)", color: studioColors.teal, fontSize: 12, fontWeight: 600 }}>
                    {catName(cid)}
                    <button onClick={() => setCatIds((x) => x.filter((y) => y !== cid))} className="grid place-items-center opacity-65 hover:opacity-100" style={{ border: "none", background: "none", cursor: "pointer", color: "inherit", padding: 2 }}>
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
                {tagIds.map((tid) => (
                  <span key={tid} className="inline-flex items-center gap-1.5" style={{ padding: "4px 6px 4px 11px", borderRadius: 999, background: "rgba(248,242,225,.95)", boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, color: studioColors.labelGray, fontSize: 12, fontWeight: 500, fontFamily: studioFonts.mono }}>
                    {tagName(tid)}
                    <button onClick={() => setTagIds((x) => x.filter((y) => y !== tid))} className="grid place-items-center opacity-55 hover:opacity-100" style={{ border: "none", background: "none", cursor: "pointer", color: "inherit", padding: 2 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                  </span>
                ))}
                {/* Pick an existing tag (dropdown, like categories) */}
                {remainingTags.length > 0 && !addingTag && (
                  <button
                    onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAddTagAnchor({ top: r.bottom + 4, left: r.left }); }}
                    aria-haspopup="menu"
                    aria-label="Add an existing tag"
                    className="inline-flex items-center hover:border-[#074A4D] hover:text-[#074A4D]"
                    style={{ padding: "4px 11px", borderRadius: 999, border: "1px dashed #B8B8B8", background: "transparent", color: studioColors.mutedGray, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-switzer)" }}
                  >
                    +
                  </button>
                )}
                {/* Type a brand-new tag */}
                {addingTag ? (
                  <input
                    autoFocus
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") void addTag(); else if (e.key === "Escape") { setAddingTag(false); setTagInput(""); } }}
                    onBlur={() => void addTag()}
                    placeholder="new tag⏎"
                    style={{ width: 120, boxSizing: "border-box", padding: "5px 10px", border: "none", borderRadius: 999, background: "#ffffff", boxShadow: "inset 0 0 0 1.5px #074A4D", fontFamily: studioFonts.mono, fontSize: 12, color: studioColors.tealDeep }}
                  />
                ) : (
                  <button
                    onClick={() => setAddingTag(true)}
                    className="inline-flex items-center gap-1 hover:border-[#074A4D] hover:text-[#074A4D]"
                    style={{ padding: "4px 11px", borderRadius: 999, border: "1px dashed #B8B8B8", background: "transparent", color: studioColors.mutedGray, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-switzer)" }}
                  >
                    + New
                  </button>
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
        items={remainingCats.map((c) => ({ label: c.name, onClick: () => setCatIds((x) => [...x, c.id]) }))}
      />

      {/* Add existing-tag menu */}
      <DropdownMenu
        open={!!addTagAnchor}
        onClose={() => setAddTagAnchor(null)}
        top={addTagAnchor?.top || 0}
        left={addTagAnchor?.left || 0}
        items={remainingTags.map((t) => ({ label: t.name, onClick: () => setTagIds((x) => [...x, t.id]) }))}
      />

      {/* Image picker */}
      <ImagePickerModal
        open={!!picker}
        onClose={() => setPicker(null)}
        onPick={pickImage}
        onUploadFiles={uploadAndPick}
        uploading={uploadingAsset}
        groupLabel={template?.image_groups.find((g) => g.key === picker?.groupKey)?.label}
        assets={pickerAssets}
      />
    </section>
  );
}
