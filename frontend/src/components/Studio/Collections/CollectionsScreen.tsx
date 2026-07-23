"use client";

// src/components/Studio/Collections/CollectionsScreen.tsx
//
// Collections — each collection is a kind of page on the website (same shape
// inside, its own public API route). Cards are shortcuts into the Entries list.
// A "New collection" modal previews the create flow (presentation stub only).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collections, entries } from "@/data/studio";
import type { Collection } from "@/types/studio";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, GhostButton, TipBanner, FieldLabel, TextInput } from "../shared/primitives";
import { Modal, ModalTitle } from "../shared/overlays";
import { studioColors, studioFonts, slugify } from "../shared/format";

/** Per-collection derived counts + template list. */
interface CollectionCard {
  coll: Collection;
  count: number;
  pubCount: number;
  tplList: string;
}

const cards: CollectionCard[] = collections.map((coll) => {
  const owned = entries.filter((e) => e.coll === coll.id);
  return {
    coll,
    count: owned.length,
    pubCount: owned.filter((e) => e.status === "published").length,
    tplList: coll.tpls.join(", "),
  };
});

function CollectionCardButton({ card, onOpen }: { card: CollectionCard; onOpen: () => void }) {
  const { coll, count, pubCount, tplList } = card;
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
            background: coll.bg,
            color: coll.ink,
          }}
        >
          {coll.letter}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: studioColors.tealDeep }}>{coll.name}</div>
          <div style={{ fontFamily: studioFonts.mono, fontSize: 11, color: studioColors.faintGray, marginTop: 1 }}>{coll.route}</div>
        </div>
      </div>
      <div className="flex" style={{ gap: 16, marginTop: 14, fontSize: 12.5, color: studioColors.bodyGray }}>
        <span>
          <b style={{ color: studioColors.tealDeep, fontFamily: "'Inter',var(--font-switzer)" }}>{count}</b> entries
        </span>
        <span>
          <b style={{ color: studioColors.tealDeep, fontFamily: "'Inter',var(--font-switzer)" }}>{pubCount}</b> published
        </span>
      </div>
      <div style={{ marginTop: 10, fontSize: 11.5, color: studioColors.faintGray }}>
        templates: <span style={{ fontFamily: studioFonts.mono }}>{tplList}</span>
      </div>
    </button>
  );
}

export default function CollectionsScreen() {
  const { tips, toast } = useStudio();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");

  const closeModal = () => {
    setModalOpen(false);
    setName("");
  };

  const createColl = () => {
    toast("Collection created");
    closeModal();
  };

  const route = `/api/${slugify(name) || "…"}`;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 1080, margin: "0 auto" }}>
      <PageHeader
        title="Collections"
        subtitle="Each collection is a kind of page on the website — same shape inside, its own public API route."
        actions={<GhostButton onClick={() => setModalOpen(true)}>+ New collection</GhostButton>}
      />

      {tips && (
        <TipBanner>
          A <b style={{ color: studioColors.tealDeep }}>collection</b> is a bucket of same-kind pages — blog Articles, Case studies,
          standalone Pages. Each gets a delivery route like <b style={{ color: studioColors.tealDeep }}>/api/articles</b>. Templates are
          picked per entry inside it.
        </TipBanner>
      )}

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {cards.map((card) => (
          <CollectionCardButton key={card.coll.id} card={card} onOpen={() => router.push("/studio/entries")} />
        ))}
      </div>

      <Modal open={modalOpen} onClose={closeModal} ariaLabel="New collection">
        <ModalTitle>New collection</ModalTitle>
        <p style={{ fontSize: 12.5, color: studioColors.bodyGray, margin: "4px 0 16px", lineHeight: 1.5 }}>
          A bucket of same-shaped pages with its own delivery route.
        </p>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Name</FieldLabel>
          <TextInput value={name} onChange={setName} placeholder="e.g. Guides" ariaLabel="Name" />
          <div style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 6 }}>
            Delivery route: <code style={{ fontFamily: studioFonts.mono, color: studioColors.teal }}>{route}</code>
          </div>
        </div>
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
              cursor: "pointer",
            }}
          >
            Create collection
          </button>
        </div>
      </Modal>
    </section>
  );
}
