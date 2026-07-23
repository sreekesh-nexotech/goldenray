"use client";

// src/components/Studio/shell/StudioShell.tsx
//
// The authenticated CMS frame: teal canvas holding the primary Sidebar and a
// cream rounded content panel (Topbar + scrolling main). Wraps every studio
// screen except the standalone sign-in.

import type { CSSProperties } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { StudioProvider } from "../shared/StudioContext";
import { ToastHost } from "../shared/overlays";

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
            className="flex-1 overflow-auto"
            style={{ padding: "24px 26px 70px" }}
          >
            {children}
          </main>
        </div>

        <ToastHost />
      </div>
    </StudioProvider>
  );
}
