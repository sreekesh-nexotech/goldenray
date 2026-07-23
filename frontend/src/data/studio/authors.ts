// src/data/studio/authors.ts
import type { Author } from "@/types/studio";

/**
 * Reusable author lookups referenced by entries. Static for now — replace
 * with a `GET /api/authors` call when the admin API is wired up.
 */
export const authors: Author[] = [
  { id: "flarize", initials: "FE", name: "Flarize Editorial", meta: "Brand author" },
  { id: "anair", initials: "AN", name: "A. Nair", meta: "Energy writer" },
  { id: "smenon", initials: "SM", name: "S. Menon", meta: "Technical reviewer" },
];
