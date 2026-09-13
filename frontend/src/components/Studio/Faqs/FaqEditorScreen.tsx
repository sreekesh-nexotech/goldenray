"use client";

// src/components/Studio/Faqs/FaqEditorScreen.tsx
//
// FAQ editor (§6.5): question, answer, page association, category, order,
// status — with SEO, a live preview, and audit metadata. Publish is disabled
// with the reason shown whenever the API reports the record incomplete, so
// nobody discovers a missing answer by reading a 400.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import {
  Card,
  CardHeader,
  CardTitle,
  DangerButton,
  FieldLabel,
  GhostButton,
  GoldButton,
  KeyTag,
  SectionIcon,
  SelectField,
  TextArea,
  TextInput,
} from "../shared/primitives";
import { ConfirmDialog } from "../shared/overlays";
import { countLabel, slugify, studioColors } from "../shared/format";
import { ErrorBox, Pill, fmtDate } from "../shared/listing";
import { EMPTY_SEO, SchemaPreview, SearchPreview, SeoPanel, type SeoValues } from "../shared/SeoPanel";
import {
  archiveFaq,
  createFaq,
  createFaqCategory,
  getFaq,
  getFaqCategories,
  previewFaq,
  publishFaq,
  restoreFaq,
  unpublishFaq,
  updateFaq,
  type Faq,
  type FaqCategory,
  type FaqPreview,
} from "@/services/faqService";
import { getPages, type PageListItem } from "@/services/pagesService";
import { StudioApiError } from "@/services/studioService";

interface Form {
  question: string;
  answer: string;
  page: string;
  section: string;
  category: string;
  display_order: string;
  seo: SeoValues;
}

const EMPTY: Form = { question: "", answer: "", page: "", section: "", category: "", display_order: "", seo: { ...EMPTY_SEO, schema_type: "FAQPage" } };

function toForm(f: Faq): Form {
  return {
    question: f.question,
    answer: f.answer,
    page: String(f.page),
    section: f.section,
    category: f.category ? String(f.category) : "",
    display_order: String(f.display_order),
    seo: {
      seo_title: f.seo_title,
      meta_description: f.meta_description,
      canonical_url: f.canonical_url,
      noindex: f.noindex,
      schema_type: f.schema_type,
    },
  };
}

export default function FaqEditorScreen({ id }: { id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const { toast, can, config } = useStudio();

  const [faq, setFaq] = useState<Faq | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [preview, setPreview] = useState<FaqPreview | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const readOnly = !can("faqs", isNew ? "create" : "edit");

  useEffect(() => {
    getPages().then((p) => setPages(p.results.filter((x) => x.status !== "archived"))).catch(() => {});
    getFaqCategories().then((c) => setCategories(c.results.filter((x) => x.is_active))).catch(() => {});
  }, []);

  const load = useCallback(() => {
    if (isNew) return;
    setLoadError(null);
    getFaq(Number(id))
      .then((f) => {
        setFaq(f);
        setForm(toForm(f));
        setDirty(false);
        previewFaq(f.id).then(setPreview).catch(() => setPreview(null));
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load FAQ"));
  }, [id, isNew]);

  useEffect(load, [load]);

  const patch = (p: Partial<Form>) => {
    setForm((f) => ({ ...f, ...p }));
    setDirty(true);
  };

  // §6.5 calls categories "optional/configurable": configuring them lives
  // here, inline, rather than on a screen of its own. A "+ New" pick prompts
  // for a name, creates it, and selects it.
  const NEW_CATEGORY = "__new__";
  const addCategory = async () => {
    const name = (window.prompt("New category name") || "").trim();
    if (!name) return;
    try {
      const created = await createFaqCategory({ name, slug: slugify(name) });
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      patch({ category: String(created.id) });
      toast(`Category "${created.name}" added`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add the category", "error");
    }
  };

  const body = () => ({
    question: form.question.trim(),
    answer: form.answer,
    page: Number(form.page),
    section: form.section.trim(),
    category: form.category ? Number(form.category) : null,
    display_order: form.display_order === "" ? undefined : Number(form.display_order),
    ...form.seo,
  });

  const validate = (): string | null => {
    if (!form.question.trim()) return "Enter the question.";
    if (!form.page) return "Choose the page this FAQ appears on.";
    return null;
  };

  const save = async (): Promise<Faq | null> => {
    const v = validate();
    if (v) {
      setFormError(v);
      return null;
    }
    setFormError(null);
    setSaving(true);
    try {
      const saved = isNew ? await createFaq(body()) : await updateFaq(Number(id), body());
      setFaq(saved);
      setForm(toForm(saved));
      setDirty(false);
      toast(isNew ? "FAQ created" : "Saved");
      if (isNew) router.replace(`/studio/faqs/${saved.id}`);
      else previewFaq(saved.id).then(setPreview).catch(() => {});
      return saved;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const workflow = async (fn: (id: number) => Promise<Faq>, done: string) => {
    // Always persist edits first so the workflow acts on what the author sees.
    const current = dirty || isNew ? await save() : faq;
    if (!current) return;
    setSaving(true);
    try {
      const next = await fn(current.id);
      setFaq(next);
      setForm(toForm(next));
      setDirty(false);
      toast(done);
      previewFaq(next.id).then(setPreview).catch(() => {});
    } catch (err) {
      const msg = err instanceof StudioApiError && err.errors?.length ? err.errors.join(" ") : err instanceof Error ? err.message : "Action failed";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const siteUrl = config?.site_url ?? "";
  const pageRoute = pages.find((p) => String(p.id) === form.page)?.route ?? faq?.page_route ?? "";
  const publishBlockers = faq?.publish_errors ?? [];

  if (loadError) return <ErrorBox message={loadError} onRetry={load} />;

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3" style={{ marginBottom: 18 }}>
        <div className="min-w-0" style={{ flex: "1 1 320px" }}>
          <div className="flex items-center gap-2.5" style={{ marginBottom: 4 }}>
            <h2 className="font-switzer" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em", color: studioColors.tealDeep, margin: 0 }}>
              {isNew ? "New FAQ" : "Edit FAQ"}
            </h2>
            {faq && <Pill status={faq.status} />}
            {dirty && <span style={{ fontSize: 11.5, color: studioColors.amberInk, fontWeight: 600 }}>Unsaved changes</span>}
          </div>
          {faq && (
            <div style={{ fontSize: 12.5, color: studioColors.mutedGray }}>
              Created {fmtDate(faq.created_at)}{faq.created_by_name ? ` by ${faq.created_by_name}` : ""} · Updated {fmtDate(faq.updated_at)}
              {faq.updated_by_name ? ` by ${faq.updated_by_name}` : ""}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <GhostButton onClick={() => router.push("/studio/faqs")}>Cancel</GhostButton>
          {!readOnly && (
            <GoldButton onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </GoldButton>
          )}
        </div>
      </div>

      {formError && <ErrorBox message={formError} />}

      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(300px, 1fr)" }}>
        {/* ── Left: the record ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <SectionIcon>
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" />
              </SectionIcon>
              <CardTitle>Question &amp; answer</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }} className="flex flex-col gap-3.5">
              <div>
                <FieldLabel suffix={<KeyTag>{countLabel(form.question, 500)}</KeyTag>}>Question *</FieldLabel>
                <TextInput value={form.question} onChange={(v) => patch({ question: v })} placeholder="How long does installation take?" />
              </div>
              <div>
                <FieldLabel suffix={<KeyTag>plain text or light HTML</KeyTag>}>Answer *</FieldLabel>
                <TextArea value={form.answer} onChange={(v) => patch({ answer: v })} minHeight={180} placeholder="Write the answer as it should read on the site. <p>, <ul>, <li>, <strong> and <a> are fine." />
                <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 5 }}>
                  Drafts can be saved without an answer; publishing requires one.
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <SectionIcon>
                <path d="M6 3.5h8l4 4v13H6Z" />
                <path d="M14 3.5v4h4" />
              </SectionIcon>
              <CardTitle>Where it appears</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }} className="grid gap-3.5" >
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <FieldLabel>Page *</FieldLabel>
                  <SelectField value={form.page} onChange={(v) => patch({ page: v })}>
                    <option value="">Choose a page…</option>
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.route}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <FieldLabel suffix={<KeyTag>optional</KeyTag>}>Section</FieldLabel>
                  <TextInput value={form.section} onChange={(v) => patch({ section: v })} placeholder="e.g. residential" mono />
                </div>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <FieldLabel>Category</FieldLabel>
                  <SelectField value={form.category} onChange={(v) => (v === NEW_CATEGORY ? void addCategory() : patch({ category: v }))}>
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    {can("faqs", "create") && <option value={NEW_CATEGORY}>+ New category…</option>}
                  </SelectField>
                </div>
                <div>
                  <FieldLabel suffix={<KeyTag>0 = first</KeyTag>}>Display order</FieldLabel>
                  <TextInput value={form.display_order} onChange={(v) => patch({ display_order: v.replace(/[^\d]/g, "") })} placeholder="Added to the end if blank" mono />
                </div>
              </div>
              <div style={{ fontSize: 12, color: studioColors.faintGray }}>
                Use a section when a page carries more than one FAQ block. Reorder whole sections from the FAQ list.
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right: workflow, SEO, preview ────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <SectionIcon>
                <path d="M5 12.5 10 17.5 19 7" />
              </SectionIcon>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }} className="flex flex-col gap-3">
              {publishBlockers.length > 0 && (
                <ul style={{ margin: 0, padding: "10px 12px", listStyle: "none", background: "rgba(248,242,225,.6)", borderRadius: 10, fontSize: 12.5, color: studioColors.amberInk }} className="flex flex-col gap-1">
                  {publishBlockers.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              )}
              {isNew && <div style={{ fontSize: 12.5, color: studioColors.mutedGray }}>Save first; publishing becomes available once the record exists.</div>}
              <div className="flex flex-wrap gap-2">
                {!isNew && faq && can("faqs", "publish") && faq.status !== "archived" && (
                  faq.status === "published" ? (
                    <GhostButton onClick={() => workflow(unpublishFaq, "Unpublished — back to draft")} disabled={saving}>Unpublish</GhostButton>
                  ) : (
                    <GoldButton onClick={() => workflow(publishFaq, "Published")} disabled={saving || (publishBlockers.length > 0 && !dirty)}>
                      Publish
                    </GoldButton>
                  )
                )}
                {!isNew && faq && faq.status === "archived" && can("faqs", "edit") && (
                  <GhostButton onClick={() => workflow(restoreFaq, "Restored as a draft")} disabled={saving}>Restore</GhostButton>
                )}
                {!isNew && faq && faq.status !== "archived" && can("faqs", "archive") && (
                  <DangerButton onClick={() => setConfirmArchive(true)} disabled={saving} style={{ marginLeft: "auto" }}>Archive</DangerButton>
                )}
              </div>
            </div>
          </Card>

          <SeoPanel
            kind="faq"
            value={form.seo}
            onChange={(p) => patch({ seo: { ...form.seo, ...p } })}
            issues={faq?.seo_issues ?? []}
            status={faq?.seo_status}
            fallbackTitle={form.question || undefined}
            disabled={readOnly}
            extra={<SearchPreview url={`${siteUrl}${pageRoute}`} title={form.seo.seo_title || form.question} description={form.seo.meta_description} />}
          />

          {preview && (
            <Card>
              <CardHeader>
                <SectionIcon>
                  <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                  <circle cx="12" cy="12" r="2.8" />
                </SectionIcon>
                <CardTitle>On the website</CardTitle>
                <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray }}>position {preview.position + 1}{preview.section ? ` · ${preview.section}` : ""}</span>
              </CardHeader>
              <div style={{ padding: 16 }} className="flex flex-col gap-3">
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(248,242,225,.55)" }}>
                  <div style={{ fontWeight: 600, color: studioColors.tealDeep, fontSize: 14 }}>{preview.question}</div>
                  <div style={{ fontSize: 13, color: studioColors.bodyGray, marginTop: 6, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: preview.answer || "<em>No answer yet.</em>" }} />
                </div>
                <SchemaPreview schema={preview.schema} />
              </div>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmArchive}
        title="Archive this FAQ?"
        confirmLabel="Archive"
        onCancel={() => setConfirmArchive(false)}
        onConfirm={() => {
          setConfirmArchive(false);
          void workflow(archiveFaq, "Archived");
        }}
      >
        It comes off the website but stays here, and can be restored as a draft later.
      </ConfirmDialog>
    </>
  );
}
