"use client";

// src/components/Studio/Templates/TemplatesScreen.tsx
//
// Templates — the structure builder, driven by GET templates/ on the admin
// API. Edits auto-save: label renames PATCH after a short debounce, required
// toggles and row removals PATCH/DELETE immediately, the add buttons POST new
// groups/slots, and Duplicate deep-copies the template server-side.

import { useEffect, useRef, useState } from "react";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import {
  PageHeader,
  TipBanner,
  GoldButton,
  GhostButton,
  CardHeader,
  CardTitle,
  CardMeta,
  FieldLabel,
  TextInput,
  SelectField,
  Switch,
} from "../shared/primitives";
import { Modal, ModalTitle, ConfirmDialog, KeyChip } from "../shared/overlays";
import { studioColors, studioFonts } from "../shared/format";
import { FieldRow, FieldTableHeader, type ChipStyle } from "./FieldRow";
import {
  getTemplates,
  duplicateTemplate,
  createImageGroup,
  patchImageGroup,
  deleteImageGroup,
  createAttributeSlot,
  patchAttributeSlot,
  deleteAttributeSlot,
  StudioApiError,
  type StudioTemplate,
  type StudioSlotType,
} from "@/services/studioService";

/* -------------------------------------------------------------------------- */
/*  Working-copy state shapes                                                  */
/* -------------------------------------------------------------------------- */

interface WorkingGroup {
  id: number;
  key: string;
  label: string;
  repeatable: boolean;
  max_items: number | null;
  required: boolean;
}

interface WorkingAttr {
  id: number;
  key: string;
  label: string;
  type: StudioSlotType;
  required: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Type-chip derivations                                                      */
/* -------------------------------------------------------------------------- */

function groupChip(g: WorkingGroup): ChipStyle {
  if (!g.repeatable) {
    return { label: "Single image", bg: "rgba(173,214,216,.45)", ink: "#074A4D" };
  }
  return {
    label: g.max_items ? `Repeatable · max ${g.max_items}` : "Repeatable",
    bg: "rgba(253,246,210,.9)",
    ink: "#8A6117",
  };
}

const SLOT_TYPE_LABELS: Record<StudioSlotType, string> = {
  text: "Text",
  richtext_blocks: "Rich text",
  number: "Number",
  boolean: "Boolean",
  date: "Date",
  enum: "Choice",
  url: "URL",
};

function attrChip(a: WorkingAttr): ChipStyle {
  switch (a.type) {
    case "number":
      return { label: SLOT_TYPE_LABELS.number, bg: "rgba(195,223,189,.5)", ink: "#0A6B31" };
    case "enum":
      return { label: SLOT_TYPE_LABELS.enum, bg: "rgba(251,232,218,.85)", ink: "#9C4B21" };
    case "richtext_blocks":
      return { label: SLOT_TYPE_LABELS.richtext_blocks, bg: "rgba(173,214,216,.45)", ink: "#074A4D" };
    case "boolean":
    case "date":
    case "url":
      return { label: SLOT_TYPE_LABELS[a.type], bg: "rgba(253,246,210,.9)", ink: "#8A6117" };
    case "text":
    default:
      return { label: SLOT_TYPE_LABELS[a.type] ?? a.type, bg: "rgba(248,242,225,.95)", ink: "#414651", ring: true };
  }
}

/* -------------------------------------------------------------------------- */

type AddModal = { kind: "group" | "attr" } | null;
type ConfirmDelete = { kind: "group" | "attr"; index: number } | null;

export default function TemplatesScreen() {
  const { tips, toast } = useStudio();
  const { canManageStructure, role } = useCapabilities();
  const readOnly = !canManageStructure;

  const [tpls, setTpls] = useState<StudioTemplate[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [groups, setGroups] = useState<WorkingGroup[]>([]);
  const [attrs, setAttrs] = useState<WorkingAttr[]>([]);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [addModal, setAddModal] = useState<AddModal>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete>(null);
  const [fKey, setFKey] = useState("");
  const [fLabel, setFLabel] = useState("");
  const [fType, setFType] = useState<StudioSlotType>("text");
  const [fRepeatable, setFRepeatable] = useState(false);
  const [fRequired, setFRequired] = useState(false);
  const [formError, setFormError] = useState("");

  const active = tpls?.find((t) => t.id === activeId) ?? null;

  // Debounce timers for label PATCHes, keyed per row.
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  /** Seed the editable rows from a template payload. */
  const seed = (tpl: StudioTemplate | null) => {
    setGroups(
      (tpl?.image_groups ?? []).map((g) => ({
        id: g.id,
        key: g.key,
        label: g.label,
        repeatable: g.repeatable,
        max_items: g.max_items,
        required: g.required,
      }))
    );
    setAttrs(
      (tpl?.attribute_slots ?? []).map((a) => ({
        id: a.id,
        key: a.key,
        label: a.label,
        type: a.type,
        required: a.required,
      }))
    );
  };

  const load = async (selectId?: number) => {
    try {
      const page = await getTemplates();
      setTpls(page.results);
      setLoadError(null);
      const keep = selectId ?? activeId;
      const next = page.results.find((t) => t.id === keep) ?? page.results[0] ?? null;
      setActiveId(next ? next.id : null);
      seed(next);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load templates");
    }
  };

  // Initial load.
  useEffect(() => {
    let cancelled = false;
    getTemplates()
      .then((page) => {
        if (cancelled) return;
        setTpls(page.results);
        const first = page.results[0] ?? null;
        setActiveId(first ? first.id : null);
        seed(first);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load templates"));
    return () => {
      cancelled = true;
    };
  }, []);

  /** Switch tabs: reseed the rows from the cached template. */
  const switchTo = (id: number) => {
    setActiveId(id);
    seed(tpls?.find((t) => t.id === id) ?? null);
  };

  /** Re-pull server state after any mutation, with a visible syncing state. */
  const refresh = async (selectId?: number) => {
    setRefreshing(true);
    try {
      await load(selectId);
    } finally {
      setRefreshing(false);
    }
  };

  /** On failure: report and re-pull server state so the UI can't drift. */
  const failAndResync = (msg: string) => (err: unknown) => {
    toast(err instanceof StudioApiError ? `${msg}: ${err.message}` : msg, "error");
    void refresh(activeId ?? undefined);
  };

  /* ── Auto-saving row handlers (no explicit save step in the design) ────── */

  const editGroupLabel = (i: number, v: string) => {
    const g = groups[i];
    setGroups((prev) => prev.map((x, j) => (j === i ? { ...x, label: v } : x)));
    const key = `g${g.id}`;
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => {
      patchImageGroup(g.id, { label: v })
        .then(() => refresh())
        .catch(failAndResync("Rename failed"));
    }, 700);
  };

  const toggleGroupReq = (i: number) => {
    const g = groups[i];
    const next = !g.required;
    setGroups((prev) => prev.map((x, j) => (j === i ? { ...x, required: next } : x)));
    patchImageGroup(g.id, { required: next })
      .then(() => refresh())
      .catch(failAndResync("Update failed"));
  };

  const removeGroup = (i: number) => {
    const g = groups[i];
    setGroups((prev) => prev.filter((_, j) => j !== i));
    deleteImageGroup(g.id)
      .then(() => {
        toast("Image group removed");
        return refresh();
      })
      .catch(failAndResync("Remove failed"));
  };

  const editAttrLabel = (i: number, v: string) => {
    const a = attrs[i];
    setAttrs((prev) => prev.map((x, j) => (j === i ? { ...x, label: v } : x)));
    const key = `a${a.id}`;
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => {
      patchAttributeSlot(a.id, { label: v })
        .then(() => refresh())
        .catch(failAndResync("Rename failed"));
    }, 700);
  };

  const toggleAttrReq = (i: number) => {
    const a = attrs[i];
    const next = !a.required;
    setAttrs((prev) => prev.map((x, j) => (j === i ? { ...x, required: next } : x)));
    patchAttributeSlot(a.id, { required: next })
      .then(() => refresh())
      .catch(failAndResync("Update failed"));
  };

  const removeAttr = (i: number) => {
    const a = attrs[i];
    setAttrs((prev) => prev.filter((_, j) => j !== i));
    deleteAttributeSlot(a.id)
      .then(() => {
        toast("Attribute removed");
        return refresh();
      })
      .catch(failAndResync("Remove failed"));
  };

  const duplicate = async () => {
    if (!active) return;
    setBusy(true);
    try {
      const copy = await duplicateTemplate(active.id);
      await refresh(copy.id);
      toast(`Duplicated as ${copy.slug}`);
    } catch (err) {
      toast(err instanceof StudioApiError ? `Duplicate failed: ${err.message}` : "Duplicate failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const closeAddModal = () => {
    setAddModal(null);
    setFKey("");
    setFLabel("");
    setFType("text");
    setFRepeatable(false);
    setFRequired(false);
    setFormError("");
  };

  const submitAdd = async () => {
    if (!active || !addModal) return;
    if (!fKey.trim() || !fLabel.trim()) {
      setFormError("Enter both key and label");
      return;
    }
    setFormError("");
    setBusy(true);
    try {
      if (addModal.kind === "group") {
        await createImageGroup({
          template: active.id,
          key: fKey.trim(),
          label: fLabel.trim(),
          repeatable: fRepeatable,
          max_items: null,
          required: fRequired,
          order: active.image_groups.length,
        });
      } else {
        await createAttributeSlot({
          template: active.id,
          key: fKey.trim(),
          label: fLabel.trim(),
          type: fType,
          options: {},
          required: fRequired,
          order: active.attribute_slots.length,
        });
      }
      await refresh();
      toast(addModal.kind === "group" ? "Image group added" : "Attribute added");
      closeAddModal();
    } catch (err) {
      setFormError(err instanceof StudioApiError ? err.message : "Couldn’t add the field");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader mb={16}
        title="Templates"
        subtitle="Set structure once — every entry using the template inherits its image groups and attributes."
        actions={
          canManageStructure && active ? (
            <GhostButton style={{ height: 38, padding: "0 15px" }} onClick={duplicate} disabled={busy}>
              {busy ? "Working…" : "Duplicate"}
            </GhostButton>
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

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load templates: {loadError}
        </div>
      ) : tpls === null ? (
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      ) : tpls.length === 0 ? (
        <div
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.bodyGray }}
        >
          No templates yet.
        </div>
      ) : (
        <>
          {/* Template tabs */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {tpls.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => switchTo(t.id)}
                  className="inline-flex items-center transition-colors"
                  style={{
                    padding: "6px 13px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: studioFonts.mono,
                    fontSize: 12,
                    fontWeight: 600,
                    background: isActive ? "#123532" : "rgba(255,255,255,.75)",
                    boxShadow: isActive ? "none" : "inset 0 0 0 1px #E5E7EB",
                    color: isActive ? "#fff" : "#414651",
                  }}
                >
                  {t.slug}
                </button>
              );
            })}
            <span className="ml-auto flex items-center gap-3" style={{ fontSize: 12, color: studioColors.faintGray }}>
              {refreshing && (
                <span aria-live="polite" style={{ color: studioColors.teal, fontWeight: 600 }}>
                  Saving…
                </span>
              )}
              {typeof active?.entries_count === "number" && (
                <span>
                  used by <b style={{ color: studioColors.tealDeep, fontFamily: "'Inter',var(--font-switzer)" }}>{active.entries_count}</b> entries
                </span>
              )}
            </span>
          </div>

          {/* Cards — dimmed and inert while a mutation refresh is in flight */}
          <div
            aria-busy={refreshing}
            style={{ opacity: refreshing ? 0.55 : 1, pointerEvents: refreshing ? "none" : "auto", transition: "opacity .15s" }}
          >
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
                  key={g.id}
                  label={g.label}
                  keyName={g.key}
                  chip={groupChip(g)}
                  required={g.required}
                  readOnly={readOnly}
                  canEdit={canManageStructure}
                  onLabel={(v) => editGroupLabel(i, v)}
                  onToggle={() => toggleGroupReq(i)}
                  onRemove={() => setConfirmDelete({ kind: "group", index: i })}
                />
              ))}
              {canManageStructure && (
                <AddButton label="+ Add image group" onClick={() => setAddModal({ kind: "group" })} />
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
                  key={a.id}
                  label={a.label}
                  keyName={a.key}
                  chip={attrChip(a)}
                  required={a.required}
                  readOnly={readOnly}
                  canEdit={canManageStructure}
                  onLabel={(v) => editAttrLabel(i, v)}
                  onToggle={() => toggleAttrReq(i)}
                  onRemove={() => setConfirmDelete({ kind: "attr", index: i })}
                />
              ))}
              {canManageStructure && (
                <AddButton label="+ Add attribute" onClick={() => setAddModal({ kind: "attr" })} />
              )}
            </div>
          </div>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmDelete !== null}
        title={`Delete ${confirmDelete?.kind === "group" ? "image group" : "attribute"}?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.kind === "group") removeGroup(confirmDelete.index);
          else removeAttr(confirmDelete.index);
          setConfirmDelete(null);
        }}
      >
        {confirmDelete &&
          (() => {
            const row = confirmDelete.kind === "group" ? groups[confirmDelete.index] : attrs[confirmDelete.index];
            if (!row) return null;
            return (
              <>
                <b style={{ color: studioColors.tealDeep }}>{row.label}</b> <KeyChip>{row.key}</KeyChip> will be
                removed from this template. Its key is part of the public API contract — entries and site pages
                reading this field will stop receiving it. This can&#8217;t be undone.
              </>
            );
          })()}
      </ConfirmDialog>

      {/* Add group/attribute modal */}
      <Modal open={addModal !== null} onClose={closeAddModal} ariaLabel={addModal?.kind === "group" ? "Add image group" : "Add attribute"}>
        <ModalTitle>{addModal?.kind === "group" ? "Add image group" : "Add attribute"}</ModalTitle>
        <p style={{ fontSize: 12.5, color: studioColors.bodyGray, margin: "4px 0 16px", lineHeight: 1.5 }}>
          The <b>key</b> becomes part of the public API contract and can&#8217;t be changed later — the label can.
        </p>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Key (fixed)</FieldLabel>
          <TextInput value={fKey} onChange={setFKey} placeholder={addModal?.kind === "group" ? "e.g. bodyImages" : "e.g. readTime"} ariaLabel="Key" mono />
        </div>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Label (renamable)</FieldLabel>
          <TextInput value={fLabel} onChange={setFLabel} placeholder={addModal?.kind === "group" ? "e.g. Body images" : "e.g. Read time (min)"} ariaLabel="Label" />
        </div>
        {addModal?.kind === "attr" && (
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Type</FieldLabel>
            <SelectField value={fType} onChange={(v) => setFType(v as StudioSlotType)} ariaLabel="Type">
              {(Object.keys(SLOT_TYPE_LABELS) as StudioSlotType[]).map((t) => (
                <option key={t} value={t}>
                  {SLOT_TYPE_LABELS[t]}
                </option>
              ))}
            </SelectField>
          </div>
        )}
        <div className="flex items-center" style={{ gap: 18, marginBottom: 14 }}>
          {addModal?.kind === "group" && (
            <label className="flex items-center" style={{ gap: 8, fontSize: 13, color: studioColors.labelGray, cursor: "pointer" }}>
              <Switch checked={fRepeatable} onChange={() => setFRepeatable((v) => !v)} ariaLabel="Repeatable" />
              Repeatable
            </label>
          )}
          <label className="flex items-center" style={{ gap: 8, fontSize: 13, color: studioColors.labelGray, cursor: "pointer" }}>
            <Switch checked={fRequired} onChange={() => setFRequired((v) => !v)} ariaLabel="Required" />
            Required
          </label>
        </div>
        {formError && (
          <div role="alert" style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger, marginBottom: 10 }}>
            {formError}
          </div>
        )}
        <div className="flex justify-end" style={{ gap: 8 }}>
          <GhostButton onClick={closeAddModal}>Cancel</GhostButton>
          <GoldButton onClick={submitAdd} disabled={busy}>
            {busy ? "Adding…" : "Add"}
          </GoldButton>
        </div>
      </Modal>
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
