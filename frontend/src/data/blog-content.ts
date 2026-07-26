export type SectionTableRow = {
  cells: string[];
};

export type SectionTable = {
  headers: string[];
  rows: SectionTableRow[];
  highlightColumnIndex?: number;
};

/**
 * One block inside a section body. Sections keep their blocks in document
 * order, so an article may mix any number of paragraphs, tables and lists and
 * still render exactly as it was authored in the CMS.
 */
export type SectionBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; table: SectionTable };

export type ContentSection = {
  id: string;
  /** Empty for a leading section with no heading — the heading is then skipped. */
  title: string;
  blocks: SectionBlock[];
};

export type ArticleContent = {
  author: string;
  reviewedBy?: string;
  tags: string[];
  quickSummary: string[];
  intro: string[];
  sections: ContentSection[];
  /** CMS `insights` field. */
  keyInsight?: string;
  /** CMS `warning` field. */
  important?: string;
  /** Cover image, rendered at the top of the body. */
  coverImage?: string;
  /** Repeatable `bodyImages` group from the CMS, rendered after the body. */
  bodyImages?: string[];
};
