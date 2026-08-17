"use client";

// src/components/Studio/shell/Topbar.tsx
//
// The white top bar: a route-derived breadcrumb on the left, and the
// "Preview site" + "+ New entry" actions on the right.

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { useStudio } from "../shared/StudioContext";
import { entries, collections } from "@/data/studio";
import { studioColors } from "../shared/format";

interface Crumb {
  label: string;
  href?: string;
}

function crumbsFor(pathname: string): Crumb[] {
  const editorMatch = pathname.match(/^\/studio\/entries\/([^/]+)$/);
  if (editorMatch) {
    const id = editorMatch[1];
    if (id === "new") return [{ label: "Entries", href: "/studio/entries" }, { label: "New entry" }];
    const entry = entries.find((e) => e.id === id);
    const coll = entry && collections.find((c) => c.id === entry.coll);
    return [
      { label: coll?.name || "Entries", href: "/studio/entries" },
      { label: entry?.title || "Entry" },
    ];
  }
  const map: Record<string, string> = {
    "/studio/dashboard": "Dashboard",
    "/studio/collections": "Collections",
    "/studio/entries": "Entries",
    "/studio/enquiries": "Enquiries",
    "/studio/templates": "Templates",
    "/studio/media": "Media library",
    "/studio/taxonomy": "Authors & taxonomy",
    "/studio/delivery-api": "Delivery API",
    "/studio/roles": "Roles & access",
  };
  return [{ label: map[pathname] || "Dashboard" }];
}

export default function Topbar() {
  const pathname = usePathname() || "/studio/dashboard";
  const router = useRouter();
  const { toast } = useStudio();
  const crumbs = crumbsFor(pathname);

  return (
    <div
      className="flex flex-none items-center gap-3 px-5 max-md:px-3.5"
      style={{ height: 60, background: "#ffffff", boxShadow: "inset 0 -1px 0 #E5E7EB", zIndex: 5 }}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-0.5 overflow-hidden">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          const inner = (
            <span
              className="overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                padding: "3px 6px",
                borderRadius: 7,
                fontSize: 13.5,
                maxWidth: last ? 420 : 200,
                color: last ? studioColors.tealDeep : studioColors.mutedGray,
                fontWeight: last ? 600 : 500,
              }}
            >
              {c.label}
            </span>
          );
          return (
            <Fragment key={i}>
              {i > 0 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
                  <path d="m9 6 6 6-6 6" />
                </svg>
              )}
              {c.href && !last ? (
                <Link href={c.href} className="min-w-0 rounded-[7px] hover:bg-[rgba(248,242,225,0.9)]">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </Fragment>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="ml-auto flex flex-none items-center gap-[9px]">
        <button
          onClick={() => toast("Preview opens the live site in a new tab")}
          className="inline-flex items-center gap-[7px] transition-colors hover:bg-[rgba(7,74,77,0.06)] max-md:hidden"
          style={{ height: 42, padding: "0 14px", borderRadius: 12, border: "none", background: "transparent", color: studioColors.teal, fontFamily: "var(--font-switzer)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
        >
          Preview site
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h6v6M20 4 11 13M19 13.5V20H4V5h6.5" />
          </svg>
        </button>
        <button
          onClick={() => router.push("/studio/entries/new")}
          className="inline-flex items-center justify-center transition-[filter] hover:brightness-[.96]"
          style={{ height: 42, padding: "0 16px", borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
        >
          + New entry
        </button>
      </div>
    </div>
  );
}
