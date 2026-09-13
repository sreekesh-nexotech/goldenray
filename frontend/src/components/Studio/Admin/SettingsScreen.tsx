"use client";

// src/components/Studio/Admin/SettingsScreen.tsx
//
// Global settings (§6.18) — the four small areas the scope allows and nothing
// more: company details, notification recipients, website defaults, careers
// configuration. One Save for the whole form; it is a singleton.

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import { Card, CardHeader, CardTitle, FieldLabel, GoldButton, KeyTag, PageHeader, SectionIcon, Switch, TextArea, TextInput, TipBanner } from "../shared/primitives";
import { countLabel, studioColors } from "../shared/format";
import { ErrorBox, fmtDate } from "../shared/listing";
import { getSettings, updateSettings, type SiteSettings } from "@/services/adminService";

export default function SettingsScreen() {
  const { tips, toast, can } = useStudio();
  const canEdit = can("settings", "edit");
  const [saved, setSaved] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    getSettings()
      .then((s) => {
        setSaved(s);
        setForm(s);
        setDirty(false);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings"));
  }, []);
  useEffect(load, [load]);

  const patch = (p: Partial<SiteSettings>) => {
    if (!canEdit) return;
    setForm((f) => (f ? { ...f, ...p } : f));
    setDirty(true);
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      // Read-only echoes never go back up.
      const body: Partial<SiteSettings> = { ...form };
      delete body.lead_recipients;
      delete body.application_recipients;
      delete body.updated_at;
      const next = await updateSettings(body);
      setSaved(next);
      setForm(next);
      setDirty(false);
      toast("Settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) return <ErrorBox message={error} onRetry={load} />;
  if (!form) return <div style={{ color: studioColors.mutedGray, fontSize: 13.5 }}>Loading…</div>;

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle={saved ? `Last updated ${fmtDate(saved.updated_at)}` : undefined}
        actions={
          canEdit ? (
            <GoldButton onClick={() => void save()} disabled={!dirty || saving} style={{ opacity: dirty ? 1 : 0.6 }}>
              {saving ? "Saving…" : "Save settings"}
            </GoldButton>
          ) : undefined
        }
      />

      {tips && <TipBanner>Kept deliberately small. Anything beyond company details, notification recipients, site defaults and careers configuration needs a confirmed requirement first.</TipBanner>}
      {error && <ErrorBox message={error} />}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}>
        <Card>
          <CardHeader>
            <SectionIcon>
              <rect x="3.5" y="9.5" width="17" height="11" rx="2" />
              <path d="M8 9.5V5.5h8v4M3.5 14.5h17" />
            </SectionIcon>
            <CardTitle>Company</CardTitle>
          </CardHeader>
          <div style={{ padding: 16 }} className="flex flex-col gap-3">
            <div>
              <FieldLabel>Company name</FieldLabel>
              <TextInput value={form.company_name} onChange={(v) => patch({ company_name: v })} placeholder="Flarize" />
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <FieldLabel>Email</FieldLabel>
                <TextInput value={form.company_email} onChange={(v) => patch({ company_email: v })} type="email" />
              </div>
              <div>
                <FieldLabel>Phone</FieldLabel>
                <TextInput value={form.company_phone} onChange={(v) => patch({ company_phone: v })} />
              </div>
            </div>
            <div>
              <FieldLabel>Address</FieldLabel>
              <TextInput value={form.address_line} onChange={(v) => patch({ address_line: v })} placeholder="Street and building" />
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 100px 70px" }}>
              <div>
                <FieldLabel>City</FieldLabel>
                <TextInput value={form.address_locality} onChange={(v) => patch({ address_locality: v })} />
              </div>
              <div>
                <FieldLabel>State</FieldLabel>
                <TextInput value={form.address_region} onChange={(v) => patch({ address_region: v })} />
              </div>
              <div>
                <FieldLabel>PIN</FieldLabel>
                <TextInput value={form.postal_code} onChange={(v) => patch({ postal_code: v })} mono />
              </div>
              <div>
                <FieldLabel>Country</FieldLabel>
                <TextInput value={form.country_code} onChange={(v) => patch({ country_code: v.toUpperCase().slice(0, 2) })} mono />
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>Used for the Organization schema and anywhere the site prints contact details.</div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <SectionIcon>
              <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
              <path d="m3 7 9 6 9-6" />
            </SectionIcon>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <div style={{ padding: 16 }} className="flex flex-col gap-3.5">
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                <FieldLabel>New lead</FieldLabel>
                <span style={{ marginLeft: "auto" }}>
                  <Switch checked={form.notify_on_new_lead} onChange={() => patch({ notify_on_new_lead: !form.notify_on_new_lead })} ariaLabel="Notify on new lead" disabled={!canEdit} />
                </span>
              </div>
              <TextInput value={form.lead_notification_emails} onChange={(v) => patch({ lead_notification_emails: v })} placeholder="sales@flarize.com, ops@flarize.com" mono />
              <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 4 }}>Comma-separated. {form.lead_recipients.length} recipient{form.lead_recipients.length === 1 ? "" : "s"} currently.</div>
            </div>
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                <FieldLabel>New career application</FieldLabel>
                <span style={{ marginLeft: "auto" }}>
                  <Switch checked={form.notify_on_new_application} onChange={() => patch({ notify_on_new_application: !form.notify_on_new_application })} ariaLabel="Notify on new application" disabled={!canEdit} />
                </span>
              </div>
              <TextInput value={form.application_notification_emails} onChange={(v) => patch({ application_notification_emails: v })} placeholder="hr@flarize.com" mono />
              <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 4 }}>{form.application_recipients.length} recipient{form.application_recipients.length === 1 ? "" : "s"} currently.</div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <SectionIcon>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m20.5 20.5-5-5" />
            </SectionIcon>
            <CardTitle>Website defaults</CardTitle>
          </CardHeader>
          <div style={{ padding: 16 }} className="flex flex-col gap-3">
            <div>
              <FieldLabel suffix={<KeyTag>{countLabel(form.default_meta_description, 160)}</KeyTag>}>Default meta description</FieldLabel>
              <TextArea value={form.default_meta_description} onChange={(v) => patch({ default_meta_description: v })} minHeight={72} placeholder="Used when a page has no description of its own." />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <SectionIcon>
              <rect x="2.5" y="7" width="19" height="13.5" rx="2.5" />
              <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
            </SectionIcon>
            <CardTitle>Careers</CardTitle>
          </CardHeader>
          <div style={{ padding: 16 }} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: studioColors.labelGray }}>Accept general applications</div>
                <div style={{ fontSize: 11.5, color: studioColors.faintGray }}>Shows the &quot;no matching role&quot; form on the careers page.</div>
              </div>
              <span style={{ marginLeft: "auto" }}>
                <Switch checked={form.careers_accepting_general_applications} onChange={() => patch({ careers_accepting_general_applications: !form.careers_accepting_general_applications })} ariaLabel="Accept general applications" disabled={!canEdit} />
              </span>
            </div>
            <div>
              <FieldLabel>Intro line above Open Positions</FieldLabel>
              <TextInput value={form.careers_intro} onChange={(v) => patch({ careers_intro: v })} placeholder="We're hiring across engineering, design and sales." />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
