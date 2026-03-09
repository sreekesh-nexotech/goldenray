import type { BlogArticle } from "@/data/blog-data";
import type {
  ArticleContent,
  ArticleUnderstanding,
  ArticleEligible,
  ContentSection,
  UnderstandingTable,
} from "@/data/blog-content";

const API_BASE = "https://blog.flarize.com/api";

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
  for (const node of nodes) {
    if (node.type === "list") {
      return node.children.map((item) => nodeText(item));
    }
  }
  return [];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Parses a [TABLE] pipe-delimited string into a structured UnderstandingTable */
function parseTableText(raw: string): UnderstandingTable {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));

  const rows = lines.map((line) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "")
  );

  const headers = rows[0] ?? [];
  const dataRows = rows.slice(1).map((cells) => ({ cells }));

  return {
    headers,
    rows: dataRows,
    // Default: highlight the last column (Key Milestone / Subsidy Amount etc.)
    highlightColumnIndex: headers.length - 1,
  };
}

// ── ContentBlocks Parser ──────────────────────────────────────────────────────
interface RawSection {
  id: string;
  title: string;
  paragraphs: string[];           // paragraphs before any [TABLE]
  tableText?: string;             // raw [TABLE]...pipe string
  afterTableParagraphs: string[]; // paragraphs after [TABLE]
  listItems?: string[];
}

function parseContentBlocks(
  blocks: ApiContentBlock[],
  insights: string | null,
  warning: string | null
): {
  sections: ContentSection[];
  understanding?: ArticleUnderstanding;
  eligible?: ArticleEligible;
} {
  const allNodes: RichTextNode[] = blocks.flatMap((b) => b.body ?? []);
  const rawSections: RawSection[] = [];
  let current: RawSection | null = null;

  for (const node of allNodes) {
    if (node.type === "heading") {
      if (current) rawSections.push(current);
      const title = nodeText(node as { children: RichTextChild[] });
      current = {
        id: slugify(title),
        title,
        paragraphs: [],
        afterTableParagraphs: [],
      };
    } else if (node.type === "paragraph") {
      const text = nodeText(node as { children: RichTextChild[] }).trim();
      if (!text) continue;
      if (!current) {
        current = { id: "intro", title: "", paragraphs: [], afterTableParagraphs: [] };
      }
      if (text.startsWith("[TABLE]")) {
        current.tableText = text;
      } else if (current.tableText) {
        current.afterTableParagraphs.push(text);
      } else {
        current.paragraphs.push(text);
      }
    } else if (node.type === "list") {
      if (!current) continue;
      current.listItems = (node as { children: RichTextListItem[] }).children.map(
        (item) => nodeText(item)
      );
    }
  }
  if (current) rawSections.push(current);

  // Identify the "understanding" section — the one containing a [TABLE]
  const understandingIdx = rawSections.findIndex((s) => s.tableText);

  // Identify the "eligible" section — first section with listItems that isn't the understanding one
  const eligibleIdx = rawSections.findIndex(
    (s, i) => i !== understandingIdx && s.listItems && s.listItems.length > 0
  );

  // Build understanding
  const understanding: ArticleUnderstanding | undefined =
    understandingIdx >= 0
      ? {
          title: rawSections[understandingIdx].title,
          paragraphs: rawSections[understandingIdx].paragraphs,
          table: parseTableText(rawSections[understandingIdx].tableText!),
          afterTableParagraphs: rawSections[understandingIdx].afterTableParagraphs,
          keyInsight: insights ?? undefined,
        }
      : undefined;

  // Build eligible
  const eligibleSection = eligibleIdx >= 0 ? rawSections[eligibleIdx] : null;
  const eligible: ArticleEligible | undefined =
    eligibleSection || warning
      ? {
          title: eligibleSection?.title ?? "Eligibility",
          intro: eligibleSection?.paragraphs[0] ?? "",
          items: eligibleSection?.listItems ?? [],
          important: warning ?? undefined,
        }
      : undefined;

  // All remaining sections
  const sections: ContentSection[] = rawSections
    .filter((s, i) => i !== understandingIdx && i !== eligibleIdx && !!s.title)
    .map((s) => ({
      id: s.id,
      title: s.title,
      paragraphs: [...s.paragraphs, ...s.afterTableParagraphs],
    }));

  return { sections, understanding, eligible };
}

// ── Transformers ──────────────────────────────────────────────────────────────
function transformToBlogArticle(raw: ApiArticle): BlogArticle {
  const category = raw.categories?.[0]?.name ?? "Solar Guide";

  // coverImage.url may be a relative path on Strapi — prefix domain if needed
  let image = DEFAULT_FALLBACK;
  if (raw.coverImage?.url) {
    const u = raw.coverImage.url;
    image = u.startsWith("http") ? u : `https://blog.flarize.com${u}`;
  } else {
    image = FALLBACK_IMAGES[category] ?? DEFAULT_FALLBACK;
  }

  return {
    id: raw.slug,
    title: raw.title,
    description: raw.excerpt,
    category,
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
  const quickSummary = richTextToListItems(raw.summary ?? []);

  const { sections, understanding, eligible } = parseContentBlocks(
    raw.contentBlocks ?? [],
    raw.insights ?? null,
    raw.warning ?? null
  );

  return {
    author,
    reviewedBy,
    tags,
    quickSummary,
    intro,
    sections,
    understanding,
    eligible,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Fetches all articles for the /blog listing page. Revalidates every hour. */
export async function fetchAllArticles(): Promise<{
  articles: BlogArticle[];
  categories: string[];
}> {
  try {
    const res = await fetch(`${API_BASE}/articles?populate=*`, {
      next: { revalidate: 3600 },
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
} | null> {
  try {
    const res = await fetch(
      `${API_BASE}/articles?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: StrapiResponse = await res.json();
    const raw = json.data[0];
    if (!raw) return null;

    return {
      article: transformToBlogArticle(raw),
      content: transformToArticleContent(raw),
      seo: raw.seo ?? null,
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
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: StrapiResponse = await res.json();
    return json.data.map((a) => a.slug).filter(Boolean);
  } catch (err) {
    console.error("[blogApiService] fetchAllSlugs failed:", err);
    return [];
  }
}
