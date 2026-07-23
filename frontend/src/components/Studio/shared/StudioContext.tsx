"use client";

// src/components/Studio/shared/StudioContext.tsx
//
// Client state for the Content Studio:
//  - session data loaded once from the admin API (`me`, `config`, `dashboard`)
//  - `role`    — the "Preview as" role that drives capability gating visuals,
//                initialised from the signed-in user's real role
//  - `tips`    — whether the amber explainer tips are shown
//  - `toast()` — transient bottom-right notifications
//
// If the API session turns out to be invalid (refresh failed), the tokens are
// cleared and the user is sent back to the sign-in screen.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types/studio";
import {
  getConfig,
  getDashboard,
  getMe,
  isAuthError,
  logout,
  type StudioConfig,
  type StudioDashboard,
  type StudioMe,
} from "@/services/studioService";

interface Toast {
  id: number;
  msg: string;
}

interface StudioContextValue {
  role: Role;
  setRole: (r: Role) => void;
  tips: boolean;
  setTips: (v: boolean) => void;
  toasts: Toast[];
  toast: (msg: string) => void;
  /** Signed-in user (null while loading). */
  me: StudioMe | null;
  /** Shell metadata from GET config/ (null while loading). */
  config: StudioConfig | null;
  /** Counts + recent entries from GET dashboard/ (null while loading). */
  dashboard: StudioDashboard | null;
  /** True until the initial me/config/dashboard load settles. */
  shellLoading: boolean;
  /** Non-auth load failure message, if any. */
  shellError: string | null;
}

const StudioCtx = createContext<StudioContextValue | null>(null);

let toastSeq = 0;

/** API role → presentation role ("admin" → "Admin"). */
function uiRole(apiRole: StudioMe["role"]): Role {
  if (apiRole === "admin") return "Admin";
  if (apiRole === "editor") return "Editor";
  return "Author";
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("Author");
  const [tips, setTips] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [me, setMe] = useState<StudioMe | null>(null);
  const [config, setConfig] = useState<StudioConfig | null>(null);
  const [dashboard, setDashboard] = useState<StudioDashboard | null>(null);
  const [shellLoading, setShellLoading] = useState(true);
  const [shellError, setShellError] = useState<string | null>(null);

  // Load the session + shell data once per studio visit.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meData, configData, dashData] = await Promise.all([
          getMe(),
          getConfig(),
          getDashboard(),
        ]);
        if (cancelled) return;
        setMe(meData);
        setRole(uiRole(meData.role));
        setConfig(configData);
        setDashboard(dashData);
      } catch (err) {
        if (cancelled) return;
        if (isAuthError(err)) {
          // Session expired / revoked — drop it and go sign in again.
          logout();
          router.replace("/studio/login");
          return;
        }
        setShellError(err instanceof Error ? err.message : "Failed to load the studio");
      } finally {
        if (!cancelled) setShellLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const toast = useCallback((msg: string) => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const value = useMemo(
    () => ({ role, setRole, tips, setTips, toasts, toast, me, config, dashboard, shellLoading, shellError }),
    [role, tips, toasts, toast, me, config, dashboard, shellLoading, shellError]
  );

  return <StudioCtx.Provider value={value}>{children}</StudioCtx.Provider>;
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioCtx);
  if (!ctx) throw new Error("useStudio must be used within a StudioProvider");
  return ctx;
}

/** Capability checks derived from the previewed role. */
export function useCapabilities() {
  const { role } = useStudio();
  return {
    role,
    canManageStructure: role === "Admin",
    canPublish: role === "Admin" || role === "Editor",
    canDelete: role === "Admin" || role === "Editor",
    isAdmin: role === "Admin",
  };
}
