"use client";

// src/components/Studio/shell/Sidebar.tsx
//
// The teal primary navigation. Vertical rail on desktop; a horizontal
// scrolling bar on narrow viewports. Active state follows the route.

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import Wordmark from "./Wordmark";
import { useStudio } from "../shared/StudioContext";
import { collections, entries, assets, currentUser } from "@/data/studio";

interface NavDef {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  count?: number;
  /** Extra route prefixes that should also mark this item active. */
  match?: (path: string) => boolean;
}

const iconProps = {
  width: 17,
  height: 17,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: { flex: "none" as const },
};

const SECTIONS: { title: string; items: NavDef[] }[] = [
  {
    title: "Content",
    items: [
      {
        key: "dash",
        label: "Dashboard",
        href: "/studio/dashboard",
        icon: (
          <svg {...iconProps}>
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        key: "coll",
        label: "Collections",
        href: "/studio/collections",
        count: collections.length,
        icon: (
          <svg {...iconProps}>
            <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
            <path d="m3 12.5 9 4.5 9-4.5" />
            <path d="m3 17 9 4.5L21 17" />
          </svg>
        ),
      },
      {
        key: "list",
        label: "Entries",
        href: "/studio/entries",
        count: entries.length,
        match: (p) => p === "/studio/entries",
        icon: (
          <svg {...iconProps}>
            <path d="M8.5 6h12M8.5 12h12M8.5 18h12" />
            <path d="M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
        ),
      },
      {
        key: "ed",
        label: "Edit entry",
        href: `/studio/entries/${entries[0].id}`,
        match: (p) => /^\/studio\/entries\/[^/]+$/.test(p),
        icon: (
          <svg {...iconProps}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Structure",
    items: [
      {
        key: "tpl",
        label: "Templates",
        href: "/studio/templates",
        icon: (
          <svg {...iconProps}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
            <path d="M3.5 9.5h17M9.5 20.5v-11" />
          </svg>
        ),
      },
      {
        key: "med",
        label: "Media library",
        href: "/studio/media",
        count: assets.length,
        icon: (
          <svg {...iconProps}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m20.5 15-5-5L5 20.5" />
          </svg>
        ),
      },
      {
        key: "tax",
        label: "Authors & tags",
        href: "/studio/taxonomy",
        icon: (
          <svg {...iconProps}>
            <path d="M3.5 3.5h7l10 10-7 7-10-10v-7Z" />
            <circle cx="7.5" cy="7.5" r="1.3" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "api",
        label: "Delivery API",
        href: "/studio/delivery-api",
        icon: (
          <svg {...iconProps}>
            <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
          </svg>
        ),
      },
      {
        key: "roles",
        label: "Roles & access",
        href: "/studio/roles",
        icon: (
          <svg {...iconProps}>
            <path d="M12 2.5 4.5 5.5v5.7c0 4.6 3.2 7.4 7.5 9.3 4.3-1.9 7.5-4.7 7.5-9.3V5.5Z" />
          </svg>
        ),
      },
    ],
  },
];

function NavItem({ item, active }: { item: NavDef; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="group flex flex-none items-center gap-2.5 whitespace-nowrap transition-colors"
      style={{
        width: "100%",
        padding: "9px 11px",
        borderRadius: 12,
        color: active ? "#ffffff" : "rgba(255,255,255,.75)",
        background: active ? "rgba(255,255,255,.14)" : "transparent",
        fontFamily: "var(--font-switzer)",
        fontSize: 13.5,
        fontWeight: 500,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,.08)";
          e.currentTarget.style.color = "#ffffff";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,.75)";
        }
      }}
    >
      {item.icon}
      <span className="max-md:hidden">{item.label}</span>
      {typeof item.count === "number" && (
        <span
          className="max-md:hidden"
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-inter),var(--font-switzer)",
            fontSize: 10.5,
            fontWeight: 600,
            background: "rgba(255,255,255,.13)",
            color: "rgba(255,255,255,.8)",
            padding: "1px 7px",
            borderRadius: 999,
          }}
        >
          {item.count}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="max-md:hidden"
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,.42)",
        padding: "14px 12px 5px",
      }}
    >
      {children}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { role, toast } = useStudio();

  const isActive = (item: NavDef) =>
    item.match ? item.match(pathname) : pathname === item.href || pathname.startsWith(item.href + "/");

  const logout = () => {
    toast("Signed out");
    router.push("/studio/login");
  };

  return (
    <aside
      className="relative flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden max-md:flex-row max-md:items-center max-md:gap-1 max-md:overflow-x-auto max-md:overflow-y-hidden"
      style={{ padding: "16px 12px 14px" }}
      role="navigation"
      aria-label="Primary"
    >
      {/* Decorative texture (desktop only) */}
      <img
        src="/studio/footer-texture.svg"
        alt=""
        className="max-md:hidden"
        style={{ position: "absolute", left: -60, bottom: -80, width: 360, opacity: 0.45, pointerEvents: "none" }}
      />

      {/* Brand card */}
      <div
        className="relative flex flex-col max-md:mr-1 max-md:flex-none"
        style={{ isolation: "isolate", background: "#ffffff", borderRadius: 14, padding: "11px 14px 9px", margin: "0 2px 10px", gap: 1 }}
      >
        <Wordmark />
        <div
          className="max-md:hidden"
          style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".14em", color: "#757575", textTransform: "uppercase" }}
        >
          Content studio
        </div>
      </div>

      {/* Environment badge */}
      <div className="flex items-center gap-[7px] max-md:hidden" style={{ padding: "0 10px 10px" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D27A", flex: "none" }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontFamily: "ui-monospace,'SF Mono',Menlo,monospace" }}>
          flarize.com · Production
        </span>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="contents">
          <SectionLabel>{section.title}</SectionLabel>
          {section.items.map((item) => (
            <NavItem key={item.key} item={item} active={isActive(item)} />
          ))}
        </div>
      ))}

      {/* Footer: user + logout */}
      <div
        className="relative mt-auto flex items-center gap-[9px] max-md:mt-0 max-md:ml-1 max-md:border-t-0 max-md:pt-0"
        style={{ borderTop: "1px solid rgba(255,255,255,.14)", padding: "12px 10px 2px" }}
      >
        <div
          className="grid flex-none place-items-center"
          style={{ width: 28, height: 28, borderRadius: "50%", background: "#F7BA41", color: "#272218", fontSize: 11, fontWeight: 700 }}
        >
          {currentUser.initials}
        </div>
        <div className="min-w-0 leading-tight max-md:hidden">
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#ffffff" }}>{currentUser.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>{role}</div>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
          className="grid flex-none place-items-center transition-colors hover:bg-[rgba(255,255,255,0.12)]"
          style={{ marginLeft: "auto", width: 30, height: 30, border: "none", borderRadius: 10, background: "transparent", color: "rgba(255,255,255,.6)", cursor: "pointer" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4H5v16h5" />
            <path d="m15 8 4 4-4 4" />
            <path d="M19 12H9" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
