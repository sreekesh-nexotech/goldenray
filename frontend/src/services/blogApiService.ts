import type { BlogArticle } from "@/data/blog-data";
import type {
  ArticleContent,
  ContentSection,
  SectionTable,
} from "@/data/blog-content";
import { BLOG_API_BASE_URL } from "@/config";

const API_BASE = BLOG_API_BASE_URL;

// Data-cache window for blog fetches: long in prod (the CMS webhook busts it on
// publish), short in dev so local edits show up within a minute even on a dev
// server the webhook can't reach.
const REVALIDATE_SECONDS = process.env.NODE_ENV === "production" ? 3600 : 60;

// ── Fallback images per category (used when coverImage is null) ───────────────
const FALLBACK_IMAGES: Record<string, string> = {
  "Subsidy & Government":
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png",
  "Cost & Savings":
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-3.png",
  "Installation Process":
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-2.png",
  "Solar Basics":
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-4.png",
  "Case Studies":
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-5.png",
  Comparisons:
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-6.png",
  Maintenance:
    "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-7.png",
};
const DEFAULT_FALLBACK =
  "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png";

// ── Strapi rich-text node shapes ──────────────────────────────────────────────
interface RichTextChild {
  text: string;
  type: string;
  bold?: boolean;
  italic?: boolean;
}

interface RichTextListItem {
  type: "list-item";
  children: RichTextChild[];
}

type RichTextNode =
  | { type: "paragraph"; children: RichTextChild[] }
  | { type: "heading"; level: number; children: RichTextChild[] }
  | {
      type: "list";
      format: "unordered" | "ordered";
      children: RichTextListItem[];
    };

// ── Strapi API shapes ─────────────────────────────────────────────────────────
interface ApiCategory {
  id: number;
  name: string;
  slug: string | null;
}

interface ApiTag {
  id: number;
  name: string;
}

interface ApiAuthor {
  id: number;
  name: string;
  bio: string | null;
  role: string | null;
}

interface ApiBadge {
  id: number;
  label: string;
  color: string;
}

interface ApiContentBlock {
  __component: string;
  id: number;
  body: RichTextNode[];
}

interface ApiImgUrls {
  coverImg?: string | null;
  mainImg?: string | null;
  socialSharing?: string | null;
  secondaryImg?: string | null;
  /** Repeatable image group — the CMS sends an array of CDN URLs. */
  bodyImages?: string[] | null;
}

export interface ApiSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  keywords?: string | null;
}

interface ApiCoverImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
}

interface ApiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  summary: RichTextNode[];
  introduction: RichTextNode[];
  readTime: number | null;
  isFeatured: boolean | null;
  sortOrder: number | null;
  publishedOn: string | null;
  updatedAt: string;
  publishedAt: string;
  author: ApiAuthor | null;
  categories: ApiCategory[];
  tags: ApiTag[];
  badges: ApiBadge[];
  contentBlocks: ApiContentBlock[];
  coverImage: ApiCoverImage | null;
  warning: string | null;
  insights: string | null;
  seo: ApiSeo | null;
  imgUrls: ApiImgUrls | null;
}

interface StrapiResponse {
  data: ApiArticle[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ── Utility helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function nodeText(node: { children: RichTextChild[] }): string {
  return node.children.map((c) => c.text).join("");
}

function richTextToStrings(nodes: RichTextNode[]): string[] {
  return nodes
    .filter((n) => n.type === "paragraph")
    .map((n) => nodeText(n as { children: RichTextChild[] }))
    .filter((s) => s.trim().length > 0);
}

function richTextToListItems(nodes: RichTextNode[]): string[] {
  const items: string[] = [];
  for (const node of nodes) {
    if (node.type === "list") {
      // Each item may be its own separate list node — accumulate all
      items.push(...node.children.map((item) => nodeText(item)));
    }
  }
  return items;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Splits one pipe-delimited row into cells. Only the empty strings produced by
 * the leading and trailing pipes are dropped — interior blanks are real cells
 * (e.g. `|Total|||23.5 units|` is a 4-column row), so stripping them would
 * shift every following cell into the wrong column.
 */
function splitRow(line: string): string[] {
  const cells = line.split("|").map((cell) => cell.trim());
  if (cells.length > 0 && cells[0] === "") cells.shift();
  if (cells.length > 0 && cells[cells.length - 1] === "") cells.pop();
  return cells;
}

/** Builds a SectionTable from collected pipe-delimited rows. */
function buildTable(pipeRows: string[]): SectionTable {
  const rows = pipeRows.map(splitRow);
  const headers = rows[0] ?? [];

  // Pad short rows so cells stay under their intended header
  const dataRows = rows.slice(1).map((cells) => ({
    cells:
      cells.length < headers.length
        ? [...cells, ...Array(headers.length - cells.length).fill("")]
        : cells,
  }));

  return {
    headers,
    rows: dataRows,
    // Default: highlight the last column (Key Milestone / Subsidy Amount etc.)
    highlightColumnIndex: headers.length - 1,
  };
}

// ── ContentBlocks Parser ──────────────────────────────────────────────────────
//
// Walks the rich-text nodes once and emits sections in document order, each
// holding its paragraphs, tables and lists as ordered blocks. An article may
// therefore contain any number of tables and lists, each rendering exactly
// where the author put it.
//
// Tables are authored as a `[TABLE]` marker followed by pipe-delimited rows.
// The rows may arrive as one multi-line paragraph or as one paragraph per row,
// so both are accepted; a run of pipe rows with no marker is also treated as a
// table, since that is unambiguous.

function parseContentBlocks(blocks: ApiContentBlock[]): ContentSection[] {
  const allNodes: RichTextNode[] = blocks.flatMap((b) => b.body ?? []);
  const sections: ContentSection[] = [];

  let current: ContentSection | null = null;
  let pendingRows: string[] | null = null;

  /** Flushes any open table into the current section. */
  const closeTable = () => {
    if (pendingRows && pendingRows.length > 0 && current) {
      current.blocks.push({ kind: "table", table: buildTable(pendingRows) });
    }
    pendingRows = null;
  };

  const openSection = (title: string) => {
    closeTable();
    if (current) sections.push(current);
    current = { id: title ? slugify(title) : "intro", title, blocks: [] };
  };

  /** Ensures there is a section to write into (leading, heading-less content). */
  const ensureSection = () => {
    if (!current) current = { id: "intro", title: "", blocks: [] };
  };

  const addParagraph = (text: string) => {
    ensureSection();
    current!.blocks.push({ kind: "paragraph", text });
  };

  for (const node of allNodes) {
    if (node.type === "heading") {
      openSection(nodeText(node as { children: RichTextChild[] }).trim());
      continue;
    }

    if (node.type === "list") {
      closeTable();
      ensureSection();
      const items = (node as { children: RichTextListItem[] }).children.map(
        (item) => nodeText(item).trim()
      );
      const last = current!.blocks[current!.blocks.length - 1];
      // Strapi may split one authored list into consecutive single-item list
      // nodes — merge them back so they render as one list.
      if (last?.kind === "list") last.items.push(...items);
      else current!.blocks.push({ kind: "list", items });
      continue;
    }

    if (node.type !== "paragraph") continue;

    const text = nodeText(node as { children: RichTextChild[] }).trim();
    if (!text) continue;
    ensureSection();

    // A paragraph may carry the marker, rows, and trailing prose at once.
    const markerIndex = text.indexOf("[TABLE]");
    let rest = text;
    if (markerIndex >= 0) {
      const before = text.slice(0, markerIndex).trim();
      if (before) addParagraph(before);
      closeTable();
      pendingRows = [];
      rest = text.slice(markerIndex + "[TABLE]".length);
    }

    for (const rawLine of rest.split("\n")) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith("|")) {
        // Pipe rows imply a table even without a preceding marker
        if (!pendingRows) pendingRows = [];
        pendingRows.push(line);
      } else {
        closeTable();
        addParagraph(line);
      }
    }
  }

  closeTable();
  if (current) sections.push(current);

  // Drop sections that ended up with nothing to show
  return sections.filter((s) => !!s.title || s.blocks.length > 0);
}

// ── Transformers ──────────────────────────────────────────────────────────────

/**
 * Resolves the editor-supplied cover image: imgUrls.coverImg → coverImage media.
 * Returns undefined when the CMS has no cover — callers decide whether a
 * placeholder is appropriate (listing cards: yes; article body: no).
 */
function resolveCoverImage(raw: ApiArticle): string | undefined {
  if (raw.imgUrls?.coverImg) return raw.imgUrls.coverImg;
  if (raw.coverImage?.url) {
    const u = raw.coverImage.url;
    return u.startsWith("http") ? u : `https://blog.flarize.com${u}`;
  }
  return undefined;
}

function transformToBlogArticle(raw: ApiArticle): BlogArticle {
  const category = raw.categories?.[0]?.name ?? "Solar Guide";
  const categoryFallback = FALLBACK_IMAGES[category] ?? DEFAULT_FALLBACK;

  // Listing cards always need an image, so fall back to the category placeholder
  const image = resolveCoverImage(raw) ?? categoryFallback;

  // Priority: imgUrls.mainImg → same as card image
  const mainImage = raw.imgUrls?.mainImg ?? image;

  return {
    id: raw.slug,
    title: raw.title,
    description: raw.excerpt,
    category,
    mainImage,
    image,
    readTime: `${raw.readTime ?? 5} min read`,
    updatedDate: formatDate(raw.publishedOn ?? raw.updatedAt),
    featured: !!(raw.isFeatured ?? (raw.sortOrder === 1)),
  };
}

function transformToArticleContent(raw: ApiArticle): ArticleContent {
  const author = raw.author?.name ?? "Golden Ray Solar";
  const badgeLabel = raw.badges?.[0]?.label ?? "";
  const reviewedBy = badgeLabel
    ? badgeLabel.replace(/^reviewed by /i, "")
    : undefined;

  const tags = raw.tags?.map((t) => t.name) ?? [];
  const intro = richTextToStrings(raw.introduction ?? []);

  // The summary field is meant to hold a bullet list, but editors routinely type
  // plain paragraphs there — fall back to those so Quick Summary still renders.
  const summaryItems = richTextToListItems(raw.summary ?? []);
  const quickSummary =
    summaryItems.length > 0 ? summaryItems : richTextToStrings(raw.summary ?? []);

  return {
    author,
    reviewedBy,
    tags,
    quickSummary,
    intro,
    sections: parseContentBlocks(raw.contentBlocks ?? []),
    keyInsight: raw.insights ?? undefined,
    important: raw.warning ?? undefined,
    coverImage: resolveCoverImage(raw),
    bodyImages: raw.imgUrls?.bodyImages ?? undefined,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Fetches all articles for the /blog listing page. Revalidates every hour. */
export async function fetchAllArticles(): Promise<{
  articles: BlogArticle[];
  categories: string[];
}> {
  try {
    const res = await fetch(`${API_BASE}/articles?populate=*&pagination[pageSize]=100`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: StrapiResponse = await res.json();

    const articles = json.data.map(transformToBlogArticle);
    const categories = [
      "All Guides",
      ...Array.from(new Set(articles.map((a) => a.category))),
    ];

    return { articles, categories };
  } catch (err) {
    console.error("[blogApiService] fetchAllArticles failed:", err);
    return { articles: [], categories: ["All Guides"] };
  }
}

/** Fetches a single article by slug for the /blog/[id] detail page. */
export async function fetchArticleBySlug(slug: string): Promise<{
  article: BlogArticle;
  content: ArticleContent;
  seo: ApiSeo | null;
  /** `imgUrls.socialSharing` — the CMS image meant for og:image. */
  socialImage: string | undefined;
} | null> {
  try {
    const res = await fetch(
      `${API_BASE}/articles?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: StrapiResponse = await res.json();
    const raw = json.data[0];
    if (!raw) return null;

    return {
      article: transformToBlogArticle(raw),
      content: transformToArticleContent(raw),
      seo: raw.seo ?? null,
      socialImage: raw.imgUrls?.socialSharing ?? undefined,
    };
  } catch (err) {
    console.error(`[blogApiService] fetchArticleBySlug(${slug}) failed:`, err);
    return null;
  }
}

/** Fetches only slugs — used for generateStaticParams. */
export async function fetchAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/articles?fields[0]=slug`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: StrapiResponse = await res.json();
    return json.data.map((a) => a.slug).filter(Boolean);
  } catch (err) {
    console.error("[blogApiService] fetchAllSlugs failed:", err);
    return [];
  }
}
