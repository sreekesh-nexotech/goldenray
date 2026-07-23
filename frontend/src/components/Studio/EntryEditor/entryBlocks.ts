// src/components/Studio/EntryEditor/entryBlocks.ts
//
// Conversion between the admin API's Strapi-blocks `content_blocks[].body`
// (a nested JSON array) and the HTML the contentEditable RichTextBlock edits.
// Covers the node types the toolbar can produce: paragraph, heading, list
// (ordered/unordered), quote, links, and the bold/italic/underline marks.

/* -------------------------------------------------------------------------- */
/*  Types (a pragmatic subset of the Strapi-blocks schema)                     */
/* -------------------------------------------------------------------------- */

export interface BlockTextNode {
  type?: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface BlockLinkNode {
  type: "link";
  url: string;
  children: BlockTextNode[];
}

type InlineNode = BlockTextNode | BlockLinkNode;

export interface BlockListItem {
  type: "list-item";
  children: InlineNode[];
}

export type BlockNode =
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "heading"; level: number; children: InlineNode[] }
  | { type: "quote"; children: InlineNode[] }
  | { type: "list"; format: "ordered" | "unordered"; children: BlockListItem[] };

/* -------------------------------------------------------------------------- */
/*  Blocks → HTML (for seeding the editor)                                      */
/* -------------------------------------------------------------------------- */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineToHtml(node: InlineNode): string {
  if ((node as BlockLinkNode).type === "link") {
    const link = node as BlockLinkNode;
    const inner = link.children.map(inlineToHtml).join("");
    return `<a href="${escapeHtml(link.url)}">${inner}</a>`;
  }
  const t = node as BlockTextNode;
  let html = escapeHtml(t.text ?? "");
  if (t.bold) html = `<strong>${html}</strong>`;
  if (t.italic) html = `<em>${html}</em>`;
  if (t.underline) html = `<u>${html}</u>`;
  return html;
}

function inlinesToHtml(children: InlineNode[]): string {
  const html = (children ?? []).map(inlineToHtml).join("");
  return html || "<br>";
}

export function blocksToHtml(body: BlockNode[] | null | undefined): string {
  if (!Array.isArray(body) || body.length === 0) return "";
  return body
    .map((node) => {
      switch (node.type) {
        case "heading": {
          const lvl = Math.min(Math.max(node.level || 2, 1), 6);
          return `<h${lvl}>${inlinesToHtml(node.children)}</h${lvl}>`;
        }
        case "quote":
          return `<blockquote>${inlinesToHtml(node.children)}</blockquote>`;
        case "list": {
          const tag = node.format === "ordered" ? "ol" : "ul";
          const items = (node.children ?? [])
            .map((li) => `<li>${inlinesToHtml(li.children)}</li>`)
            .join("");
          return `<${tag}>${items}</${tag}>`;
        }
        case "paragraph":
        default:
          return `<p>${inlinesToHtml(node.children)}</p>`;
      }
    })
    .join("");
}

/* -------------------------------------------------------------------------- */
/*  HTML → Blocks (for saving)                                                  */
/* -------------------------------------------------------------------------- */

/** Collapse an element's inline content into block text/link nodes. */
function inlineFromDom(parent: Node, marks: { bold?: boolean; italic?: boolean; underline?: boolean } = {}): InlineNode[] {
  const out: InlineNode[] = [];
  parent.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const text = n.textContent ?? "";
      if (text) out.push({ type: "text", text, ...marks });
      return;
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return;
    const el = n as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === "strong" || tag === "b") return void out.push(...inlineFromDom(el, { ...marks, bold: true }));
    if (tag === "em" || tag === "i") return void out.push(...inlineFromDom(el, { ...marks, italic: true }));
    if (tag === "u") return void out.push(...inlineFromDom(el, { ...marks, underline: true }));
    if (tag === "a") {
      const url = el.getAttribute("href") || "";
      const children = inlineFromDom(el, marks).map((c) => c as BlockTextNode);
      out.push({ type: "link", url, children: children.length ? children : [{ type: "text", text: el.textContent || url }] });
      return;
    }
    if (tag === "br") return;
    // Unknown inline wrapper (span, etc.) — descend keeping marks.
    out.push(...inlineFromDom(el, marks));
  });
  return out;
}

function nonEmpty(children: InlineNode[]): InlineNode[] {
  return children.length ? children : [{ type: "text", text: "" }];
}

export function htmlToBlocks(html: string): BlockNode[] {
  if (typeof document === "undefined") return [];
  const container = document.createElement("div");
  container.innerHTML = html ?? "";

  const blocks: BlockNode[] = [];
  const flushInline = (nodes: InlineNode[]) => {
    if (nodes.some((n) => ((n as BlockTextNode).text ?? "").trim() || (n as BlockLinkNode).type === "link")) {
      blocks.push({ type: "paragraph", children: nonEmpty(nodes) });
    }
  };

  // Loose inline nodes at the top level get grouped into one paragraph.
  let looseBuffer: InlineNode[] = [];
  const drainLoose = () => {
    if (looseBuffer.length) {
      flushInline(looseBuffer);
      looseBuffer = [];
    }
  };

  container.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const text = n.textContent ?? "";
      if (text.trim()) looseBuffer.push({ type: "text", text });
      return;
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return;
    const el = n as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tag)) {
      drainLoose();
      blocks.push({ type: "heading", level: Number(tag[1]), children: nonEmpty(inlineFromDom(el)) });
    } else if (tag === "blockquote") {
      drainLoose();
      blocks.push({ type: "quote", children: nonEmpty(inlineFromDom(el)) });
    } else if (tag === "ul" || tag === "ol") {
      drainLoose();
      const items: BlockListItem[] = [];
      el.querySelectorAll(":scope > li").forEach((li) =>
        items.push({ type: "list-item", children: nonEmpty(inlineFromDom(li)) })
      );
      blocks.push({ type: "list", format: tag === "ol" ? "ordered" : "unordered", children: items });
    } else if (tag === "p" || tag === "div") {
      drainLoose();
      flushInline(inlineFromDom(el));
    } else {
      // Inline-level element at the top: buffer it.
      looseBuffer.push(...inlineFromDom(el));
    }
  });
  drainLoose();

  return blocks;
}
