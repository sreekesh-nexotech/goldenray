"use client";

// src/components/Studio/shell/StudioShell.tsx
//
// The authenticated CMS frame: teal canvas holding the primary Sidebar and a
// cream rounded content panel (Topbar + scrolling main). Wraps every studio
// screen except the standalone sign-in.

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { StudioProvider, useStudio } from "../shared/StudioContext";
import { ToastHost } from "../shared/overlays";
import { studioColors } from "../shared/format";
import type { StudioModule } from "@/services/studioService";

/**
 * Route prefix → the Phase 1 module that grants it. Longest prefix wins, so
 * /studio/careers/positions resolves to job_positions rather than careers.
 * Routes not listed (the blog-structure screens) keep their own legacy gate.
 */
const ROUTE_MODULES: [string, StudioModule][] = [
  ["/studio/dashboard", "dashboard"],
  ["/studio/pages", "pages"],
  ["/studio/entries", "blogs"],
  ["/studio/faqs", "faqs"],
  ["/studio/media", "media"],
  ["/studio/seo", "seo"],
  ["/studio/enquiries", "leads"],
  ["/studio/emi-calculator", "emi"],
  ["/studio/careers/positions", "job_positions"],
  ["/studio/careers/applications", "applications"],
  ["/studio/careers/departments", "departments"],
  ["/studio/careers/page", "career_page"],
  ["/studio/careers", "careers"],
  ["/studio/users", "users"],
  ["/studio/roles", "roles"],
  ["/studio/settings", "settings"],
];

function moduleForPath(pathname: string): StudioModule | null {
  let best: [string, StudioModule] | null = null;
  for (const entry of ROUTE_MODULES) {
    const [prefix] = entry;
    if ((pathname === prefix || pathname.startsWith(prefix + "/")) && (!best || prefix.length > best[0].length)) {
      best = entry;
    }
  }
  return best ? best[1] : null;
}

/**
 * Client-side route guard (§6.17). The API already refuses a module the user
 * lacks, so this is about the experience, not security: a typed or bookmarked
 * URL into a screen outside the role gets one clear message instead of a
 * half-rendered page whose every request fails.
 */
function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const { me, shellLoading, can } = useStudio();
  const required = moduleForPath(pathname);

  if (!required || shellLoading || !me || can(required)) return <>{children}</>;

  return (
    <section style={{ animation: "flzFade .22s ease", maxWidth: 560, margin: "40px auto" }}>
      <div
        role="alert"
        style={{ background: "#ffffff", borderRadius: 16, boxShadow: `inset 0 0 0 1px ${studioColors.ring}`, padding: "22px 24px" }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: studioColors.tealDeep, marginBottom: 6 }}>
          This screen isn&apos;t part of your role
        </div>
        <div style={{ fontSize: 13.5, color: studioColors.bodyGray, lineHeight: 1.5 }}>
          Your account ({me.access_role_name ?? me.role}) doesn&apos;t include this module. Ask a Super Admin to
          extend your role if you need it.
        </div>
        <Link href="/studio/dashboard" style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>
          ← Back to the dashboard
        </Link>
      </div>
    </section>
  );
}

export default function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <div
        className="grid grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-[236px_minmax(0,1fr)] md:grid-rows-1"
        style={
          {
            position: "fixed",
            inset: 0,
            background: "#074A4D",
            fontFamily: "var(--font-switzer)",
            overflow: "hidden",
            "--font-sans": "var(--font-switzer)",
          } as CSSProperties
        }
      >
        {/* Skip to content */}
        <a
          href="#flzMain"
          className="focus:top-2"
          style={{
            position: "absolute",
            left: 8,
            top: -60,
            zIndex: 300,
            background: "#123532",
            color: "#ffffff",
            padding: "9px 14px",
            borderRadius: 10,
            fontFamily: "var(--font-switzer)",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            transition: "top .15s",
          }}
        >
          Skip to content
        </a>

        <Sidebar />

        <div
          className="flex min-w-0 flex-col overflow-hidden max-md:m-[0_8px_8px] md:m-[10px_10px_10px_0]"
          style={{ background: "#F8F2E1", borderRadius: 20, boxShadow: "0 2px 8px rgba(0,0,0,.18)" }}
        >
          <Topbar />
          <main
            id="flzMain"
            role="main"
            aria-label="Content area"
            tabIndex={-1}
            className="flex-1 overflow-auto p-[24px_26px_70px] max-md:p-[16px_14px_56px]"
          >
            <RouteGuard>{children}</RouteGuard>
          </main>
        </div>

        <ToastHost />
      </div>
    </StudioProvider>
  );
}
