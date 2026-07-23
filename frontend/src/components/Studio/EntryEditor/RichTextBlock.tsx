"use client";

// src/components/Studio/EntryEditor/RichTextBlock.tsx
//
// A single rich-text content block: a formatting toolbar over a contentEditable
// region. Formatting uses document.execCommand (as in the prototype) — kept for
// presentation fidelity; a production editor would swap in a real RTE.

import { useRef } from "react";
import { studioColors } from "../shared/format";

type Cmd = { key: string; title: string; run: () => void; render: React.ReactNode; style?: React.CSSProperties };

export default function RichTextBlock({
  label,
  html,
  canRemove,
  onRemove,
}: {
  label: string;
  html: string;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const exec = (command: string, value?: string) => {
    ref.current?.focus();
    try {
      document.execCommand(command, false, value);
    } catch {
      /* no-op in unsupported environments */
    }
  };

  const cmds: Cmd[] = [
    { key: "b", title: "Bold", run: () => exec("bold"), render: "B", style: { fontWeight: 700 } },
    { key: "i", title: "Italic", run: () => exec("italic"), render: "I", style: { fontWeight: 600, fontStyle: "italic" } },
    { key: "u", title: "Underline", run: () => exec("underline"), render: "U", style: { fontWeight: 600, textDecoration: "underline" } },
  ];

  const btn = (title: string, run: () => void, node: React.ReactNode, style?: React.CSSProperties) => (
    <button
      key={title}
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault();
        run();
      }}
      className="grid place-items-center hover:bg-white"
      style={{ width: 28, height: 26, border: "none", background: "transparent", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-switzer)", fontSize: 12.5, color: studioColors.labelGray, ...style }}
    >
      {node}
    </button>
  );

  return (
    <div style={{ marginBottom: 15 }}>
      <div className="mb-1.5 flex items-center gap-2">
        <span style={{ fontSize: 13, fontWeight: 600, color: studioColors.labelGray }}>{label}</span>
        {canRemove && (
          <button
            onClick={onRemove}
            title="Remove block"
            className="ml-auto grid place-items-center hover:bg-[rgba(220,38,38,0.07)] hover:text-[#DC2626]"
            style={{ border: "none", background: "none", cursor: "pointer", color: "#B8B8B8", padding: "3px 5px", borderRadius: 6 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        )}
      </div>
      <div role="toolbar" aria-label="Text formatting" className="flex gap-0.5" style={{ padding: "5px 6px", background: "rgba(248,242,225,.65)", borderRadius: "12px 12px 0 0", boxShadow: `inset 0 0 0 1px ${studioColors.inputRing}` }}>
        {cmds.map((c) => btn(c.title, c.run, c.render, c.style))}
        <span style={{ width: 1, height: 16, background: studioColors.inputRing, margin: "5px 4px" }} />
        {btn("Heading", () => exec("formatBlock", "H4"), "H", { fontWeight: 700 })}
        {btn("Bullet list", () => exec("insertUnorderedList"), "≡", { fontSize: 13, fontWeight: 600 })}
        {btn("Blockquote", () => exec("formatBlock", "BLOCKQUOTE"), "“”", { fontSize: 13, fontWeight: 700 })}
        {btn(
          "Insert link",
          () => {
            const url = typeof window !== "undefined" ? window.prompt("Link URL") : null;
            if (url) exec("createLink", url);
          },
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></svg>
        )}
        <button
          type="button"
          title="Clear formatting"
          aria-label="Clear formatting"
          onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}
          className="hover:bg-white"
          style={{ marginLeft: "auto", height: 26, padding: "0 9px", border: "none", background: "transparent", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-switzer)", fontSize: 10.5, fontWeight: 600, color: studioColors.mutedGray }}
        >
          Clear
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        className="flz-rt flz-ph"
        data-ph="Write here…"
        dangerouslySetInnerHTML={{ __html: html }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 0 1.5px #074A4D,0 1px 2px rgba(10,13,18,.05)")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 0 1px #D5D7DA,0 1px 2px rgba(10,13,18,.05)")}
        style={{ boxShadow: "inset 0 0 0 1px #D5D7DA,0 1px 2px rgba(10,13,18,.05)", borderRadius: "0 0 12px 12px", background: "#ffffff", minHeight: 104, padding: "12px 14px", cursor: "text" }}
      />
    </div>
  );
}
