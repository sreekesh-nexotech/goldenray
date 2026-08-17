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
import { logout as apiLogout } from "@/services/studioService";

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
        // Placeholder — resolved at render to the most recently edited entry.
        href: "/studio/entries/new",
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
    title: "Leads",
    items: [
      {
        key: "enq",
        label: "Enquiries",
        href: "/studio/enquiries",
        icon: (
          <svg {...iconProps}>
            <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
            <path d="m3 7 9 6 9-6" />
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
  const { role, toast, me, config, dashboard } = useStudio();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Sidebar badge counts + "Edit entry" target from the dashboard payload.
  const counts = dashboard?.counts;
  const badgeByKey: Record<string, number | undefined> = {
    coll: counts?.collections,
    list: counts?.entries,
    tpl: counts?.templates,
    med: counts?.media_assets,
    tax: counts?.authors,
  };
  const editHref = dashboard?.recent_entries?.[0]
    ? `/studio/entries/${dashboard.recent_entries[0].id}`
    : "/studio/entries/new";

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

      {SECTIONS.map((section) => (
        <div key={section.title} className="contents">
          <SectionLabel>{section.title}</SectionLabel>
          {section.items.map((item) => {
            // Resolve live data into the static defs: badge counts from the
            // dashboard payload, "Edit entry" → most recently edited entry.
            const resolved: NavDef = {
              ...item,
              count: badgeByKey[item.key],
              href: item.key === "ed" ? editHref : item.href,
            };
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
