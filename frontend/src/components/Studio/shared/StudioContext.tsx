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
import type { Role } from "@/types/studio";
import {
  endStudioSession,
  getConfig,
  getDashboard,
  getMe,
  isAuthenticated,
  isSessionExpired,
  sessionExpiresAt,
  type StudioAction,
  type StudioConfig,
  type StudioDashboard,
  type StudioMe,
  type StudioModule,
} from "@/services/studioService";

export type ToastKind = "success" | "error";

interface Toast {
  id: number;
  msg: string;
  kind: ToastKind;
}

interface StudioContextValue {
  role: Role;
  setRole: (r: Role) => void;
  tips: boolean;
  setTips: (v: boolean) => void;
  toasts: Toast[];
  /** Bottom-right notification; pass "error" for failures (red, ⚠ icon). */
  toast: (msg: string, kind?: ToastKind) => void;
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
  /**
   * Phase 1 permission check (§6.17): does the signed-in user hold `action` on
   * `module`? Resolved from `me.permissions`, which the API has already reduced
   * through superuser override and legacy fallback — so this is a lookup, not
   * a re-encoding of role rules. False while `me` is still loading, which
   * keeps action buttons hidden rather than briefly visible.
   */
  can: (module: StudioModule, action?: StudioAction) => boolean;
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
        if (isSessionExpired(err)) {
          // Session expired / revoked — drop it and go sign in again. A 403 or
          // a server hiccup falls through to the error banner instead.
          endStudioSession();
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
  }, []);

  // Send the user to sign in the moment the login lifetime runs out, even if
  // they're idle on a screen that won't make another call. Re-checked when the
  // tab regains focus: timers are throttled in background tabs and a laptop
  // may have slept past the deadline. Signing out in another tab (cookie gone)
  // is caught the same way.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      clearTimeout(timer);
      const expiresAt = sessionExpiresAt();
      if (expiresAt === null) {
        if (!isAuthenticated()) endStudioSession();
        return; // undecodable token — the API's 401 path still covers it
      }
      const left = expiresAt - Date.now();
      if (left <= 0) {
        endStudioSession();
        return;
      }
      // setTimeout overflows past ~24.8 days; re-check at most daily.
      timer = setTimeout(check, Math.min(left, 24 * 60 * 60 * 1000));
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);

  const toast = useCallback((msg: string, kind: ToastKind = "success") => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, msg, kind }]);
    // Errors linger a little longer so they can actually be read.
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 4600 : 2800);
  }, []);

  const can = useCallback(
    (module: StudioModule, action: StudioAction = "view") =>
      Boolean(me?.permissions?.[module]?.includes(action)),
    [me]
  );

  const value = useMemo(
    () => ({ role, setRole, tips, setTips, toasts, toast, me, config, dashboard, shellLoading, shellError, can }),
    [role, tips, toasts, toast, me, config, dashboard, shellLoading, shellError, can]
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
