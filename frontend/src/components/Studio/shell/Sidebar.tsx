"use client";

// src/components/Studio/shell/Sidebar.tsx
//
// The teal primary navigation. Vertical rail on desktop; on narrow viewports
// a compact top bar with a hamburger button that opens a slide-in drawer.
// Active state follows the route.

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import Wordmark from "./Wordmark";
import { useStudio } from "../shared/StudioContext";
import { ConfirmDialog } from "../shared/overlays";
import { initialsOf } from "../shared/format";
import { logout as apiLogout, type StudioModule } from "@/services/studioService";

interface NavDef {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  count?: number;
  /** Phase 1 module this item belongs to; hidden unless the user can view it. */
  module?: StudioModule;
  /** Legacy gate for the blog-structure screens (schema editors only). */
  schemaOnly?: boolean;
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

/* Icons — one per nav item, kept together so the SECTIONS table reads clean. */
const I = {
  dash: (
    <svg {...iconProps}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  pages: (
    <svg {...iconProps}>
      <path d="M6 3.5h8l4 4v13H6Z" />
      <path d="M14 3.5v4h4M9 12h6M9 16h6" />
    </svg>
  ),
  blogs: (
    <svg {...iconProps}>
      <path d="M8.5 6h12M8.5 12h12M8.5 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  ),
  faqs: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" />
    </svg>
  ),
  media: (
    <svg {...iconProps}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m20.5 15-5-5L5 20.5" />
    </svg>
  ),
  seo: (
    <svg {...iconProps}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20.5 20.5-5-5M8 10.5h5M10.5 8v5" />
    </svg>
  ),
  leads: (
    <svg {...iconProps}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  emi: (
    <svg {...iconProps}>
      <rect x="4.5" y="2.5" width="15" height="19" rx="2.5" />
      <path d="M8 6.5h8" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
      <path d="M8.5 14.5h.01M12 14.5h.01M15.5 14.5h3.5" />
      <path d="M8.5 18h.01M12 18h.01" />
    </svg>
  ),
  careers: (
    <svg {...iconProps}>
      <path d="M3.5 20.5v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3" />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M17 9.5l1.5 1.5 3-3" />
    </svg>
  ),
  positions: (
    <svg {...iconProps}>
      <rect x="2.5" y="7" width="19" height="13.5" rx="2.5" />
      <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
      <path d="M2.5 12.5h19" />
    </svg>
  ),
  applications: (
    <svg {...iconProps}>
      <path d="M6 3.5h8l4 4v13H6Z" />
      <path d="M14 3.5v4h4" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  ),
  departments: (
    <svg {...iconProps}>
      <rect x="3.5" y="9.5" width="17" height="11" rx="2" />
      <path d="M8 9.5V5.5h8v4M3.5 14.5h17" />
    </svg>
  ),
  careerPage: (
    <svg {...iconProps}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 9.5h17M9.5 20.5v-11" />
      <path d="M13 14h4M13 17h2.5" />
    </svg>
  ),
  users: (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.5a5 5 0 0 1 6 5" />
    </svg>
  ),
  roles: (
    <svg {...iconProps}>
      <path d="M12 2.5 4.5 5.5v5.7c0 4.6 3.2 7.4 7.5 9.3 4.3-1.9 7.5-4.7 7.5-9.3V5.5Z" />
    </svg>
  ),
  settings: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
  coll: (
    <svg {...iconProps}>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5L21 17" />
    </svg>
  ),
  tpl: (
    <svg {...iconProps}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 9.5h17M9.5 20.5v-11" />
    </svg>
  ),
  tax: (
    <svg {...iconProps}>
      <path d="M3.5 3.5h7l10 10-7 7-10-10v-7Z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </svg>
  ),
  api: (
    <svg {...iconProps}>
      <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
    </svg>
  ),
};

/**
 * The Phase 1 information architecture (§4). Group titles and item order are
 * the scope document's; each item names the module that grants it, and the
 * Comparison / Quotation Analyzer / Group Purchasing modules are absent because
 * they are Phase 2. "Blog structure" holds the existing CMS schema screens —
 * §6.3 says integrate the blog, not redesign it — gated as they always were.
 */
const SECTIONS: { title: string; items: NavDef[] }[] = [
  {
    title: "",
    items: [{ key: "dash", label: "Dashboard", href: "/studio/dashboard", icon: I.dash, module: "dashboard" }],
  },
  {
    title: "Website",
    items: [
      { key: "pages", label: "Pages", href: "/studio/pages", icon: I.pages, module: "pages" },
      {
        key: "blogs",
        label: "Blogs",
        href: "/studio/entries",
        icon: I.blogs,
        module: "blogs",
        match: (p) => p.startsWith("/studio/entries"),
      },
      { key: "faqs", label: "FAQs", href: "/studio/faqs", icon: I.faqs, module: "faqs" },
      { key: "med", label: "Media", href: "/studio/media", icon: I.media, module: "media" },
      { key: "seo", label: "SEO", href: "/studio/seo", icon: I.seo, module: "seo" },
    ],
  },
  {
    title: "Business",
    items: [
      { key: "enq", label: "Leads / Entries", href: "/studio/enquiries", icon: I.leads, module: "leads" },
      { key: "emi", label: "EMI Calculator", href: "/studio/emi-calculator", icon: I.emi, module: "emi" },
    ],
  },
  {
    title: "Careers",
    items: [
      {
        key: "careers",
        label: "Overview",
        href: "/studio/careers",
        icon: I.careers,
        module: "careers",
        match: (p) => p === "/studio/careers",
      },
      {
        key: "positions",
        label: "Job Positions",
        href: "/studio/careers/positions",
        icon: I.positions,
        module: "job_positions",
      },
      {
        key: "applications",
        label: "Applications",
        href: "/studio/careers/applications",
        icon: I.applications,
        module: "applications",
      },
      {
        key: "departments",
        label: "Departments",
        href: "/studio/careers/departments",
        icon: I.departments,
        module: "departments",
      },
      {
        key: "careerPage",
        label: "Career Page",
        href: "/studio/careers/page",
        icon: I.careerPage,
        module: "career_page",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      { key: "users", label: "Users", href: "/studio/users", icon: I.users, module: "users" },
      { key: "roles", label: "Roles & Permissions", href: "/studio/roles", icon: I.roles, module: "roles" },
      { key: "settings", label: "Settings", href: "/studio/settings", icon: I.settings, module: "settings" },
    ],
  },
  {
    title: "Blog structure",
    items: [
      { key: "coll", label: "Collections", href: "/studio/collections", icon: I.coll, schemaOnly: true },
      { key: "tpl", label: "Templates", href: "/studio/templates", icon: I.tpl, schemaOnly: true },
      { key: "tax", label: "Authors & tags", href: "/studio/taxonomy", icon: I.tax, schemaOnly: true },
      { key: "api", label: "Delivery API", href: "/studio/delivery-api", icon: I.api, schemaOnly: true },
    ],
  },
];

function NavItem({ item, active }: { item: NavDef; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="group flex w-full flex-none items-center gap-2.5 whitespace-nowrap transition-colors"
      style={{
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
      <span>{item.label}</span>
      {typeof item.count === "number" && (
        <span
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

/** Hostname for the environment badge ("https://flarize.com" → "flarize.com"). */
function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { role, toast, me, config, dashboard, can } = useStudio();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Sidebar badge counts from the dashboard payload.
  const counts = dashboard?.counts;
  const badgeByKey: Record<string, number | undefined> = {
    coll: counts?.collections,
    blogs: counts?.entries,
    tpl: counts?.templates,
    med: counts?.media_assets,
    tax: counts?.authors,
  };

  // §6.17: a module the user cannot view has no route in the sidebar. Groups
  // that end up empty disappear with their label, so a Sales/Lead user sees
  // Dashboard and Business and nothing else — not a shell full of headings.
  const visible = (item: NavDef) => {
    if (item.schemaOnly) return Boolean(me?.can_edit_schema);
    if (item.module) return can(item.module);
    return true;
  };
  const sections = SECTIONS.map((s) => ({ ...s, items: s.items.filter(visible) })).filter(
    (s) => s.items.length > 0
  );

  const displayName = me
    ? [me.first_name, me.last_name].filter(Boolean).join(" ") || me.username
    : "…";

  // Close the mobile drawer whenever the route changes (a nav link was used).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (item: NavDef) =>
    item.match ? item.match(pathname) : pathname === item.href || pathname.startsWith(item.href + "/");

  const logout = () => {
    setConfirmLogout(false);
    apiLogout(); // no server endpoint — just discard the tokens
    toast("Signed out");
    router.push("/studio/login");
  };

  // Full vertical nav — rendered in the desktop rail and the mobile drawer.
  const navContent = (
    <>
      {/* Decorative texture */}
      <img
        src="/studio/footer-texture.svg"
        alt=""
        style={{ position: "absolute", left: -60, bottom: -80, width: 360, opacity: 0.45, pointerEvents: "none" }}
      />

      {/* Brand card */}
      <div
        className="relative m-[0_2px_10px] flex flex-col"
        style={{ isolation: "isolate", background: "#ffffff", borderRadius: 14, padding: "11px 14px 9px", gap: 1 }}
      >
        <Wordmark />
        <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".14em", color: "#757575", textTransform: "uppercase" }}>
          Content studio
        </div>
      </div>

      {/* Environment badge */}
      <div className="flex items-center gap-[7px]" style={{ padding: "0 10px 10px" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D27A", flex: "none" }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontFamily: "ui-monospace,'SF Mono',Menlo,monospace" }}>
          {config ? `${hostOf(config.site_url)} · ${config.environment}` : "connecting…"}
        </span>
      </div>

      {sections.map((section) => (
        <div key={section.title || "top"} className="contents">
          {section.title && <SectionLabel>{section.title}</SectionLabel>}
          {section.items.map((item) => {
            // Resolve live badge counts from the dashboard payload.
            const resolved: NavDef = { ...item, count: badgeByKey[item.key] };
            return <NavItem key={item.key} item={resolved} active={isActive(item)} />;
          })}
        </div>
      ))}

      {/* Footer: user + logout */}
      <div className="relative mt-auto flex items-center gap-[9px] border-t border-[rgba(255,255,255,.14)] p-[12px_10px_2px]">
        <div
          className="grid flex-none place-items-center"
          style={{ width: 28, height: 28, borderRadius: "50%", background: "#F7BA41", color: "#272218", fontSize: 11, fontWeight: 700 }}
        >
          {me ? initialsOf(displayName) : "·"}
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, color: "#ffffff" }}>{displayName}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>{role}</div>
        </div>
        <button
          onClick={() => setConfirmLogout(true)}
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
    </>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside
        className="relative flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-[16px_12px_14px] max-md:hidden"
        role="navigation"
        aria-label="Primary"
      >
        {navContent}
      </aside>

      {/* Mobile top bar: brand + hamburger */}
      <div className="flex items-center gap-2 p-[10px_12px] md:hidden">
        <div
          className="relative flex flex-col"
          style={{ isolation: "isolate", background: "#ffffff", borderRadius: 12, padding: "8px 12px 7px" }}
        >
          <Wordmark />
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="flzMobileNav"
          className="ml-auto grid place-items-center transition-colors hover:bg-[rgba(255,255,255,0.12)]"
          style={{ width: 40, height: 40, border: "none", borderRadius: 12, background: "rgba(255,255,255,.1)", color: "#ffffff", cursor: "pointer" }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6.5h16M4 12h16M4 17.5h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Scrim */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 140, background: "rgba(4,28,29,.55)", animation: "flzScrim .18s ease" }}
          />
          <aside
            id="flzMobileNav"
            role="navigation"
            aria-label="Primary"
            className="flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-[16px_12px_14px]"
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              zIndex: 150,
              width: "min(272px, 84vw)",
              background: "#074A4D",
              boxShadow: "8px 0 28px rgba(0,0,0,.3)",
              animation: "flzDrawer .2s ease",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="grid place-items-center transition-colors hover:bg-[rgba(255,255,255,0.12)]"
              style={{ position: "absolute", top: 10, right: 10, zIndex: 1, width: 32, height: 32, border: "none", borderRadius: 10, background: "transparent", color: "rgba(255,255,255,.75)", cursor: "pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
            {navContent}
          </aside>
        </div>
      )}

      {/* Sign-out confirmation */}
      <ConfirmDialog
        open={confirmLogout}
        title="Sign out?"
        confirmLabel="Sign out"
        danger={false}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={logout}
      >
        You&#8217;ll be returned to the sign-in screen and need your credentials to get back in.
      </ConfirmDialog>
    </>
  );
}
