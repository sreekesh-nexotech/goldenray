// src/data/studio/collections.ts
import type { Collection } from "@/types/studio";

/**
 * Collections — each is a kind of page on the website, with its own delivery
 * route and the templates it offers.
 */
export const collections: Collection[] = [
  { id: "articles", name: "Articles", letter: "A", bg: "#FDF6D2", ink: "#8A6117", route: "/api/articles", tpls: ["solar-guide", "comparison"] },
  { id: "case-studies", name: "Case studies", letter: "C", bg: "#ADD6D8", ink: "#074A4D", route: "/api/case-studies", tpls: ["case-study"] },
  { id: "pages", name: "Pages", letter: "P", bg: "#FBE8DA", ink: "#9C4B21", route: "/api/pages", tpls: ["standard-page"] },
];
