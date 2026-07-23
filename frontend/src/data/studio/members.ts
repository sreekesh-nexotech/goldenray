// src/data/studio/members.ts
import type { Member } from "@/types/studio";

/** Team members shown in Roles & access. */
export const members: Member[] = [
  { id: "u_sree", name: "Sree Nath", email: "sree@flarize.com", role: "Admin", status: "active", initials: "SN", self: true },
  { id: "u_anitha", name: "A. Nair", email: "anitha@flarize.com", role: "Editor", status: "active", initials: "AN" },
  { id: "u_sanjay", name: "S. Menon", email: "sanjay@flarize.com", role: "Author", status: "active", initials: "SM" },
  { id: "u_ravi", name: "Ravi Kumar", email: "ravi@flarize.com", role: "Author", status: "invited", initials: "RK" },
];

/** The signed-in user (drives the sidebar footer). */
export const currentUser = {
  name: "Sree Nath",
  initials: "SN",
  email: "sree@flarize.com",
} as const;
