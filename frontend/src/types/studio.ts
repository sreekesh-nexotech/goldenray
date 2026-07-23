// src/types/studio.ts
//
// Types for the Flarize Content Studio (blog CMS) presentation layer.
// These mirror the shape of the data the delivery/admin API will eventually
// return, so the static data in `@/data/studio` can be swapped for live
// service calls without touching the components.

/** Publish state of an entry. */
export type EntryStatus = "published" | "draft" | "modified";

/** CMS access role. */
export type Role = "Admin" | "Editor" | "Author";

/** Membership status in the team list. */
export type MemberStatus = "active" | "invited";

/** Field type for a template attribute. */
export type AttributeType = "number" | "string" | "text" | "enum";

/** Image-group cardinality. */
export type ImageGroupKind = "single" | "repeat";

/* -------------------------------------------------------------------------- */
/*  Taxonomy & people                                                          */
/* -------------------------------------------------------------------------- */

export interface Author {
  id: string;
  initials: string;
  name: string;
  meta: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  initials: string;
  /** True for the currently signed-in user. */
  self?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Structure — collections, templates                                         */
/* -------------------------------------------------------------------------- */

export interface Collection {
  id: string;
  name: string;
  /** Single-letter avatar. */
  letter: string;
  /** Avatar background colour. */
  bg: string;
  /** Avatar ink colour. */
  ink: string;
  /** Delivery route, e.g. `/api/articles`. */
  route: string;
  /** Template ids this collection offers. */
  tpls: string[];
}

export interface ImageGroup {
  key: string;
  label: string;
  kind: ImageGroupKind;
  req: boolean;
  /** Max images for a repeatable group. */
  max?: number;
}

export interface AttributeField {
  key: string;
  label: string;
  type: AttributeType;
  /** Options for an `enum` attribute. */
  options?: string[];
}

export interface Template {
  id: string;
  groups: ImageGroup[];
  attrs: AttributeField[];
}

/* -------------------------------------------------------------------------- */
/*  Media                                                                       */
/* -------------------------------------------------------------------------- */

export interface Asset {
  id: string;
  name: string;
  src: string;
  /** Pixel width. */
  w: number;
  /** Pixel height. */
  h: number;
  /** File size in KB. */
  kb: number;
  folder: string;
  alt: string;
}

/* -------------------------------------------------------------------------- */
/*  Entries                                                                     */
/* -------------------------------------------------------------------------- */

export interface ContentBlock {
  id: string;
  label: string;
  /** Rich-text HTML. */
  html: string;
}

export interface EntrySeo {
  /** metaTitle */
  mt: string;
  /** metaDescription */
  md: string;
  /** canonicalUrl */
  cu: string;
  /** keywords (comma-separated) */
  kw: string;
}

export interface Entry {
  id: string;
  coll: string;
  tpl: string;
  title: string;
  slug: string;
  /** True when the slug was auto-tracked from the title. */
  slugT?: boolean;
  excerpt: string;
  author: string;
  cats: string[];
  tags: string[];
  status: EntryStatus;
  /** Human date string, or null for never-published. */
  pubDate: string | null;
  /** Last-edited timestamp (ms). */
  _ts: number;
  /** Last-saved timestamp (ms). */
  savedTs: number;
  /** Map of image-group key -> asset id (single) or asset ids (repeat). */
  images: Record<string, string | string[]>;
  /** Map of attribute key -> value. */
  attrs: Record<string, string>;
  blocks: ContentBlock[];
  seo: EntrySeo;
}

/* -------------------------------------------------------------------------- */
/*  Derived presentation helpers                                               */
/* -------------------------------------------------------------------------- */

/** Pill styling for a status badge. */
export interface StatusPillStyle {
  label: string;
  bg: string;
  ink: string;
}
