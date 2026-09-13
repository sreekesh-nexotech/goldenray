"use client";

// src/components/Studio/shared/SeoPanel.tsx
//
// The basic SEO block (§6.7) shared by every record that publishes a URL:
// title, description, canonical, index toggle, schema type — and the validity
// indicator the API computes. Deliberately no raw JSON field: schema is
// generated from the record, and §6.2 says not to put JSON in front of content
// users.

import type { ReactNode } from "react";
import type { SeoIssue, SeoStatus } from "@/services/faqService";
import { Card, CardHeader, CardTitle, FieldLabel, KeyTag, SectionIcon, SelectField, Switch, TextArea, TextInput } from "./primitives";
import { countLabel, studioColors } from "./format";
import { Pill } from "./listing";

export interface SeoValues {
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  noindex: boolean;
  schema_type: string;
}

export const EMPTY_SEO: SeoValues = {
  seo_title: "",
  meta_description: "",
  canonical_url: "",
  noindex: false,
  schema_type: "none",
};

/** Schema shapes a record type may pick from. Keeps the select honest. */
export const SCHEMA_OPTIONS: Record<"page" | "faq" | "job", { key: string; label: string }[]> = {
  page: [
    { key: "none", label: "No structured data" },
    { key: "WebPage", label: "Web page" },
  ],
  faq: [
    { key: "none", label: "None (page-level FAQPage still applies)" },
    { key: "FAQPage", label: "FAQ page" },
  ],
  job: [
    { key: "none", label: "No structured data" },
    { key: "JobPosting", label: "Job posting" },
  ],
};

export function SeoPanel({
  value,
  onChange,
  issues,
  status,
  kind,
  fallbackTitle,
  disabled = false,
  extra,
}: {
  value: SeoValues;
  onChange: (patch: Partial<SeoValues>) => void;
  issues: SeoIssue[];
  status?: SeoStatus;
  kind: "page" | "faq" | "job";
  /** Shown as the placeholder — what the site falls back to. */
  fallbackTitle?: string;
  disabled?: boolean;
  /** Optional extra rows (e.g. a search preview) rendered under the fields. */
  extra?: ReactNode;
}) {
  const set = (patch: Partial<SeoValues>) => !disabled && onChange(patch);
  return (
    <Card>
      <CardHeader>
        <SectionIcon>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m20.5 20.5-5-5" />
        </SectionIcon>
        <CardTitle>SEO</CardTitle>
        <span style={{ marginLeft: "auto" }}>{status && <Pill status={status} size="sm" />}</span>
      </CardHeader>

      <div style={{ padding: 16 }} className="flex flex-col gap-3.5">
        <div>
          <FieldLabel suffix={<KeyTag>{countLabel(value.seo_title, 60)}</KeyTag>}>SEO title</FieldLabel>
          <TextInput value={value.seo_title} onChange={(v) => set({ seo_title: v })} placeholder={fallbackTitle || "Falls back to the record title"} />
        </div>
        <div>
          <FieldLabel suffix={<KeyTag>{countLabel(value.meta_description, 160)}</KeyTag>}>Meta description</FieldLabel>
          <TextArea value={value.meta_description} onChange={(v) => set({ meta_description: v })} minHeight={72} placeholder="70–160 characters reads best in search results." />
        </div>
        <div>
          <FieldLabel>Canonical URL</FieldLabel>
          <TextInput value={value.canonical_url} onChange={(v) => set({ canonical_url: v })} placeholder="Only when this URL duplicates another" mono />
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr auto" }}>
          <div>
            <FieldLabel>Structured data</FieldLabel>
            <SelectField value={value.schema_type} onChange={(v) => set({ schema_type: v })}>
              {SCHEMA_OPTIONS[kind].map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Hide from search</FieldLabel>
            <div style={{ paddingTop: 8 }}>
              <Switch checked={value.noindex} onChange={() => set({ noindex: !value.noindex })} ariaLabel="noindex" disabled={disabled} />
            </div>
          </div>
        </div>

        {extra}

        {issues.length > 0 && (
          <ul className="flex flex-col gap-1.5" style={{ margin: 0, padding: "10px 12px", listStyle: "none", background: "rgba(248,242,225,.6)", borderRadius: 10 }}>
            {issues.map((i, n) => (
              <li key={n} className="flex items-start gap-2" style={{ fontSize: 12.5, color: i.level === "error" ? "#9C2B1B" : studioColors.amberInk }}>
                <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: "50%", background: "currentColor", flex: "none" }} />
                <span>{i.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

/** Google-style result preview (§6.7 — "basic search/social preview"). */
export function SearchPreview({ url, title, description }: { url: string; title: string; description: string }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 10, background: "#ffffff", boxShadow: `inset 0 0 0 1px ${studioColors.ring}` }}>
      <div style={{ fontSize: 11.5, color: "#1F7A3F", fontFamily: "ui-monospace,'SF Mono',Menlo,monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</div>
      <div style={{ fontSize: 16, color: "#1A0DAB", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title || "Untitled"}</div>
      <div style={{ fontSize: 12.5, color: "#4D5156", marginTop: 3, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {description || "No description — search engines will invent one."}
      </div>
    </div>
  );
}

/** Collapsed JSON-LD block for previews: read-only, never an input. */
export function SchemaPreview({ schema }: { schema: Record<string, unknown> | null }) {
  if (!schema) return <div style={{ fontSize: 12.5, color: studioColors.faintGray }}>No structured data will be emitted.</div>;
  return (
    <details>
      <summary style={{ fontSize: 12.5, color: studioColors.teal, cursor: "pointer", fontWeight: 600 }}>
        Generated {String(schema["@type"])} schema
      </summary>
      <pre style={{ margin: "8px 0 0", padding: 12, borderRadius: 10, background: "#123532", color: "#DCEBE7", fontSize: 11, lineHeight: 1.5, overflowX: "auto" }}>
        {JSON.stringify(schema, null, 2)}
      </pre>
    </details>
  );
}
