// src/data/studio/index.ts
//
// Barrel + light derivations for the Content Studio static data. Components
// import from here; when the admin API lands, these named exports become the
// swap point (each can be replaced by a service call returning the same shape).

import type { Role } from "@/types/studio";

export { authors } from "./authors";
export { categories, tags, badges, badgeColors } from "./taxonomy";
export { members, currentUser } from "./members";
export { collections } from "./collections";
export { templates } from "./templates";
export { assets, mediaFolders } from "./assets";
export { entries } from "./entries";
export { STUDIO_NOW, hoursAgo } from "./constants";

/** Role capability matrix rendered on the Roles & access screen. */
export interface RolePermissionRow {
  role: Role;
  name: string;
  sub: string;
  /** [Manage structure, Author entries, Publish, Delete]. */
  cells: boolean[];
}

export const rolePermissions: RolePermissionRow[] = [
  { role: "Admin", name: "Admin", sub: "Full control — structure, content, people", cells: [true, true, true, true] },
  { role: "Editor", name: "Editor", sub: "Content & publishing, no structure", cells: [false, true, true, true] },
  { role: "Author", name: "Author", sub: "Writes drafts; an editor publishes", cells: [false, true, false, false] },
];

/** Short helper note shown next to the "Preview the CMS as" segment. */
export const rolePreviewNotes: Record<Role, string> = {
  Admin: "Admins manage structure, publish and delete.",
  Editor: "Editors write, publish and delete — but not structure.",
  Author: "Authors write drafts; an editor publishes them.",
};

/** Options offered in role dropdowns. */
export const roleOptions: Role[] = ["Admin", "Editor", "Author"];
