"use client";

// src/components/Studio/Collections/CollectionsScreen.tsx
//
// Collections — each collection is a kind of page on the website (same shape
// inside, its own public API route). Loaded from GET collections/ on the
// admin API; the "New collection" modal POSTs a real create (admin only).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio, useCapabilities } from "../shared/StudioContext";
import { PageHeader, GhostButton, TipBanner, FieldLabel, TextInput } from "../shared/primitives";
import { Modal, ModalTitle } from "../shared/overlays";
import { studioColors, studioFonts, slugify } from "../shared/format";
import {
  getCollections,
  createCollection,
  StudioApiError,
  type StudioCollection,
} from "@/services/studioService";

/** Avatar colour pairs cycled per card (design tokens from the studio palette). */
const AVATAR_COLORS: { bg: string; ink: string }[] = [
  { bg: "#FDF6D2", ink: "#8A6117" },
  { bg: "#ADD6D8", ink: "#074A4D" },
  { bg: "#FBE8DA", ink: "#9C4B21" },
];

function CollectionCardButton({
  coll,
  index,
  onOpen,
}: {
  coll: StudioCollection;
  index: number;
  onOpen: () => void;
}) {
  const { bg, ink } = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <button
      onClick={onOpen}
      style={{
        textAlign: "left",
        border: "none",
        cursor: "pointer",
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
        padding: 18,
        fontFamily: "var(--font-switzer)",
        transition: "box-shadow .12s, transform .12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px #074A4D";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${studioColors.ring}`;
        e.currentTarget.style.transform = "none";
      }}
    >
      <div className="flex items-center" style={{ gap: 11 }}>
        <div
          className="grid place-items-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 16,
            flex: "none",
            background: bg,
            color: ink,
          }}
        >
          {(coll.plural_name[0] || "?").toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: studioColors.tealDeep }}>{coll.plural_name}</div>
          <div style={{ fontFamily: studioFonts.mono, fontSize: 11, color: studioColors.faintGray, marginTop: 1 }}>
            /api/{coll.api_uid}
          </div>
        </div>
      </div>
      <div className="flex items-center" style={{ gap: 10, marginTop: 14, fontSize: 12.5, color: studioColors.bodyGray }}>
        <span>
          singular: <b style={{ color: studioColors.tealDeep }}>{coll.singular_name}</b>
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 9px",
            borderRadius: 999,
            background: coll.is_active ? "#C3E0BD" : "#E5E7EB",
            color: coll.is_active ? "#0A6B31" : "#5B5B5B",
          }}
        >
          {coll.is_active ? "Active" : "Inactive"}
        </span>
      </div>
      {coll.description && (
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ marginTop: 10, fontSize: 11.5, color: studioColors.faintGray }}
        >
          {coll.description}
        </div>
      )}
    </button>
  );
}

export default function CollectionsScreen() {
  const { tips, toast } = useStudio();
  const { canManageStructure } = useCapabilities();
  const router = useRouter();

  const [colls, setColls] = useState<StudioCollection[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [plural, setPlural] = useState("");
  const [singular, setSingular] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getCollections()
      .then((page) => !cancelled && setColls(page.results))
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Failed to load collections"));
    return () => {
      cancelled = true;
    };
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setPlural("");
    setSingular("");
    setFormError("");
  };

  const apiUid = slugify(plural) || "…";

  const createColl = async () => {
    if (!plural.trim() || !singular.trim()) {
      setFormError("Enter both names");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const created = await createCollection({
        api_uid: slugify(plural),
        singular_name: singular.trim(),
        plural_name: plural.trim(),
      });
      setColls((c) => [...(c ?? []), created]);
      toast("Collection created");
      closeModal();
    } catch (err) {
      setFormError(err instanceof StudioApiError ? err.message : "Couldn’t create the collection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        title="Collections"
        subtitle="Each collection is a kind of page on the website — same shape inside, its own public API route."
        actions={
          canManageStructure ? (
            <GhostButton onClick={() => setModalOpen(true)}>+ New collection</GhostButton>
          ) : undefined
        }
      />

      {tips && (
        <TipBanner>
          A <b style={{ color: studioColors.tealDeep }}>collection</b> is a bucket of same-kind pages — blog Articles, Case studies,
          standalone Pages. Each gets a delivery route like <b style={{ color: studioColors.tealDeep }}>/api/articles</b>. Templates are
          picked per entry inside it.
        </TipBanner>
      )}

      {loadError ? (
        <div
          role="alert"
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.danger }}
        >
          Couldn’t load collections: {loadError}
        </div>
      ) : colls === null ? (
        <div style={{ fontSize: 13, color: studioColors.mutedGray, padding: "8px 2px" }}>Loading…</div>
      ) : colls.length === 0 ? (
        <div
          style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "18px 20px", fontSize: 13.5, color: studioColors.bodyGray }}
        >
          No collections yet{canManageStructure ? " — create the first one with “+ New collection”." : "."}
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(280px,100%),1fr))", gap: 14 }}>
          {colls.map((coll, i) => (
            <CollectionCardButton key={coll.id} coll={coll} index={i} onOpen={() => router.push("/studio/entries")} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} ariaLabel="New collection">
        <ModalTitle>New collection</ModalTitle>
        <p style={{ fontSize: 12.5, color: studioColors.bodyGray, margin: "4px 0 16px", lineHeight: 1.5 }}>
          A bucket of same-shaped pages with its own delivery route.
        </p>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Plural name</FieldLabel>
          <TextInput value={plural} onChange={setPlural} placeholder="e.g. Guides" ariaLabel="Plural name" />
          <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 6 }}>
            Delivery route:{" "}
            <code style={{ fontFamily: studioFonts.mono, color: studioColors.teal }}>/api/{apiUid}</code>{" "}
            — fixed once live.
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Singular name</FieldLabel>
          <TextInput value={singular} onChange={setSingular} placeholder="e.g. Guide" ariaLabel="Singular name" />
        </div>
        {formError && (
          <div role="alert" style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger, marginBottom: 10 }}>
            {formError}
          </div>
        )}
        <div className="flex justify-end" style={{ gap: 8 }}>
          <button
            onClick={closeModal}
            className="inline-flex items-center"
            style={{
              height: 36,
              padding: "0 14px",
              borderRadius: 12,
              border: "none",
              background: "#ffffff",
              boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}`,
              color: studioColors.labelGray,
              fontFamily: "var(--font-switzer)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 0 0 1px #074A4D";
              e.currentTarget.style.color = studioColors.teal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${studioColors.inputRing}`;
              e.currentTarget.style.color = studioColors.labelGray;
            }}
          >
            Cancel
          </button>
          <button
            onClick={createColl}
            disabled={saving}
            className="inline-flex items-center transition-[filter] hover:brightness-[.96]"
            style={{
              height: 36,
              padding: "0 15px",
              borderRadius: 12,
              border: "none",
              background: studioColors.gold,
              color: studioColors.goldInk,
              fontFamily: "var(--font-switzer)",
              fontSize: 13,
              fontWeight: 600,
              cursor: saving ? "default" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Creating…" : "Create collection"}
          </button>
        </div>
      </Modal>
    </section>
  );
}
