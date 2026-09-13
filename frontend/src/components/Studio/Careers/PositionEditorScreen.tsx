"use client";

// src/components/Studio/Careers/PositionEditorScreen.tsx
//
// Job position editor (§6.12): every field the scope lists, SEO basics for the
// job page, and a preview of what the public page will carry — including the
// JobPosting schema generated from the record. Publish stays disabled with the
// reason shown while the API reports the posting incomplete.

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStudio } from "../shared/StudioContext";
import { Card, CardHeader, CardTitle, DangerButton, FieldLabel, GhostButton, GoldButton, KeyTag, SectionIcon, SelectField, TextArea, TextInput } from "../shared/primitives";
import { ConfirmDialog } from "../shared/overlays";
import { countLabel, slugify, studioColors, studioFonts } from "../shared/format";
import { ErrorBox, Pill, fmtDate } from "../shared/listing";
import { EMPTY_SEO, SchemaPreview, SearchPreview, SeoPanel, type SeoValues } from "../shared/SeoPanel";
import {
  EMPLOYMENT_TYPES,
  archivePosition,
  closePosition,
  createPosition,
  getDepartments,
  getPosition,
  previewPosition,
  publishPosition,
  unpublishPosition,
  updatePosition,
  type Department,
  type EmploymentType,
  type Position,
  type PositionPreview,
} from "@/services/careersService";
import { StudioApiError } from "@/services/studioService";

interface Form {
  title: string;
  slug: string;
  slugTouched: boolean;
  department: string;
  location: string;
  employment_type: EmploymentType;
  experience_required: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  application_instructions: string;
  application_deadline: string;
  seo: SeoValues;
}

const EMPTY: Form = {
  title: "", slug: "", slugTouched: false, department: "", location: "Kochi, Kerala", employment_type: "full_time",
  experience_required: "", description: "", responsibilities: "", requirements: "", benefits: "",
  application_instructions: "", application_deadline: "", seo: { ...EMPTY_SEO, schema_type: "JobPosting" },
};

function toForm(p: Position): Form {
  return {
    title: p.title, slug: p.slug, slugTouched: true, department: String(p.department), location: p.location,
    employment_type: p.employment_type, experience_required: p.experience_required, description: p.description,
    responsibilities: p.responsibilities, requirements: p.requirements, benefits: p.benefits,
    application_instructions: p.application_instructions, application_deadline: p.application_deadline ?? "",
    seo: { seo_title: p.seo_title, meta_description: p.meta_description, canonical_url: p.canonical_url, noindex: p.noindex, schema_type: p.schema_type },
  };
}

export default function PositionEditorScreen({ id }: { id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const params = useSearchParams();
  const { toast, can, config } = useStudio();

  const [position, setPosition] = useState<Position | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [preview, setPreview] = useState<PositionPreview | null>(null);
  const [showPreview, setShowPreview] = useState(params.get("preview") === "1");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const readOnly = !can("job_positions", isNew ? "create" : "edit");

  useEffect(() => {
    getDepartments().then((p) => setDepartments(p.results.filter((d) => d.is_active))).catch(() => {});
  }, []);

  const refreshPreview = (pid: number) => previewPosition(pid).then(setPreview).catch(() => setPreview(null));

  const load = useCallback(() => {
    if (isNew) return;
    setLoadError(null);
    getPosition(Number(id))
      .then((p) => {
        setPosition(p);
        setForm(toForm(p));
        setDirty(false);
        void refreshPreview(p.id);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load position"));
  }, [id, isNew]);
  useEffect(load, [load]);

  const patch = (p: Partial<Form>) => {
    setForm((f) => {
      const next = { ...f, ...p };
      // Slug follows the title until someone edits it by hand.
      if (p.title !== undefined && !f.slugTouched) next.slug = slugify(p.title);
      return next;
    });
    setDirty(true);
  };

  const body = () => ({
    title: form.title.trim(),
    slug: form.slug.trim(),
    department: Number(form.department),
    location: form.location.trim(),
    employment_type: form.employment_type,
    experience_required: form.experience_required,
    description: form.description,
    responsibilities: form.responsibilities,
    requirements: form.requirements,
    benefits: form.benefits,
    application_instructions: form.application_instructions,
    application_deadline: form.application_deadline || null,
    ...form.seo,
  });

  const validate = (): string | null => {
    if (!form.title.trim()) return "Enter the job title.";
    if (!form.slug.trim()) return "Enter a URL slug.";
    if (!form.department) return "Choose a department.";
    if (!form.location.trim()) return "Enter the location.";
    return null;
  };

  const save = async (): Promise<Position | null> => {
    const v = validate();
    if (v) {
      setFormError(v);
      return null;
    }
    setFormError(null);
    setSaving(true);
    try {
      const saved = isNew ? await createPosition(body()) : await updatePosition(Number(id), body());
      setPosition(saved);
      setForm(toForm(saved));
      setDirty(false);
      toast(isNew ? "Position created" : "Saved");
      if (isNew) router.replace(`/studio/careers/positions/${saved.id}`);
      else void refreshPreview(saved.id);
      return saved;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const workflow = async (fn: (id: number) => Promise<Position>, done: string) => {
    const current = dirty || isNew ? await save() : position;
    if (!current) return;
    setSaving(true);
    try {
      const next = await fn(current.id);
      setPosition(next);
      setForm(toForm(next));
      setDirty(false);
      toast(done);
      void refreshPreview(next.id);
    } catch (err) {
      setFormError(err instanceof StudioApiError && err.errors?.length ? err.errors.join(" ") : err instanceof Error ? err.message : "Action failed");
    } finally {
      setSaving(false);
    }
  };

  const siteUrl = config?.site_url ?? "";
  const publicUrl = `${siteUrl}/career/${form.slug || "…"}`;
  const blockers = position?.publish_errors ?? [];

  if (loadError) return <ErrorBox message={loadError} onRetry={load} />;

  return (
    <>
      <div className="flex flex-wrap items-start gap-3" style={{ marginBottom: 18 }}>
        <div className="min-w-0" style={{ flex: "1 1 320px" }}>
          <div className="flex items-center gap-2.5" style={{ marginBottom: 4 }}>
            <h2 className="font-switzer" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em", color: studioColors.tealDeep, margin: 0 }}>
              {isNew ? "New position" : form.title || "Edit position"}
            </h2>
            {position && <Pill status={position.status} />}
            {dirty && <span style={{ fontSize: 11.5, color: studioColors.amberInk, fontWeight: 600 }}>Unsaved changes</span>}
          </div>
          <div style={{ fontSize: 12.5, color: studioColors.mutedGray, fontFamily: studioFonts.mono }}>{publicUrl}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <GhostButton onClick={() => router.push("/studio/careers/positions")}>Cancel</GhostButton>
          {!isNew && <GhostButton onClick={() => setShowPreview((s) => !s)}>{showPreview ? "Hide preview" : "Preview"}</GhostButton>}
          {!readOnly && (
            <GoldButton onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </GoldButton>
          )}
        </div>
      </div>

      {formError && <ErrorBox message={formError} />}

      {showPreview && preview && (
        <Card style={{ marginBottom: 16 }}>
          <CardHeader>
            <SectionIcon>
              <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
              <circle cx="12" cy="12" r="2.8" />
            </SectionIcon>
            <CardTitle>How the job page will appear</CardTitle>
            <span style={{ marginLeft: "auto", fontSize: 11, color: studioColors.faintGray }}>{preview.url}</span>
          </CardHeader>
          <div style={{ padding: 16 }} className="grid gap-4" >
            <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(248,242,225,.55)" }}>
              <div style={{ fontSize: 11.5, color: studioColors.mutedGray, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{preview.department} · {preview.location} · {preview.employment_type}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: studioColors.tealDeep, marginTop: 4 }}>{form.title}</div>
              <div style={{ fontSize: 13.5, color: studioColors.bodyGray, marginTop: 10, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{form.description || "No description yet."}</div>
              {form.responsibilities && (
                <PreviewList title="Responsibilities" text={form.responsibilities} />
              )}
              {form.requirements && <PreviewList title="Requirements" text={form.requirements} />}
              {form.benefits && <PreviewList title="Benefits" text={form.benefits} />}
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <SearchPreview url={preview.url} title={preview.title} description={preview.description} />
              <SchemaPreview schema={preview.schema} />
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(300px, 1fr)" }}>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <SectionIcon>
                <rect x="2.5" y="7" width="19" height="13.5" rx="2.5" />
                <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
              </SectionIcon>
              <CardTitle>Position</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }} className="flex flex-col gap-3.5">
              <div className="grid gap-3" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
                <div>
                  <FieldLabel>Job title *</FieldLabel>
                  <TextInput value={form.title} onChange={(v) => patch({ title: v })} placeholder="Solar Design Engineer" />
                </div>
                <div>
                  <FieldLabel suffix={<KeyTag>/career/…</KeyTag>}>URL slug *</FieldLabel>
                  <TextInput value={form.slug} onChange={(v) => patch({ slug: slugify(v), slugTouched: true })} mono />
                </div>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div>
                  <FieldLabel>Department *</FieldLabel>
                  <SelectField value={form.department} onChange={(v) => patch({ department: v })}>
                    <option value="">Choose…</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <FieldLabel>Location *</FieldLabel>
                  <TextInput value={form.location} onChange={(v) => patch({ location: v })} />
                </div>
                <div>
                  <FieldLabel>Employment type</FieldLabel>
                  <SelectField value={form.employment_type} onChange={(v) => patch({ employment_type: v as EmploymentType })}>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <FieldLabel>Experience required</FieldLabel>
                  <TextInput value={form.experience_required} onChange={(v) => patch({ experience_required: v })} placeholder="2–4 years" />
                </div>
                <div>
                  <FieldLabel suffix={<KeyTag>optional</KeyTag>}>Application deadline</FieldLabel>
                  <TextInput value={form.application_deadline} onChange={(v) => patch({ application_deadline: v })} type="date" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <SectionIcon>
                <path d="M4 7h16M4 12h10M4 17h13" />
              </SectionIcon>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }} className="flex flex-col gap-3.5">
              <div>
                <FieldLabel suffix={<KeyTag>{countLabel(form.description, 2000)}</KeyTag>}>Job description *</FieldLabel>
                <TextArea value={form.description} onChange={(v) => patch({ description: v })} minHeight={140} placeholder="What the role is and who it suits." />
              </div>
              <div>
                <FieldLabel suffix={<KeyTag>one per line</KeyTag>}>Responsibilities</FieldLabel>
                <TextArea value={form.responsibilities} onChange={(v) => patch({ responsibilities: v })} minHeight={100} />
              </div>
              <div>
                <FieldLabel suffix={<KeyTag>one per line</KeyTag>}>Requirements / qualifications</FieldLabel>
                <TextArea value={form.requirements} onChange={(v) => patch({ requirements: v })} minHeight={100} />
              </div>
              <div>
                <FieldLabel suffix={<KeyTag>one per line · optional</KeyTag>}>Benefits</FieldLabel>
                <TextArea value={form.benefits} onChange={(v) => patch({ benefits: v })} minHeight={72} />
              </div>
              <div>
                <FieldLabel>Application instructions</FieldLabel>
                <TextArea value={form.application_instructions} onChange={(v) => patch({ application_instructions: v })} minHeight={64} placeholder="Anything a candidate should include or know before applying." />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <SectionIcon>
                <path d="M5 12.5 10 17.5 19 7" />
              </SectionIcon>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <div style={{ padding: 16 }} className="flex flex-col gap-3">
              {blockers.length > 0 && (
                <ul style={{ margin: 0, padding: "10px 12px", listStyle: "none", background: "rgba(248,242,225,.6)", borderRadius: 10, fontSize: 12.5, color: studioColors.amberInk }} className="flex flex-col gap-1">
                  {blockers.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              )}
              {isNew && <div style={{ fontSize: 12.5, color: studioColors.mutedGray }}>Save first; publishing becomes available once the record exists.</div>}
              {position && (
                <div style={{ fontSize: 12, color: studioColors.faintGray }}>
                  {position.published_at ? `Published ${fmtDate(position.published_at)}` : "Never published"}
                  {position.closed_at ? ` · closed ${fmtDate(position.closed_at)}` : ""}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {position && can("job_positions", "publish") && position.status !== "archived" && (
                  position.status === "published" ? (
                    <GhostButton onClick={() => workflow(unpublishPosition, "Unpublished — back to draft")} disabled={saving}>Unpublish</GhostButton>
                  ) : (
                    <GoldButton onClick={() => workflow(publishPosition, "Published")} disabled={saving || (blockers.length > 0 && !dirty)}>Publish</GoldButton>
                  )
                )}
                {position && can("job_positions", "edit") && position.status === "published" && (
                  <GhostButton onClick={() => workflow(closePosition, "Closed — no longer accepting applications")} disabled={saving}>Close</GhostButton>
                )}
                {position && can("job_positions", "archive") && position.status !== "archived" && (
                  <DangerButton onClick={() => setConfirmArchive(true)} disabled={saving} style={{ marginLeft: "auto" }}>Archive</DangerButton>
                )}
              </div>
            </div>
          </Card>

          <SeoPanel
            kind="job"
            value={form.seo}
            onChange={(p) => patch({ seo: { ...form.seo, ...p } })}
            issues={position?.seo_issues ?? []}
            status={position?.seo_status}
            fallbackTitle={form.title || undefined}
            disabled={readOnly}
            extra={<SearchPreview url={publicUrl} title={form.seo.seo_title || form.title} description={form.seo.meta_description} />}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmArchive}
        title="Archive this position?"
        confirmLabel="Archive"
        onCancel={() => setConfirmArchive(false)}
        onConfirm={() => {
          setConfirmArchive(false);
          void workflow(archivePosition, "Archived");
        }}
      >
        It leaves the careers page and the lists here. Applications already received for it are kept.
      </ConfirmDialog>
    </>
  );
}

function PreviewList({ title, text }: { title: string; text: string }) {
  const items = text.split("\n").map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep }}>{title}</div>
      <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 13, color: studioColors.bodyGray, lineHeight: 1.6 }}>
        {items.map((i, n) => (
          <li key={n}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
