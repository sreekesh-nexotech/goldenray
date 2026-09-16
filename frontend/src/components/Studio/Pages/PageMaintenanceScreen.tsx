"use client";

// src/components/Studio/Pages/PageMaintenanceScreen.tsx
//
// The controlled maintenance view (§6.2, §6.16). Three things are editable —
// registered image slots, registered text slots, and SEO — and each saves on
// its own so a replaced hero image never waits on a half-edited description.
// The page's copy and layout are not here at all; the lock badge says why.
//
// Also serves the Career Page screen (§6.16): same view, route pinned to
// /career, module gate switched to `career_page`.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { Card, CardHeader, CardTitle, FieldLabel, GhostButton, GoldButton, KeyTag, SectionIcon, TextArea, TextInput } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { ErrorBox, LockedTag, Pill, fmtDate } from "../shared/listing";
import { SchemaPreview, SearchPreview, SeoPanel, type SeoValues } from "../shared/SeoPanel";
import ImagePickerModal from "../shared/ImagePickerModal";
import {
  getPage,
  getPages,
  previewPage,
  updateImageSlot,
  updatePageSeo,
  updateTextSlot,
  type PageDetail,
  type PageImageSlot,
  type PagePreview,
  type PagesMount,
  type PageTextSlot,
} from "@/services/pagesService";
import type { StudioModule } from "@/services/studioService";

export default function PageMaintenanceScreen({
  id,
  route,
  module = "pages",
}: {
  /** Page id from the route, or … */
  id?: string;
  /** … a fixed route to resolve (the Career Page screen passes "/career"). */
  route?: string;
  module?: StudioModule;
}) {
  const router = useRouter();
  const { can, config } = useStudio();
  const canEdit = can(module, "edit");
  // The career_page grant reaches the same page through its own API mount;
  // without this the Career/HR role 403s on every call this screen makes.
  const mount: PagesMount = module === "career_page" ? "career-page" : "pages";

  const [page, setPage] = useState<PageDetail | null>(null);
  const [preview, setPreview] = useState<PagePreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      let pageId = id ? Number(id) : null;
      if (!pageId && route) {
        const list = await getPages({ search: route }, mount);
        const hit = list.results.find((p) => p.route === route);
        if (!hit) {
          setNotFound(true);
          return;
        }
        pageId = hit.id;
      }
      if (!pageId) return;
      const p = await getPage(pageId, mount);
      setPage(p);
      previewPage(p.id, mount).then(setPreview).catch(() => setPreview(null));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load page");
    }
  }, [id, route, mount]);

  useEffect(() => {
    void load();
  }, [load]);

  const siteUrl = config?.site_url ?? "";

  if (notFound)
    return (
      <ErrorBox message={`The page ${route} is not registered yet. Run \`manage.py seed_pages\` on the CMS.`} />
    );
  if (loadError) return <ErrorBox message={loadError} onRetry={() => void load()} />;
  if (!page) return <div style={{ color: studioColors.mutedGray, fontSize: 13.5 }}>Loading…</div>;

  return (
    <>
      <div className="flex flex-wrap items-start gap-3" style={{ marginBottom: 18 }}>
        <div className="min-w-0" style={{ flex: "1 1 320px" }}>
          <div className="flex items-center gap-2.5" style={{ marginBottom: 4 }}>
            <h2 className="font-switzer" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em", color: studioColors.tealDeep, margin: 0 }}>
              {page.name}
            </h2>
            <Pill status={page.status} />
            {page.is_protected && <LockedTag />}
          </div>
          <div style={{ fontSize: 12.5, color: studioColors.mutedGray, fontFamily: studioFonts.mono }}>
            {siteUrl}
            {page.route}
          </div>
          {page.description && <div style={{ fontSize: 13, color: studioColors.bodyGray, marginTop: 6 }}>{page.description}</div>}
        </div>
        <div className="flex gap-2">
          {!route && <GhostButton onClick={() => router.push("/studio/pages")}>Back to pages</GhostButton>}
          <GhostButton onClick={() => window.open(`${siteUrl}${page.route}`, "_blank", "noopener")}>Preview page ↗</GhostButton>
        </div>
      </div>

      {page.is_protected && (
        <div
          className="flex items-start gap-2.5"
          style={{ marginBottom: 16, padding: "11px 14px", borderRadius: 12, background: "rgba(229,231,235,.5)", boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, fontSize: 12.5, color: studioColors.bodyGray, lineHeight: 1.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={studioColors.mutedGray} strokeWidth="2" strokeLinecap="round" style={{ flex: "none", marginTop: 2 }}>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
          </svg>
          <span>
            <b style={{ color: studioColors.tealDeep }}>This page&apos;s copy and layout are locked.</b> Only the image slots, text
            fields and SEO below are editable. Anything else needs a developer.
          </span>
        </div>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 1fr)" }}>
        <div className="flex flex-col gap-4">
          <ImageSlots page={page} mount={mount} canEdit={canEdit} onChanged={(slot) => setPage({ ...page, image_slots: page.image_slots.map((s) => (s.id === slot.id ? slot : s)) })} />
          <TextSlots page={page} mount={mount} canEdit={canEdit} onChanged={(slot) => setPage({ ...page, text_slots: page.text_slots.map((s) => (s.id === slot.id ? slot : s)) })} />
        </div>

        <div className="flex flex-col gap-4">
          <PageSeoCard page={page} mount={mount} canEdit={canEdit} siteUrl={siteUrl} onSaved={(seo) => { setPage({ ...page, seo }); previewPage(page.id, mount).then(setPreview).catch(() => {}); }} />
          {preview && (
            <Card>
              <CardHeader>
                <SectionIcon>
                  <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                  <circle cx="12" cy="12" r="2.8" />
                </SectionIcon>
                <CardTitle>Search preview</CardTitle>
              </CardHeader>
              <div style={{ padding: 16 }} className="flex flex-col gap-3">
                <SearchPreview url={preview.url} title={preview.title} description={preview.description} />
                <SchemaPreview schema={preview.schema} />
              </div>
            </Card>
          )}
          <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>
            {page.faq_count} FAQ{page.faq_count === 1 ? "" : "s"} attached · last updated {fmtDate(page.updated_at)}
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Image slots                                                                */
/* -------------------------------------------------------------------------- */

function ImageSlots({ page, mount, canEdit, onChanged }: { page: PageDetail; mount: PagesMount; canEdit: boolean; onChanged: (s: PageImageSlot) => void }) {
  const { toast } = useStudio();
  const [picking, setPicking] = useState<PageImageSlot | null>(null);
  const [altDraft, setAltDraft] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);

  const save = async (slot: PageImageSlot, body: { asset?: number | null; alt_text?: string }, done: string) => {
    setBusy(slot.id);
    try {
      const next = await updateImageSlot(page.id, slot.id, body, mount);
      onChanged(next);
      toast(done);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update the image", "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <SectionIcon>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m20.5 15-5-5L5 20.5" />
        </SectionIcon>
        <CardTitle>Image slots</CardTitle>
        <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray }}>{page.image_slots.length} registered</span>
      </CardHeader>
      <div style={{ padding: 16 }} className="flex flex-col gap-3">
        {page.image_slots.length === 0 && (
          <div style={{ fontSize: 13, color: studioColors.mutedGray }}>
            No image slots are registered on this page yet. A developer declares a slot alongside the component that renders it.
          </div>
        )}
        {page.image_slots.map((slot) => {
          const alt = altDraft[slot.id] ?? slot.alt_text;
          const altDirty = alt !== slot.alt_text;
          return (
            <div key={slot.id} className="grid gap-3" style={{ gridTemplateColumns: "140px 1fr", padding: 12, borderRadius: 12, boxShadow: `inset 0 0 0 1px ${studioColors.ring}` }}>
              <div style={{ aspectRatio: "4 / 3", borderRadius: 8, overflow: "hidden", background: "#E5E7EB", display: "grid", placeItems: "center" }}>
                {slot.asset_url ? (
                  <img src={slot.asset_url} alt={slot.effective_alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <span style={{ fontSize: 10.5, color: studioColors.faintGray, textAlign: "center", padding: 8 }}>Built-in image</span>
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 13.5 }}>{slot.label}</span>
                    <KeyTag>{slot.key}</KeyTag>
                  </div>
                  {slot.guidance && <div style={{ fontSize: 12, color: studioColors.mutedGray, marginTop: 2 }}>{slot.guidance}</div>}
                  {slot.asset_filename && (
                    <div style={{ fontSize: 11, color: studioColors.faintGray, fontFamily: studioFonts.mono, marginTop: 2 }}>
                      {slot.asset_filename}
                      {slot.asset_width && slot.asset_height ? ` · ${slot.asset_width}×${slot.asset_height}` : ""}
                    </div>
                  )}
                </div>
                <div>
                  <FieldLabel>Alt text</FieldLabel>
                  <div className="flex gap-2">
                    <TextInput value={alt} onChange={(v) => canEdit && setAltDraft({ ...altDraft, [slot.id]: v })} placeholder="Describe the image for accessibility and search" />
                    {altDirty && canEdit && (
                      <GoldButton onClick={() => save(slot, { alt_text: alt }, "Alt text saved")} disabled={busy === slot.id} style={{ height: 40, padding: "0 12px", fontSize: 12.5 }}>
                        Save
                      </GoldButton>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <GhostButton onClick={() => setPicking(slot)} disabled={busy === slot.id} style={{ height: 34, padding: "0 12px", fontSize: 12.5 }}>
                      {slot.asset ? "Replace image" : "Set image"}
                    </GhostButton>
                    {slot.asset && (
                      <GhostButton onClick={() => save(slot, { asset: null }, "Reverted to the built-in image")} disabled={busy === slot.id} style={{ height: 34, padding: "0 12px", fontSize: 12.5 }}>
                        Use built-in
                      </GhostButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ImagePickerModal
        open={picking !== null}
        guidance={picking?.guidance}
        onClose={() => setPicking(null)}
        onPick={(asset) => {
          const slot = picking;
          setPicking(null);
          if (slot) void save(slot, { asset: asset.id }, "Image replaced");
        }}
      />
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Text slots                                                                 */
/* -------------------------------------------------------------------------- */

function TextSlots({ page, mount, canEdit, onChanged }: { page: PageDetail; mount: PagesMount; canEdit: boolean; onChanged: (s: PageTextSlot) => void }) {
  const { toast } = useStudio();
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);

  const save = async (slot: PageTextSlot) => {
    const value = drafts[slot.id] ?? slot.value;
    setBusy(slot.id);
    try {
      const next = await updateTextSlot(page.id, slot.id, { value }, mount);
      onChanged(next);
      setDrafts((d) => {
        const rest = { ...d };
        delete rest[slot.id];
        return rest;
      });
      toast("Saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save", "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <SectionIcon>
          <path d="M4 7h16M4 12h10M4 17h13" />
        </SectionIcon>
        <CardTitle>Exposed text</CardTitle>
        <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray }}>{page.text_slots.length} field{page.text_slots.length === 1 ? "" : "s"}</span>
      </CardHeader>
      <div style={{ padding: 16 }} className="flex flex-col gap-3.5">
        {page.text_slots.length === 0 && (
          <div style={{ fontSize: 13, color: studioColors.mutedGray }}>
            No text fields are exposed on this page. Only fields a developer has explicitly registered can be corrected here.
          </div>
        )}
        {page.text_slots.map((slot) => {
          const value = drafts[slot.id] ?? slot.value;
          const dirty = value !== slot.value;
          const over = slot.max_length ? value.length > slot.max_length : false;
          return (
            <div key={slot.id}>
              <FieldLabel suffix={<KeyTag>{slot.max_length ? `${value.length} / ${slot.max_length}` : slot.key}</KeyTag>}>{slot.label}</FieldLabel>
              {slot.kind === "long_text" ? (
                <TextArea value={value} onChange={(v) => canEdit && setDrafts({ ...drafts, [slot.id]: v })} minHeight={80} />
              ) : (
                <TextInput value={value} onChange={(v) => canEdit && setDrafts({ ...drafts, [slot.id]: v })} type={slot.kind === "email" ? "email" : slot.kind === "url" ? "url" : "text"} mono={slot.kind === "url"} />
              )}
              <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
                {slot.guidance && <span style={{ fontSize: 11.5, color: studioColors.faintGray }}>{slot.guidance}</span>}
                {over && <span style={{ fontSize: 11.5, color: studioColors.danger }}>Too long for this field.</span>}
                {dirty && canEdit && (
                  <GoldButton onClick={() => save(slot)} disabled={busy === slot.id || over} style={{ marginLeft: "auto", height: 32, padding: "0 12px", fontSize: 12.5 }}>
                    Save
                  </GoldButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  SEO card (saves independently)                                             */
/* -------------------------------------------------------------------------- */

function PageSeoCard({ page, mount, canEdit, siteUrl, onSaved }: { page: PageDetail; mount: PagesMount; canEdit: boolean; siteUrl: string; onSaved: (seo: NonNullable<PageDetail["seo"]>) => void }) {
  const { toast, can } = useStudio();
  const seo = page.seo;
  const initial: SeoValues = {
    seo_title: seo?.seo_title ?? "",
    meta_description: seo?.meta_description ?? "",
    canonical_url: seo?.canonical_url ?? "",
    noindex: seo?.noindex ?? false,
    schema_type: seo?.schema_type ?? "none",
  };
  const [value, setValue] = useState<SeoValues>(initial);
  const [ogImage, setOgImage] = useState<{ id: number | null; url: string | null }>({ id: seo?.og_image ?? null, url: seo?.og_image_url ?? null });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const editable = canEdit || can("seo", "edit");

  const save = async () => {
    setSaving(true);
    try {
      const next = await updatePageSeo(page.id, { ...value, og_image: ogImage.id }, mount);
      onSaved(next);
      setDirty(false);
      toast("SEO saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save SEO", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <SeoPanel
        kind="page"
        value={value}
        onChange={(p) => {
          setValue((v) => ({ ...v, ...p }));
          setDirty(true);
        }}
        issues={seo?.seo_issues ?? [{ level: "error", field: "seo_title", message: "No SEO has been set for this page yet." }]}
        status={seo?.seo_status ?? "error"}
        fallbackTitle={page.name}
        disabled={!editable}
        ogImage={{
          url: ogImage.url,
          onPick: (asset) => {
            setOgImage(asset);
            setDirty(true);
          },
          onClear: () => {
            setOgImage({ id: null, url: null });
            setDirty(true);
          },
        }}
        extra={<SearchPreview url={`${siteUrl}${page.route}`} title={value.seo_title || page.name} description={value.meta_description} />}
      />
      {dirty && editable && (
        <div className="flex justify-end">
          <GoldButton onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save SEO"}
          </GoldButton>
        </div>
      )}
    </div>
  );
}
